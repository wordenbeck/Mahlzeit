#!/usr/bin/env node

/**
 * QUALITY GATE TEST: Groq Validation
 *
 * Test die 13 TOP-Quality Baseline-Rezepte:
 * 1. Fetch Original-Captions (aus DB oder Instagram oEmbed)
 * 2. Parse mit Groq (oder simulieren)
 * 3. Vergleiche Quality mit aktueller DB-Version
 * 4. PASS/FAIL: Kann Groq die TOP-Quality reproduzieren?
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envLocalPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
let supabaseUrl, anonKey;
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key === 'VITE_SUPABASE_URL') supabaseUrl = value.trim();
  if (key === 'VITE_SUPABASE_ANON_KEY') anonKey = value.trim();
});

const OUTPUT_DIR = path.join(__dirname, '../scripts/output');

// ============================================================================
// Fetch recipes from DB
// ============================================================================

async function fetchRecipesFromDB() {
  return new Promise((resolve, reject) => {
    const urlStr = `${supabaseUrl}/rest/v1/recipes?select=*&limit=500`;
    https.get(
      urlStr,
      {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
        },
      },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }
    ).on('error', reject);
  });
}

// ============================================================================
// Quality Scoring (same as analysis)
// ============================================================================

function qualityScore(recipe) {
  let score = 0;
  if (recipe.titel) score += 15;
  if (recipe.beschreibung) score += 10;
  if (recipe.portionen) score += 5;
  if (recipe.zubereitungszeit_min) score += 5;
  if (recipe.schwierigkeit) score += 5;
  if (recipe.kategorie && Array.isArray(recipe.kategorie) && recipe.kategorie.length > 0) score += 10;
  if (recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0) score += 5;

  if (recipe.zutaten) {
    try {
      const z = typeof recipe.zutaten === 'string' ? JSON.parse(recipe.zutaten) : recipe.zutaten;
      if (Array.isArray(z) && z.length > 0) {
        const valid = z.filter(x => x.name && x.einheit && x.menge !== undefined).length;
        score += (valid / z.length) * 20;
      }
    } catch (e) {}
  }

  if (recipe.zubereitung) {
    try {
      const z = typeof recipe.zubereitung === 'string' ? JSON.parse(recipe.zubereitung) : recipe.zubereitung;
      if (Array.isArray(z) && z.length > 0) {
        score += Math.min(25, z.length * 3);
      }
    } catch (e) {}
  }

  return Math.min(100, Math.round(score));
}

// ============================================================================
// Fetch Instagram Caption via oEmbed
// ============================================================================

async function fetchInstagramCaption(url) {
  return new Promise((resolve) => {
    const normalized = url.split('?')[0].replace(/\/$/, '');
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(normalized)}`;

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

// ============================================================================
// Main Test
// ============================================================================

async function main() {
  console.log('🔬 QUALITY GATE TEST: Groq Validation\n');

  // Fetch recipes
  console.log('📥 Loading recipes from DB...');
  const recipes = await fetchRecipesFromDB();
  console.log(`   ✅ ${recipes.length} recipes loaded\n`);

  // Get TOP-Quality Instagram with URL
  const baseline = recipes.filter(r =>
    r.source === 'instagram' &&
    r.source_url &&
    qualityScore(r) >= 80
  );

  console.log(`🎯 BASELINE (TOP-Quality Instagram mit URL): ${baseline.length}\n`);

  if (baseline.length === 0) {
    console.log('❌ Keine TOP-Quality Baseline gefunden!');
    return;
  }

  // Sort by score and take top 10
  const testRecipes = baseline
    .map(r => ({ ...r, currentScore: qualityScore(r) }))
    .sort((a, b) => b.currentScore - a.currentScore)
    .slice(0, 10);

  console.log(`📋 Testing ${testRecipes.length} recipes\n`);
  console.log('Fetching original captions from Instagram...\n');

  const testResults = [];

  for (let i = 0; i < testRecipes.length; i++) {
    const recipe = testRecipes[i];

    // Try to get original caption
    let caption = recipe.source_caption_raw;

    if (!caption && recipe.source_url) {
      console.log(`  [${i + 1}/${testRecipes.length}] Fetching caption for ${recipe.titel.substring(0, 40)}...`);
      caption = await fetchInstagramCaption(recipe.source_url);
      await new Promise(r => setTimeout(r, 500));
    } else {
      console.log(`  [${i + 1}/${testRecipes.length}] Using stored caption for ${recipe.titel.substring(0, 40)}`);
    }

    if (!caption) {
      console.log(`      ⚠️  No caption found, skipping\n`);
      continue;
    }

    testResults.push({
      titel: recipe.titel,
      url: recipe.source_url,
      currentScore: recipe.currentScore,
      captionLength: caption.length,
      captionPreview: caption.substring(0, 100),
      status: 'ready_for_groq_test',
    });
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 QUALITY GATE TEST RESULTS\n');

  console.log('Rezepte bereit für Groq-Validierung:\n');
  console.log('Pos | Score | Titel');
  console.log('----|-------|------');
  testResults.forEach((r, i) => {
    console.log(`${(i + 1).toString().padEnd(3)} | ${r.currentScore.toString().padEnd(5)} | ${r.titel.substring(0, 40)}`);
  });

  console.log(`\n═══════════════════════════════════════════════════════`);
  console.log('\n💡 NÄCHSTE SCHRITTE:\n');
  console.log(`1. Diese ${testResults.length} Rezepte mit Groq parsen`);
  console.log(`2. Quality vergleichen: Original (DB) vs. Groq (neu geparst)`);
  console.log(`3. Scoring:`);
  console.log(`   - Falls Score >= 80: PASS ✅ → weitermachen mit Haiku/Sonnet`);
  console.log(`   - Falls Score < 80: FAIL ❌ → grundlegendes Problem`);
  console.log(`4. Entscheidung: Groq beibehalten oder zu Claude wechseln?\n`);

  // Save test plan
  const testPlan = {
    timestamp: new Date().toISOString(),
    baselineCount: baseline.length,
    testCount: testResults.length,
    testRecipes: testResults,
    nextStep: 'groq_validation',
    passThreshold: 80,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'quality-gate-test-plan.json'),
    JSON.stringify(testPlan, null, 2)
  );

  console.log(`📋 Test plan: ${path.join(OUTPUT_DIR, 'quality-gate-test-plan.json')}\n`);
}

main().catch(console.error);
