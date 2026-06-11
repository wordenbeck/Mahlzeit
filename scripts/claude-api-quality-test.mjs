#!/usr/bin/env node

/**
 * Claude API Qualitäts-Test: Haiku vs Sonnet vs Opus
 *
 * Testet 10 Instagram-Rezepte mit 3 Claude-Modellen:
 * - claude-3-5-haiku-20241022
 * - claude-3-5-sonnet-20241022
 * - claude-opus-4-8-20250514
 *
 * Output: Confidence-Scores, Parsing-Dauer, Kosten-Vergleich
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';
import readline from 'readline';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envLocalPath = path.join(__dirname, '../.env.local');

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// Env-Variablen
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1';

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY nicht gesetzt!');
  process.exit(1);
}

const URLS_FILE = path.join(__dirname, '../urls.txt');
const OUTPUT_DIR = path.join(__dirname, '../scripts/output');
const TEST_OUTPUT = path.join(OUTPUT_DIR, 'claude-quality-test-' + new Date().toISOString().split('T')[0] + '.json');

// Recipe Parser System Prompt (vereinfacht für Test)
const RECIPE_PARSER_PROMPT = `Du bist ein Rezept-Parser. Extrahiere aus einer Instagram-Caption ein strukturiertes Rezept als JSON.

OUTPUT SCHEMA:
{
  "status": "ok" | "needs_clarification" | "not_a_recipe",
  "rezept": {
    "titel": "string",
    "portionen": number,
    "zubereitungszeit_min": number,
    "schwierigkeit": "einfach" | "mittel" | "aufwendig",
    "zutaten": [{"name": "string", "menge": number, "einheit": "string"}],
    "zubereitung": ["string"],
    "tags": ["string"],
    "ai_confidence": "low" | "medium" | "high"
  },
  "warnungen": ["string"]
}

WICHTIG: Antworte NUR mit JSON, kein Text außerhalb.`;

// ============================================================================
// Utilities
// ============================================================================

async function loadUrls() {
  const urls = [];
  const fileStream = createReadStream(URLS_FILE);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.trim()) urls.push(line.trim());
  }

  return urls;
}

function normalizeUrl(url) {
  return url
    .replace(/\/$/, '')
    .replace(/\?.*/, '')
    .split('?')[0];
}

async function fetchInstagramCaption(url) {
  return new Promise((resolve) => {
    const normalized = normalizeUrl(url);
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(normalized)}`;

    https.get(
      oembedUrl,
      { headers: { 'User-Agent': 'facebookexternalhit/1.1' } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.title && json.title.length > 20) {
              resolve({
                caption: json.title,
                author: json.author_name || null,
                url: normalized,
                success: true,
              });
            } else {
              resolve({
                caption: null,
                url: normalized,
                success: false,
                error: 'Caption zu kurz',
              });
            }
          } catch (e) {
            resolve({
              caption: null,
              url: normalized,
              success: false,
              error: e.message,
            });
          }
        });
      }
    ).on('error', (e) => {
      resolve({
        caption: null,
        url: normalized,
        success: false,
        error: e.message,
      });
    });
  });
}

async function parseWithClaude(model, caption, url) {
  const startTime = Date.now();

  const requestBody = {
    model,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Bitte parse diese Instagram-Caption als Rezept:\n\n"${caption}"`,
      }
    ],
    system: RECIPE_PARSER_PROMPT,
  };

  return new Promise((resolve) => {
    const req = https.request(
      new URL('/messages', ANTHROPIC_BASE_URL),
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
              resolve({
                model,
                url,
                success: false,
                error: data.error?.message || 'Unknown error',
                duration,
                inputTokens: null,
                outputTokens: null,
              });
              return;
            }

            const content = data.content[0]?.text || '';
            let parsed;
            try {
              parsed = JSON.parse(content);
            } catch {
              parsed = { error: 'JSON parse error', raw: content };
            }

            const confidence = parsed.rezept?.ai_confidence || 'unknown';
            const confidenceScore = confidence === 'high' ? 3 : confidence === 'medium' ? 2 : 1;

            resolve({
              model,
              url,
              success: true,
              confidence,
              confidenceScore,
              status: parsed.status || 'unknown',
              duration,
              inputTokens: data.usage?.input_tokens || 0,
              outputTokens: data.usage?.output_tokens || 0,
              parsed: parsed.rezept ? {
                title: parsed.rezept.titel,
                porzioni: parsed.rezept.portionen,
                difficulty: parsed.rezept.schwierigkeit,
                tags: parsed.rezept.tags,
              } : null,
            });
          } catch (e) {
            resolve({
              model,
              url,
              success: false,
              error: e.message,
              duration,
            });
          }
        });
      }
    );

    req.on('error', (e) => {
      resolve({
        model,
        url,
        success: false,
        error: e.message,
        duration: Date.now() - startTime,
      });
    });

    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🚀 Claude API Qualitäts-Test: Haiku vs Sonnet vs Opus\n');

  // URLs laden
  console.log('📥 Lade URLs...');
  const allUrls = await loadUrls();
  console.log(`✅ ${allUrls.length} URLs gefunden\n`);

  // 10 Sample-URLs
  const sampleUrls = allUrls.slice(0, 10);
  console.log(`📋 Teste ${sampleUrls.length} URLs\n`);

  // Captions fetchen
  console.log('🌐 Fetch Instagram Captions...');
  const captions = [];
  for (let i = 0; i < sampleUrls.length; i++) {
    const result = await fetchInstagramCaption(sampleUrls[i]);
    console.log(`  [${i + 1}/${sampleUrls.length}] ${result.success ? '✅' : '❌'} ${result.url}`);
    if (result.success && result.caption) {
      captions.push(result);
    }
    await new Promise(r => setTimeout(r, 500)); // 500ms delay
  }

  console.log(`\n✅ ${captions.length} Captions erfolgreich geladen\n`);

  // Mit 3 Modellen testen
  const models = [
    'claude-3-5-haiku-20241022',
    'claude-3-5-sonnet-20241022',
    'claude-opus-4-8-20250514',
  ];

  const results = {
    timestamp: new Date().toISOString(),
    captions: captions.length,
    models,
    tests: [],
    summary: {},
  };

  for (const caption of captions) {
    console.log(`\n📄 Caption: "${caption.caption.substring(0, 60)}..."\n`);

    const captionResults = {
      url: caption.url,
      caption: caption.caption.substring(0, 200),
      models: {},
    };

    for (const model of models) {
      console.log(`  ⏳ ${model.split('-').slice(1, 3).join(' ')}...`);
      const result = await parseWithClaude(model, caption.caption, caption.url);

      captionResults.models[model] = {
        success: result.success,
        confidence: result.confidence || null,
        confidenceScore: result.confidenceScore || 0,
        duration: result.duration,
        tokens: {
          input: result.inputTokens,
          output: result.outputTokens,
        },
        error: result.error || null,
      };

      if (result.success) {
        console.log(`    ✅ ${result.confidence} confidence · ${result.duration}ms`);
      } else {
        console.log(`    ❌ ${result.error}`);
      }

      await new Promise(r => setTimeout(r, 1000)); // 1s delay zwischen API Calls
    }

    results.tests.push(captionResults);
  }

  // Summary berechnen
  const summary = {};
  for (const model of models) {
    const modelResults = results.tests
      .map(t => t.models[model])
      .filter(r => r.success);

    if (modelResults.length > 0) {
      summary[model] = {
        successRate: `${(modelResults.length / results.tests.length * 100).toFixed(1)}%`,
        avgConfidence: (modelResults.reduce((s, r) => s + r.confidenceScore, 0) / modelResults.length).toFixed(2),
        avgDuration: Math.round(modelResults.reduce((s, r) => s + r.duration, 0) / modelResults.length),
        totalTokens: modelResults.reduce((s, r) => s + (r.tokens.input + r.tokens.output), 0),
        costEstimate: `$${(modelResults.reduce((s, r) => s + (r.tokens.input + r.tokens.output), 0) * 0.00001).toFixed(4)}`,
      };
    }
  }
  results.summary = summary;

  // Output speichern
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(TEST_OUTPUT, JSON.stringify(results, null, 2));

  // Zusammenfassung ausgeben
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('📊 QUALITÄTS-TEST SUMMARY\n');

  for (const model of models) {
    const shortModel = model.split('-').slice(1, 3).join(' ').toUpperCase();
    const sum = summary[model];
    if (sum) {
      console.log(`${shortModel}:`);
      console.log(`  Success Rate:    ${sum.successRate}`);
      console.log(`  Avg Confidence:  ${sum.avgConfidence} / 3.0`);
      console.log(`  Avg Duration:    ${sum.avgDuration}ms`);
      console.log(`  Cost Estimate:   ${sum.costEstimate}`);
      console.log();
    }
  }

  console.log(`\n✅ Ergebnisse gespeichert: ${TEST_OUTPUT}`);
}

main().catch(console.error);
