#!/usr/bin/env node

// Quick test: lade URLs, fetch 5 Captions, check DB

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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Extract URLs
function extractUrls(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/https:\/\/www\.instagram\.com\/[^\s\n]*/g) || [];
  return matches.map(url => url.split(/[?#\s]/)[0]).filter((v, i, a) => a.indexOf(v) === i);
}

async function fetchCaption(url) {
  return new Promise((resolve) => {
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`;
    https.get(
      oembedUrl,
      { headers: { 'User-Agent': 'facebookexternalhit/1.1' } },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.title || null);
          } catch {
            resolve(null);
          }
        });
      }
    ).on('error', () => resolve(null));
  });
}

async function fetchRecipes() {
  return new Promise((resolve, reject) => {
    const urlStr = `${SUPABASE_URL}/rest/v1/recipes?select=id,titel,beschreibung,source_url&limit=500`;
    https.get(
      urlStr,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              resolve(JSON.parse(data));
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    ).on('error', reject);
  });
}

async function main() {
  console.log('🚀 Quick URL Test\n');

  // URLs
  console.log('📂 Extract URLs...');
  const oldUrls = extractUrls(path.join(__dirname, '../../Rezepte/insta_urls old.md'));
  const newUrls = extractUrls(path.join(__dirname, '../../Rezepte/insta_urls new.md'));
  const allUrls = [...new Set([...oldUrls, ...newUrls])];
  console.log(`✅ ${allUrls.length} URLs (${oldUrls.length} old + ${newUrls.length} new)\n`);

  // Test 3 captions
  console.log('🌐 Test 3 Instagram captions...');
  for (let i = 0; i < 3; i++) {
    const url = allUrls[i];
    const caption = await fetchCaption(url);
    console.log(`  ${i + 1}. ${caption ? '✅ ' + caption.substring(0, 60) : '❌'}`);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n🗄️  Fetch recipes from DB...');
  try {
    const recipes = await fetchRecipes();
    console.log(`✅ ${recipes.length} recipes`);
    const withoutUrl = recipes.filter(r => !r.source_url);
    console.log(`   ${withoutUrl.length} without source_url`);

    if (recipes.length > 0) {
      console.log(`\n📋 Sample recipe:`);
      console.log(`   ID: ${recipes[0].id}`);
      console.log(`   Title: ${recipes[0].titel}`);
      console.log(`   Has URL: ${recipes[0].source_url ? 'yes' : 'no'}`);
    }
  } catch (e) {
    console.error(`❌ ${e.message}`);
  }

  console.log('\n✅ Test complete!');
}

main().catch(console.error);
