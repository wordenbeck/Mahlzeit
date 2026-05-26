#!/usr/bin/env node

/**
 * MealPlanner Recipe Parser (Manual/Heuristic)
 *
 * Lädt recipes_ready_to_parse.json und strukturiert Captions
 * mit Regex + Pattern-Matching (kein API).
 *
 * Usage:
 *   node scripts/parse-recipes-manual.js
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

// ============================================================================
// Parsing Logic
// ============================================================================

function parseCaption(caption) {
  const text = caption.toLowerCase();

  // === TITEL ===
  let titel = extractTitel(caption);

  // === BESCHREIBUNG ===
  let beschreibung = extractDescription(caption);

  // === KATEGORIEN ===
  let kategorie = extractCategories(text);

  // === ZUTATEN ===
  let zutaten = extractIngredients(caption);

  // === ZUBEREITUNG ===
  let zubereitung = extractInstructions(caption);

  // === TAGS ===
  let tags = extractTags(text, kategorie);

  // === REZEPT-TYP ===
  let recipe_type = extractRecipeType(text, titel);

  // === PORTIONEN ===
  let portionen = extractServings(caption);

  // === ZUBEREITUNGSZEIT ===
  let zubereitungszeit_min = extractPrepTime(caption);

  // === SCHWIERIGKEIT ===
  let schwierigkeit = estimateDifficulty(zutaten.length, zubereitung.length);

  // === CONFIDENCE + WARNINGS ===
  let ai_warnings = [];
  if (zutaten.length < 3) ai_warnings.push('Sehr wenige Zutaten extrahiert');
  if (zubereitung.length < 2) ai_warnings.push('Zubereitung unklar strukturiert');
  if (!titel || titel.length < 3) ai_warnings.push('Titel konnte nicht extrahiert werden');

  let ai_confidence = calculateConfidence(zutaten.length, zubereitung.length, ai_warnings.length);

  return {
    titel: titel || 'Rezept',
    beschreibung: beschreibung || null,
    portionen,
    zubereitungszeit_min,
    schwierigkeit,
    kategorie,
    zutaten,
    zubereitung,
    tags,
    recipe_type,
    ai_confidence,
    ai_warnings,
  };
}

function extractTitel(caption) {
  // Erste Zeile (oft Titel) oder emoji-Zeile
  const lines = caption.split('\n').filter((l) => l.trim().length > 0);
  let firstLine = lines[0] || '';

  // Entferne Emojis und Sonderzeichen am Anfang
  firstLine = firstLine.replace(/^[\s\p{Emoji}]+/gu, '').trim();

  // Wenn zu lang, verkürze auf erste 60 Zeichen
  if (firstLine.length > 80) {
    firstLine = firstLine.substring(0, 60).trim() + '...';
  }

  return firstLine.length > 3 ? firstLine : 'Rezept';
}

function extractDescription(caption) {
  const lines = caption.split('\n').filter((l) => l.trim().length > 0);

  // Suche nach 1-2 Sätzen vor "Zutaten" oder "Nährwerte"
  let desc = [];
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    if (
      line.toLowerCase().includes('zutat') ||
      line.toLowerCase().includes('nährwert') ||
      line.toLowerCase().includes('kalor')
    ) {
      break;
    }
    if (line.length > 10 && !line.match(/^[\p{Emoji}\s]+$/gu)) {
      desc.push(line);
    }
  }

  let text = desc.join(' ').trim();
  if (text.length > 200) text = text.substring(0, 200).trim() + '...';
  return text.length > 10 ? text : null;
}

function extractCategories(text) {
  const cats = [];
  if (text.includes('vegan')) cats.push('vegan');
  else if (text.includes('vegetarisch')) cats.push('vegetarisch');
  if (text.includes('fleisch')) cats.push('fleisch');
  if (text.includes('fisch')) cats.push('fisch');
  return cats.length > 0 ? cats : ['vegetarisch'];
}

function extractIngredients(caption) {
  const ingredients = [];
  const lines = caption.split('\n');

  // Finde Zutat-Sektion
  let inIngredients = false;
  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes('zutat') || lower.includes('ingredient')) {
      inIngredients = true;
      continue;
    }
    if (
      inIngredients &&
      (lower.includes('zubereitung') ||
        lower.includes('anleitung') ||
        lower.includes('nährwert') ||
        lower.includes('kalor'))
    ) {
      break;
    }

    if (inIngredients && line.trim().length > 0) {
      const ing = parseIngredientLine(line);
      if (ing) ingredients.push(ing);
    }
  }

  return ingredients.length > 0 ? ingredients : [];
}

function parseIngredientLine(line) {
  line = line.trim();
  if (!line || line.length < 3) return null;

  // Pattern: "200g Mehl" oder "2 EL Öl" oder "Salz nach Geschmack"
  const match = line.match(/^[\s\-•*]*([\d.,½⅓⅔]+)?\s*([a-zA-Z]*)\s+(.+?)(?:\s*\(.*?\))?$/i);

  if (!match) {
    // Fallback: "nach Geschmack" Zutaten
    if (
      line.toLowerCase().includes('nach geschmack') ||
      line.toLowerCase().includes('nach bedarf')
    ) {
      const name = line.replace(/\(.*?\)/g, '').replace(/nach (geschmack|bedarf)/gi, '').trim();
      return {
        name: name || 'Zutat',
        menge: null,
        einheit: 'nach Geschmack',
        hinweis: null,
      };
    }
    return null;
  }

  const [, menge, unit, nameWithNote] = match;
  let name = nameWithNote.replace(/\(.*?\)/g, '').trim();
  let hinweis = null;

  // Extrahiere Hinweis aus Klammern
  const noteMatch = nameWithNote.match(/\((.*?)\)/);
  if (noteMatch) hinweis = noteMatch[1];

  const units = [
    'g',
    'ml',
    'el',
    'tl',
    'stück',
    'portion',
    'prise',
    'hand',
    'becher',
    'dose',
    'bund',
    'zehe',
  ];
  let einheit = unit && units.includes(unit.toLowerCase()) ? unit.toLowerCase() : unit || 'g';

  return {
    name: name || 'Zutat',
    menge: menge ? parseFloat(menge.replace(',', '.')) : null,
    einheit,
    hinweis,
  };
}

function extractInstructions(caption) {
  const instructions = [];
  const lines = caption.split('\n');

  let inInstructions = false;
  for (const line of lines) {
    const lower = line.toLowerCase();

    if (
      lower.includes('zubereitung') ||
      lower.includes('anleitung') ||
      lower.includes('so einfach') ||
      lower.includes('schritt')
    ) {
      inInstructions = true;
      continue;
    }

    if (inInstructions && (lower.includes('nährwert') || lower.includes('kalor'))) {
      break;
    }

    if (inInstructions && line.trim().length > 5) {
      let step = line
        .replace(/^[\s\-•*0-9.]+/, '')
        .replace(/[\p{Emoji}]/gu, '')
        .trim();

      if (step.length > 5) {
        // Normalize to imperative
        step = normalizeInstruction(step);
        instructions.push(step);
      }
    }
  }

  return instructions.length > 0 ? instructions : [];
}

function normalizeInstruction(step) {
  // "Die Kartoffeln schneiden" → "Kartoffeln schneiden"
  step = step.replace(/^(die|der|das|den|dem|ein|eine|einen|einem|eines)\s+/i, '');
  // "Kartoffeln werden geschnitten" → "Kartoffeln schneiden"
  step = step.replace(/\s+(werden|wird)\s+.*(?:en|et|t)$/i, '');
  return step;
}

function extractTags(text, kategorie) {
  const tags = new Set();

  if (kategorie.includes('vegan')) tags.add('vegan');
  if (kategorie.includes('vegetarisch')) tags.add('vegetarisch');
  if (text.includes('schnell') || text.includes('15 min')) tags.add('schnell');
  if (text.includes('high protein') || text.includes('protein')) tags.add('high-protein');
  if (text.includes('low carb') || text.includes('low-carb')) tags.add('low-carb');
  if (text.includes('glutenfrei')) tags.add('glutenfrei');
  if (text.includes('low cal') || text.includes('kalorie')) tags.add('low-calorie');
  if (text.includes('meal prep')) tags.add('meal-prep');

  return Array.from(tags);
}

function extractRecipeType(text, titel) {
  const titleLower = titel.toLowerCase();

  if (titleLower.includes('frühstück') || titleLower.includes('breakfast')) return 'frühstück';
  if (titleLower.includes('suppe') || titleLower.includes('soup')) return 'snack';
  if (titleLower.includes('dessert') || titleLower.includes('kuchen') || titleLower.includes('brownie'))
    return 'dessert';
  if (titleLower.includes('snack') || titleLower.includes('chip') || titleLower.includes('wrap'))
    return 'snack';
  if (
    titleLower.includes('getränk') ||
    titleLower.includes('drink') ||
    titleLower.includes('smoothie')
  )
    return 'getränk';
  if (titleLower.includes('beilage') || titleLower.includes('side')) return 'beilage';
  if (titleLower.includes('pasta') || titleLower.includes('pizza') || titleLower.includes('burger'))
    return 'hauptgericht';

  if (text.includes('hauptgang') || text.includes('main')) return 'hauptgericht';

  return 'hauptgericht'; // default
}

function extractServings(caption) {
  const match = caption.match(/(\d+)\s+portion/i);
  return match ? parseInt(match[1]) : 2; // default 2
}

function extractPrepTime(caption) {
  // "15 minuten", "20-30 min", "unter 15 min"
  const match = caption.match(/(\d+)(?:\s*-\s*\d+)?\s*min/i);
  if (match) {
    return parseInt(match[1]);
  }
  // Estimate from Zubereitung-Schritte
  return 20; // default
}

function estimateDifficulty(ingredientCount, stepCount) {
  if (ingredientCount > 10 || stepCount > 6) return 'schwer';
  if (ingredientCount > 6 || stepCount > 4) return 'mittel';
  return 'einfach';
}

function calculateConfidence(ingCount, stepCount, warningCount) {
  let conf = 1.0;
  if (ingCount < 3) conf -= 0.15;
  if (stepCount < 2) conf -= 0.2;
  if (warningCount > 0) conf -= warningCount * 0.1;
  return Math.max(0.5, Math.min(1.0, conf));
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🍽️  MealPlanner Recipe Parser (Manual)\n');

  if (!fs.existsSync(READY_FILE)) {
    console.error(`❌ ${READY_FILE} not found`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(READY_FILE, 'utf8'));
  const recipes = data.recipes || [];

  console.log(`📋 Parsing ${recipes.length} recipes...\n`);

  const parsed = [];
  const errors = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    try {
      const parsed_recipe = parseCaption(recipe.caption);

      const result = {
        ...parsed_recipe,
        source_caption: recipe.caption.substring(0, 500),
        source_author: recipe.author,
        source_thumbnail: recipe.thumbnail,
        source_score: recipe.quality,
        created_at: new Date().toISOString(),
      };

      parsed.push(result);
      process.stdout.write(`\r[${i + 1}/${recipes.length}] ✓ "${parsed_recipe.titel}"`);
    } catch (e) {
      errors.push({
        index: i,
        caption: recipe.caption.substring(0, 100),
        error: e.message,
      });
      process.stdout.write(`\r[${i + 1}/${recipes.length}] ✗ Error`);
    }
  }

  console.log('\n');

  // Save
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

  console.log(`📊 Results:`);
  console.log(`   ✅ Parsed: ${parsed.length}/${recipes.length}`);
  console.log(`   ❌ Failed: ${errors.length}`);
  console.log(`\n💾 Saved to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
