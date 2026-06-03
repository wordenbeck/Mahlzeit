/**
 * Extract Zubereitungszeit from SanaMana PDFs
 * Match with existing DB Rezepte by titel
 * Generate UPDATE SQL to set zubereitungszeit_min
 */
import * as fs from 'fs';
import * as path from 'path';

const specDir = path.join(process.cwd(), '../MealPlanner-Spec/Sanamana Rezepte');

function extractTimes(content) {
  const recipes = {};

  // Split by recipe headers (# oder ##)
  let blocks = content.split(/\n(?=^#+\s)/m);

  for (const block of blocks) {
    const lines = block.split('\n');

    // Extract title (first line)
    const titel = lines[0].replace(/^#+\s+/, '').trim();
    if (!titel || titel.includes('Batch') || titel.includes('Extraktion')) continue;

    let time = null;

    // Look for time patterns: "20 Minuten", "20-30 Min", "ca. 15 min"
    for (const line of lines) {
      const match = line.match(/(\d+)\s*(?:-\d+)?\s*(?:Minuten?|Min|min|min\.)/i);
      if (match) {
        time = parseInt(match[1]);
        break;
      }
    }

    if (titel && time) {
      recipes[titel] = time;
    }
  }

  return recipes;
}

async function main() {
  const files = [
    'rezepte_batch_1.md',
    'Rezepte_Batch_2.md',
    'rezepte_batch_3.md'
  ];

  const allTimes = {};

  for (const file of files) {
    const filePath = path.join(specDir, file);
    if (!fs.existsSync(filePath)) {
      process.stderr.write(`File not found: ${filePath}\n`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const times = extractTimes(content);
    Object.assign(allTimes, times);
    process.stderr.write(`${file}: ${Object.keys(times).length} recipes with time\n`);
  }

  // Now get the current DB recipes and match
  const env = fs.readFileSync('./.env.local', 'utf-8');
  const SUPA = env.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
  const ANON = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

  const res = await fetch(SUPA + '/rest/v1/recipes?source=eq.sanamana&select=id,titel,zubereitungszeit_min', {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` }
  });
  const dbRecipes = await res.json();

  let matched = 0, missed = 0;
  let sql = '-- SanaMana: Set Zubereitungszeit\nBEGIN;\n\n';

  for (const dbR of dbRecipes) {
    const extractedTime = allTimes[dbR.titel];
    if (extractedTime) {
      sql += `UPDATE recipes SET zubereitungszeit_min = ${extractedTime}, updated_at = NOW() WHERE id = '${dbR.id}';\n`;
      matched++;
    } else {
      missed++;
      process.stderr.write(`⚠️  No time found for: ${dbR.titel}\n`);
    }
  }

  sql += '\nCOMMIT;\n';

  fs.writeFileSync('./sanamana_set_times.sql', sql, 'utf-8');

  process.stderr.write(`\n✅ Matched: ${matched}/${dbRecipes.length}\n`);
  process.stderr.write(`❌ Missed: ${missed}\n`);
  process.stderr.write(`📝 SQL: ./sanamana_set_times.sql\n`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
