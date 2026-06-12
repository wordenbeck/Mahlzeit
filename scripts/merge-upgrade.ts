/**
 * MERGE-UPGRADE: hebt Rezept-Qualität — NUR nach oben, nie verschlechtern.
 *
 * Pro Rezept: volle Caption (oEmbed) → V3-Parse → feldweise mergen:
 *   - Zutaten: übernehmen wenn MEHR valide als aktuell
 *   - Zubereitung: übernehmen wenn aktuell quasi leer (<50z) ODER neu deutlich mehr (>1.2×)
 *   - Dauer/Schwierigkeit/Beschreibung: übernehmen NUR wenn aktuell fehlt
 *   - Tags: übernehmen wenn aktuell <3 und neu ≥3
 * Schützt manuelle Optimierungen + vermeidet Parse-Varianz-Verluste.
 *
 * DRY_RUN=1 (default): zeigt nur, was sich ändern würde. DRY_RUN=0: schreibt via Service-Role.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RECIPE_PARSER_SYSTEM_PROMPT, formatRecipeFewShotExamples } from '../src/lib/prompts/recipeParserPrompt.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const cfg: Record<string, string> = {};
env.split('\n').forEach((l) => { const i = l.indexOf('='); if (i > 0) cfg[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
const BASE = cfg.VITE_SUPABASE_URL, ANON = cfg.VITE_SUPABASE_ANON_KEY, SR = cfg.SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC = cfg.ANTHROPIC_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'output');
// Produktiv-Prompt (V3) — exakt was die App nutzt
const SYS = RECIPE_PARSER_SYSTEM_PROMPT;
const PREFIX = formatRecipeFewShotExamples();
const DRY = process.env.DRY_RUN !== '0';

function pm(v: any) { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v); } catch { return null; } } return v; }
function validZut(z: any[]) { return (z || []).filter((x) => x?.name && x?.einheit); }

async function fullCaption(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': 'facebookexternalhit/1.1' }, signal: ctrl.signal });
    clearTimeout(t); const j = await r.json(); return j.title ?? null;
  } catch { return null; }
}

async function parseV3(caption: string) {
  const userMsg = `${PREFIX}Parse diese Caption als Rezept:\n\n${JSON.stringify({ caption, source: 'instagram' })}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 45000);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 4000, system: SYS, messages: [{ role: 'user', content: userMsg }] }),
        signal: ctrl.signal,
      });
      clearTimeout(t); const data = await res.json();
      if (!res.ok) { if (attempt < 3) { await new Promise((x) => setTimeout(x, 3000 * (attempt + 1))); continue; } return null; }
      const txt = data.content?.[0]?.text ?? '';
      let p: any; try { p = JSON.parse(txt.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()); }
      catch { const m = txt.match(/\{[\s\S]*\}/); if (m) try { p = JSON.parse(m[0]); } catch {} }
      return p?.rezept ?? p ?? null;
    } catch { clearTimeout(t); if (attempt < 3) { await new Promise((x) => setTimeout(x, 3000 * (attempt + 1))); continue; } return null; }
  }
  return null;
}

// Merge-Logik: gibt nur die zu ändernden Felder zurück (oder {} wenn nichts besser)
function computeUpgrade(db: any, neu: any) {
  const upd: any = {}; const reasons: string[] = [];
  const dbZut = validZut(pm(db.zutaten)), newZut = validZut(pm(neu.zutaten));
  if (newZut.length > dbZut.length) { upd.zutaten = newZut; reasons.push(`Zutaten ${dbZut.length}→${newZut.length}`); }

  const dbStep = (pm(db.zubereitung) || []), newStep = (pm(neu.zubereitung) || []);
  const dbC = dbStep.join(' ').length, newC = newStep.join(' ').length;
  if (newStep.length && (dbC < 50 || newC > dbC * 1.2)) { upd.zubereitung = newStep; reasons.push(`Anleitung ${dbC}→${newC}z`); }

  if (!db.zubereitungszeit_min && neu.zubereitungszeit_min) { upd.zubereitungszeit_min = neu.zubereitungszeit_min; reasons.push('Dauer+'); }
  if (!db.schwierigkeit && neu.schwierigkeit) { upd.schwierigkeit = neu.schwierigkeit; reasons.push('Schwierigkeit+'); }
  if (!db.beschreibung && neu.beschreibung) { upd.beschreibung = neu.beschreibung; reasons.push('Beschreibung+'); }
  const dbTags = pm(db.tags) || [], newTags = pm(neu.tags) || [];
  if (dbTags.length < 3 && newTags.length >= 3) { upd.tags = newTags; reasons.push(`Tags ${dbTags.length}→${newTags.length}`); }
  const dbKat = pm(db.kategorie) || [], newKat = pm(neu.kategorie) || [];
  if (dbKat.length === 0 && newKat.length > 0) { upd.kategorie = newKat; reasons.push('Kategorie+'); }

  return { upd, reasons };
}

async function writeUpdate(id: string, upd: any) {
  const res = await fetch(`${BASE}/rest/v1/recipes?id=eq.${id}`, {
    method: 'PATCH',
    headers: { apikey: SR, Authorization: `Bearer ${SR}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(upd),
  });
  return res.status === 204 || res.status === 200;
}

async function main() {
  const LIMIT = Number(process.env.LIMIT ?? 200);
  console.log(`🔧 MERGE-UPGRADE ${DRY ? '(DRY-RUN — schreibt nichts)' : '(⚠️ SCHREIBT IN DB)'}\n`);

  const q = `${BASE}/rest/v1/recipes?select=id,titel,source_url,zutaten,zubereitung,zubereitungszeit_min,schwierigkeit,beschreibung,tags,kategorie&source=eq.instagram&source_url=not.is.null&limit=${LIMIT}`;
  const all = await (await fetch(q, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  console.log(`${all.length} Instagram-Rezepte mit URL\n`);

  let upgraded = 0, unchanged = 0, failed = 0, written = 0;
  const changes: any[] = [];

  for (let i = 0; i < all.length; i++) {
    const r = all[i];
    const cap = await fullCaption(r.source_url);
    if (!cap || cap.length < 80) { failed++; continue; }
    const neu = await parseV3(cap);
    if (!neu) { failed++; continue; }

    const { upd, reasons } = computeUpgrade(r, neu);
    if (Object.keys(upd).length === 0) { unchanged++; }
    else {
      upgraded++;
      changes.push({ id: r.id, titel: r.titel, reasons });
      console.log(`🔼 ${r.titel.slice(0, 40).padEnd(40)} ${reasons.join(', ')}`);
      if (!DRY) { if (await writeUpdate(r.id, upd)) written++; else console.log(`   ⚠️ Schreiben fehlgeschlagen`); }
    }
    if (i % 10 === 0) process.stdout.write(`  …${i}/${all.length}\r`);
    await new Promise((x) => setTimeout(x, 1800)); // Haiku-Rate-Limit-safe (~30 Calls/Min)
  }

  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log(`📊 ${DRY ? 'DRY-RUN' : 'AUSGEFÜHRT'}\n`);
  console.log(`🔼 Verbesserbar:  ${upgraded}`);
  console.log(`✓  Unverändert:   ${unchanged} (bereits gut — kein Downgrade)`);
  console.log(`❌ Fehler/skip:   ${failed}`);
  if (!DRY) console.log(`💾 Geschrieben:   ${written}`);
  // Häufigste Verbesserungs-Typen
  const byReason: Record<string, number> = {};
  changes.forEach((c) => c.reasons.forEach((r: string) => { const k = r.split(' ')[0]; byReason[k] = (byReason[k] || 0) + 1; }));
  console.log(`\nVerbesserungs-Typen:`, JSON.stringify(byReason));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'merge-upgrade.json'), JSON.stringify({ dryRun: DRY, upgraded, unchanged, failed, changes }, null, 2));
  console.log(`\nReport: scripts/output/merge-upgrade.json`);
  if (DRY) console.log(`\n→ Für echten Lauf: DRY_RUN=0`);
}
main().catch((e) => { console.error(e); process.exit(1); });
