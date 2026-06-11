#!/usr/bin/env node

/**
 * SMART DB Analysis + Quality Gate Testing
 *
 * Phase 1: DB-Analyse
 * - Rezepte nach Source
 * - Top-Quality Instagram identifizieren (mit URL)
 * - Original vs. Aktuell Vergleich
 *
 * Phase 2: Quality Gate
 * - Groq auf Baseline testen
 * - PASS/FAIL Entscheidung
 * - Nur bei PASS → Haiku/Sonnet testen
 *
 * Phase 3: URL-Matching (vorbereiten)
 * - 105 URLs gegen fehlende Instagram-Rezepte
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
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
// DB Fetch
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
            if (res.statusCode === 200) {
              resolve(JSON.parse(data));
            } else {
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
// Quality Metrics (ECHTE, nicht Bullshit!)
// ============================================================================

function calculateQualityScore(recipe) {
  let score = 0;
  let maxScore = 100;

  // Struktur-Felder
  if (recipe.titel) score += 15;
  if (recipe.beschreibung) score += 10;
  if (recipe.portionen) score += 5;
  if (recipe.zubereitungszeit_min) score += 5;
  if (recipe.schwierigkeit) score += 5;

  // Kategorisierung
  if (recipe.kategorie && Array.isArray(recipe.kategorie) && recipe.kategorie.length > 0) score += 10;
  if (recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0) score += 5;

  // Zutaten (WICHTIG!)
  let ingredientScore = 0;
  if (recipe.zutaten) {
    try {
      const zutaten = typeof recipe.zutaten === 'string' ? JSON.parse(recipe.zutaten) : recipe.zutaten;
      if (Array.isArray(zutaten) && zutaten.length > 0) {
        const validZutaten = zutaten.filter(z => z.name && z.einheit && z.menge !== undefined).length;
        const completeness = Math.round((validZutaten / zutaten.length) * 100);
        ingredientScore = (completeness / 100) * 20; // max 20 points
        score += ingredientScore;
      }
    } catch (e) {
      // invalid JSON
    }
  }

  // Zubereitung (WICHTIG!)
  let zubereitungScore = 0;
  if (recipe.zubereitung) {
    try {
      const zubereitung = typeof recipe.zubereitung === 'string' ? JSON.parse(recipe.zubereitung) : recipe.zubereitung;
      if (Array.isArray(zubereitung) && zubereitung.length > 0) {
        zubereitungScore = Math.min(25, zubereitung.length * 3); // max 25 points
        score += zubereitungScore;
      }
    } catch (e) {
      // invalid JSON
    }
  }

  return Math.min(100, Math.round(score));
}

function getQualityLevel(score) {
  if (score >= 80) return 'TOP';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'OK';
  return 'POOR';
}

// ============================================================================
// Main Analysis
// ============================================================================

async function main() {
  console.log('🔬 SMART DB ANALYSIS + QUALITY GATE\n');

  // Fetch DB
  console.log('📥 Loading recipes from DB...');
  const recipes = await fetchRecipesFromDB();
  console.log(`   ✅ ${recipes.length} recipes loaded\n`);

  // =========================================================================
  // PHASE 1: DB-ANALYSE
  // =========================================================================

  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 PHASE 1: DB-ANALYSE\n');

  // Group by source
  const bySource = {};
  recipes.forEach(r => {
    const source = r.source || 'unknown';
    if (!bySource[source]) bySource[source] = [];
    bySource[source].push(r);
  });

  console.log('Rezepte nach Source:\n');
  for (const [source, recs] of Object.entries(bySource)) {
    const withUrl = recs.filter(r => r.source_url).length;
    console.log(`  ${source.padEnd(15)} | ${recs.length.toString().padEnd(3)} Rezepte | ${withUrl} mit URL`);
  }

  // Instagram mit URL = potenzielle Top-Quality Baseline
  const instagramRecipes = bySource['instagram'] || [];
  const instagramWithUrl = instagramRecipes.filter(r => r.source_url);

  console.log(`\n🎯 Instagram mit source_url: ${instagramWithUrl.length}\n`);

  // Quality scores für alle
  console.log('Berechne Quality-Scores...');
  const withQuality = recipes.map(r => ({
    ...r,
    qualityScore: calculateQualityScore(r),
    qualityLevel: getQualityLevel(calculateQualityScore(r)),
  }));

  // Quality distribution
  const quality = {
    TOP: withQuality.filter(r => r.qualityLevel === 'TOP').length,
    GOOD: withQuality.filter(r => r.qualityLevel === 'GOOD').length,
    OK: withQuality.filter(r => r.qualityLevel === 'OK').length,
    POOR: withQuality.filter(r => r.qualityLevel === 'POOR').length,
  };

  console.log(`\nQuality Distribution:\n`);
  console.log(`  🌟 TOP (80+):   ${quality.TOP}`);
  console.log(`  ✅ GOOD (60-79): ${quality.GOOD}`);
  console.log(`  🟡 OK (40-59):   ${quality.OK}`);
  console.log(`  ❌ POOR (<40):   ${quality.POOR}\n`);

  // TOP-Quality Instagram mit URL = BASELINE!
  const baseline = instagramWithUrl.filter(r => r.qualityLevel === 'TOP');
  console.log(`🎯 BASELINE (TOP-Quality Instagram mit URL): ${baseline.length} Rezepte\n`);

  if (baseline.length === 0) {
    console.log('⚠️  Keine TOP-Quality Instagram-Rezepte mit URL gefunden!');
    console.log('   Das ist ein Problem - können nicht validieren!\n');
  } else {
    console.log('Top 5 Baseline-Rezepte:');
    baseline.slice(0, 5).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.titel.substring(0, 40)} (Score: ${r.qualityScore})`);
    });
    console.log();
  }

  // =========================================================================
  // PHASE 2: QUALITY GATE LOGIC
  // =========================================================================

  console.log('═══════════════════════════════════════════════════════');
  console.log('⚙️  PHASE 2: QUALITY GATE SETUP\n');

  if (baseline.length > 0) {
    console.log(`QUALITY GATE TEST PLAN:\n`);
    console.log(`1. Test ${Math.min(10, baseline.length)} Baseline-Rezepte mit Groq`);
    console.log(`   → Können wir die TOP-Quality reproduzieren?`);
    console.log(`   → PASS: Groq ist OK, teste Haiku/Sonnet`);
    console.log(`   → FAIL: Grundlegendes Problem, STOP!\n`);

    console.log(`2. Falls Groq PASS: Test Haiku/Sonnet`);
    console.log(`   → Besser als Groq?`);
    console.log(`   → Lohnt sich der Wechsel?\n`);

    console.log(`3. Entscheidung: Welcher Parser für Zukunft?\n`);
  }

  // =========================================================================
  // PHASE 3: URL-MATCHING VORBEREITUNG
  // =========================================================================

  console.log('═══════════════════════════════════════════════════════');
  console.log('🔗 PHASE 3: URL-MATCHING VORBEREITUNG\n');

  // Instagram-Rezepte OHNE URL
  const instagramWithoutUrl = instagramRecipes.filter(r => !r.source_url);
  console.log(`Instagram-Rezepte OHNE source_url: ${instagramWithoutUrl.length}\n`);

  if (instagramWithoutUrl.length > 0) {
    console.log('Diese müssen mit neuen 105 URLs gematched werden:');
    console.log(`  Quality TOP:   ${instagramWithoutUrl.filter(r => r.qualityLevel === 'TOP').length}`);
    console.log(`  Quality GOOD:  ${instagramWithoutUrl.filter(r => r.qualityLevel === 'GOOD').length}`);
    console.log(`  Quality OK:    ${instagramWithoutUrl.filter(r => r.qualityLevel === 'OK').length}`);
    console.log(`  Quality POOR:  ${instagramWithoutUrl.filter(r => r.qualityLevel === 'POOR').length}\n`);
  }

  // Load URL-Matching Report
  const matchReport = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR, 'url-matching-report.json'), 'utf8')
  );

  console.log(`Neue URLs verfügbar: ${matchReport.summary.totalUrls}`);
  console.log(`  - Exact Matches: ${matchReport.matches.exact.length}`);
  console.log(`  - Good Matches: ${matchReport.matches.good.length}`);
  console.log(`  - Possible: ${matchReport.matches.possible.length}`);
  console.log(`  - No Match: ${matchReport.matches.noMatch.length}\n`);

  // =========================================================================
  // SAVE ANALYSIS
  // =========================================================================

  const analysis = {
    timestamp: new Date().toISOString(),
    phase1: {
      totalRecipes: recipes.length,
      bySource,
      quality,
      baselineRecipes: {
        count: baseline.length,
        recipes: baseline.map(r => ({
          id: r.id,
          titel: r.titel,
          source_url: r.source_url,
          qualityScore: r.qualityScore,
        })),
      },
      instagramWithoutUrl: {
        count: instagramWithoutUrl.length,
        byQuality: {
          TOP: instagramWithoutUrl.filter(r => r.qualityLevel === 'TOP').length,
          GOOD: instagramWithoutUrl.filter(r => r.qualityLevel === 'GOOD').length,
          OK: instagramWithoutUrl.filter(r => r.qualityLevel === 'OK').length,
          POOR: instagramWithoutUrl.filter(r => r.qualityLevel === 'POOR').length,
        },
      },
    },
    phase2: {
      qualityGatePlan: baseline.length > 0 ? 'Ready' : 'No baseline found',
      testCount: Math.min(10, baseline.length),
    },
    phase3: {
      urlsAvailable: matchReport.summary.totalUrls,
      exactMatches: matchReport.matches.exact.length,
      instagramNeedingUrls: instagramWithoutUrl.length,
    },
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'smart-analysis.json'),
    JSON.stringify(analysis, null, 2)
  );

  console.log('═══════════════════════════════════════════════════════');
  console.log(`\n✅ Analysis complete!\n`);
  console.log(`Report: ${path.join(OUTPUT_DIR, 'smart-analysis.json')}\n`);

  // Summary
  console.log('📋 SUMMARY:\n');
  if (baseline.length > 0) {
    console.log(`✅ QUALITY GATE: Ready`);
    console.log(`   ${baseline.length} TOP-Quality Instagram-Rezepte → Test with Groq\n`);
  } else {
    console.log(`⚠️  QUALITY GATE: Keine Top-Quality Baseline gefunden!\n`);
  }

  console.log(`📦 URL-Matching:`);
  console.log(`   ${instagramWithoutUrl.length} Instagram-Rezepte brauchen URLs`);
  console.log(`   ${matchReport.summary.totalUrls} neue URLs verfügbar\n`);

  console.log(`🎯 NEXT STEPS:`);
  console.log(`   1. Falls Baseline OK: Groq Quality Gate Test`);
  console.log(`   2. Falls Groq PASS: Haiku/Sonnet Vergleich`);
  console.log(`   3. URL-Matching für fehlende Instagram-Rezepte\n`);
}

main().catch(console.error);
