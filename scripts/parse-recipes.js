#!/usr/bin/env node

/**
 * MealPlanner Recipe Parser
 *
 * Lädt recipes_ready_to_parse.json, parst jede Caption mit Groq-API
 * in strukturierte Rezepte, speichert parsed-recipes.json für DB-Insert.
 *
 * Usage:
 *   GROQ_API_KEY=gsk_... node scripts/parse-recipes.js
 *
 * Output:
 *   recipes_parsed.json (ready für Supabase INSERT)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const READY_FILE = path.join(__dirname, '../recipes_ready_to_parse.json');
const OUTPUT_FILE = path.join(__dirname, '../recipes_parsed.json');

// Load .env.local
function loadEnv() {
  const envFile = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    content.split('\n').forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    });
  }
}

loadEnv();
const API_KEY = process.env.GROQ_API_KEY;

// ============================================================================
// System Prompt (aus RECIPE_PARSE_PROMPT.md)
// ============================================================================

const SYSTEM_PROMPT = `Du bist ein Rezept-Parser. Deine Aufgabe:
Instagram-Captions in strukturierte Rezepte umwandeln.

INPUT: Rohe Instagram-Caption (kann Emojis, Hashtags, Fretext enthalten)
OUTPUT: Strukturiertes JSON-Rezept

## Dein Output-Schema:

{
  "titel": "Kurzer Rezept-Name (2-4 Wörter)",
  "beschreibung": "1-2 Sätze über das Rezept oder null",
  "portionen": 2,
  "zubereitungszeit_min": 20,
  "schwierigkeit": "einfach|mittel|schwer",
  "kategorie": ["vegan|vegetarisch|fleisch|fisch"],
  "zutaten": [
    {
      "name": "Zutat-Name",
      "menge": 200,
      "einheit": "g|ml|EL|TL|Stück|Prise|nach Geschmack",
      "hinweis": "optional verfeinert|gehackt|etc oder null"
    }
  ],
  "zubereitung": [
    "Schritt 1: Klare Anweisung",
    "Schritt 2: Nächster Schritt"
  ],
  "tags": ["vegan", "schnell", "high-protein", "etc"],
  "recipe_type": "hauptgericht|beilage|dessert|snack|frühstück|getränk",
  "ai_confidence": 0.85,
  "ai_warnings": ["Caption war unklar", "Zutaten-Menge geraten"]
}

## Regeln:

1. **Titel:** Kurz, prägnant. Nicht aus Hashtags, sondern aus Caption-Inhalt
2. **Zutaten:**
   - Struktur: "200g Mehl" → menge: 200, einheit: "g", name: "Mehl"
   - Mengen raten wenn nicht exakt (z.B. "eine Handvoll" → ~50ml)
   - Wenn wirklich unklar: null setzen, in ai_warnings merken
3. **Zubereitung:**
   - Imperative Form ("Mehl sieben" nicht "Mehl wird gesiebt")
   - Klar numbered wie 1, 2, 3
   - Wenn unklar: beste Vermutung, in ai_warnings merken
4. **Tags:** Automatisch erkennen: vegan, vegetarisch, high-protein, schnell, low-carb, glutenfrei, etc.
5. **Schwierigkeit:** einfach (alle können) | mittel (erfahrener) | schwer (Technik nötig)
6. **AI-Confidence:** 0-1, wie sicher du bist. <0.7 = Caption war unklar
7. **AI-Warnings:** Array von Hinweisen falls etwas geraten/unklar war

**WICHTIG:** Gib IMMER nur das JSON-Objekt zurück, kein Markdown, kein \`\`\`json, nur raw JSON.`;

// ============================================================================
// API Call
// ============================================================================

async function parseCaption(caption) {
  if (!API_KEY) {
    throw new Error('GROQ_API_KEY not set');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Parse this Instagram caption:\n\n${caption}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content.trim();

  // Versuche JSON zu parsen
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON response:', text);
    throw new Error('API returned invalid JSON');
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🍽️  MealPlanner Recipe Parser\n');

  // Load recipes
  if (!fs.existsSync(READY_FILE)) {
    console.error(`❌ ${READY_FILE} not found. Run harvest first.`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(READY_FILE, 'utf8'));
  const recipes = data.recipes || [];

  if (recipes.length === 0) {
    console.error('❌ No recipes to parse');
    process.exit(1);
  }

  console.log(`📋 Loading ${recipes.length} recipes from harvest...\n`);

  const parsed = [];
  const errors = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const num = i + 1;

    try {
      console.log(`[${num}/${recipes.length}] Parsing: ${recipe.caption.substring(0, 50)}...`);

      const parsed_recipe = await parseCaption(recipe.caption);

      // Merge with harvest metadata
      const result = {
        ...parsed_recipe,
        source_caption: recipe.caption,
        source_author: recipe.author,
        source_thumbnail: recipe.thumbnail,
        source_score: recipe.score,
        created_at: new Date().toISOString(),
      };

      parsed.push(result);
      console.log(`   ✅ Success (confidence: ${parsed_recipe.ai_confidence})`);

      // Rate limit — Claude API großzügig aber respectful
      if (i < recipes.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (e) {
      console.error(`   ❌ Error: ${e.message}`);
      errors.push({
        index: i,
        caption: recipe.caption.substring(0, 100),
        error: e.message,
      });
    }
  }

  // Save results
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        parseTime: new Date().toISOString(),
        total: recipes.length,
        successful: parsed.length,
        failed: errors.length,
        recipes: parsed,
        errors: errors.length > 0 ? errors : null,
      },
      null,
      2
    )
  );

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Parsed: ${parsed.length}/${recipes.length}`);
  console.log(`   ❌ Failed: ${errors.length}`);
  console.log(`\n💾 Saved to: ${OUTPUT_FILE}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Failed recipes:`);
    errors.forEach((err) => {
      console.log(`   [${err.index}] ${err.error}: "${err.caption}"`);
    });
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
