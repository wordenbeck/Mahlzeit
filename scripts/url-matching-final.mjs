#!/usr/bin/env node

/**
 * FINAL URL MATCHING
 *
 * Matche 105 neue URLs gegen 55 fehlende Instagram-Rezepte
 * Generiere UPDATE source_url SQL
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../scripts/output');

function scoreMatch(caption, titel) {
  if (!caption || !titel) return 0;

  const capLower = caption.toLowerCase();
  const titLower = titel.toLowerCase();

  let score = 0;
  if (capLower === titLower) score += 100;
  if (capLower.includes(titLower)) score += 50;
  if (titLower.includes(capLower)) score += 40;

  const capWords = capLower.split(/[^a-zäöüß]+/).filter(w => w.length > 3);
  const titWords = titLower.split(/[^a-zäöüß]+/).filter(w => w.length > 3);
  const matches = capWords.filter(w => titWords.includes(w)).length;
  if (matches > 0) score += matches * 10;

  return score;
}

async function main() {
  console.log('🔗 FINAL URL MATCHING\n');

  // Load data
  const matchReport = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR, 'url-matching-report.json'), 'utf8')
  );

  // Load recipes (need to fetch from DB)
  console.log('📥 Would need DB access to fetch recipes...\n');
  console.log('📋 MATCHING STRATEGY:\n');
  console.log('1. Take 105 new URLs (captions available)');
  console.log('2. Match against 55 Instagram-Rezepte without URL (by titel)');
  console.log('3. Score matching: text similarity\n');

  console.log('Available matches from report:\n');
  console.log(`Exact (score > 70):   ${matchReport.matches.exact.length}`);
  console.log(`Good (score 50-70):   ${matchReport.matches.good.length}`);
  console.log(`Possible (score 20-50): ${matchReport.matches.possible.length}`);
  console.log(`No Match (score < 20): ${matchReport.matches.noMatch.length}\n`);

  const readyForUrl = matchReport.matches.exact.length + matchReport.matches.good.length;
  console.log(`✅ Ready to UPDATE source_url: ${readyForUrl}\n`);

  // Save SQL template
  const sqlTemplate = matchReport.matches.exact
    .concat(matchReport.matches.good)
    .map(m => {
      const url = m.url.replace(/'/g, "''");
      const id = m.recipe.id;
      return `UPDATE recipes SET source_url = '${url}' WHERE id = '${id}';`;
    })
    .join('\n');

  const sqlFile = path.join(OUTPUT_DIR, 'update-missing-urls.sql');
  fs.writeFileSync(sqlFile, sqlTemplate);

  console.log(`📝 SQL file: ${sqlFile}`);
  console.log(`   ${readyForUrl} UPDATE statements ready\n`);
}

main().catch(console.error);
