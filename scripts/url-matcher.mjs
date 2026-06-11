#!/usr/bin/env node

/**
 * Instagram URL Matcher & Source URL Updater
 *
 * Workflow:
 * 1. Lädt ~80 alte Instagram-URLs
 * 2. Vergleicht gegen DB-Rezepte (name, description)
 * 3. Matchet URLs zu Rezepten ohne source_url
 * 4. Speichert Matching-Report (ready-to-import, already-has-url, no-match)
 *
 * Nächster Schritt: User reviewed → SQL-Script zur DB-Update
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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase Config nicht gefunden!');
  process.exit(1);
}

const URLS_FILE = path.join(__dirname, '../urls.txt');
const OUTPUT_DIR = path.join(__dirname, '../scripts/output');
const MATCH_REPORT = path.join(OUTPUT_DIR, 'url-match-report-' + new Date().toISOString().split('T')[0] + '.json');

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
    .split('?')[0];
}

/**
 * Fetch all recipes from Supabase (nur ID, name, description, source_url)
 */
async function fetchRecipesFromDB() {
  return new Promise((resolve, reject) => {
    const query = '/rest/v1/recipes?select=id,name,description,source_url&limit=500';
    const url = new URL(query, SUPABASE_URL);

    https.get(
      url,
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

/**
 * Simple Text-Matching zwischen URL-Caption und Recipe-Name/Description
 */
function scoreMatch(caption, recipe) {
  if (!caption || !recipe.name) return 0;

  const captionLower = caption.toLowerCase();
  const nameLower = recipe.name.toLowerCase();
  const descLower = (recipe.description || '').toLowerCase();

  let score = 0;

  // Exact match in name
  if (captionLower === nameLower) score += 100;

  // Name is substring of caption
  if (captionLower.includes(nameLower)) score += 50;
  if (nameLower.includes(captionLower)) score += 40;

  // Word overlap
  const captionWords = captionLower.split(/\s+/);
  const nameWords = nameLower.split(/\s+/);
  const matches = captionWords.filter(w => nameWords.includes(w) && w.length > 3).length;
  if (matches > 0) score += matches * 10;

  // Description match
  if (descLower.includes(captionLower)) score += 20;
  if (captionLower.includes(descLower)) score += 15;

  return score;
}

/**
 * Fetch Instagram Caption via oEmbed
 */
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
                success: true,
              });
            } else {
              resolve({ caption: null, success: false });
            }
          } catch {
            resolve({ caption: null, success: false });
          }
        });
      }
    ).on('error', () => {
      resolve({ caption: null, success: false });
    });
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🚀 URL Matcher — Instagram URLs gegen Rezepte matchen\n');

  // URLs laden
  console.log('📥 Lade URLs...');
  const allUrls = await loadUrls();
  console.log(`✅ ${allUrls.length} URLs gefunden\n`);

  // Recipes aus DB
  console.log('🗄️  Lade Rezepte aus DB...');
  const recipes = await fetchRecipesFromDB();
  console.log(`✅ ${recipes.length} Rezepte gefunden\n`);

  const recipesWithoutSourceUrl = recipes.filter(r => !r.source_url);
  console.log(`📊 ${recipesWithoutSourceUrl.length} Rezepte ohne source_url\n`);

  // Captions fetchen
  console.log('🌐 Fetch Instagram Captions...');
  const urlsWithCaptions = [];
  for (let i = 0; i < allUrls.length; i++) {
    const result = await fetchInstagramCaption(allUrls[i]);
    console.log(`  [${i + 1}/${allUrls.length}] ${result.success ? '✅' : '❌'}`);
    if (result.success) {
      urlsWithCaptions.push({
        url: normalizeUrl(allUrls[i]),
        caption: result.caption,
        author: result.author,
      });
    }
    await new Promise(r => setTimeout(r, 300)); // 300ms delay
  }

  console.log(`\n✅ ${urlsWithCaptions.length} Captions erfolgreich geladen\n`);

  // Matching
  console.log('🎯 Matching URLs gegen Rezepte...\n');

  const matches = {
    exact: [],         // caption === recipe.name
    good: [],          // score > 50
    possible: [],      // score 20-50
    noMatch: [],       // score < 20
    alreadyHasUrl: [], // recipe hat schon source_url
  };

  for (const item of urlsWithCaptions) {
    const scores = recipesWithoutSourceUrl.map(recipe => ({
      recipe,
      score: scoreMatch(item.caption, recipe),
    }));

    scores.sort((a, b) => b.score - a.score);
    const bestMatch = scores[0];

    if (bestMatch && bestMatch.score > 70) {
      matches.exact.push({
        url: item.url,
        caption: item.caption,
        recipe: bestMatch.recipe,
        score: bestMatch.score,
      });
    } else if (bestMatch && bestMatch.score > 50) {
      matches.good.push({
        url: item.url,
        caption: item.caption,
        recipe: bestMatch.recipe,
        score: bestMatch.score,
      });
    } else if (bestMatch && bestMatch.score > 20) {
      matches.possible.push({
        url: item.url,
        caption: item.caption,
        recipe: bestMatch.recipe,
        score: bestMatch.score,
      });
    } else {
      matches.noMatch.push({
        url: item.url,
        caption: item.caption,
        bestScore: bestMatch?.score || 0,
      });
    }
  }

  // Check already-has-url
  for (const recipe of recipes) {
    if (recipe.source_url) {
      const foundUrl = allUrls.find(url => normalizeUrl(url) === recipe.source_url);
      if (foundUrl) {
        matches.alreadyHasUrl.push({
          recipe,
          url: foundUrl,
        });
      }
    }
  }

  // Report speichern
  const report = {
    timestamp: new Date().toISOString(),
    totalUrls: allUrls.length,
    urlsWithCaption: urlsWithCaptions.length,
    totalRecipes: recipes.length,
    recipesWithoutUrl: recipesWithoutSourceUrl.length,
    matches,
    summary: {
      exact: matches.exact.length,
      good: matches.good.length,
      possible: matches.possible.length,
      noMatch: matches.noMatch.length,
      alreadyHasUrl: matches.alreadyHasUrl.length,
    },
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(MATCH_REPORT, JSON.stringify(report, null, 2));

  // Summary ausgeben
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 MATCHING SUMMARY\n');
  console.log(`Exact Matches (score > 70):    ${matches.exact.length}`);
  console.log(`Good Matches (score > 50):     ${matches.good.length}`);
  console.log(`Possible Matches (score 20+):  ${matches.possible.length}`);
  console.log(`No Match (score < 20):         ${matches.noMatch.length}`);
  console.log(`Already Has URL:               ${matches.alreadyHasUrl.length}\n`);

  if (matches.exact.length > 0) {
    console.log('✅ TOP EXACT MATCHES:');
    matches.exact.slice(0, 5).forEach(m => {
      console.log(`  • ${m.recipe.name} (${m.recipe.id.substring(0, 8)}...)`);
    });
    console.log();
  }

  console.log(`\n✅ Report gespeichert: ${MATCH_REPORT}`);
}

main().catch(console.error);
