#!/usr/bin/env node

/**
 * Simple Claude API Test — direkt ohne Instagram-Scraping
 * Testet ob die 3 Modelle antworten
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

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

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY nicht gefunden');
  process.exit(1);
}

async function callClaude(model, message) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const requestBody = JSON.stringify({
      model,
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: message,
        }
      ],
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
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          const duration = Date.now() - startTime;
          try {
            const data = JSON.parse(body);

            if (res.statusCode !== 200) {
              resolve({
                model,
                success: false,
                statusCode: res.statusCode,
                error: data.error?.message || 'Unknown error',
                duration,
              });
              return;
            }

            const content = data.content[0]?.text || '';
            resolve({
              model,
              success: true,
              statusCode: 200,
              duration,
              inputTokens: data.usage?.input_tokens || 0,
              outputTokens: data.usage?.output_tokens || 0,
              response: content.substring(0, 100),
              stopReason: data.stop_reason,
            });
          } catch (e) {
            resolve({
              model,
              success: false,
              error: e.message,
              duration,
              rawBody: body.substring(0, 200),
            });
          }
        });
      }
    );

    req.on('error', (e) => {
      resolve({
        model,
        success: false,
        error: e.message,
        duration: Date.now() - startTime,
      });
    });

    req.write(requestBody);
    req.end();
  });
}

async function main() {
  console.log('🧪 Simple Claude API Test\n');

  const testMessage = 'Schreibe ein kurzes deutsches Rezept für Spaghetti Carbonara';

  const models = [
    'claude-3-5-haiku-20241022',
    'claude-3-5-sonnet-20241022',
    'claude-opus-4-8-20250514',
  ];

  for (const model of models) {
    console.log(`⏳ Testing ${model}...`);
    const result = await callClaude(model, testMessage);

    if (result.success) {
      console.log(`  ✅ Success (${result.duration}ms)`);
      console.log(`  📊 Tokens: ${result.inputTokens} in, ${result.outputTokens} out`);
      console.log(`  📝 Response: "${result.response}..."`);
      console.log(`  🛑 Stop: ${result.stopReason}\n`);
    } else {
      console.log(`  ❌ Error (${result.duration}ms)`);
      console.log(`  📋 ${result.error || result.statusCode}\n`);
    }

    await new Promise(r => setTimeout(r, 1000));
  }
}

main().catch(console.error);
