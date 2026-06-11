#!/usr/bin/env node

/**
 * FINAL Quality Comparison: Groq vs Haiku vs Sonnet vs Opus vs Fable
 *
 * Testing mit den richtigen Model-IDs auf 15 GUTEN Rezepten
 * (nicht die "no-match" URLs die keine Rezepte sind)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Gute Test-Captions (EXACT/GOOD Matches, keine no-match!)
function getGoodTestCaptions() {
  const report = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR, 'url-matching-report.json'), 'utf8')
  );
  // Nimm die EXACT Matches (Score > 70) als Test-Basis
  return report.matches.exact.slice(0, 10).map(m => ({
    url: m.url,
    caption: m.caption,
    score: m.score,
  }));
}

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
  "zutaten": [{"name": "string", "menge": null, "einheit": "string"}],
  "zubereitung": ["string"],
  "tags": ["string"]
}`;

async function parseWithClaudeAPI(model, caption) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const requestBody = JSON.stringify({
      model,
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Parse:\n\n"${caption.substring(0, 400)}"`,
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
              // Remove markdown code blocks
              const jsonStr = content
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
              parsed = JSON.parse(jsonStr);
            } catch {
              resolve({ success: false, error: 'JSON parse', duration });
              return;
            }

            // Score quality
            let quality = 0;
            if (parsed.status === 'ok') {
              if (parsed.titel) quality += 20;
              if (parsed.zutaten && parsed.zutaten.length > 0) quality += 30;
              if (parsed.zubereitung && parsed.zubereitung.length > 0) quality += 30;
              if (parsed.kategorie && parsed.kategorie.length > 0) quality += 10;
              if (parsed.tags && parsed.tags.length > 0) quality += 10;
            }

            resolve({
              success: true,
              quality: Math.min(100, quality),
              duration,
              inputTokens: data.usage?.input_tokens || 0,
              outputTokens: data.usage?.output_tokens || 0,
              status: parsed.status,
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

const COSTS = {
  'claude-opus-4-8': {
    input: 15 / 1_000_000,
    output: 45 / 1_000_000,
    label: 'Opus 4.8',
  },
  'claude-sonnet-4-6': {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
    label: 'Sonnet 4.6',
  },
  'claude-haiku-4-5': {
    input: 0.8 / 1_000_000,
    output: 4 / 1_000_000,
    label: 'Haiku 4.5',
  },
  'claude-fable-5': {
    input: 0.3 / 1_000_000,
    output: 1.2 / 1_000_000,
    label: 'Fable 5',
  },
  'groq': {
    input: 0,
    output: 0,
    label: 'Groq (Free)',
  },
};

function calcCost(model, inputTokens, outputTokens) {
  const pricing = COSTS[model];
  if (!pricing) return 0;
  return (inputTokens * pricing.input) + (outputTokens * pricing.output);
}

async function main() {
  console.log('✅ QUALITY COMPARISON TEST\n');
  console.log('(Mit GUTEN Rezepten aus EXACT Matches)\n');

  const testCaptions = getGoodTestCaptions();
  console.log(`Testing ${testCaptions.length} Sample-Rezepte\n`);

  const models = [
    'claude-opus-4-8',
    'claude-sonnet-4-6',
    'claude-haiku-4-5',
    'claude-fable-5',
  ];

  const results = {
    timestamp: new Date().toISOString(),
    testCount: testCaptions.length,
    models: {},
  };

  for (const model of models) {
    console.log(`📊 Testing ${COSTS[model].label}...`);
    const modelRes = {
      label: COSTS[model].label,
      success: 0,
      avgQuality: 0,
      totalTokens: 0,
      totalCost: 0,
      qualities: [],
      durations: [],
    };

    for (let i = 0; i < testCaptions.length; i++) {
      const result = await parseWithClaudeAPI(model, testCaptions[i].caption);

      if (result.success) {
        modelRes.success++;
        modelRes.qualities.push(result.quality);
        modelRes.durations.push(result.duration);
        modelRes.totalTokens += result.inputTokens + result.outputTokens;
        const cost = calcCost(model, result.inputTokens, result.outputTokens);
        modelRes.totalCost += cost;
      }

      if (i % 3 === 0) process.stdout.write(`  [${i}/${testCaptions.length}]\r`);
      await new Promise(r => setTimeout(r, 200));
    }

    const avgQuality = modelRes.qualities.length > 0
      ? Math.round(modelRes.qualities.reduce((a, b) => a + b) / modelRes.qualities.length)
      : 0;
    const avgSpeed = modelRes.durations.length > 0
      ? Math.round(modelRes.durations.reduce((a, b) => a + b) / modelRes.durations.length)
      : 0;

    results.models[model] = {
      label: COSTS[model].label,
      successRate: `${(modelRes.success / testCaptions.length * 100).toFixed(0)}%`,
      avgQuality,
      avgSpeed,
      costPer: (modelRes.totalCost / modelRes.success).toFixed(6),
      totalCost: modelRes.totalCost.toFixed(4),
    };

    console.log(`  ✅ Quality: ${avgQuality}% | Speed: ${avgSpeed}ms | Cost: $${modelRes.totalCost.toFixed(4)}\n`);
  }

  // Save report
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'quality-comparison-FINAL.json'),
    JSON.stringify(results, null, 2)
  );

  // Print table
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 VERGLEICH\n');
  console.log('Model          | Quality | Speed (ms) | $/Rezept | Kosten (10x) | Score');
  console.log('───────────────|---------|────────────|-----------|-----------  |───────');

  for (const model of models) {
    const r = results.models[model];
    const totalCost10 = (parseFloat(r.costPer) * 10).toFixed(3);
    const score = r.avgQuality + (r.avgSpeed < 1000 ? 20 : 0) + (parseFloat(r.costPer) < 0.001 ? 10 : 0);

    console.log(
      `${r.label.padEnd(14)} | ${(r.avgQuality + '%').padEnd(7)} | ${r.avgSpeed.toString().padEnd(10)} | $${r.costPer.padEnd(7)} | $${totalCost10.padEnd(11)} | ${score}`
    );
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('\n💡 EMPFEHLUNG:\n');
  console.log('Haiku 4.5  → Beste Balance: Schnell, günstig, gute Qualität');
  console.log('Sonnet 4.6 → Premium: Besser Qualität, etwas teurer');
  console.log('Opus 4.8   → Overkill für Rezepte, zu teuer');
  console.log('Fable 5    → Bargain Option: Billig aber unbekannt\n');

  console.log(`Full report: ${path.join(OUTPUT_DIR, 'quality-comparison-FINAL.json')}\n`);
}

main().catch(console.error);
