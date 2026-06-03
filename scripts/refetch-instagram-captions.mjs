/**
 * Holt VOLLE Instagram-Captions (og:description, ungekürzt) für schwache Rezepte,
 * parst Zutaten + Zubereitung neu, klassifiziert A/B/C und schreibt SQL.
 * Kein LLM — Struktur-Extraktion des Original-Creator-Texts.
 * Output: ./refetch_instagram.sql + Report.
 */
import * as fs from 'fs';

const env = fs.readFileSync('./.env.local', 'utf-8');
const SUPA = env.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const ANON = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

const sqlEsc = s => s.replace(/'/g, "''");
const jsonStr = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

// HTML-Entities dekodieren (&quot; &#x1f959; &amp; etc.)
function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

// og:description → reiner Caption-Text (Präfix "12K likes... on DATE: "..."" entfernen)
function extractCaption(ogDesc) {
  let s = decodeEntities(ogDesc);
  const m = s.match(/:\s*[""„](.*)[""„]\s*$/s) || s.match(/:\s*"(.*)"\s*$/s);
  if (m) return m[1];
  // Fallback: ab erstem Doppelpunkt nach "on <Datum>:"
  const idx = s.indexOf(': ');
  return idx >= 0 ? s.slice(idx + 2) : s;
}

function isBullet(line) { return /^\s*[•\-*▪️·]\s*[⁠​]?\s*\S/.test(line) || /^\s*[⁠​]/.test(line); }
function stripBullet(line) { return line.replace(/^\s*[•\-*▪️·]\s*/, '').replace(/[⁠​]/g, '').trim(); }
const STOP = /^(nährwerte|gefällt dir|speicher|abspeichern|folg|werbung|werte pro|pro portion|^\d+\s*kcal|gefolgt|#)/i;

function parseCaption(caption) {
  const lines = caption.split('\n');
  const zutaten = [], steps = [];
  let mode = 'pre';
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^(zutaten|ingredients|das brauchst|dafür brauchst|hier sind( die)? zutaten)/i.test(line)) { mode = 'zutaten'; continue; }
    if (/^(zubereitung|so geht|anleitung|zubereiten|los geht|so wird)/i.test(line)) { mode = 'zubereitung'; continue; }
    if (STOP.test(line)) { if (mode === 'zubereitung') break; continue; }
    if (mode === 'zutaten') {
      const z = isBullet(line) ? stripBullet(line) : line;
      if (z && z.length < 80) zutaten.push(z);
    } else if (mode === 'zubereitung') {
      const s = line.replace(/^\d+[\.\)]\s*/, '').replace(/^[•\-*]\s*/, '').trim();
      if (s && s.length > 3) steps.push(s);
    } else {
      if (isBullet(line)) { const z = stripBullet(line); if (z && z.length < 80) zutaten.push(z); }
    }
  }
  return { zutaten, steps };
}
function classify(zutaten, steps) {
  const good = steps.filter(s => s.length >= 12);
  if (zutaten.length >= 2 && good.length >= 2) return 'A';
  if (zutaten.length >= 2) return 'B';
  return 'C';
}

const res = await fetch(SUPA + '/rest/v1/recipes?source=eq.instagram&select=id,titel,zutaten,zubereitung,source_url', {
  headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
});
const rows = await res.json();
const weak = rows.filter(r => {
  const z = (r.zutaten || []).length, b = (r.zubereitung || []).length;
  const a = b ? r.zubereitung.join(' ').length / b : 0;
  return !(z >= 2 && b >= 2 && a >= 15);
});

const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' };
let sql = '-- Re-Fetch volle IG-Captions → Zutaten + Zubereitung\nBEGIN;\n\n';
const buckets = { A: [], B: [], C: [] };
let fetchFail = 0;

for (const r of weak) {
  if (!r.source_url) { buckets.C.push({ titel: r.titel, note: 'keine url' }); continue; }
  let caption = '';
  try {
    const html = await (await fetch(r.source_url, { headers: UA })).text();
    const og = html.match(/<meta property="og:description" content="([^"]*)"/);
    if (og) caption = extractCaption(og[1]);
  } catch (e) { fetchFail++; }
  await new Promise(rs => setTimeout(rs, 400)); // sanftes Rate-Limit

  const { zutaten, steps } = parseCaption(caption);
  const cls = classify(zutaten, steps);
  buckets[cls].push({ titel: r.titel, zut: zutaten.length, steps: steps.length, capLen: caption.length });

  if (cls === 'A' || cls === 'B') {
    const zJson = '[' + zutaten.map(n => `{"name":"${jsonStr(n)}","menge":null,"einheit":null,"hinweis":null}`).join(',') + ']';
    const sJson = '[' + steps.map(s => `"${jsonStr(s)}"`).join(',') + ']';
    sql += `UPDATE recipes SET zutaten = '${sqlEsc(zJson)}'::jsonb`;
    if (steps.length >= 2) sql += `, zubereitung = '${sqlEsc(sJson)}'::jsonb`;
    sql += `, source_caption_raw = '${sqlEsc(caption)}', updated_at = NOW() WHERE id = '${r.id}';\n`;
  }
}
sql += '\nCOMMIT;\n';
fs.writeFileSync('./refetch_instagram.sql', sql, 'utf-8');

console.log('=== Re-Fetch volle Captions:', weak.length, 'Rezepte (Fetch-Fehler:', fetchFail, ') ===\n');
console.log('A = Voll-Rezept (Zutaten + >=2 Schritte):', buckets.A.length);
buckets.A.forEach(x => console.log('   ✅', x.titel.slice(0, 48), `[zut:${x.zut} steps:${x.steps} cap:${x.capLen}]`));
console.log('\nB = Zutaten ok, Anleitung dünn:', buckets.B.length);
buckets.B.forEach(x => console.log('   ⚠️', x.titel.slice(0, 48), `[zut:${x.zut} steps:${x.steps} cap:${x.capLen}]`));
console.log('\nC = kein Rezept extrahierbar:', buckets.C.length);
buckets.C.forEach(x => console.log('   ❌', x.titel.slice(0, 48), x.note || `[cap:${x.capLen}]`));
console.log('\n📝 SQL: ./refetch_instagram.sql (A+B =', buckets.A.length + buckets.B.length, 'UPDATEs)');
