/**
 * Refresh Recipe Image — Supabase Edge Function
 *
 * Repariert Rezepte deren bild_url auf einen toten/abgelaufenen Insta-CDN-Link
 * zeigt: holt frisches Thumbnail via oEmbed, spiegelt es in Supabase Storage
 * und aktualisiert recipes.bild_url auf die dauerhafte Storage-URL.
 *
 * Input:  { recipe_ids: string[] }   (Batch, sequenziell verarbeitet)
 * Output: { results: [{ id, status, bild_url? , error? }] }
 *
 * Auth:   Service-Role (umgeht RLS) — workspace_id wird aus dem Rezept gelesen,
 *         kein User-JWT nötig.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED_ORIGINS = [
  "https://mahlzeit123.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function normalizeInstagramUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("instagram.com")) return `${u.origin}${u.pathname}`;
    return url;
  } catch {
    return url;
  }
}

/** Holt frisches Thumbnail via Instagram oEmbed */
async function fetchThumbnail(url: string): Promise<string | null> {
  const normalized = normalizeInstagramUrl(url);
  try {
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(normalized)}`;
    const resp = await fetch(oembedUrl, {
      headers: { "User-Agent": "facebookexternalhit/1.1" },
    });
    if (resp.ok) {
      const data = await resp.json();
      return data.thumbnail_url || null;
    }
  } catch (_e) { /* fallthrough */ }
  return null;
}

/** Spiegelt eine Bild-URL in den Storage-Bucket "recipe-images". */
async function mirrorImageToStorage(
  imageUrl: string,
  workspaceId: string,
  supabase: ReturnType<typeof createClient>,
): Promise<string | null> {
  try {
    const imageResp = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!imageResp.ok) return null;

    const contentType = imageResp.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png"
      : contentType.includes("webp") ? "webp" : "jpg";
    const arrayBuffer = await imageResp.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    if (fileBytes.length > 5 * 1024 * 1024) return null;

    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const filePath = `${workspaceId}/imports/${timestamp}-${random}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("recipe-images")
      .upload(filePath, fileBytes, {
        contentType,
        cacheControl: "31536000",
        upsert: false,
      });
    if (uploadError) return null;

    const { data } = supabase.storage.from("recipe-images").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (_e) {
    return null;
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { recipe_ids } = (await req.json()) as { recipe_ids: string[] };
    if (!Array.isArray(recipe_ids) || recipe_ids.length === 0) {
      return new Response(JSON.stringify({ error: "recipe_ids[] fehlt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const results: any[] = [];

    for (const id of recipe_ids) {
      try {
        const { data: recipe } = await supabase
          .from("recipes")
          .select("id, source_url, workspace_id")
          .eq("id", id)
          .maybeSingle();

        if (!recipe || !recipe.source_url) {
          results.push({ id, status: "skip", error: "kein source_url" });
          continue;
        }

        const thumb = await fetchThumbnail(recipe.source_url as string);
        if (!thumb) {
          results.push({ id, status: "no_thumbnail", error: "oEmbed lieferte kein Bild (Reel evtl. gelöscht)" });
          continue;
        }

        const mirrored = await mirrorImageToStorage(
          thumb,
          recipe.workspace_id as string,
          supabase,
        );
        if (!mirrored) {
          results.push({ id, status: "mirror_failed" });
          continue;
        }

        const { error: updErr } = await supabase
          .from("recipes")
          .update({ bild_url: mirrored })
          .eq("id", id);

        if (updErr) {
          results.push({ id, status: "update_failed", error: updErr.message });
          continue;
        }

        results.push({ id, status: "ok", bild_url: mirrored });
      } catch (e) {
        results.push({ id, status: "error", error: e instanceof Error ? e.message : String(e) });
      }
    }

    const ok = results.filter((r) => r.status === "ok").length;
    return new Response(JSON.stringify({ total: recipe_ids.length, ok, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ status: "error", error: msg }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
