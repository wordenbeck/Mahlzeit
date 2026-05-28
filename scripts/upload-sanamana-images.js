#!/usr/bin/env node

/**
 * Upload SanaMana Images to Supabase Storage
 *
 * Lädt konvertierte JPG-Bilder in recipe-images Bucket
 * Zuordnung: Rezeptbilder/{01-24}.jpg → Rezepte {1-24}
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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const WORKSPACE_ID = process.env.WORKSPACE_ID || 'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d';
const IMAGES_DIR = '/tmp/sanamana_jpg';

if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL required in .env.local');
  process.exit(1);
}

// Mapping: Rezeptbilder/{01-24}.jpg → SanaMana Rezept IDs
// Basierend auf rezept_mapping.md: 1-24 sind die SanaMana Rezepte
const RECIPE_MAPPING = {
  '01': 'Zwiebelkuchen',
  '02': 'Bunte Superfoods-Bowl',
  '03': 'Kartoffelwürfel mit Pinienkernen und Avocado-Dip',
  '04': 'Pikante Reispfanne',
  '05': 'Sommerrollen mit Erdnussdip',
  '06': 'Penne mit Linsen-Bolognese',
  '07': 'Nudeln mit Grünkohl-Pesto',
  '08': 'Nudeln mit Mangold in Sahnesoße',
  '09': 'Herzhafte Maultaschen',
  '10': 'Pellkartoffeln mit Sauerkraut und Seitan-Würstchen',
  '11': 'Wraps mit Räuchertofu-Pilz-Füllung',
  '12': 'Kartoffel-Spinat-Auflauf',
  '13': 'Italienischer Nudelsalat mit Tomaten-Tofu',
  '14': 'Pflanzliches Gulasch',
  '15': 'Seitangeschnetzeltes',
  '16': 'Buchweizen-Spinat-Pfanne',
  '17': 'Falafel im Brot',
  '18': 'Blumenkohl-Kichererbsen-Curry',
  '19': 'Mediterraner Kichererbsen-Salat',
  '20': 'Azukibohnen-Reis-Salat',
  '21': 'Scharfer Gurkensalat mit Knoblauch',
  '22': 'Blumenkohl-Curry-Suppe',
  '23': 'Indische Linsen-Suppe mit Spinat',
  '24': 'Waffeln mit heißen Beeren',
};

async function uploadImages() {
  console.log('🍽️  SanaMana Image Uploader\n');

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ ${IMAGES_DIR} not found`);
    process.exit(1);
  }

  const jpgFiles = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.jpg'))
    .sort();

  if (jpgFiles.length === 0) {
    console.error('❌ Keine JPG-Bilder gefunden');
    process.exit(1);
  }

  console.log(`📷 ${jpgFiles.length} JPG-Bilder gefunden\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const filename of jpgFiles) {
    const recipeNum = filename.replace('.jpg', '');
    const recipeName = RECIPE_MAPPING[recipeNum] || `Recipe ${recipeNum}`;
    const filePath = path.join(IMAGES_DIR, filename);

    try {
      // Lese Datei als Base64
      const fileBuffer = fs.readFileSync(filePath);
      const base64 = fileBuffer.toString('base64');

      // Upload via Edge Function
      const filename = `${recipeNum}-${recipeName.replace(/\//g, '_')}.jpg`;
      const response = await fetch(`${SUPABASE_URL}/functions/v1/upload-sanamana-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64,
          filename,
          workspaceId: WORKSPACE_ID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`❌ ${recipeNum}: ${errorData.error || response.statusText}`);
        failCount++;
        results.push({
          recipeNum,
          recipeName,
          success: false,
          error: errorData.error || response.statusText,
        });
      } else {
        const { publicUrl, storagePath } = await response.json();
        console.log(`✅ ${recipeNum}: ${recipeName.substring(0, 40)}`);
        successCount++;
        results.push({
          recipeNum,
          recipeName,
          storagePath,
          publicUrl,
          success: true,
        });
      }
    } catch (e) {
      console.log(`❌ ${recipeNum}: ${e.message}`);
      failCount++;
      results.push({
        recipeNum,
        recipeName,
        success: false,
        error: e.message,
      });
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}\n`);

  // Speichere results
  fs.writeFileSync(
    path.join(__dirname, '../sanamana_images_uploaded.json'),
    JSON.stringify(
      {
        uploadTime: new Date().toISOString(),
        workspace_id: WORKSPACE_ID,
        successCount,
        failCount,
        results,
      },
      null,
      2
    )
  );

  console.log(`💾 Results saved to sanamana_images_uploaded.json`);

  if (failCount > 0) {
    process.exit(1);
  }
}

uploadImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
