/**
 * PROMPT-ENTSCHEIDUNGSTEST — V0 vs V3, große Stichprobe, VOLLE Captions.
 *
 * Behebt die zwei Schwächen der ersten Eval:
 *  - n=25 statt 10 (statistisch solider)
 *  - volle oEmbed-Captions statt der auf 500 gekürzten DB-Version (faire Anleitung)
 *
 * Head-to-head pro Komponente: hält V3 (schlank) das Niveau von V0 (5 Few-Shots)?
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
const V0 = VARIANTS.find((v) => v.id === 'V0')!;
const V3 = VARIANTS.find((v) => v.id === 'V3')!;

function pm(v: any) { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v); } catch { return null; } } return v; }

async function fullCaption(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': 'facebookexternalhit/1.1' }, signal: ctrl.signal });
    clearTimeout(t); const j = await r.json(); return j.title ?? null;
  } catch { return null; }
}

async function parseOnce(v: any, caption: string) {
  const userMsg = `${v.userPrefix}Parse diese Caption als Rezept:\n\n${JSON.stringify({ caption, source: 'instagram' })}`;
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 4000, system: v.system, messages: [{ role: 'user', content: userMsg }] }),
      signal: ctrl.signal,
    });
    clearTimeout(t); const data = await res.json();
    if (!res.ok) return { retry: res.status === 429 || res.status === 529, val: null };
    const txt = data.content?.[0]?.text ?? '';
    let p: any; try { p = JSON.parse(txt.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()); }
    catch { const m = txt.match(/\{[\s\S]*\}/); if (m) try { p = JSON.parse(m[0]); } catch {} }
    const rez = p?.rezept ?? p;
    if (!rez) return { retry: false, val: null };
    return { retry: false, val: { zut: (pm(rez.zutaten) || []).length, stepC: (pm(rez.zubereitung) || []).join(' ').length, dauer: !!rez.zubereitungszeit_min, schwier: !!rez.schwierigkeit, tags: (pm(rez.tags) || []).length >= 3, inTok: data.usage?.input_tokens ?? 0 } };
  } catch { clearTimeout(t); return { retry: true, val: null }; }
}
async function parse(v: any, caption: string) {
  let r = await parseOnce(v, caption);
  if (!r.val && r.retry) { await new Promise((x) => setTimeout(x, 2500)); r = await parseOnce(v, caption); }
  return r.val;
}

async function main() {
  const N = Number(process.env.SAMPLE ?? 25);
  console.log(`🔬 PROMPT-ENTSCHEIDUNGSTEST — V0 vs V3, n=${N}, VOLLE Captions\n`);

  const q = `${BASE}/rest/v1/recipes?select=titel,source_url&source=eq.instagram&source_url=not.is.null&limit=200`;
  const all = await (await fetch(q, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  const sample = all.slice(0, N);

  const agg: any = { V0: { zut: [], stepC: [], dauer: 0, schwier: 0, tags: 0, tok: [], n: 0 }, V3: { zut: [], stepC: [], dauer: 0, schwier: 0, tags: 0, tok: [], n: 0 } };
  let v3WinsZut = 0, v3WinsStep = 0, compared = 0;

  console.log('Rezept                          | V0 Zut/Anl | V3 Zut/Anl');
  console.log('────────────────────────────────┼────────────┼───────────');
  for (const r of sample) {
    const cap = await fullCaption(r.source_url);
    if (!cap || cap.length < 80) { console.log(`  skip ${r.titel.slice(0, 28)}`); continue; }
    const a = await parse(V0, cap); // sequenziell statt parallel — vermeidet Rate-/Overload-Limit
    await new Promise((x) => setTimeout(x, 400));
    const b = await parse(V3, cap);
    if (!a || !b) { console.log(`  err  ${r.titel.slice(0, 28)}`); continue; }
    for (const [k, res] of [['V0', a], ['V3', b]] as const) {
      agg[k].zut.push(res.zut); agg[k].stepC.push(res.stepC); agg[k].tok.push(res.inTok);
      if (res.dauer) agg[k].dauer++; if (res.schwier) agg[k].schwier++; if (res.tags) agg[k].tags++; agg[k].n++;
    }
    compared++;
    if (b.zut >= a.zut) v3WinsZut++;
    if (b.stepC >= a.stepC * 0.9) v3WinsStep++; // V3 hält ≥90% des V0-Anleitungstexts
    console.log(`${r.titel.slice(0, 30).padEnd(30)}  | ${String(a.zut).padStart(2)} / ${String(a.stepC).padStart(4)}  | ${String(b.zut).padStart(2)} / ${String(b.stepC).padStart(4)}`);
    await new Promise((x) => setTimeout(x, 200));
  }

  const avg = (a: number[]) => a.length ? (a.reduce((x, y) => x + y, 0) / a.length) : 0;
  const pct = (c: number, n: number) => n ? Math.round((c / n) * 100) : 0;

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`📊 ENTSCHEIDUNG — V0 vs V3 (n=${compared}, volle Captions)\n`);
  console.log('Komponente        | V0 (5-Ex)     | V3 (schlank)');
  console.log('──────────────────┼───────────────┼──────────────');
  console.log(`Ø Zutaten         | ${avg(agg.V0.zut).toFixed(1).padEnd(13)} | ${avg(agg.V3.zut).toFixed(1)}`);
  console.log(`Ø Anleitung-Zeich | ${Math.round(avg(agg.V0.stepC)).toString().padEnd(13)} | ${Math.round(avg(agg.V3.stepC))}`);
  console.log(`Dauer gefüllt     | ${(pct(agg.V0.dauer, agg.V0.n) + '%').padEnd(13)} | ${pct(agg.V3.dauer, agg.V3.n)}%`);
  console.log(`Schwierigkeit     | ${(pct(agg.V0.schwier, agg.V0.n) + '%').padEnd(13)} | ${pct(agg.V3.schwier, agg.V3.n)}%`);
  console.log(`Tags (≥3)         | ${(pct(agg.V0.tags, agg.V0.n) + '%').padEnd(13)} | ${pct(agg.V3.tags, agg.V3.n)}%`);
  console.log(`Ø Input-Tokens    | ${Math.round(avg(agg.V0.tok)).toString().padEnd(13)} | ${Math.round(avg(agg.V3.tok))} (−${Math.round((1 - avg(agg.V3.tok) / avg(agg.V0.tok)) * 100)}%)`);
  console.log('\nHead-to-Head:');
  console.log(`  V3 ≥ V0 bei Zutaten:    ${v3WinsZut}/${compared} (${pct(v3WinsZut, compared)}%)`);
  console.log(`  V3 hält ≥90% Anleitung: ${v3WinsStep}/${compared} (${pct(v3WinsStep, compared)}%)`);
  console.log('\n★ Wenn V3 bei Zutaten+Anleitung ≈ V0 → schlanker Prompt ist sicher (bei −80% Tokens).\n');

  fs.writeFileSync(path.join(OUTPUT_DIR, 'prompt-decision.json'), JSON.stringify({ timestamp: new Date().toISOString(), n: compared, agg, v3WinsZut, v3WinsStep }, null, 2));
  console.log('Report: scripts/output/prompt-decision.json');
}
main().catch((e) => { console.error(e); process.exit(1); });
