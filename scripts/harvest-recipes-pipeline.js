#!/usr/bin/env node

/**
 * MealPlanner Recipe Harvesting Pipeline v2
 *
 * Vollautomatisches Harvesting von Instagram-Rezepten bis 300+ gute Captions.
 *
 * Phase 1: Instagram-URLs → Captions (oEmbed, kostenlos)
 * Phase 2: Quality-Score (Zutaten + Zubereitung Check)
 * Phase 3: Account-Mining (pro Author weitere Videos wenn gut)
 * Phase 4: Resume & Loop bis 300+
 *
 * Usage:
 *   node scripts/harvest-recipes-pipeline.js
 *
 * Output:
 *   - recipes_harvested.json (alle Captions mit Score)
 *   - recipes_ready_to_parse.json (nur >0.7 Score)
 *   - .harvest-state.json (Resume-State)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATE_FILE = path.join(__dirname, '../.harvest-state.json');
const OUTPUT_FILE = path.join(__dirname, '../recipes_harvested.json');
const READY_FILE = path.join(__dirname, '../recipes_ready_to_parse.json');
const URLS_FILE = path.join(__dirname, '../urls.txt');

const TARGET_RECIPES = 300;
const DELAY_MS = 3000; // Instagram-freundlich
const ACCOUNT_DEPTH = 10; // Weitere Videos pro good Author
const QUALITY_THRESHOLD = 0.7;

// ============================================================================
// Quality Scoring
// ============================================================================

function scoreCaption(caption) {
  if (!caption || caption.length < 100) return { score: 0, reason: 'Zu kurz' };

  const text = caption.toLowerCase();

  // Check 1: Zutaten-Liste erkannt?
  const hasIngredients = /(\d+\s*(g|ml|el|tl|stück|portion|prise|hand|becher)|ohne\s+(zucker|mehl|ei))/.test(text);
  if (!hasIngredients) return { score: 0.2, reason: 'Keine Zutaten erkannt' };

  // Check 2: Zubereitung/Schritte erkannt?
  const hasSteps = /(\d+\.|schritt|zubereitung|anleitung|backen|kochen|braten|mischen|vermischen|dann|anschließend)/.test(text);
  if (!hasSteps) return { score: 0.3, reason: 'Keine Zubereitung erkannt' };

  // Check 3: Nicht nur Werbung?
  const isSpam = /kommentier|dm|schreib|link|kochbuch|kostenlos|eBook|gib bescheid/.test(text);
  if (isSpam && text.length < 300) return { score: 0.4, reason: 'Looks like spam' };

  // Check 4: Nährwert-Info (bonus)
  const hasNutrition = /kcal|protein|kohlenhydrat|fett|gramm\s+(eiweiß|protein)/.test(text);

  // Score berechnen
  let score = 0.5; // Base
  score += hasIngredients ? 0.25 : 0;
  score += hasSteps ? 0.25 : 0;
  score += hasNutrition ? 0.1 : 0;
  score = Math.min(score, 1.0);

  return {
    score: parseFloat(score.toFixed(2)),
    reason: 'Good recipe',
    hasIngredients,
    hasSteps,
    hasNutrition,
  };
}

// ============================================================================
// State Management
// ============================================================================

function loadState() {
  try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    // Validate structure
    if (data.phase && data.goodRecipes && Array.isArray(data.goodRecipes)) {
      return data;
    }
  } catch {}

  return {
    phase: 'harvest',
    totalProcessed: 0,
    goodRecipes: [],
    allCaptures: [],
    accountsToMine: [],
    accountsMined: [],
    errors: [],
  };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function saveOutput(state) {
  // All recipes
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        harvestTime: new Date().toISOString(),
        total: state.allCaptures.length,
        good: state.goodRecipes.length,
        targetReached: state.goodRecipes.length >= TARGET_RECIPES,
        recipes: state.allCaptures,
      },
      null,
      2
    )
  );

  // Only ready-to-parse (>0.7)
  fs.writeFileSync(
    READY_FILE,
    JSON.stringify(
      {
        harvestTime: new Date().toISOString(),
        count: state.goodRecipes.length,
        recipes: state.goodRecipes,
      },
      null,
      2
    )
  );
}

// ============================================================================
// Instagram Caption Extraction
// ============================================================================

function extractInstagramCaption(url) {
  return new Promise((resolve) => {
    const normalized = normalizeUrl(url);
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(normalized)}`;

    https
      .get(
        oembedUrl,
        { headers: { 'User-Agent': 'facebookexternalhit/1.1' } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              if (json.title && json.title.length > 50) {
                resolve({
                  caption: json.title,
                  author: json.author_name ? `@${json.author_name}` : null,
                  thumbnail: json.thumbnail_url || null,
                  success: true,
                });
              } else {
                resolve({ caption: null, success: false });
              }
            } catch (e) {
              resolve({ caption: null, success: false });
            }
          });
        }
      )
      .on('error', () => {
        resolve({ caption: null, success: false });
      });
  });
}

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname.replace(/\/$/, '')}`;
  } catch {
    return url.trim();
  }
}

function extractReelId(url) {
  const match = url.match(/\/reel\/([^/?]+)/);
  return match ? match[1] : 'unknown';
}

function extractAuthor(url) {
  const match = url.match(/\/([^/]+?)\/reel/);
  return match ? match[1] : null;
}

// ============================================================================
// Account Harvesting (weitere Videos pro Author)
// ============================================================================

async function harvestAccountVideos(author, limit = ACCOUNT_DEPTH) {
  // Placeholder: Instagram macht es schwer, alle Videos eines Accounts zu scrapen
  // Für MVP: Wir würden hier manuell curated URLs reinpacken oder auf Instagram-API gehen
  // Für jetzt: Return empty, könnte später erweitert werden
  return [];
}

// ============================================================================
// Main Pipeline
// ============================================================================

async function main() {
  console.log('🍽️  MealPlanner Recipe Harvesting Pipeline v2\n');

  // Load URLs
  let urls = [];
  try {
    const content = fs.readFileSync(URLS_FILE, 'utf8');
    urls = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('http'));
    console.log(`✅ Loaded ${urls.length} URLs\n`);
  } catch (e) {
    console.error('❌ Could not read urls.txt:', e.message);
    process.exit(1);
  }

  // Load state (resume)
  let state = loadState();
  console.log(`📋 State loaded:`);
  console.log(`   Good recipes: ${state.goodRecipes.length}/${TARGET_RECIPES}`);
  console.log(`   Total processed: ${state.totalProcessed}`);
  console.log(`   Accounts to mine: ${state.accountsToMine.length}\n`);

  // ===== PHASE 1: Initial Harvest + Quality Score =====
  if (state.phase === 'harvest') {
    console.log('📍 Phase 1: Harvest URLs + Quality Score\n');

    const processedUrls = state.allCaptures.map((r) => r.reel_id);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const reelId = extractReelId(url);
      const author = extractAuthor(url);

      if (processedUrls.includes(reelId)) {
        console.log(`⏭️  [${i + 1}/${urls.length}] ${reelId} (cached)`);
        continue;
      }

      console.log(`🔍 [${i + 1}/${urls.length}] ${reelId}...`);
      const result = await extractInstagramCaption(url);

      if (result.success && result.caption) {
        const quality = scoreCaption(result.caption);
        const item = {
          reel_id: reelId,
          url,
          author,
          caption: result.caption,
          thumbnail: result.thumbnail,
          quality: quality.score,
          qualityReason: quality.reason,
        };

        state.allCaptures.push(item);

        if (quality.score >= QUALITY_THRESHOLD) {
          state.goodRecipes.push(item);
          console.log(`   ✅ GOOD (${quality.score})`);

          // Merke Author falls genug guter Captions
          if (author && !state.accountsMined.includes(author)) {
            state.accountsToMine.push(author);
          }
        } else {
          console.log(`   ⚠️  Low quality (${quality.score})`);
        }
      } else {
        console.log(`   ❌ No caption`);
      }

      state.totalProcessed++;

      // Save state
      if ((i + 1) % 10 === 0) {
        saveState(state);
        saveOutput(state);
        console.log(`   💾 State saved (Good: ${state.goodRecipes.length}/${TARGET_RECIPES})\n`);
      }

      if (i < urls.length - 1) {
        await new Promise((r) => setTimeout(r, DELAY_MS));
      }
    }

    state.phase = 'account-mining';
    console.log(`\n✅ Phase 1 Complete: ${state.goodRecipes.length} good recipes\n`);
  }

  // ===== PHASE 2: Account Mining =====
  if (state.phase === 'account-mining' && state.goodRecipes.length < TARGET_RECIPES) {
    console.log('📍 Phase 2: Account Mining (further videos per good Author)\n');
    console.log(`Target: ${TARGET_RECIPES}, Current: ${state.goodRecipes.length}`);
    console.log(`Authors to mine: ${state.accountsToMine.filter((a) => !state.accountsMined.includes(a)).length}\n`);

    // Placeholder: Account harvesting würde hier stattfinden
    // Für MVP: Skip, da Instagram API schwierig
    // Könnte mit Playwright/Puppeteer erweitert werden

    state.phase = 'ready-to-parse';
  }

  // Final save
  saveState(state);
  saveOutput(state);

  // Summary
  console.log('\n📊 HARVEST PIPELINE COMPLETE\n');
  console.log(`Total Recipes Harvested: ${state.allCaptures.length}`);
  console.log(`Good Recipes (>${QUALITY_THRESHOLD}): ${state.goodRecipes.length}`);
  console.log(`Target Reached: ${state.goodRecipes.length >= TARGET_RECIPES ? '✅ YES' : '❌ NO'}`);
  console.log(`\n📁 Output:`);
  console.log(`   All: ${OUTPUT_FILE}`);
  console.log(`   Ready to parse: ${READY_FILE}`);

  if (state.goodRecipes.length >= TARGET_RECIPES) {
    console.log(`\n✨ TARGET REACHED! Ready to parse & save to DB.`);
  } else {
    console.log(`\n⚠️  Need ${TARGET_RECIPES - state.goodRecipes.length} more recipes.`);
    console.log(`   Next: Account mining or manual URL addition.`);
  }
}

// Run
await main().catch(console.error);
