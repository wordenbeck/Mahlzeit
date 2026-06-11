#!/usr/bin/env node

/**
 * Full Import: 26 Matches (UPDATE) + 33 New Recipes (parse + INSERT)
 *
 * Uses Claude Haiku for parsing new recipes
 * Generates SQL for both UPDATEs and INSERTs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envLocalPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const OUTPUT_DIR = path.join(__dirname, '../scripts/output');
const WORKSPACE_ID = 'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d';
const CREATED_BY = '39b427ea-645c-4845-89a6-1c5a591aba17';

// ============================================================================
// Load Report
// ============================================================================

function loadMatchReport() {
  const reportPath = path.join(OUTPUT_DIR, 'url-matching-report.json');
  return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
}

// ============================================================================
// Claude Haiku Recipe Parsing
// ============================================================================

const RECIPE_PARSER_PROMPT = `Du bist ein Rezept-Parser. Extrahiere aus dieser Instagram-Caption ein strukturiertes Rezept als JSON.

OUTPUT SCHEMA (gültig JSON, nichts außerhalb):
{
  "status": "ok" | "not_a_recipe",
  "titel": "string",
  "beschreibung": "string oder null",
  "portionen": number,
  "zubereitungszeit_min": number oder null,
  "schwierigkeit": "einfach" | "mittel" | "aufwendig",
  "kategorie": ["string"],
  "zutaten": [{"name": "string", "menge": number oder null, "einheit": "string", "hinweis": "string oder null"}],
  "zubereitung": ["string"],
  "tags": ["string"],
  "ai_confidence": "low" | "medium" | "high"
}`;

async function parseRecipeWithClaude(caption, url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const requestBody = JSON.stringify({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Bitte parse diese Instagram-Caption als Rezept:\n\n"${caption}"`,
        }
      ],
      system: RECIPE_PARSER_PROMPT,
    });

    const req = https.request(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          const duration = Date.now() - startTime;
          try {
            const data = JSON.parse(body);

            if (res.statusCode !== 200) {
              resolve({ success: false, error: data.error?.message || 'API error', url });
              return;
            }

            const content = data.content[0]?.text || '';

            // Try to extract JSON from content
            let parsed;
            try {
              // Remove markdown code blocks and extra whitespace
              let jsonStr = content
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
              parsed = JSON.parse(jsonStr);
            } catch {
              resolve({ success: false, error: 'JSON parse error', url, raw: content.substring(0, 100) });
              return;
            }

            if (parsed.status !== 'ok') {
              resolve({ success: false, error: 'Not a recipe', url });
              return;
            }

            resolve({
              success: true,
              url,
              recipe: parsed,
              duration,
              inputTokens: data.usage?.input_tokens,
              outputTokens: data.usage?.output_tokens,
            });
          } catch (e) {
            resolve({ success: false, error: e.message, url });
          }
        });
      }
    );

    req.on('error', (e) => {
      resolve({ success: false, error: e.message, url });
    });

    req.write(requestBody);
    req.end();
  });
}

// ============================================================================
// SQL Generation
// ============================================================================

function generateUpdateSQL(matches) {
  const updates = matches.map(m => {
    const url = m.url.replace(/'/g, "''");
    const id = m.recipe.id;
    return `UPDATE recipes SET source_url = '${url}' WHERE id = '${id}';`;
  });

  return updates.join('\n');
}

function generateInsertSQL(recipes) {
  const inserts = recipes.map(r => {
    if (!r.recipe) return null;

    const recipe = r.recipe;
    const url = r.url.replace(/'/g, "''");
    const titel = (recipe.titel || '').replace(/'/g, "''");
    const beschreibung = (recipe.beschreibung || '').replace(/'/g, "''");
    const portionen = recipe.portionen || 2;
    const zubereitungszeit = recipe.zubereitungszeit_min || null;
    const schwierigkeit = recipe.schwierigkeit || 'einfach';
    const kategorie = JSON.stringify(recipe.kategorie || []);
    const zutaten = JSON.stringify(recipe.zutaten || []);
    const zubereitung = JSON.stringify(recipe.zubereitung || []);
    const tags = JSON.stringify(recipe.tags || []);
    const confidence = recipe.ai_confidence || 'medium';

    return `INSERT INTO recipes
      (workspace_id, created_by, source, source_url, titel, beschreibung, portionen,
       zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags,
       ai_confidence)
    VALUES
      ('${WORKSPACE_ID}', '${CREATED_BY}', 'instagram', '${url}', '${titel}',
       '${beschreibung}', ${portionen}, ${zubereitungszeit}, '${schwierigkeit}',
       '${kategorie}'::text[], '${zutaten}'::jsonb, '${zubereitung}'::jsonb,
       '${tags}'::text[], '${confidence}');`;
  }).filter(Boolean);

  return inserts.join('\n\n');
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🚀 Full Import: 26 Updates + 33 New Recipes\n');

  // Load report
  const report = loadMatchReport();
  const matches = report.matches;

  console.log(`📊 Matches zu UPDATE: ${matches.exact.length} exact + ${matches.good.length} good`);
  console.log(`📊 URLs zu PARSE: ${matches.noMatch.length} no-match\n`);

  // Generate UPDATE SQL
  console.log('✍️  Generating UPDATE SQL for 26 matches...');
  const updateSQL = generateUpdateSQL([...matches.exact, ...matches.good]);
  fs.writeFileSync(path.join(OUTPUT_DIR, '01-update-source-urls.sql'), updateSQL);
  console.log(`   ✅ ${matches.exact.length + matches.good.length} UPDATEs geschrieben\n`);

  // Parse new recipes with Claude
  console.log('🤖 Parsing 33 new recipes with Claude Haiku...');
  const newRecipes = [];

  for (let i = 0; i < matches.noMatch.length; i++) {
    const item = matches.noMatch[i];
    const result = await parseRecipeWithClaude(item.caption, item.url);

    if (i % 5 === 0) {
      console.log(`  [${i}/${matches.noMatch.length}] ${result.success ? '✅' : '❌'}`);
    }

    if (result.success) {
      newRecipes.push(result);
    }

    await new Promise(r => setTimeout(r, 200)); // 200ms delay
  }

  console.log(`  ✅ ${newRecipes.length}/${matches.noMatch.length} erfolgreich geparst\n`);

  // Generate INSERT SQL
  console.log('✍️  Generating INSERT SQL for new recipes...');
  const insertSQL = generateInsertSQL(newRecipes);
  fs.writeFileSync(path.join(OUTPUT_DIR, '02-insert-new-recipes.sql'), insertSQL);
  console.log(`   ✅ ${newRecipes.length} INSERTs geschrieben\n`);

  // Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 IMPORT SUMMARY\n');
  console.log(`📝 File 1: 01-update-source-urls.sql`);
  console.log(`   → UPDATEs für 26 Rezepte (source_url setzen)\n`);
  console.log(`📝 File 2: 02-insert-new-recipes.sql`);
  console.log(`   → INSERTs für ${newRecipes.length} neue Rezepte\n`);
  console.log(`═══════════════════════════════════════════════════════`);
  console.log(`\n💰 Kosten: ~$0.30 (Claude Haiku × 33 Rezepte)\n`);

  // Stats
  const totalTokens = newRecipes.reduce((sum, r) => sum + (r.inputTokens || 0) + (r.outputTokens || 0), 0);
  console.log(`📊 Stats:`);
  console.log(`   Tokens used: ${totalTokens}`);
  console.log(`   Success rate: ${(newRecipes.length / matches.noMatch.length * 100).toFixed(1)}%\n`);

  console.log('✅ Fertig! SQL-Scripts sind ready zum manuellen Review + Execute\n');
}

main().catch(console.error);
