/**
 * Kombiniertes Account-Ranking: echte Authoren (aus Block-2-Matches) +
 * Quality-Score aus DB. Liefert die Scrape-Prioritätenliste.
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
  if (r.titel) s += 15; if (r.beschreibung) s += 10; if (r.portionen) s += 5;
  if (r.zubereitungszeit_min) s += 5; if (r.schwierigkeit) s += 5;
  if (Array.isArray(r.kategorie) && r.kategorie.length) s += 10;
  if (Array.isArray(r.tags) && r.tags.length) s += 5;
  const z = parseMaybe(r.zutaten);
  if (Array.isArray(z) && z.length) s += (z.filter((x: any) => x?.name && x?.einheit).length / z.length) * 20;
  const zb = parseMaybe(r.zubereitung);
  if (Array.isArray(zb) && zb.length) s += Math.min(25, zb.length * 3);
  return Math.min(100, Math.round(s));
}
function handle(a: string | null): string | null {
  if (!a) return null;
  const m = a.match(/@?([a-z0-9._]+)/i);
  return m ? '@' + m[1].toLowerCase() : null;
}

async function main() {
  // alle Insta-Rezepte mit id + Feldern
  const q = `${SUPABASE_URL}/rest/v1/recipes?select=id,titel,source_author,source_url,beschreibung,portionen,zubereitungszeit_min,schwierigkeit,kategorie,tags,zutaten,zubereitung&source=eq.instagram&limit=500`;
  const recipes = await (await fetch(q, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();

  // Map id → echter Author aus Block-2-Report (für die 55 ohne URL)
  const block2 = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'block2-match-report.json'), 'utf8'));
  const realAuthor: Record<string, string> = {};
  block2.matches.forEach((m: any) => { if (m.author) realAuthor[m.id] = '@' + m.author.toLowerCase(); });

  const byAcc: Record<string, { scores: number[]; titles: string[] }> = {};
  for (const r of recipes) {
    // echten Author bevorzugen (aus Block 2), sonst source_author
    const acc = realAuthor[r.id] || handle(r.source_author);
    if (!acc || acc === '@www.instagram.com') continue;
    if (!byAcc[acc]) byAcc[acc] = { scores: [], titles: [] };
    byAcc[acc].scores.push(qualityScore(r));
    byAcc[acc].titles.push(r.titel);
  }

  const ranked = Object.entries(byAcc).map(([acc, d]) => ({
    account: acc,
    count: d.scores.length,
    avgQuality: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
    topShare: Math.round((d.scores.filter((s) => s >= 80).length / d.scores.length) * 100),
    sample: d.titles[0],
  })).sort((a, b) => b.count - a.count);

  console.log('🏆 KOMBINIERTES ACCOUNT-RANKING (echte Authoren, alt+neu)\n');
  console.log('Account                    | Rez | ØQual | TOP% | Beispiel');
  console.log('───────────────────────────┼─────┼───────┼──────┼─────────');
  ranked.filter((a) => a.count >= 2).forEach((a) => {
    console.log(`${a.account.substring(0, 26).padEnd(26)} | ${String(a.count).padEnd(3)} | ${(a.avgQuality + '%').padEnd(5)} | ${(a.topShare + '%').padEnd(4)} | ${(a.sample || '').substring(0, 30)}`);
  });

  const scrapeList = ranked.filter((a) => a.count >= 3 && a.avgQuality >= 70);
  console.log('\n🎯 SCRAPE-PRIORITÄT (≥3 Rezepte, Ø≥70%):\n');
  scrapeList.forEach((a, i) => console.log(`  ${i + 1}. ${a.account}  (${a.count} Rezepte, Ø${a.avgQuality}%, ${a.topShare}% TOP)`));

  fs.writeFileSync(path.join(OUTPUT_DIR, 'account-ranking-combined.json'), JSON.stringify({ ranked, scrapeList }, null, 2));
  console.log(`\n📋 Report: scripts/output/account-ranking-combined.json\n`);
}
main().catch((e) => { console.error(e); process.exit(1); });
