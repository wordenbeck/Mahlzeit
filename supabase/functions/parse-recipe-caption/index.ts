/**
 * parse-recipe-caption — Groq-powered Instagram caption parsing
 * Takes Instagram caption, returns structured recipe data via Groq LLM
 */

interface ParseRequest {
  caption: string;
  recipeName?: string;
}

interface ParsedRecipe {
  titel: string;
  zutaten: string[];
  zubereitung: string[];
}

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const systemPrompt = `Du bist ein Rezept-Parser. Extrahiere aus einer Instagram-Caption folgende Informationen:
1. Rezept-Titel (kurz und prägnant)
2. Liste der Zutaten (jede als einzelner String mit Menge und Einheit)
3. Anleitung als Schritte (jeder als einzelner String)

Antworte IMMER als valides JSON, keine anderen Worte:
{
  "titel": "Rezept Name",
  "zutaten": ["Zutat 1", "Zutat 2", ...],
  "zubereitung": ["Schritt 1", "Schritt 2", ...]
}

Regeln:
- Zutaten: Mengen + Einheit + Name zusammen (z.B. "400g Nudeln")
- Zubereitung: Nummerierung entfernen (z.B. "1. Wasser erhitzen" → "Wasser erhitzen")
- Wenn etwas unklar ist: beste Vermutung, nicht leer lassen
- Deutsch bevorzugt
- Array darf nicht leer sein
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

    console.log('[parse-recipe-caption] Success:', { titel: parsed.titel, zutatenCount: parsed.zutaten.length, zubereitungCount: parsed.zubereitung.length });
    return parsed;
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
