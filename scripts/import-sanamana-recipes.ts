/**
 * Generate SQL for importing SanaMana Recipes
 * Handles both h2 format (batch 1, 3) and h1 format (batch 2)
 */

import * as fs from 'fs';
import * as path from 'path';

interface ParsedRecipe {
  titel: string;
  zubereitung: string;
  zutaten: string;
  zubereitungszeit_min?: number;
}

// Track unique titles across all files
const seenTitles = new Set<string>();

function parseMarkdownRecipes(content: string): ParsedRecipe[] {
  const recipes: ParsedRecipe[] = [];

  // Split by BOTH h1 and h2 at line start, but give priority to h1
  // First try h1 split, if none found try h2 split
  let recipeBlocks = content.split(/\n(?=^# )/m);

  // If only one block (no h1), try h2
  if (recipeBlocks.length === 1) {
    recipeBlocks = content.split(/\n(?=^## )/m);
  }

  for (const block of recipeBlocks) {
    const lines = block.split('\n');

    // Extract title (first line, remove # or ##)
    const titel = lines[0].replace(/^#+\s+/, '').trim();

    // Skip header lines
    if (!titel ||
        titel.includes('Batch') ||
        titel.includes('Extraktion')) {
      continue;
    }

    // Skip duplicates (keep first occurrence)
    if (seenTitles.has(titel.toLowerCase())) {
      continue;
    }
    seenTitles.add(titel.toLowerCase());

    let zubereitungszeit_min: number | undefined;
    let zutaten = '';
    let zubereitung = '';
    let inZutaten = false;
    let inZubereitung = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Extract Zubereitungszeit
      const zeitMatch = line.match(/\*\*Zubereitungszeit:\*?\s*(\d+)\s*Minuten?/i);
      if (zeitMatch) {
        zubereitungszeit_min = parseInt(zeitMatch[1]);
      }

      // Detect Zutaten section
      if (line.match(/^[#]*\s*Zutaten/i) || line.match(/^\*\*Zutaten/i)) {
        inZutaten = true;
        inZubereitung = false;
        continue;
      }

      // Detect Zubereitung section
      if (line.match(/^[#]*\s*Zubereitung/i) || line.match(/^\*\*Zubereitung/i)) {
        inZubereitung = true;
        inZutaten = false;
        continue;
      }

      // Stop at end markers
      if (line.match(/^---/) || line.match(/^[#]{1,2}\s+/)) {
        if (inZutaten || inZubereitung) {
          break;
        }
      }

      // Stop zutaten if we hit a **Tipp** or **Hinweis** line (notes section)
      if (inZutaten && line.match(/^\*\*(Tipp|Hinweis|Geheimtipp):/i)) {
        break;
      }

      // Collect content - ONLY bullet items for zutaten
      if (inZutaten && line.trim() && line.match(/^[-*]\s+/)) {
        zutaten += line + '\n';
      }

      if (inZubereitung && line.trim() && !line.match(/^[#>]/)) {
        zubereitung += line + '\n';
      }
    }

    zutaten = zutaten.trim();
    zubereitung = zubereitung.trim();

    if (titel && zutaten && zubereitung) {
      recipes.push({
        titel,
        zutaten,
        zubereitung,
        zubereitungszeit_min,
      });
    }
  }

  return recipes;
}

function escapeSql(str: string): string {
  // Escape single quotes AND newlines
  return str
    .replace(/\\/g, '\\\\')     // Backslash first
    .replace(/'/g, "''")         // Single quotes
    .replace(/\n/g, '\\n')       // Newlines to \n
    .replace(/\r/g, '\\r')       // Carriage returns
    .replace(/\t/g, '\\t');      // Tabs
}

function parseZutatenToJsonArray(text: string): string {
  // zutaten ist jsonb: [{ name, menge, einheit, hinweis }]
  // SanaMana-Items wie "80 g Naturreis" → komplett in name, menge=null
  const lines = text.split('\n').filter(l => l.trim());
  const objects = lines
    .map(l => l.replace(/^[-*]\s+/, '').trim())
    .filter(l => l)
    .map(name => {
      const escName = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `{"name":"${escName}","menge":null,"einheit":null,"hinweis":null}`;
    })
    .join(',');

  return `[${objects}]`;
}

function parseZubereitungToJsonArray(text: string): string {
  // zubereitung ist jsonb: ["Schritt 1", "Schritt 2", ...]
  // Führende "1. " / "2. " Nummern entfernen (App nummeriert selbst)
  const lines = text.split('\n').filter(l => l.trim());
  const steps = lines
    .map(l => l.replace(/^\d+\.\s*/, '').trim())
    .filter(l => l)
    .map(step => {
      const escStep = step.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `"${escStep}"`;
    })
    .join(',');

  return `[${steps}]`;
}

async function generateSQL() {
  const batchDir = path.join(
    process.cwd(),
    '../MealPlanner-Spec/Sanamana Rezepte'
  );

  const files = [
    'rezepte_batch_1.md',
    'Rezepte_Batch_2.md',
    'rezepte_batch_3.md',
  ];

  const allRecipes: ParsedRecipe[] = [];

  for (const file of files) {
    const filePath = path.join(batchDir, file);
    if (!fs.existsSync(filePath)) {
      process.stderr.write(`File not found: ${filePath}\n`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const recipes = parseMarkdownRecipes(content);
    process.stderr.write(`${file}: ${recipes.length} recipes\n`);
    allRecipes.push(...recipes);
  }

  process.stderr.write(`\n✓ Parsed ${allRecipes.length} recipes\n\n`);

  // Build SQL into a string buffer (NICHT stdout — verhindert Log-Müll in Datei)
  let sql = '';
  sql += `-- SanaMana Recipes Import (${new Date().toISOString()})\n`;
  sql += `-- Total recipes: ${allRecipes.length}\n\n`;
  sql += `BEGIN;\n\n`;

  // Echte IDs aus bestehenden Rezepten (Instagram-Import)
  const WORKSPACE_ID = 'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d';
  const CREATED_BY = '39b427ea-645c-4845-89a6-1c5a591aba17';

  for (const recipe of allRecipes) {
    const titel = escapeSql(recipe.titel);
    const zutaten = parseZutatenToJsonArray(recipe.zutaten);
    const zubereitung = parseZubereitungToJsonArray(recipe.zubereitung);
    const zeit = recipe.zubereitungszeit_min || 'NULL';

    sql += `INSERT INTO recipes (
  workspace_id,
  created_by,
  source,
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  '${WORKSPACE_ID}',
  '${CREATED_BY}',
  'sanamana',
  '${titel}',
  '${zutaten}'::jsonb,
  '${zubereitung}'::jsonb,
  ${zeit},
  'mittel',
  true,
  NOW(),
  NOW()
);\n\n`;
  }

  sql += `COMMIT;\n`;

  // Direkt in Datei schreiben — kein stdout/stderr Mischrisiko mehr
  const outPath = path.join(process.cwd(), 'sanamana_simple.sql');
  fs.writeFileSync(outPath, sql, 'utf-8');
  process.stderr.write(`\n📝 SQL geschrieben nach: ${outPath}\n`);
}

generateSQL().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
