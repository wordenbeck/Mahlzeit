/**
 * Import Recipe From URL — Supabase Edge Function
 *
 * Flow:
 * 1. User pasted Instagram/TikTok/URL Reel-Link
 * 2. Edge Function fetched die Page
 * 3. Extrahiert og:description / og:title / JSON-LD aus HTML
 * 4. Sendet Caption an Groq → Recipe Parser
 * 5. Returned strukturiertes Recipe-Schema
 *
 * Kosten: 0€ (Supabase Free + Groq Free)
 *
 * Limitierungen:
 * - Manche Instagram-Posts zeigen Login-Wall → og:description fehlt
 *   → Fallback: User kann Caption manuell pasten
 * - Meta könnte den Ansatz jederzeit blockieren
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GROQ_MODEL = Deno.env.get("GROQ_MODEL") || "llama-3.3-70b-versatile";
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const ANTHROPIC_MODEL = Deno.env.get("ANTHROPIC_MODEL") || "claude-haiku-4-5";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface RequestBody {
  url: string;
  manual_caption?: string; // Fallback wenn Auto-Fetch fehlschlägt
  provider?: "groq" | "claude"; // Default groq (Einzel-Import); claude für Bulk
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Erkennt Quelle anhand URL
 */
function detectSource(url: string): string {
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("youtube.com") || url.includes("youtu.be"))
    return "youtube";
  return "url";
}

/**
 * Normalisiert Instagram-URL: entfernt Query-Strings (igsh etc),
 * stellt sicher dass es /reel/ oder /p/ ist
 */
function normalizeInstagramUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("instagram.com")) {
      // Entferne alle Query-Parameter
      return `${u.origin}${u.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * Extrahiert Caption + Author aus Instagram Reel/Post.
 *
 * Strategie:
 * 1. Public oEmbed-Endpoint (gibt KOMPLETTE Caption als JSON zurück)
 * 2. Fallback: Facebook-Crawler User-Agent für og-Tags
 * 3. Wenn beides fehlschlägt: manueller Caption-Paste vom User
 */
async function extractCaptionFromUrl(
  url: string
): Promise<{
  caption: string | null;
  author: string | null;
  thumbnail: string | null;
  error?: string;
}> {
  const normalizedUrl = normalizeInstagramUrl(url);
  const isInstagram = normalizedUrl.includes("instagram.com");

  // === STRATEGIE 1: Instagram oEmbed (beste Quelle, volle Caption) ===
  if (isInstagram) {
    try {
      const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(normalizedUrl)}`;
      const oembedResp = await fetch(oembedUrl, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1",
        },
      });

      if (oembedResp.ok) {
        const data = await oembedResp.json();
        // "title" enthält die volle Caption
        if (data.title && data.title.length > 20) {
          return {
            caption: data.title,
            author: data.author_name ? `@${data.author_name}` : null,
            thumbnail: data.thumbnail_url || null,
          };
        }
      }
    } catch (e) {
      // oEmbed failed, try fallback
      console.log("oEmbed failed, trying og-tags fallback:", e);
    }
  }

  // === STRATEGIE 2: og-Tags via Facebook-Crawler User-Agent ===
  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1",
        "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      return {
        caption: null,
        author: null,
        thumbnail: null,
        error: `Konnte Page nicht laden: HTTP ${response.status}`,
      };
    }

    const html = await response.text();

    const ogDescMatch = html.match(
      /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
    );
    const ogTitleMatch = html.match(
      /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
    );
    const ogImageMatch = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
    );

    let caption: string | null = null;
    let author: string | null = null;
    let thumbnail: string | null = null;

    if (ogDescMatch) {
      caption = decodeHtmlEntities(ogDescMatch[1]);
    }

    if (ogTitleMatch) {
      const title = decodeHtmlEntities(ogTitleMatch[1]);
      // Format: "Author on Instagram: \"Caption...\""
      const authorMatch = title.match(/^([^:]+?)\s+on\s+(Instagram|TikTok)/i);
      if (authorMatch) {
        const name = authorMatch[1].trim();
        author = name.startsWith("@") ? name : `@${name}`;
      }
      // Wenn caption fehlt, versuche aus title zu extrahieren
      if (!caption) {
        const captionMatch = title.match(/:\s*["“](.+)["”]/s);
        if (captionMatch) caption = decodeHtmlEntities(captionMatch[1]);
      }
    }

    if (ogImageMatch) {
      thumbnail = decodeHtmlEntities(ogImageMatch[1]);
    }

    if (!caption || caption.length < 20) {
      return {
        caption: null,
        author,
        thumbnail,
        error:
          "Caption konnte nicht automatisch extrahiert werden. Möglicherweise privater Account, gelöschter Post oder Login-Wall.",
      };
    }

    return { caption, author, thumbnail };
  } catch (error) {
    return {
      caption: null,
      author: null,
      thumbnail: null,
      error: `Fetch-Fehler: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Spiegelt eine externe Bild-URL in den Supabase Storage Bucket "recipe-images".
 * Wichtig fuer Instagram-CDN-URLs, die nach Wochen expiren.
 *
 * Pfad-Konvention: {workspace_id}/imports/{timestamp}-{random}.{ext}
 * Returnt die public URL des gespiegelten Bildes, oder null bei Fehler.
 */
async function mirrorImageToStorage(
  imageUrl: string,
  workspaceId: string
): Promise<string | null> {
  try {
    // 1. Bild downloaden (mit Browser User-Agent fuer Insta-CDN)
    const imageResp = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!imageResp.ok) {
      console.log(`Bild-Download failed: HTTP ${imageResp.status}`);
      return null;
    }

    const contentType = imageResp.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
      ? "webp"
      : "jpg";
    const arrayBuffer = await imageResp.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    // Sanity check: nicht ueber 5 MB (matcht Bucket-Limit)
    if (fileBytes.length > 5 * 1024 * 1024) {
      console.log(`Bild zu gross: ${fileBytes.length} bytes`);
      return null;
    }

    // 2. Filename generieren
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const path = `${workspaceId}/imports/${timestamp}-${random}.${ext}`;

    // 3. Upload via Service Role (umgeht RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: uploadError } = await supabase.storage
      .from("recipe-images")
      .upload(path, fileBytes, {
        contentType,
        cacheControl: "31536000", // 1 Jahr cachen, ist immutable
        upsert: false,
      });

    if (uploadError) {
      console.log("Storage upload error:", uploadError);
      return null;
    }

    // 4. Public URL holen
    const { data: publicUrlData } = supabase.storage
      .from("recipe-images")
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.log("mirrorImageToStorage error:", error);
    return null;
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#10;/g, "\n")
    .replace(/&nbsp;/g, " ");
}

/**
 * Ruft Groq mit Recipe Parser Prompt auf
 *
 * NOTE: Die Prompts liegen aktuell im Frontend-Code (src/lib/prompts/).
 * Für die Edge Function müssen sie hier dupliziert oder via Shared-Module
 * eingebunden werden. Im MVP: Frontend ruft Edge Function auf, Edge Function
 * sendet Caption + die Prompts (vom Frontend mitgeliefert) an Groq.
 *
 * Alternative: Prompts als Supabase Storage / KV speichern und hier laden.
 */
async function callGroqRecipeParser(
  caption: string,
  source: string,
  sourceUrl: string,
  sourceAuthor: string | null,
  systemPrompt: string,
  fewShotExamples: string
): Promise<any> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY ist nicht gesetzt");
  }

  const userMessage = `${fewShotExamples}

# AKTUELLE AUFGABE
INPUT:
\`\`\`json
${JSON.stringify(
  {
    caption,
    source,
    source_url: sourceUrl,
    source_author: sourceAuthor,
  },
  null,
  2
)}
\`\`\`

Antworte nur mit dem JSON-Output gemäß Schema.`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  return JSON.parse(content);
}

/**
 * Ruft Claude (Anthropic Messages API) mit dem Recipe Parser Prompt auf.
 * Default-Modell: claude-haiku-4-5 — für Bulk-Import (kein TPM/TPD-Limit wie Groq).
 *
 * Wichtig: Caption wird via JSON.stringify im userMessage-Objekt encodiert
 * (kein manuelles Escaping → Emojis/Surrogate-Pairs bleiben heil). Claude
 * antwortet teils mit ```json-Markdown → wird vor JSON.parse entfernt.
 */
async function callClaudeRecipeParser(
  caption: string,
  source: string,
  sourceUrl: string,
  sourceAuthor: string | null,
  systemPrompt: string,
  fewShotExamples: string
): Promise<any> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY ist nicht gesetzt");
  }

  const userMessage = `${fewShotExamples}

# AKTUELLE AUFGABE
INPUT:
\`\`\`json
${JSON.stringify(
  { caption, source, source_url: sourceUrl, source_author: sourceAuthor },
  null,
  2
)}
\`\`\`

Antworte nur mit dem JSON-Output gemäß Schema.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 8000, // großzügig: lange Rezepte werden nicht abgeschnitten
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "";
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error("Claude-Antwort enthielt kein gültiges JSON");
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // User-ID + Workspace-ID aus dem JWT bzw Profile-Lookup
    const authHeader = req.headers.get("Authorization") || "";
    let userId: string | null = null;
    let workspaceId: string | null = null;
    if (authHeader.startsWith("Bearer ")) {
      try {
        const supabaseAuth = createClient(
          SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY
        );
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseAuth.auth.getUser(token);
        userId = userData.user?.id || null;
        if (userId) {
          const { data: profile } = await supabaseAuth
            .from("profiles")
            .select("workspace_id")
            .eq("id", userId)
            .maybeSingle();
          workspaceId = profile?.workspace_id ?? null;
        }
      } catch (e) {
        console.log("Auth-Fehler:", e);
      }
    }

    const body = (await req.json()) as RequestBody & {
      systemPrompt: string;
      fewShotExamples: string;
    };
    const { url, manual_caption, systemPrompt, fewShotExamples, provider } = body;

    if (!url) {
      return new Response(
        JSON.stringify({ error: "Parameter 'url' fehlt" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!systemPrompt) {
      return new Response(
        JSON.stringify({
          error: "Parameter 'systemPrompt' muss mitgegeben werden",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const source = detectSource(url);

    // 1. Caption extrahieren (oder manual_caption nehmen)
    let caption: string | null = manual_caption || null;
    let author: string | null = null;
    let thumbnail: string | null = null;
    let extractError: string | undefined;

    if (!caption) {
      const result = await extractCaptionFromUrl(url);
      caption = result.caption;
      author = result.author;
      thumbnail = result.thumbnail;
      extractError = result.error;
    }

    if (!caption) {
      return new Response(
        JSON.stringify({
          status: "extraction_failed",
          error:
            extractError ||
            "Caption konnte nicht extrahiert werden. Bitte Caption manuell pasten.",
          fallback_required: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Caption an Recipe Parser — provider wählbar
    //    'groq' (default): kostenlos, für Einzel-Import in der App
    //    'claude': Haiku 4.5, kein TPM/TPD-Limit → für Bulk-Import
    const useClaude = provider === "claude";
    const recipeOutput = useClaude
      ? await callClaudeRecipeParser(
          caption,
          source,
          url,
          author,
          systemPrompt,
          fewShotExamples
        )
      : await callGroqRecipeParser(
          caption,
          source,
          url,
          author,
          systemPrompt,
          fewShotExamples
        );

    // 3. Thumbnail spiegeln zu Supabase Storage (Insta-CDN-URLs expiren!)
    let mirroredThumbnail: string | null = null;
    if (thumbnail && workspaceId) {
      mirroredThumbnail = await mirrorImageToStorage(thumbnail, workspaceId);
    }

    // Bevorzuge gespiegelte URL, fallback auf Original
    const finalThumbnail = mirroredThumbnail || thumbnail;

    if (finalThumbnail && recipeOutput?.rezept && !recipeOutput.rezept.bild_url) {
      recipeOutput.rezept.bild_url = finalThumbnail;
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        extracted_caption: caption,
        extracted_author: author,
        extracted_thumbnail: thumbnail,
        result: recipeOutput,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // 200 statt 500 damit supabase-js den Body lesbar an den Client durchreicht.
    // Frontend kann error-Feld auswerten + retry-on-rate-limit triggern.
    const msg = error instanceof Error ? error.message : String(error);
    console.error("import-recipe-from-url error:", msg);
    return new Response(
      JSON.stringify({ status: "error", error: msg }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
