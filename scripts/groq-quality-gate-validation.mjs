#!/usr/bin/env node

/**
 * GROQ QUALITY GATE VALIDATION
 *
 * Teste 10 Baseline-Rezepte:
 * 1. Parse mit Claude (als Groq-Proxy, da wir keinen Groq Key haben)
 * 2. Quality Score vergleichen: DB-Version vs. neu geparst
 * 3. PASS/FAIL: Kann Parser die TOP-Quality (80+) halten?
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envLocalPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
let supabaseUrl, anonKey, anthropicKey;
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key === 'VITE_SUPABASE_URL') supabaseUrl = value.trim();
  if (key === 'VITE_SUPABASE_ANON_KEY') anonKey = value.trim();
  if (key === 'ANTHROPIC_API_KEY') anthropicKey = value.trim();
});

const OUTPUT_DIR = path.join(__dirname, '../scripts/output');

// ============================================================================
// Quality Scoring
// ============================================================================

function qualityScore(recipe) {
  let score = 0;
  if (recipe.titel) score += 15;
  if (recipe.beschreibung) score += 10;
  if (recipe.portionen) score += 5;
  if (recipe.zubereitungszeit_min) score += 5;
  if (recipe.schwierigkeit) score += 5;
  if (recipe.kategorie && Array.isArray(recipe.kategorie) && recipe.kategorie.length > 0) score += 10;
  if (recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0) score += 5;

  if (recipe.zutaten) {
    try {
      const z = typeof recipe.zutaten === 'string' ? JSON.parse(recipe.zutaten) : recipe.zutaten;
      if (Array.isArray(z) && z.length > 0) {
        const valid = z.filter(x => x.name && x.einheit && x.menge !== undefined).length;
        score += (valid / z.length) * 20;
      }
    } catch (e) {}
  }

  if (recipe.zubereitung) {
    try {
      const z = typeof recipe.zubereitung === 'string' ? JSON.parse(recipe.zubereitung) : recipe.zubereitung;
      if (Array.isArray(z) && z.length > 0) {
        score += Math.min(25, z.length * 3);
      }
    } catch (e) {}
  }

  return Math.min(100, Math.round(score));
}

// ============================================================================
// Parse with Claude (simulating Groq)
// ============================================================================

const RECIPE_PROMPT = `Du bist ein Rezept-Parser. Extrahiere aus dieser Instagram-Caption ein Rezept als JSON.

OUTPUT (NUR JSON):
{
  "status": "ok" | "not_a_recipe",
  "titel": "string",
  "beschreibung": "string",
  "portionen": number,
  "zubereitungszeit_min": number,
  "schwierigkeit": "einfach" | "mittel" | "aufwendig",
  "kategorie": ["string"],
  "zutaten": [{"name": "string", "menge": number, "einheit": "string", "hinweis": null}],
  "zubereitung": ["string"],
  "tags": ["string"]
}`;

async function parseRecipeWithClaude(caption) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    // Properly escape caption for JSON
    const escapedCaption = caption
      .substring(0, 500)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');

    const requestBody = JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Parse Rezept:\n\n"${escapedCaption}"`,
      }],
      system: RECIPE_PROMPT,
    });

    const req = https.request(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const duration = Date.now() - startTime;
          try {
            const data = JSON.parse(body);

            if (res.statusCode !== 200) {
              resolve({ success: false, error: data.error?.message, duration });
              return;
            }

            const content = data.content[0]?.text || '';
            let parsed;
            try {
              const jsonStr = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
              parsed = JSON.parse(jsonStr);
            } catch {
              resolve({ success: false, error: 'JSON parse error', duration });
              return;
            }

            resolve({
              success: true,
              recipe: parsed,
              score: parsed.status === 'ok' ? qualityScore(parsed) : 0,
              duration,
            });
          } catch (e) {
            resolve({ success: false, error: e.message, duration });
          }
        });
      }
    );

    req.on('error', (e) => {
      resolve({ success: false, error: e.message, duration: Date.now() - startTime });
    });

    req.write(requestBody);
    req.end();
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🔬 GROQ QUALITY GATE VALIDATION\n');
  console.log('Testing 10 TOP-Quality Baseline-Rezepte\n');

  // Load test plan
  const testPlan = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR, 'quality-gate-test-plan.json'), 'utf8')
  );

  const testRecipes = testPlan.testRecipes;

  console.log('Parsing recipes with Claude (Groq-proxy)...\n');

  const results = [];
  let passCount = 0;

  for (let i = 0; i < testRecipes.length; i++) {
    const recipe = testRecipes[i];
    process.stdout.write(`[${i + 1}/${testRecipes.length}] ${recipe.titel.substring(0, 40).padEnd(40)} `);

    const parseResult = await parseRecipeWithClaude(recipe.captionPreview);

    if (parseResult.success) {
      const dbScore = recipe.currentScore;
      const parseScore = parseResult.score;
      const diff = dbScore - parseScore;
      const pass = parseScore >= 80;

      if (pass) passCount++;

      console.log(`DB: ${dbScore} | Parse: ${parseScore} | Diff: ${diff > 0 ? '+' : ''}${diff} ${pass ? '✅' : '⚠️'}`);

      results.push({
        titel: recipe.titel,
        dbScore,
        parseScore,
        diff,
        pass,
        status: parseResult.recipe.status,
      });
    } else {
      console.log(`❌ Parse error: ${parseResult.error}`);
      results.push({
        titel: recipe.titel,
        error: parseResult.error,
        pass: false,
      });
    }

    await new Promise(r => setTimeout(r, 200));
  }

  // =========================================================================
  // RESULTS
  // =========================================================================

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 QUALITY GATE RESULTS\n');

  console.log('Rezept                              | DB | Parse | Pass?');
  console.log('────────────────────────────────────|----|-------|-------');
  results.forEach(r => {
    if (r.error) {
      console.log(`${r.titel.substring(0, 35).padEnd(35)} | ❌ Error`);
    } else {
      const status = r.pass ? '✅' : '⚠️';
      console.log(`${r.titel.substring(0, 35).padEnd(35)} | ${r.dbScore.toString().padEnd(3)} | ${r.parseScore.toString().padEnd(5)} | ${status}`);
    }
  });

  const passPercentage = (passCount / testRecipes.length * 100).toFixed(1);

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`\n📈 GATE DECISION\n`);
  console.log(`Pass Rate: ${passCount}/${testRecipes.length} (${passPercentage}%)`);
  console.log(`Threshold: ≥80 per Rezept\n`);

  if (passCount >= testRecipes.length * 0.8) {
    console.log('✅ QUALITY GATE: PASS\n');
    console.log('Parser kann TOP-Quality (80+) halten!');
    console.log('→ Weitermachen mit Haiku/Sonnet Vergleich\n');
  } else {
    console.log('❌ QUALITY GATE: FAIL\n');
    console.log('Parser schafft die TOP-Quality nicht konsistent!');
    console.log('→ Groq/Claude-Prozess überprüfen nötig\n');
  }

  // Save results
  const report = {
    timestamp: new Date().toISOString(),
    testCount: testRecipes.length,
    passCount,
    passPercentage: parseFloat(passPercentage),
    threshold: 80,
    decision: passCount >= testRecipes.length * 0.8 ? 'PASS' : 'FAIL',
    results,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'quality-gate-validation-results.json'),
    JSON.stringify(report, null, 2)
  );

  console.log(`Report: ${path.join(OUTPUT_DIR, 'quality-gate-validation-results.json')}\n`);

  // =========================================================================
  // NEXT STEPS
  // =========================================================================

  console.log('═══════════════════════════════════════════════════════');
  console.log('\n🎯 NÄCHSTE SCHRITTE\n');

  if (passCount >= testRecipes.length * 0.8) {
    console.log('1. ✅ Quality Gate PASS → Haiku/Sonnet mit den gleichen 10 testen');
    console.log('2. Quality-Vergleich: Parser A vs. B vs. C');
    console.log('3. Cost-Analyse und Entscheidung');
    console.log('4. URL-Matching für fehlende 55 Instagram-Rezepte\n');
  } else {
    console.log('1. ❌ Quality Gate FAIL → Analyse nötig');
    console.log('2. Welche Felder fallen weg?');
    console.log('3. Groq/Claude-Prompt optimieren');
    console.log('4. Retry nach Optimierung\n');
  }
}

main().catch(console.error);
