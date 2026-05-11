/**
 * Magic Fill Week — Supabase Edge Function
 *
 * Schlägt für leere Tage in einem Wochenplan passende Rezepte aus der
 * Workspace-Sammlung vor. Groq llama-3.3-70b entscheidet basierend auf
 * Abwechslung, Tags, Schwierigkeit.
 *
 * Input:  { weekplan_id, target_days: number[] }   // target_days = die Tage die gefüllt werden sollen
 * Output: { suggestions: [{ day_of_week, recipe_id, reason }] }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GROQ_MODEL = Deno.env.get("GROQ_MODEL") || "llama-3.3-70b-versatile";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DAY_LABELS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

type RecipeMini = {
  id: string;
  titel: string;
  zeitMin: number | null;
  schwierigkeit: string | null;
  kategorie: string[];
  tags: string[];
};

const SYSTEM_PROMPT = `Du bist ein Wochenplan-Assistent für eine Familie.

Aufgabe: Aus einer gegebenen Rezeptsammlung wählst du für jeden zu füllenden Wochentag genau EIN Rezept aus.

Regeln:
- KEINE Doppelungen innerhalb der Vorschläge
- Abwechslung: Mische vegetarisch/Fleisch, schnell/aufwendig, verschiedene Stile
- Aufwendige Rezepte eher für Wochenenden oder Tage mit mehr Zeit (Mittwoch erfahrungsgemäß okay)
- Schnelle Rezepte (≤25 Min) eher für Werktage
- Wenn die Sammlung sehr klein ist (<5 Rezepte): nimm was passt, auch wenn das Ideal nicht erreichbar
- Antwort als JSON gemäß Schema, KEINE zusätzliche Erklärung

Output-Schema:
{
  "suggestions": [
    { "day_of_week": 0, "recipe_id": "uuid", "reason": "kurzer Grund (max 8 Wörter)" }
  ]
}`;

async function getUserIdFromAuthHeader(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseAuth.auth.getUser(token);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

async function callGroq(recipes: RecipeMini[], targetDays: number[]) {
  const recipeList = recipes
    .map(r => `- ${r.id} | "${r.titel}" | ${r.zeitMin ?? "?"} Min | ${r.schwierigkeit ?? "?"} | ${r.kategorie.join(",")} | ${r.tags.join(",")}`)
    .join("\n");
  const dayList = targetDays.map(d => `- ${d} (${DAY_LABELS[d]})`).join("\n");

  const userMessage = `Rezeptsammlung (id | titel | zeit | schwierigkeit | kategorien | tags):
${recipeList}

Zu füllende Tage (day_of_week):
${dayList}

Wähle pro Tag ein Rezept aus der Sammlung. Antwort als JSON.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userId = await getUserIdFromAuthHeader(req.headers.get("Authorization"));
    if (!userId) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { weekplan_id, target_days } = await req.json() as {
      weekplan_id: string;
      target_days: number[];
    };

    if (!weekplan_id || !Array.isArray(target_days) || target_days.length === 0) {
      return new Response(
        JSON.stringify({ error: "weekplan_id und target_days[] erforderlich" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Service-Role-Client um Rezepte + Workspace zu lesen (RLS-bypass)
    // — wir prüfen aber selbst dass der User in dem Workspace ist
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Profile + Workspace des Users
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("workspace_id")
      .eq("id", userId)
      .single();
    if (profErr || !profile) {
      return new Response(JSON.stringify({ error: "Profile nicht gefunden" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Weekplan validieren (gehört der zum Workspace?)
    const { data: weekplan } = await supabase
      .from("weekplans")
      .select("workspace_id")
      .eq("id", weekplan_id)
      .single();
    if (!weekplan || weekplan.workspace_id !== profile.workspace_id) {
      return new Response(JSON.stringify({ error: "Weekplan nicht im Workspace" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Recipes laden
    const { data: recipes, error: recErr } = await supabase
      .from("recipes")
      .select("id, titel, zubereitungszeit_min, schwierigkeit, kategorie, tags")
      .eq("workspace_id", profile.workspace_id);
    if (recErr) throw recErr;
    if (!recipes || recipes.length === 0) {
      return new Response(JSON.stringify({ suggestions: [], warning: "Keine Rezepte im Workspace" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recipeMinis: RecipeMini[] = recipes.map((r: {
      id: string;
      titel: string;
      zubereitungszeit_min: number | null;
      schwierigkeit: string | null;
      kategorie: string[] | null;
      tags: string[] | null;
    }) => ({
      id: r.id,
      titel: r.titel,
      zeitMin: r.zubereitungszeit_min,
      schwierigkeit: r.schwierigkeit,
      kategorie: r.kategorie ?? [],
      tags: r.tags ?? [],
    }));

    // 4. Groq fragen
    const result = await callGroq(recipeMinis, target_days);

    // 5. Validierung: nur recipe_ids zulassen die existieren
    const validIds = new Set(recipeMinis.map(r => r.id));
    const cleaned = (result.suggestions ?? []).filter(
      (s: { recipe_id: string; day_of_week: number }) =>
        validIds.has(s.recipe_id) && target_days.includes(s.day_of_week)
    );

    return new Response(JSON.stringify({ suggestions: cleaned }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : String(error),
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
