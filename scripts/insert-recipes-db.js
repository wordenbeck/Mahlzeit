#!/usr/bin/env node

/**
 * MealPlanner Recipe DB Inserter
 *
 * Lädt recipes_parsed.json und speichert in Supabase `recipes` table.
 *
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... node scripts/insert-recipes-db.js
 *
 * Oder mit anon key + workspace code (über Edge Function).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
function loadEnv() {
  const envFile = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    content.split('\n').forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    });
  }
}

loadEnv();

const PARSED_FILE = path.join(__dirname, '../recipes_parsed.json');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WORKSPACE_ID = process.env.WORKSPACE_ID || 'default';
const CREATED_BY = process.env.CREATED_BY || 'harvest-bot';

// ============================================================================
// Supabase Insert
// ============================================================================

async function insertRecipes(recipes) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }

  console.log(`🔌 Connecting to Supabase...\n`);

  const url = new URL(`${SUPABASE_URL}/rest/v1/recipes`);
  url.searchParams.set('select', '*');

  const records = recipes.map((r) => ({
    workspace_id: WORKSPACE_ID,
    created_by: CREATED_BY,
    title: r.titel,
    description: r.beschreibung,
    servings: r.portionen,
    prep_time_min: r.zubereitungszeit_min,
    difficulty: r.schwierigkeit,
    category: r.kategorie,
    ingredients: r.zutaten,
    instructions: r.zubereitung,
    tags: r.tags,
    recipe_type: r.recipe_type,
    ai_confidence: r.ai_confidence,
    ai_warnings: r.ai_warnings,
    source_caption: r.source_caption,
    source_author: r.source_author,
    source_thumbnail: r.source_thumbnail,
  }));

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(records),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Insert failed ${response.status}: ${error}`);
    }

    const inserted = await response.json();
    return inserted;
  } catch (e) {
    throw new Error(`Supabase error: ${e.message}`);
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🍽️  MealPlanner Recipe DB Inserter\n');

  // Load parsed recipes
  if (!fs.existsSync(PARSED_FILE)) {
    console.error(`❌ ${PARSED_FILE} not found. Run parser first.`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(PARSED_FILE, 'utf8'));
  const recipes = data.recipes || [];

  if (recipes.length === 0) {
    console.error('❌ No recipes to insert');
    process.exit(1);
  }

  console.log(`📋 Loaded ${recipes.length} parsed recipes`);
  console.log(`📍 Workspace: ${WORKSPACE_ID}`);
  console.log(`📍 Author: ${CREATED_BY}\n`);

  if (data.failed && data.failed > 0) {
    console.warn(`⚠️  ${data.failed} recipes failed parsing (skipping)\n`);
  }

  console.log('⏳ Inserting to Supabase...');

  try {
    const inserted = await insertRecipes(recipes);
    console.log(`✅ Successfully inserted ${inserted.length} recipes\n`);

    // Save insertion log
    fs.writeFileSync(
      path.join(__dirname, '../recipes_inserted.json'),
      JSON.stringify(
        {
          insertTime: new Date().toISOString(),
          count: inserted.length,
          workspace_id: WORKSPACE_ID,
          created_by: CREATED_BY,
          recipes: inserted.map((r) => ({
            id: r.id,
            title: r.title,
            created_at: r.created_at,
          })),
        },
        null,
        2
      )
    );

    console.log(`💾 Insertion log saved to recipes_inserted.json`);
  } catch (e) {
    console.error(`❌ Insert failed: ${e.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
