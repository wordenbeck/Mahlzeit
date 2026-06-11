#!/usr/bin/env node

/**
 * Find correct Model IDs for Opus 4.8, Sonnet 4.6, Haiku 4.5
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

// Mögliche Model IDs zu testen
const MODELS_TO_TEST = [
  // Short names (ohne Datum)
  'claude-opus-4-8',
  'claude-sonnet-4-6',
  'claude-haiku-4-5',
  'claude-fable-5',

  // Mit verschiedenen Datumsangaben
  'claude-opus-4-8-20250805',
  'claude-sonnet-4-6-20250805',
  'claude-haiku-4-5-20250805',

  'claude-opus-4.8-20250805',
  'claude-sonnet-4.6-20250805',
  'claude-haiku-4.5-20250805',

  // Alternative Datumsformate
  'claude-opus-4.8-20250101',
  'claude-sonnet-4.6-20250101',
  'claude-haiku-4.5-20250101',
];

const TEST_PROMPT = 'Hallo, ich bin ein Test. Antworte mit OK wenn du funktionierst.';

async function testModel(modelId) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const requestBody = JSON.stringify({
      model: modelId,
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: TEST_PROMPT,
      }],
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

            if (res.statusCode === 200) {
              resolve({
                model: modelId,
                status: '✅ WORKS',
                duration,
              });
            } else if (res.statusCode === 404) {
              resolve({
                model: modelId,
                status: '❌ 404',
                duration,
              });
            } else {
              resolve({
                model: modelId,
                status: `❌ ${res.statusCode}`,
                duration,
              });
            }
          } catch (e) {
            resolve({
              model: modelId,
              status: '❌ Parse Error',
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
        duration: Date.now() - startTime,
      });
    });

    req.write(requestBody);
    req.end();
  });
}

async function main() {
  console.log('🔍 Finding Correct Model IDs\n');
  console.log('Testing: Opus 4.8, Sonnet 4.6, Haiku 4.5, Fable 5\n');

  const working = [];

  for (const model of MODELS_TO_TEST) {
    process.stdout.write(`${model.padEnd(45)}... `);
    const result = await testModel(model);

    if (result.status === '✅ WORKS') {
      console.log(result.status);
      working.push(model);
    } else {
      console.log(result.status);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 WORKING MODELS:\n');

  if (working.length === 0) {
    console.log('❌ Keine Modelle gefunden!\n');
    console.log('Alternative: Bitte check deine Anthropic Console');
    console.log('und poste die exakten Model-IDs.\n');
  } else {
    working.forEach(m => console.log(`✅ ${m}`));
    console.log();
    console.log('Nutze diese IDs für die Tests!');
  }
}

main().catch(console.error);
