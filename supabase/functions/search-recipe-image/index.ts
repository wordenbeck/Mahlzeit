/**
 * Search Recipe Image — Supabase Edge Function
 *
 * Bildersuche fuer Rezepte. Verwendet Openverse (WordPress) — kostenlos,
 * kein API-Key noetig, CC-lizenziert.
 *
 * Optional: Wenn UNSPLASH_ACCESS_KEY gesetzt, wird Unsplash bevorzugt
 * (hoehere Bildqualitaet bei Food-Fotos).
 *
 * Returnt: { results: [{ url, thumb, alt, source }] }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY");

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

interface SearchResult {
  url: string;
  thumb: string;
  alt: string;
  source: "unsplash" | "openverse";
}

async function searchUnsplash(query: string): Promise<SearchResult[]> {
  if (!UNSPLASH_ACCESS_KEY) return [];
  try {
    const resp = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query + " food"
      )}&per_page=12&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          "Accept-Version": "v1",
        },
      }
    );
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.results || []).map((img: any) => ({
      url: img.urls.regular,
      thumb: img.urls.small,
      alt: img.alt_description || query,
      source: "unsplash" as const,
    }));
  } catch (e) {
    console.log("Unsplash error:", e);
    return [];
  }
}

async function searchOpenverse(query: string): Promise<SearchResult[]> {
  try {
    const resp = await fetch(
      `https://api.openverse.engineering/v1/images/?q=${encodeURIComponent(
        query + " food"
      )}&page_size=12&license_type=commercial,modification`,
      {
        headers: {
          "User-Agent": "MealPlanner/1.0 (https://github.com/wordenbeck/MealPlanner)",
        },
      }
    );
    if (!resp.ok) {
      console.log(`Openverse status: ${resp.status}`);
      return [];
    }
    const data = await resp.json();
    return (data.results || []).map((img: any) => ({
      url: img.url,
      thumb: img.thumbnail || img.url,
      alt: img.title || query,
      source: "openverse" as const,
    }));
  } catch (e) {
    console.log("Openverse error:", e);
    return [];
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "query muss mindestens 2 Zeichen sein" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 1. Unsplash bevorzugen (wenn Key gesetzt)
    let results = await searchUnsplash(query);

    // 2. Fallback / Ergaenzung: Openverse
    if (results.length < 6) {
      const openverseResults = await searchOpenverse(query);
      results = [...results, ...openverseResults].slice(0, 12);
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
