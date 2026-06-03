/**
 * Upload SanaMana JPGs (aus /tmp/sanamana-jpg) zu Supabase Storage
 * und generiere bild_url-UPDATE-SQL.
 * Voraussetzung: temp_anon_upload Policy aktiv + JPGs in /tmp/sanamana-jpg.
 */
import * as fs from 'fs';

const env = fs.readFileSync('./.env.local', 'utf-8');
const URL = env.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const ANON = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();
const WS = 'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d';

const mapping = fs.readFileSync('../MealPlanner-Spec/Sanamana Rezepte/rezept_mapping.md', 'utf-8');
const map = {};
mapping.split('\n').forEach(l => {
  const m = l.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|$/);
  if (m && m[1] !== 'Nr.') map[m[1].padStart(2, '0')] = m[2].trim();
});

const esc = s => s.replace(/'/g, "''");
let updates = '';
let uploaded = 0, failed = 0;

for (let i = 1; i <= 24; i++) {
  const nn = String(i).padStart(2, '0');
  const titel = map[nn];
  if (!titel) { console.error(`⚠️ Kein Titel für ${nn}`); continue; }
  const buf = fs.readFileSync(`/tmp/sanamana-jpg/${nn}.jpg`);
  const path = `${WS}/sanamana/${nn}.jpg`;
  const res = await fetch(`${URL}/storage/v1/object/recipe-images/${path}`, {
    method: 'POST',
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'image/jpeg', 'x-upsert': 'true' },
    body: buf,
  });
  if (res.ok) {
    uploaded++;
    const publicUrl = `${URL}/storage/v1/object/public/recipe-images/${path}`;
    updates += `UPDATE recipes SET bild_url = '${publicUrl}', updated_at = NOW() WHERE source = 'sanamana' AND titel = '${esc(titel)}';\n`;
  } else {
    failed++;
    console.error(`❌ ${nn} (${titel}): ${res.status} ${await res.text()}`);
  }
}

const sql = `-- SanaMana Bild-URLs verknüpfen + temp Upload-Policy entfernen\nBEGIN;\n\n${updates}\n-- Sicherheit: temporäre Upload-Policy wieder entfernen\ndrop policy if exists "temp_anon_upload" on storage.objects;\n\nCOMMIT;\n`;
fs.writeFileSync('./sanamana_bilder.sql', sql, 'utf-8');
console.log(`\n✅ Hochgeladen: ${uploaded}/24, Fehler: ${failed}`);
console.log(`📝 SQL: ./sanamana_bilder.sql (${(updates.match(/UPDATE/g) || []).length} UPDATEs + policy drop)`);
