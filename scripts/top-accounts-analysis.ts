/**
 * BLOCK 3 (Schritt 1): Top-Account-Analyse — datengetrieben
 *
 * Wertet aus, welche Instagram-Accounts uns bereits die besten Rezepte
 * geliefert haben. Basis für iteratives Scraping: bei den nachweislich
 * guten Accounts pro Account 2-3 weitere Videos ziehen.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const cfg: Record<string, string> = {};
env.split('\n').forEach((l) => { const [k, ...v] = l.split('='); if (k && v.length) cfg[k.trim()] = v.join('=').trim(); });
const SUPABASE_URL = cfg.VITE_SUPABASE_URL;
const ANON = cfg.VITE_SUPABASE_ANON_KEY;
const OUTPUT_DIR = path.join(__dirname, 'output');

function parseMaybe(v: any) { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v); } catch { return null; } } return v; }

function qualityScore(r: any): number {
  let s = 0;
  if (r.titel) s += 15;
  if (r.beschreibung) s += 10;
  if (r.portionen) s += 5;
  if (r.zubereitungszeit_min) s += 5;
  if (r.schwierigkeit) s += 5;
  if (Array.isArray(r.kategorie) && r.kategorie.length) s += 10;
  if (Array.isArray(r.tags) && r.tags.length) s += 5;
  const zutaten = parseMaybe(r.zutaten);
  if (Array.isArray(zutaten) && zutaten.length) {
    const valid = zutaten.filter((z: any) => z?.name && z?.einheit).length;
    s += (valid / zutaten.length) * 20;
  }
  const zub = parseMaybe(r.zubereitung);
  if (Array.isArray(zub) && zub.length) s += Math.min(25, zub.length * 3);
  return Math.min(100, Math.round(s));
}

// extrahiert @handle aus source_author (Formate: "@x", "x", "Name (@x)")
function handle(a: string | null): string | null {
  if (!a) return null;
  const m = a.match(/@([a-z0-9._]+)/i);
  if (m) return '@' + m[1].toLowerCase();
  const clean = a.trim().toLowerCase().replace(/\s+/g, '');
  return clean ? '@' + clean : null;
}

async function main() {
  console.log('📊 BLOCK 3 — Top-Account-Analyse (datengetrieben)\n');

  const q = `${SUPABASE_URL}/rest/v1/recipes?select=titel,source,source_author,source_url,beschreibung,portionen,zubereitungszeit_min,schwierigkeit,kategorie,tags,zutaten,zubereitung&source=eq.instagram&limit=500`;
  const recipes = await (await fetch(q, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  console.log(`Instagram-Rezepte gesamt: ${recipes.length}\n`);

  // gruppieren nach Account
  const byAccount: Record<string, { scores: number[]; withUrl: number; titles: string[] }> = {};
  let noAuthor = 0;
  for (const r of recipes) {
    const h = handle(r.source_author);
    if (!h) { noAuthor++; continue; }
    if (!byAccount[h]) byAccount[h] = { scores: [], withUrl: 0, titles: [] };
    byAccount[h].scores.push(qualityScore(r));
    if (r.source_url) byAccount[h].withUrl++;
    byAccount[h].titles.push(r.titel);
  }

  const ranked = Object.entries(byAccount)
    .map(([acc, d]) => ({
      account: acc,
      count: d.scores.length,
      avgQuality: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
      topQuality: d.scores.filter((s) => s >= 80).length,
      withUrl: d.withUrl,
      sampleTitles: d.titles.slice(0, 2),
    }))
    .sort((a, b) => b.avgQuality * b.count - a.avgQuality * a.count); // Qualität × Menge

  console.log(`Accounts gesamt: ${ranked.length} | ohne Author-Angabe: ${noAuthor}\n`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🏆 TOP-ACCOUNTS (sortiert nach Qualität × Anzahl)\n');
  console.log('Account                       | Rez | ØQual | TOP | mitURL');
  console.log('──────────────────────────────┼─────┼───────┼─────┼───────');
  ranked.slice(0, 15).forEach((a) => {
    console.log(
      `${a.account.substring(0, 29).padEnd(29)} | ${String(a.count).padEnd(3)} | ${(a.avgQuality + '%').padEnd(5)} | ${String(a.topQuality).padEnd(3)} | ${a.withUrl}`,
    );
  });

  // Scrape-Kandidaten: mehrere Rezepte + hohe Quality
  const candidates = ranked.filter((a) => a.count >= 2 && a.avgQuality >= 80);
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎯 SCRAPE-KANDIDATEN (≥2 Rezepte, Ø≥80%)\n');
  candidates.forEach((a) => {
    console.log(`  ${a.account}  — ${a.count} Rezepte, Ø${a.avgQuality}%`);
    console.log(`     z.B. "${a.sampleTitles[0]?.substring(0, 45)}"`);
  });
  if (!candidates.length) console.log('  (keine — Author-Daten evtl. dünn besetzt)');

  fs.writeFileSync(path.join(OUTPUT_DIR, 'top-accounts.json'), JSON.stringify({ ranked, candidates, noAuthor }, null, 2));
  console.log(`\n📋 Report: scripts/output/top-accounts.json`);
  console.log(`\n→ Nächster Schritt: bei ${candidates.length || 'den Top-'}Accounts je 2-3 neue Videos ziehen + Quality-Gate.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
