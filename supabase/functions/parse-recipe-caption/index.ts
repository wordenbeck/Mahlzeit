/**
 * parse-recipe-caption — Groq-powered Instagram caption parsing
 * Takes Instagram caption, returns structured recipe data via Groq LLM
 * Now with intelligent ingredient quantity + unit extraction
 */

interface ParseRequest {
  caption: string;
  recipeName?: string;
}

interface Zutat {
  name: string;
  menge: number | null;
  einheit: string | null;
  hinweis: string | null;
}

interface ParsedRecipe {
  titel: string;
  zutaten: Zutat[];
  zubereitung: string[];
}

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const systemPrompt = `Du bist ein Rezept-Parser spezialisiert auf Zutatenlisten. Extrahiere aus einer Instagram-Caption:
1. Rezept-Titel (kurz und prägnant)
2. Zutaten mit Menge, Einheit und Name SEPARAT
3. Zubereitung als nummerierte Schritte

WICHTIG: Zutaten müssen als Objekte mit name/menge/einheit sein, NICHT als Strings!

Antworte IMMER als valides JSON, keine anderen Worte:
{
  "titel": "Rezept Name",
  "zutaten": [
    {"name": "Nudeln", "menge": 400, "einheit": "g"},
    {"name": "Wasser", "menge": 2, "einheit": "Liter"},
    {"name": "Olivenöl", "menge": 2, "einheit": "EL"},
    {"name": "Salz", "menge": null, "einheit": null},
    {"name": "Pfeffer", "menge": "nach Geschmack", "einheit": null}
  ],
  "zubereitung": ["Schritt 1", "Schritt 2", ...]
}

Regeln:
- menge: Zahl wenn parsebar (z.B. 400, 2, 1.5), sonst null
- einheit: "g", "kg", "ml", "l", "EL", "TL", "Prise", "Pck", etc. oder null
- name: Nur der Zutatename, OHNE Menge/Einheit
- Bei ungefähren Mengen (z.B. "nach Geschmack"): menge=null, einheit=null
- Deutsch bevorzugt
- Listen dürfen nicht leer sein
- Zubereitung: Nummerierung entfernen (z.B. "1. Wasser erhitzen" → "Wasser erhitzen")

EXAMPLES:
"400g Nudeln" → {name: "Nudeln", menge: 400, einheit: "g"}
"2 EL Olivenöl" → {name: "Olivenöl", menge: 2, einheit: "EL"}
"1 Zwiebel, gehackt" → {name: "Zwiebel gehackt", menge: 1, einheit: null}
"Salz und Pfeffer nach Geschmack" → {name: "Salz und Pfeffer", menge: null, einheit: null}
"250ml Wasser" → {name: "Wasser", menge: 250, einheit: "ml"}
`;

async function parseWithGroq(caption: string, recipeName?: string): Promise<ParsedRecipe> {
  try {
    const userPrompt = `Hier ist eine Instagram-Caption eines Rezepts${recipeName ? ` (${recipeName})` : ''}:

${caption}

Bitte extrahiere Titel, Zutaten und Zubereitung.`;

    console.log('[parse-recipe-caption] Calling Groq LLM...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[parse-recipe-caption] Groq API error:', response.status, error);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in Groq response');
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[parse-recipe-caption] No JSON found in response:', content);
      throw new Error('No JSON in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ParsedRecipe;

    // Validate structure
    if (!parsed.titel || !Array.isArray(parsed.zutaten) || !Array.isArray(parsed.zubereitung)) {
      throw new Error('Invalid response structure');
    }

    // Validate and sanitize zutaten objects with post-processing
    const sanitizedZutaten = parsed.zutaten
      .map((z) => {
        let name = typeof z.name === 'string' ? z.name.trim() : '';
        let menge = typeof z.menge === 'number' ? z.menge : null;
        let einheit = typeof z.einheit === 'string' ? z.einheit.trim() : null;

        // 1. Validate menge (no negatives, reasonable max)
        if (menge !== null) {
          if (menge < 0) menge = null; // Remove negative quantities
          if (menge > 10000) menge = null; // Remove unreasonable quantities
        }

        // 2. Clean up name: remove cooking adjectives (gehackt, fein, gerieben, etc)
        name = name
          .replace(/,\s*(gehackt|fein|grob|ganz|klein|gross|geraspelt|gerieben|zerkleinert|zerstoßen|gepellt|geschält|gesäuert)/gi, '')
          .replace(/\s+(gehackt|fein|grob|ganz|klein|gross|geraspelt|gerieben|zerkleinert|zerstoßen|gepellt|geschält|gesäuert)$/i, '')
          .trim();

        // 3. Better parse menge + einheit if somehow wrong
        if ((menge === null || !einheit) && name) {
          const match = name.match(/^([\d.,]+)\s+([a-zA-Z]+)\s+(.+)$/);
          if (match) {
            menge = parseFloat(match[1].replace(',', '.'));
            einheit = match[2];
            name = match[3];
          }
        }

        // 4. Split "oder" alternatives into separate items (if multiple)
        const orParts = name.split(/\s+oder\s+/i);
        if (orParts.length > 1) {
          // Return multiple items for "oder" alternatives
          return orParts.map(part => ({
            name: part.trim(),
            menge,
            einheit,
            hinweis: null,
          }));
        }

        return [{
          name,
          menge,
          einheit,
          hinweis: null,
        }];
      })
      .flat()
      .filter(z => z.name.length > 0);

    if (sanitizedZutaten.length === 0) {
      throw new Error('No valid ingredients extracted');
    }

    const result: ParsedRecipe = {
      titel: parsed.titel,
      zutaten: sanitizedZutaten,
      zubereitung: parsed.zubereitung.filter(z => typeof z === 'string' && z.trim().length > 0),
    };

    console.log('[parse-recipe-caption] Success:', { titel: result.titel, zutatenCount: result.zutaten.length, zubereitungCount: result.zubereitung.length });
    return result;
  } catch (error) {
    console.error('[parse-recipe-caption] Groq error:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { caption, recipeName } = (await req.json()) as ParseRequest;

    if (!caption || typeof caption !== 'string') {
      return new Response(JSON.stringify({ error: 'caption is required and must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await parseWithGroq(caption, recipeName);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[parse-recipe-caption] Handler error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to parse caption',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
