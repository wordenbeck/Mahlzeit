/**
 * RE-PARSE-POTENZIAL: Welche bestehenden Rezepte liegen unter ihrem Quell-Potenzial?
 *
 * Holt die VOLLE Instagram-Caption (oEmbed) — nicht die in der DB auf 500 Zeichen
 * gekürzte — und parst sie mit V3 neu. Vergleicht gegen die aktuelle DB-Version:
 * mehr Zutaten / mehr Anleitungstext = Verbesserungs-Kandidat.
 *
 * Beantwortet zugleich die faire Anleitungs-Qualität (volle Caption statt gekürzte).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VARIANTS } from './prompt-eval.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const cfg: Record<string, string> = {};
env.split('\n').forEach((l) => { const i = l.indexOf('='); if (i > 0) cfg[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
const BASE = cfg.VITE_SUPABASE_URL, ANON = cfg.VITE_SUPABASE_ANON_KEY, ANTHROPIC = cfg.ANTHROPIC_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'output');
const V3 = VARIANTS.find((v) => v.id === 'V3')!;

function parseMaybe(v: any) { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v); } catch { return null; } } return v; }

async function fetchFullCaption(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const o = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`;
    const r = await fetch(o, { headers: { 'User-Agent': 'facebookexternalhit/1.1' }, signal: ctrl.signal });
    clearTimeout(t);
    const j = await r.json();
    return j.title ?? null;
  } catch { return null; }
}

async function parseV3(caption: string) {
  const userMsg = `${V3.userPrefix}Parse diese Caption als Rezept:\n\n${JSON.stringify({ caption, source: 'instagram' })}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 4000, system: V3.system, messages: [{ role: 'user', content: userMsg }] }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    const data = await res.json();
    if (!res.ok) return null;
    const txt = data.content?.[0]?.text ?? '';
    let p: any; try { p = JSON.parse(txt.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()); }
    catch { const m = txt.match(/\{[\s\S]*\}/); if (m) try { p = JSON.parse(m[0]); } catch {} }
    return p?.rezept ?? p ?? null;
  } catch { clearTimeout(t); return null; }
}

async function main() {
  const SAMPLE = Number(process.env.SAMPLE ?? 15);
  console.log('🔬 RE-PARSE-POTENZIAL — volle Caption vs. DB-Version (V3)\n');

  const q = `${BASE}/rest/v1/recipes?select=id,titel,source_url,source_caption_raw,zutaten,zubereitung&source=eq.instagram&source_url=not.is.null&limit=200`;
  const all = await (await fetch(q, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  // priorisiere die mit gekürzter Caption (genau 500) — die wahrscheinlichsten Kandidaten
  const sorted = all.sort((a: any, b: any) => (b.source_caption_raw?.length === 500 ? 1 : 0) - (a.source_caption_raw?.length === 500 ? 1 : 0));
  const sample = sorted.slice(0, SAMPLE);

  console.log(`Teste ${sample.length} Rezepte (volle Caption holen + V3-Reparse)\n`);
  console.log('Status | Rezept                         | Zutaten DB→neu | Anleit-Zeichen DB→neu');
  console.log('───────┼────────────────────────────────┼────────────────┼──────────────────────');

  const candidates: any[] = [];
  for (const r of sample) {
    const full = await fetchFullCaption(r.source_url);
    if (!full) { console.log(`  skip  | ${r.titel.slice(0, 30).padEnd(30)} | (keine Caption)`); continue; }

    const dbZut = (parseMaybe(r.zutaten) || []).length;
    const dbStep = (parseMaybe(r.zubereitung) || []).join(' ').length;
    const cut = r.source_caption_raw?.length === 500 ? '✂️500' : `${r.source_caption_raw?.length}z`;

    const reparsed = await parseV3(full);
    if (!reparsed) { console.log(`  err   | ${r.titel.slice(0, 30).padEnd(30)} | (parse fail)`); continue; }
    const newZut = (parseMaybe(reparsed.zutaten) || []).length;
    const newStep = (parseMaybe(reparsed.zubereitung) || []).join(' ').length;

    const zutGain = newZut - dbZut;
    const stepGain = newStep - dbStep;
    // Verbesserungs-Kandidat: deutlich mehr Zutaten ODER deutlich mehr Anleitungstext
    const isCand = zutGain >= 2 || stepGain > 150;
    const flag = isCand ? '🔼 BESS' : (zutGain < -1 || stepGain < -150) ? '🔽 schl' : '✓  ok ';
    console.log(`${flag} | ${r.titel.slice(0, 30).padEnd(30)} | ${String(dbZut).padStart(2)}→${String(newZut).padEnd(2)} (${zutGain >= 0 ? '+' : ''}${zutGain})      | ${String(dbStep).padStart(4)}→${String(newStep).padEnd(4)} (${stepGain >= 0 ? '+' : ''}${stepGain}) ${cut}`);

    if (isCand) candidates.push({ id: r.id, titel: r.titel, fullCaptionLen: full.length, dbCaptionLen: r.source_caption_raw?.length, zutGain, stepGain, dbZut, newZut, dbStep, newStep });
    await new Promise((x) => setTimeout(x, 300));
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`📊 ${candidates.length}/${sample.length} Rezepte würden von Re-Parse profitieren\n`);
  if (candidates.length) {
    console.log('Top-Verbesserungs-Kandidaten:');
    candidates.sort((a, b) => (b.zutGain + b.stepGain / 50) - (a.zutGain + a.stepGain / 50)).slice(0, 10)
      .forEach((c) => console.log(`  🔼 ${c.titel.slice(0, 38).padEnd(38)} +${c.zutGain} Zutaten, +${c.stepGain} Anleit-Zeichen (Caption ${c.dbCaptionLen}→${c.fullCaptionLen})`));
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'reparse-potential.json'), JSON.stringify({ timestamp: new Date().toISOString(), sample: sample.length, candidates }, null, 2));
  console.log(`\nReport: scripts/output/reparse-potential.json`);
}
main().catch((e) => { console.error(e); process.exit(1); });
