#!/usr/bin/env node

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

const SIMPLE_PROMPT = `Antworte nur mit JSON:
{
  "titel": "Rezept Name",
  "portionen": 2,
  "status": "ok"
}`;

async function testClaude() {
  return new Promise((resolve) => {
    const caption = "Einfache Pasta Carbonara mit 4 Zutaten";

    const requestBody = JSON.stringify({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Parse as JSON:\n\n"${caption}"`,
        }
      ],
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
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            console.log('✅ API Response:');
            console.log('Status:', res.statusCode);
            console.log('Content:', data.content[0]?.text);
            console.log('\n🔍 Raw text:');
            console.log(JSON.stringify(data.content[0]?.text));
            resolve();
          } catch (e) {
            console.error('❌ Parse error:', e.message);
            console.log('Body:', body);
            resolve();
          }
        });
      }
    );

    req.on('error', (e) => {
      console.error('❌ Request error:', e.message);
      resolve();
    });

    req.write(requestBody);
    req.end();
  });
}

console.log('🧪 Debug Claude Response\n');
testClaude().catch(console.error);
