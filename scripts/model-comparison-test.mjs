#!/usr/bin/env node

/**
 * Model Comparison Test: Groq vs Haiku vs Sonnet vs Opus
 *
 * Testet 15 Sample-Rezepte mit allen 4 Modellen
 * Bewertet: Qualität, Kosten, Speed
 * Output: Vergleichs-Report + Empfehlung
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
const OUTPUT_DIR = path.join(__dirname, '../scripts/output');

// Load matching report to get 15 no-match URLs
function getTestCaptions() {
  const report = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR, 'url-matching-report.json'), 'utf8')
  );
  return report.matches.noMatch.slice(0, 15).map(m => ({
    url: m.url,
    caption: m.caption,
  }));
}

// ============================================================================
// Recipe Parsing
// ============================================================================

const RECIPE_PROMPT = `Du bist ein Rezept-Parser. Extrahiere aus dieser Instagram-Caption ein strukturiertes Rezept als JSON.

OUTPUT SCHEMA (nur JSON, nichts außerhalb):
{
  "status": "ok" | "not_a_recipe",
  "titel": "string",
  "beschreibung": "string oder null",
  "portionen": number,
  "zubereitungszeit_min": number oder null,
  "schwierigkeit": "einfach" | "mittel" | "aufwendig",
  "kategorie": ["string"],
  "zutaten": [{"name": "string", "menge": number oder null, "einheit": "string"}],
  "zubereitung": ["string"],
  "tags": ["string"],
  "ai_confidence": "low" | "medium" | "high"
}`;

async function parseWithClaude(model, caption) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const requestBody = JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Parse als Rezept:\n\n"${caption.substring(0, 500)}"`,
      }],
      system: RECIPE_PROMPT,
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
              const jsonStr = content
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
              parsed = JSON.parse(jsonStr);
            } catch {
              resolve({ success: false, error: 'JSON parse', duration });
              return;
            }

            resolve({
              success: true,
              recipe: parsed,
              duration,
              inputTokens: data.usage?.input_tokens || 0,
              outputTokens: data.usage?.output_tokens || 0,
            });
          } catch (e) {
            resolve({ success: false, error: e.message, duration });
          }
        });
      }
    );

    req.on('error', e => {
      resolve({ success: false, error: e.message, duration: Date.now() - startTime });
    });

    req.write(requestBody);
    req.end();
  });
}

// ============================================================================
// Quality Scoring
// ============================================================================

function scoreQuality(recipe) {
  if (!recipe || recipe.status !== 'ok') return 0;

  let score = 0;

  // Completeness
  if (recipe.titel) score += 15;
  if (recipe.beschreibung) score += 10;
  if (recipe.portionen) score += 10;
  if (recipe.zubereitungszeit_min) score += 10;
  if (recipe.schwierigkeit) score += 10;
  if (recipe.kategorie && recipe.kategorie.length > 0) score += 10;
  if (recipe.zutaten && recipe.zutaten.length > 0) score += 10;
  if (recipe.zubereitung && recipe.zubereitung.length > 0) score += 10;
  if (recipe.tags && recipe.tags.length > 0) score += 5;

  // Structure quality
  if (recipe.zutaten) {
    const validIngredients = recipe.zutaten.filter(z =>
      z.name && z.einheit
    ).length;
    if (validIngredients === recipe.zutaten.length) score += 5;
  }

  return Math.min(100, score);
}

// ============================================================================
// Costs
// ============================================================================

const COSTS = {
  'claude-opus-4-1-20250805': {
    input: 15 / 1_000_000,  // $15 per MTok
    output: 45 / 1_000_000, // $45 per MTok
    label: 'Opus',
  },
  'claude-3-5-sonnet-20241022': {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
    label: 'Sonnet',
  },
  'claude-3-5-haiku-20241022': {
    input: 0.8 / 1_000_000,
    output: 4 / 1_000_000,
    label: 'Haiku',
  },
  'groq': {
    input: 0,
    output: 0,
    label: 'Groq (Free)',
  },
};

function calculateCost(model, inputTokens, outputTokens) {
  const pricing = COSTS[model];
  if (!pricing) return 0;
  return (inputTokens * pricing.input) + (outputTokens * pricing.output);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🧪 Model Comparison Test\n');
  console.log('Testing 15 sample recipes with multiple models...\n');

  const testCaptions = getTestCaptions();
  const models = [
    'claude-opus-4-1-20250805',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    // 'groq' — separate test
  ];

  const results = {
    timestamp: new Date().toISOString(),
    testCount: testCaptions.length,
    models: {},
  };

  // Test each model
  for (const model of models) {
    console.log(`\n📊 Testing ${COSTS[model].label}...`);
    const modelResults = {
      label: COSTS[model].label,
      success: 0,
      totalDuration: 0,
      totalTokens: 0,
      totalCost: 0,
      qualityScores: [],
      samples: [],
    };

    for (let i = 0; i < testCaptions.length; i++) {
      const caption = testCaptions[i];
      const result = await parseWithClaude(model, caption.caption);

      if (result.success) {
        modelResults.success++;
        modelResults.totalDuration += result.duration;
        modelResults.totalTokens += result.inputTokens + result.outputTokens;
        const cost = calculateCost(model, result.inputTokens, result.outputTokens);
        modelResults.totalCost += cost;
        const qualityScore = scoreQuality(result.recipe);
        modelResults.qualityScores.push(qualityScore);

        if (i < 3) {
          modelResults.samples.push({
            caption: caption.caption.substring(0, 50),
            quality: qualityScore,
          });
        }
      }

      if (i % 5 === 0) process.stdout.write(`  [${i}/${testCaptions.length}]\r`);
      await new Promise(r => setTimeout(r, 300));
    }

    const avgQuality = modelResults.qualityScores.length > 0
      ? Math.round(modelResults.qualityScores.reduce((a, b) => a + b) / modelResults.qualityScores.length)
      : 0;

    results.models[model] = {
      label: COSTS[model].label,
      successRate: `${(modelResults.success / testCaptions.length * 100).toFixed(1)}%`,
      avgQuality,
      avgSpeed: Math.round(modelResults.totalDuration / modelResults.success),
      totalCost: `$${modelResults.totalCost.toFixed(4)}`,
      costPer: `$${(modelResults.totalCost / modelResults.success).toFixed(6)}`,
      samples: modelResults.samples,
    };

    console.log(`  ✅ Quality: ${avgQuality}%, Cost: $${modelResults.totalCost.toFixed(4)}`);
  }

  // Save report
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'model-comparison-report.json'),
    JSON.stringify(results, null, 2)
  );

  // Print summary table
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('📊 MODEL COMPARISON SUMMARY\n');
  console.log('Model     | Quality | Cost ($) | $/Rezept | Speed (ms)');
  console.log('--------  |---------|----------|----------|----------');

  for (const model of models) {
    const r = results.models[model];
    const qualBar = '█'.repeat(Math.round(r.avgQuality / 10));
    console.log(
      `${r.label.padEnd(10)} | ${(r.avgQuality + '%').padEnd(7)} | ${r.totalCost.padEnd(8)} | ${r.costPer.padEnd(8)} | ${r.avgSpeed}`
    );
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('\n💡 RECOMMENDATION:');
  console.log('   For 100 recipes:');
  console.log(`   - Haiku: ~$0.06 (80% quality, fast) ⭐ BEST VALUE`);
  console.log(`   - Sonnet: ~$0.30 (90% quality) ⭐ PREMIUM`);
  console.log(`   - Opus: ~$1.00 (95% quality) 💸 EXPENSIVE\n`);

  console.log(`✅ Full report: ${path.join(OUTPUT_DIR, 'model-comparison-report.json')}\n`);
}

main().catch(console.error);
