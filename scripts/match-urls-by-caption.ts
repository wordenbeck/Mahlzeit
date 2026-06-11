/**
 * BLOCK 2: URL-Vervollständigung via Caption-Matching
 *
 * Idee: Beide Seiten stammen vom selben Instagram-Post → Captions ~identisch.
 *   - 55 DB-Rezepte (instagram, source_url IS NULL) mit source_caption_raw
 *   - 105 neue URLs mit frischer oEmbed-Caption
 * Match per normalisiertem Caption-Anfang → eindeutige Zuordnung URL↔Rezept.
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
const REZEPTE_DIR = path.join(__dirname, '../../Rezepte');

// normalisiert Caption für Vergleich: lowercase, nur Buchstaben/Zahlen
function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Ähnlichkeit zweier normalisierter Strings: Anteil gemeinsamer Anfangs-Tokens + Jaccard
function similarity(a: string, b: string): number {
  const na = norm(a), nb = norm(b);
  if (!na || !nb) return 0;
  // Anfangs-Match (erste 60 Zeichen)
  const headA = na.slice(0, 60), headB = nb.slice(0, 60);
  let headScore = 0;
  if (headA === headB) headScore = 1;
  else if (na.startsWith(headB.slice(0, 40)) || nb.startsWith(headA.slice(0, 40))) headScore = 0.8;
  // Token-Jaccard
  const ta = new Set(na.split(' ').filter((w) => w.length > 3));
  const tb = new Set(nb.split(' ').filter((w) => w.length > 3));
  const inter = [...ta].filter((w) => tb.has(w)).length;
  const uni = new Set([...ta, ...tb]).size;
  const jac = uni ? inter / uni : 0;
  return Math.max(headScore, jac);
}

function extractUrls(file: string): string[] {
  if (!fs.existsSync(file)) return [];
  const c = fs.readFileSync(file, 'utf8');
  const m = c.match(/https:\/\/www\.instagram\.com\/[^\s\n]*/g) || [];
  return m.map((u) => u.split(/[?#\s]/)[0]).filter((v, i, a) => a.indexOf(v) === i);
}

async function fetchCaption(url: string): Promise<{ caption: string | null; author: string | null }> {
  try {
    const o = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000); // hartes 8s-Timeout pro Request
    const r = await fetch(o, { headers: { 'User-Agent': 'facebookexternalhit/1.1' }, signal: ctrl.signal });
    clearTimeout(timer);
    const j = await r.json();
    return { caption: j.title ?? null, author: j.author_name ?? null };
  } catch { return { caption: null, author: null }; }
}

async function main() {
  console.log('🔗 BLOCK 2: URL-Matching via Caption\n');

  // 55 DB-Rezepte ohne URL
  const dbq = `${SUPABASE_URL}/rest/v1/recipes?select=id,titel,source_caption_raw&source=eq.instagram&source_url=is.null&limit=200`;
  const dbRecipes = await (await fetch(dbq, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  console.log(`DB-Rezepte ohne URL: ${dbRecipes.length}`);

  // 105 URLs einlesen + Captions holen
  const urls = [
    ...extractUrls(path.join(REZEPTE_DIR, 'insta_urls old.md')),
    ...extractUrls(path.join(REZEPTE_DIR, 'insta_urls new.md')),
  ].filter((v, i, a) => a.indexOf(v) === i);
  console.log(`Neue URLs: ${urls.length}\nFetch Captions...`);

  const urlCaptions: { url: string; caption: string; author: string | null }[] = [];
  for (let i = 0; i < urls.length; i++) {
    const { caption, author } = await fetchCaption(urls[i]);
    if (caption) urlCaptions.push({ url: urls[i], caption, author });
    if (i % 20 === 0) process.stdout.write(`  ${i}/${urls.length}\r`);
    await new Promise((x) => setTimeout(x, 120));
  }
  console.log(`  ${urlCaptions.length}/${urls.length} Captions geladen\n`);

  // Matching: für jedes DB-Rezept die beste URL
  const matches: any[] = [];
  const noMatch: any[] = [];
  const usedUrls = new Set<string>();

  for (const rec of dbRecipes) {
    let best = { url: '', author: null as string | null, sim: 0 };
    for (const uc of urlCaptions) {
      if (usedUrls.has(uc.url)) continue;
      const sim = similarity(rec.source_caption_raw, uc.caption);
      if (sim > best.sim) best = { url: uc.url, author: uc.author, sim };
    }
    if (best.sim >= 0.6) {
      usedUrls.add(best.url);
      matches.push({ id: rec.id, titel: rec.titel, url: best.url, author: best.author, confidence: Math.round(best.sim * 100) });
    } else {
      noMatch.push({ id: rec.id, titel: rec.titel, bestSim: Math.round(best.sim * 100) });
    }
  }

  matches.sort((a, b) => b.confidence - a.confidence);

  // SQL generieren
  const sql = matches
    .map((m) => `UPDATE recipes SET source_url = '${m.url.replace(/'/g, "''")}' WHERE id = '${m.id}'; -- ${m.titel.replace(/\n/g, ' ').substring(0, 50)} (${m.confidence}%)`)
    .join('\n');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'block2-update-urls.sql'), sql);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'block2-match-report.json'), JSON.stringify({ matches, noMatch, unusedUrls: urlCaptions.filter((u) => !usedUrls.has(u.url)).map((u) => u.url) }, null, 2));

  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 ERGEBNIS\n');
  console.log(`✅ Sichere Matches (≥60%):  ${matches.length}`);
  console.log(`❓ Kein Match:              ${noMatch.length}`);
  console.log(`🔗 Übrige URLs (neu/Dupe):  ${urlCaptions.length - usedUrls.size}\n`);

  console.log('Match-Verteilung:');
  console.log(`  90-100% (quasi sicher): ${matches.filter((m) => m.confidence >= 90).length}`);
  console.log(`  75-89% (sehr gut):      ${matches.filter((m) => m.confidence >= 75 && m.confidence < 90).length}`);
  console.log(`  60-74% (review):        ${matches.filter((m) => m.confidence >= 60 && m.confidence < 75).length}\n`);

  console.log('Top 10 Matches:');
  matches.slice(0, 10).forEach((m) => console.log(`  ${m.confidence}% | ${m.titel.substring(0, 40).padEnd(40)} → ...${m.url.split('/').filter(Boolean).pop()}`));

  if (noMatch.length) {
    console.log('\nOhne Match (brauchen manuelle Prüfung):');
    noMatch.slice(0, 10).forEach((n) => console.log(`  ${n.bestSim}% best | ${n.titel.substring(0, 45)}`));
  }

  console.log(`\n📝 SQL: scripts/output/block2-update-urls.sql (${matches.length} UPDATEs)`);
  console.log(`📋 Report: scripts/output/block2-match-report.json\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
