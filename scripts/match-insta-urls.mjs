#!/usr/bin/env node

/**
 * Instagram URL Matcher — URLs from Rezepte/ gegen DB-Rezepte matchen
 *
 * Workflow:
 * 1. Lädt URLs aus Rezepte/insta_urls_old.md + Rezepte/insta_urls_new.md
 * 2. Fetcht Captions via Instagram oEmbed API
 * 3. Vergleicht gegen DB-Rezepte (simple text matching)
 * 4. Generiert Report: exact matches, good matches, possible, no-match
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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const REZEPTE_DIR = path.join(__dirname, '../../Rezepte');
const OUTPUT_DIR = path.join(__dirname, '../scripts/output');
const REPORT_FILE = path.join(OUTPUT_DIR, 'url-matching-report.json');

// ============================================================================
// URL Loading
// ============================================================================

function extractUrlsFromMd(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  const urls = [];

  // Match all Instagram URLs (with or without params)
  const matches = content.match(/https:\/\/www\.instagram\.com\/[^\s\n]*/g) || [];

  for (const url of matches) {
    // Clean up: remove trailing punctuation and params
    const cleaned = url.split(/[?#\s]/)[0];
    if (cleaned && !urls.includes(cleaned)) {
      urls.push(cleaned);
    }
  }

  return urls;
}

// ============================================================================
// Instagram Caption Fetching
// ============================================================================

async function fetchInstagramCaption(url) {
  return new Promise((resolve) => {
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`;

    const req = https.get(
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
                url,
                caption: json.title,
                author: json.author_name || null,
                success: true,
              });
            } else {
              resolve({ url, caption: null, success: false });
            }
          } catch {
            resolve({ url, caption: null, success: false });
          }
        });
      }
    );

    req.on('error', () => {
      resolve({ url, caption: null, success: false });
    });
  });
}

// ============================================================================
// DB Fetching
// ============================================================================

async function fetchRecipesFromDB() {
  return new Promise((resolve, reject) => {
    const urlStr = `${SUPABASE_URL}/rest/v1/recipes?select=id,titel,beschreibung,source_url&limit=500`;
    const url = new URL(urlStr);

    https.get(
      url.toString(),
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              resolve(JSON.parse(data));
            } else {
              console.error(`DB Error: ${res.statusCode} - ${data}`);
              reject(new Error(`HTTP ${res.statusCode}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    ).on('error', reject);
  });
}

// ============================================================================
// Matching
// ============================================================================

function scoreMatch(caption, recipe) {
  if (!caption || !recipe.titel) return 0;

  const captionLower = caption.toLowerCase();
  const titelLower = recipe.titel.toLowerCase();
  const descLower = (recipe.beschreibung || '').toLowerCase();

  let score = 0;

  // Exact match
  if (captionLower === titelLower) score += 100;

  // Contains
  if (captionLower.includes(titelLower)) score += 50;
  if (titelLower.includes(captionLower)) score += 40;

  // Word overlap (>3 chars)
  const captionWords = captionLower.split(/[^a-zäöüß]+/).filter(w => w.length > 3);
  const titelWords = titelLower.split(/[^a-zäöüß]+/).filter(w => w.length > 3);
  const matches = captionWords.filter(w => titelWords.includes(w)).length;
  if (matches > 0) score += matches * 10;

  // Description match
  if (descLower && captionLower.includes(descLower)) score += 20;

  return score;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🚀 Instagram URL Matcher\n');

  // Load URLs
  console.log('📂 Lade URLs aus Rezepte/...');
  const urlsOld = extractUrlsFromMd(path.join(REZEPTE_DIR, 'insta_urls old.md'));
  const urlsNew = extractUrlsFromMd(path.join(REZEPTE_DIR, 'insta_urls new.md'));
  const allUrls = [...new Set([...urlsOld, ...urlsNew])]; // Deduplicate

  console.log(`  📋 Old: ${urlsOld.length}, New: ${urlsNew.length}, Total unique: ${allUrls.length}\n`);

  // Fetch recipes
  console.log('🗄️  Lade Rezepte aus DB...');
  const recipes = await fetchRecipesFromDB();
  console.log(`  ✅ ${recipes.length} Rezepte geladen`);

  const withoutUrl = recipes.filter(r => !r.source_url);
  console.log(`  📊 ${withoutUrl.length} ohne source_url\n`);

  // Fetch captions
  console.log('🌐 Fetch Instagram Captions...');
  const urlsWithCaption = [];

  for (let i = 0; i < allUrls.length; i++) {
    const result = await fetchInstagramCaption(allUrls[i]);
    if (i % 10 === 0) process.stdout.write(`  [${i}/${allUrls.length}]\r`);

    if (result.success) {
      urlsWithCaption.push(result);
    }

    await new Promise(r => setTimeout(r, 100)); // 100ms delay
  }

  console.log(`  ✅ ${urlsWithCaption.length}/${allUrls.length} Captions erfolgreich\n`);

  // Matching
  console.log('🎯 Matching...\n');

  const matches = {
    exact: [],      // score > 70
    good: [],       // score 50-70
    possible: [],   // score 20-50
    noMatch: [],    // score < 20
    alreadyHasUrl: [], // recipe.source_url exists
  };

  for (const item of urlsWithCaption) {
    const scores = withoutUrl.map(r => ({
      recipe: r,
      score: scoreMatch(item.caption, r),
    }));

    scores.sort((a, b) => b.score - a.score);
    const best = scores[0];

    const matchType = !best ? 'noMatch'
      : best.score > 70 ? 'exact'
      : best.score > 50 ? 'good'
      : best.score > 20 ? 'possible'
      : 'noMatch';

    if (matchType === 'noMatch' || !best) {
      matches.noMatch.push({
        url: item.url,
        caption: item.caption.substring(0, 80),
        bestScore: best?.score || 0,
      });
    } else {
      matches[matchType].push({
        url: item.url,
        caption: item.caption.substring(0, 80),
        recipe: best.recipe,
        score: best.score,
      });
    }
  }

  // Check already-has-url
  for (const recipe of recipes) {
    if (recipe.source_url) {
      const foundUrl = allUrls.find(u => u === recipe.source_url);
      if (foundUrl) {
        matches.alreadyHasUrl.push({
          recipe,
          url: foundUrl,
        });
      }
    }
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalUrls: allUrls.length,
      urlsWithCaption: urlsWithCaption.length,
      totalRecipes: recipes.length,
      recipesWithoutUrl: withoutUrl.length,
      matches: {
        exact: matches.exact.length,
        good: matches.good.length,
        possible: matches.possible.length,
        noMatch: matches.noMatch.length,
        alreadyHasUrl: matches.alreadyHasUrl.length,
      },
    },
    matches,
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // Print summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 MATCHING SUMMARY\n');
  console.log(`✅ Exact Matches (score > 70):   ${matches.exact.length}`);
  console.log(`🟢 Good Matches (score 50-70):   ${matches.good.length}`);
  console.log(`🟡 Possible (score 20-50):       ${matches.possible.length}`);
  console.log(`❌ No Match (score < 20):        ${matches.noMatch.length}`);
  console.log(`🔗 Already Has URL:               ${matches.alreadyHasUrl.length}\n`);

  if (matches.exact.length > 0) {
    console.log('🎯 TOP EXACT MATCHES:');
    matches.exact.slice(0, 5).forEach((m, i) => {
      console.log(`  ${i + 1}. ${m.recipe.titel}`);
      console.log(`     Score: ${m.score} | Caption: "${m.caption}..."`);
    });
    console.log();
  }

  console.log(`✅ Report: ${REPORT_FILE}`);
  console.log(`\n📋 Ready to import: ${matches.exact.length + matches.good.length} URLs\n`);
}

main().catch(console.error);
