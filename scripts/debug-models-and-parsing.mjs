#!/usr/bin/env node

/**
 * Debug: Welche Modelle funktionieren? Warum so niedrige Success-Rate?
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

// Test Modell-IDs
const MODELS_TO_TEST = [
  'claude-opus-4-1-20250805',      // funktioniert
  'claude-opus-4.1-20250805',      // falsch?
  'claude-sonnet-4-6-20250805',    // versuchen
  'claude-sonnet-4.6-20250805',    // versuchen
  'claude-haiku-4-5-20250805',     // versuchen
  'claude-haiku-4.5-20250805',     // versuchen
];

// Gute Test-Caption (echtes Rezept, nicht "no-match")
const GOOD_CAPTION = `Einfach, gesund und so SAFTIG. Schokoladen Brownies OHNE ZUCKER und OHNE MEHL.

Zutaten:
230g Kichererbsen
100g Haferflocken
1 EL Mandelmus
200g Joghurt
50g Leinsamen
5 EL Kakaopulver
1 TL Zimt
10g Stevia

Zubereitung:
1. Alle Zutaten in den Mixer geben
2. Gut vermischen
3. In eine Form geben und backen
4. Fertig!`;

const SIMPLE_PROMPT = `Du bist ein Rezept-Parser. Antworte NUR mit gültigem JSON:
{
  "status": "ok" | "not_a_recipe",
  "titel": "string",
  "zutaten": [{"name": "string", "menge": null, "einheit": "string"}],
  "zubereitung": ["string"]
}`;

async function testModel(modelId) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const requestBody = JSON.stringify({
      model: modelId,
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Parse Rezept:\n\n"${GOOD_CAPTION.substring(0, 300)}"`,
      }],
      system: SIMPLE_PROMPT,
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

            if (res.statusCode === 404) {
              resolve({
                model: modelId,
                status: '❌ 404',
                error: data.error?.message,
                duration,
              });
              return;
            }

            if (res.statusCode !== 200) {
              resolve({
                model: modelId,
                status: `❌ ${res.statusCode}`,
                error: data.error?.message || 'Unknown error',
                duration,
              });
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
              resolve({
                model: modelId,
                status: '⚠️ JSON Error',
                response: content.substring(0, 100),
                duration,
              });
              return;
            }

            resolve({
              model: modelId,
              status: parsed.status === 'ok' ? '✅ OK' : '⚠️ NOT_RECIPE',
              response: parsed.status,
              duration,
              tokens: data.usage?.input_tokens + data.usage?.output_tokens,
            });
          } catch (e) {
            resolve({
              model: modelId,
              status: '❌ Error',
              error: e.message,
              duration,
            });
          }
        });
      }
    );

    req.on('error', (e) => {
      resolve({
        model: modelId,
        status: '❌ Network Error',
        error: e.message,
        duration: Date.now() - startTime,
      });
    });

    req.write(requestBody);
    req.end();
  });
}

async function main() {
  console.log('🔧 DEBUG: Model IDs + Parsing Success Rate\n');

  console.log('═══════════════════════════════════════════════════════');
  console.log('1️⃣  TESTING MODELL-IDs\n');
  console.log('Testkarte: Schokoladen Brownies (echtes Rezept)\n');

  for (const model of MODELS_TO_TEST) {
    process.stdout.write(`Testing ${model.substring(0, 35).padEnd(35)}... `);
    const result = await testModel(model);
    console.log(`${result.status} | ${result.response || result.error || ''}`);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('2️⃣  AVAILABLE MODELS:\n');
  console.log('✅ claude-opus-4-1-20250805 (funktioniert)\n');
  console.log('❓ Sonnet/Haiku: Bitte neue IDs prüfen!');
  console.log('   - claude-sonnet-4-6-20250805');
  console.log('   - claude-haiku-4-5-20250805\n');

  console.log('═══════════════════════════════════════════════════════');
  console.log('3️⃣  WARUM NUR 7% SUCCESS-RATE?\n');
  console.log('Vermutungen:');
  console.log('  ❌ Die 15 Test-URLs sind keine echten Rezepte (30 von 33 nicht!)');
  console.log('  ✅ Opus antwortet richtig mit "not_a_recipe"');
  console.log('  → Problem: "no-match" URLs sind überwiegend Marketing/Bio-Links\n');

  console.log('LÖSUNG:');
  console.log('  1. Haiku/Sonnet IDs finden (oben testen)');
  console.log('  2. NUR die 26 EXACT/GOOD Matches importieren (nicht die no-match)');
  console.log('  3. Groq für zukünftige neue Rezepte testen\n');
}

main().catch(console.error);
