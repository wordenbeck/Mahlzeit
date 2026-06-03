/**
 * Re-Parse Instagram source_caption_raw → saubere Zutaten + Zubereitung.
 * Klassifiziert jedes schwache Rezept:
 *   A = Voll-Rezept (Zutaten + >=2 sinnvolle Schritte) → UPDATE
 *   B = Nur Zutaten / Schritte unvollständig (Video nötig) → UPDATE (so weit es geht) + Flag
 *   C = Kein Rezept (Marketing-Müll) → Löschkandidat
 * Schreibt SQL nach ./reparse_instagram.sql (UPDATEs) + Report nach stdout.
 * Kein LLM — nur Struktur-Extraktion des Original-Creator-Texts.
 */
import * as fs from 'fs';

const env = fs.readFileSync('./.env.local', 'utf-8');
const SUPA = env.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const ANON = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

const sqlEsc = s => s.replace(/'/g, "''");
const jsonStr = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

// Bullet-Zeile? (•, -, *, ⁠ inkl. unsichtbare Zeichen)
function isBullet(line) {
  return /^\s*[•\-*▪️·]\s*[⁠​]?\s*\S/.test(line) || /^\s*[⁠​]/.test(line);
}
function stripBullet(line) {
  return line.replace(/^\s*[•\-*▪️·]\s*/, '').replace(/[⁠​]/g, '').trim();
}

// Marker, die NICHT zum Rezept gehören
const STOP_MARKERS = /^(nährwerte|gefällt dir|speicher|abspeichern|folg|werbung|anzeige|#|werte pro|pro portion|kcal|gefolgt)/i;

function parseCaption(caption, titel) {
  const lines = caption.split('\n');
  const zutaten = [];
  const steps = [];
  let mode = 'pre'; // pre | zutaten | zubereitung

  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // Section-Marker
    if (/^(zutaten|ingredients|das brauchst|dafür brauchst|hier sind zutaten|hier sind die zutaten)/i.test(line)) {
      mode = 'zutaten'; continue;
    }
    if (/^(zubereitung|so geht|anleitung|zubereiten|los geht)/i.test(line)) {
      mode = 'zubereitung'; continue;
    }
    // Nährwert/Hashtag-Block beendet das Rezept
    if (STOP_MARKERS.test(line)) {
      if (mode !== 'pre') break;
      continue;
    }

    if (mode === 'zutaten') {
      const z = isBullet(line) ? stripBullet(line) : line;
      if (z && z.length < 80) zutaten.push(z);
    } else if (mode === 'zubereitung') {
      const s = line.replace(/^\d+[\.\)]\s*/, '').replace(/^[•\-*]\s*/, '').trim();
      if (s) steps.push(s);
    } else {
      // pre: Bullets sind meist Zutaten (wie bei Crunchy Tuna)
      if (isBullet(line)) {
        const z = stripBullet(line);
        if (z && z.length < 80) zutaten.push(z);
      }
    }
  }
  return { zutaten, steps };
}

function classify(zutaten, steps) {
  const stepText = steps.join(' ');
  const goodSteps = steps.filter(s => s.length >= 12);
  if (zutaten.length >= 2 && goodSteps.length >= 2) return 'A';
  if (zutaten.length >= 2) return 'B'; // Zutaten da, Anleitung unvollständig
  return 'C'; // kein verwertbares Rezept
}

const res = await fetch(SUPA + '/rest/v1/recipes?source=eq.instagram&select=id,titel,zutaten,zubereitung,source_caption_raw,source_url', {
  headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
});
const rows = await res.json();

const weak = rows.filter(r => {
  const z = (r.zutaten || []).length, b = (r.zubereitung || []).length;
  const a = b ? r.zubereitung.join(' ').length / b : 0;
  return !(z >= 2 && b >= 2 && a >= 15);
});

let sql = '-- Re-Parse Instagram Captions → saubere Zutaten/Zubereitung\nBEGIN;\n\n';
const buckets = { A: [], B: [], C: [] };

for (const r of weak) {
  const { zutaten, steps } = parseCaption(r.source_caption_raw || '', r.titel);
  const cls = classify(zutaten, steps);
  buckets[cls].push({ titel: r.titel, zut: zutaten.length, steps: steps.length });

  if (cls === 'A' || cls === 'B') {
    const zJson = '[' + zutaten.map(n => `{"name":"${jsonStr(n)}","menge":null,"einheit":null,"hinweis":null}`).join(',') + ']';
    const sJson = '[' + steps.map(s => `"${jsonStr(s)}"`).join(',') + ']';
    sql += `UPDATE recipes SET zutaten = '${sqlEsc(zJson)}'::jsonb`;
    if (steps.length) sql += `, zubereitung = '${sqlEsc(sJson)}'::jsonb`;
    sql += `, updated_at = NOW() WHERE id = '${r.id}';\n`;
  }
}
sql += '\nCOMMIT;\n';
fs.writeFileSync('./reparse_instagram.sql', sql, 'utf-8');

console.log('=== KLASSIFIKATION der', weak.length, 'schwachen IG-Rezepte ===\n');
console.log('A = Voll-Rezept (Zutaten + >=2 Schritte):', buckets.A.length);
buckets.A.forEach(x => console.log('   ✅', x.titel.slice(0, 50), `[zut:${x.zut} steps:${x.steps}]`));
console.log('\nB = Zutaten ok, Anleitung unvollständig (Video sinnvoll):', buckets.B.length);
buckets.B.forEach(x => console.log('   ⚠️', x.titel.slice(0, 50), `[zut:${x.zut} steps:${x.steps}]`));
console.log('\nC = Kein verwertbares Rezept (Löschkandidat):', buckets.C.length);
buckets.C.forEach(x => console.log('   ❌', x.titel.slice(0, 50), `[zut:${x.zut} steps:${x.steps}]`));
console.log('\n📝 SQL: ./reparse_instagram.sql (UPDATE für A+B =', buckets.A.length + buckets.B.length, 'Rezepte)');
