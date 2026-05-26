#!/usr/bin/env node

/**
 * Instagram Recipe Harvesting Agent
 *
 * Öffnet 80+ Insta-URLs, extrahiert Captions, speichert strukturiert.
 *
 * Usage:
 *   node scripts/harvest-instagram-agent.js
 *
 * Input: urls.txt (eine URL pro Zeile)
 * Output: harvested_captions.json
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATE_FILE = path.join(__dirname, '../.harvest-state.json');
const OUTPUT_FILE = path.join(__dirname, '../harvested_captions.json');
const URLS_FILE = path.join(__dirname, '../urls.txt');

const DELAY_MS = 3000; // 3s zwischen Requests (Instagram-freundlich)
const GOLDMINE_PATTERNS = [
  /rezept\s+(\d+)\s*\/\s*(\d+)/i,
  /part\s+(\d+)\s*\/\s*(\d+)/i,
  /episode\s+(\d+)/i,
  /series/i,
];

// ============================================================================
// State Management
// ============================================================================

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {
      processed: [],
      captions: [],
      noCaption: [],
      goldmines: [],
      errors: [],
    };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function saveOutput(state) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
    harvestTime: new Date().toISOString(),
    totalProcessed: state.processed.length,
    withCaption: state.captions.length,
    noCaption: state.noCaption.length,
    goldmines: state.goldmines.length,
    errors: state.errors.length,
    captions: state.captions,
    noCaption: state.noCaption,
    goldmines: state.goldmines,
    errors: state.errors,
  }, null, 2));
}

// ============================================================================
// Instagram Caption Extraction (via oEmbed API)
// ============================================================================

function extractInstagramCaption(url) {
  return new Promise((resolve) => {
    const normalized = normalizeUrl(url);
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(normalized)}`;

    https.get(oembedUrl, { headers: { 'User-Agent': 'facebookexternalhit/1.1' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          // oEmbed gibt "title" field mit Caption zurück
          if (json.title && json.title.length > 20) {
            resolve({
              caption: json.title,
              author: json.author_name ? `@${json.author_name}` : null,
              thumbnail: json.thumbnail_url || null,
              success: true,
            });
          } else {
            resolve({ caption: null, success: false, error: 'Caption zu kurz oder leer' });
          }
        } catch (e) {
          resolve({ caption: null, success: false, error: e.message });
        }
      });
    }).on('error', (e) => {
      resolve({ caption: null, success: false, error: e.message });
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

function isGoldmine(caption) {
  if (!caption) return false;
  return GOLDMINE_PATTERNS.some(pattern => pattern.test(caption));
}

// ============================================================================
// Main Loop
// ============================================================================

async function main() {
  console.log('🍽️  Instagram Recipe Harvesting Agent\n');

  // Load URLs
  let urls = [];
  try {
    const content = fs.readFileSync(URLS_FILE, 'utf8');
    urls = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('http'));
    console.log(`✅ Loaded ${urls.length} URLs from urls.txt\n`);
  } catch (e) {
    console.error('❌ Could not read urls.txt:', e.message);
    process.exit(1);
  }

  // Load existing state (for resume)
  let state = loadState();
  console.log(`📋 State loaded: ${state.captions.length} captions, ${state.noCaption.length} no-caption\n`);

  // Process each URL
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const reel_id = extractReelId(url);

    // Skip if already processed
    if (state.processed.includes(reel_id)) {
      console.log(`⏭️  [${i + 1}/${urls.length}] ${reel_id} (already processed)`);
      continue;
    }

    // Extract caption
    console.log(`🔍 [${i + 1}/${urls.length}] ${reel_id}...`);
    const result = await extractInstagramCaption(url);

    if (result.success && result.caption) {
      // Has caption
      const isGold = isGoldmine(result.caption);
      const item = {
        reel_id,
        url,
        caption: result.caption,
        author: result.author,
        thumbnail: result.thumbnail,
        isGoldmine: isGold,
        confidence: 0.9,
      };

      state.captions.push(item);
      state.processed.push(reel_id);

      if (isGold) {
        console.log(`   ✅ Caption found (GOLDMINE 🏆)`);
        state.goldmines.push(reel_id);
      } else {
        console.log(`   ✅ Caption found`);
      }
    } else {
      // No caption
      const item = {
        reel_id,
        url,
        error: result.error,
        revisitLater: true,
      };

      state.noCaption.push(item);
      state.processed.push(reel_id);
      console.log(`   ❌ No caption (${result.error})`);
    }

    // Save state + output every 5 items
    if ((i + 1) % 5 === 0) {
      saveState(state);
      saveOutput(state);
      console.log(`   💾 State saved\n`);
    }

    // Delay vor nächstem Request
    if (i < urls.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  // Final save
  saveState(state);
  saveOutput(state);

  // Summary
  console.log('\n📊 HARVEST COMPLETE\n');
  console.log(`Total URLs: ${urls.length}`);
  console.log(`✅ With Caption: ${state.captions.length}`);
  console.log(`   🏆 Goldmines: ${state.goldmines.length}`);
  console.log(`❌ No Caption: ${state.noCaption.length} (revisit later)`);
  console.log(`⚠️  Errors: ${state.errors.length}`);
  console.log(`\n📁 Output: ${OUTPUT_FILE}`);
}

function extractReelId(url) {
  const match = url.match(/\/reel\/([^/?]+)/);
  return match ? match[1] : 'unknown';
}

// Run
await main().catch(console.error);
