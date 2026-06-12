/**
 * GROQ-Gegentest: hält der schlanke Prompt (V2) auf Groq die Qualität?
 *
 * Testet V0 (Baseline) vs V2 (1 Few-Shot) über die Edge Function (Groq llama).
 * Wichtig, weil schwächere Modelle mehr von Few-Shots profitieren als Haiku.
 * TPM-schonende Delays; bricht bei TPD-Limit sauber ab.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VARIANTS } from './prompt-eval.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const cfg: Record<string, string> = {};
env.split('\n').forEach((l) => { const i = l.indexOf('='); if (i > 0) cfg[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
const BASE = cfg.VITE_SUPABASE_URL, ANON = cfg.VITE_SUPABASE_ANON_KEY;
const OUTPUT_DIR = path.join(__dirname, 'output');

function parseMaybe(v: any) { if (!v) return null; if (typeof v === 'string') { try { return JSON.parse(v); } catch { return null; } } return v; }
function qualityScore(r: any): number {
  let s = 0;
  if (r.titel) s += 15; if (r.beschreibung) s += 10; if (r.portionen) s += 5;
  if (r.zubereitungszeit_min) s += 5; if (r.schwierigkeit) s += 5;
  if (Array.isArray(r.kategorie) && r.kategorie.length) s += 10;
  if (Array.isArray(r.tags) && r.tags.length) s += 5;
  const z = parseMaybe(r.zutaten);
  if (z && z.length) s += (z.filter((x: any) => x?.name && x?.einheit).length / z.length) * 20;
  const zb = parseMaybe(r.zubereitung);
  if (zb && zb.length) { const c = zb.join(' ').length; s += c > 200 ? 25 : c > 80 ? 18 : c > 30 ? 10 : 5; }
  return Math.min(100, Math.round(s));
}

// Variante über Edge Function (Groq). systemPrompt + fewShotExamples getrennt.
async function parseGroq(v: any, caption: string, sourceUrl: string) {
  const t0 = Date.now();
  // V0: echte Few-Shots als fewShotExamples; V1/V2: Few-Shot steckt im system → fewShotExamples=" " (Edge Fn verlangt truthy)
  const fewShots = v.userPrefix && v.userPrefix.length > 5 ? v.userPrefix : ' ';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch(`${BASE}/functions/v1/import-recipe-from-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
      body: JSON.stringify({ url: sourceUrl, manual_caption: caption, systemPrompt: v.system, fewShotExamples: fewShots, provider: 'groq' }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const data = await res.json();
    if (data.status === 'error') {
      const rl = /rate_limit|TPD|TPM|tokens per/i.test(data.error || '');
      return { ok: false as const, err: data.error?.slice(0, 60), rateLimit: rl, dur: Date.now() - t0 };
    }
    const rez = data.result?.rezept;
    if (!rez) return { ok: false as const, err: data.status || 'kein rezept', dur: Date.now() - t0 };
    return { ok: true as const, rez, score: qualityScore(rez), dur: Date.now() - t0 };
  } catch (e: any) {
    clearTimeout(timer);
    return { ok: false as const, err: e.name === 'AbortError' ? 'timeout' : e.message, dur: Date.now() - t0 };
  }
}

async function main() {
  console.log('🧪 GROQ-GEGENTEST — V0 vs V2 (über Edge Function)\n');

  // gleiches Top-Quality Referenz-Set wie Haiku-Eval
  const q = `${BASE}/rest/v1/recipes?select=titel,source_url,source_caption_raw,zutaten,zubereitung&source=eq.instagram&source_caption_raw=not.is.null&limit=200`;
  const all = await (await fetch(q, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  const refs = all
    .filter((r: any) => r.source_caption_raw?.length > 150)
    .map((r: any) => ({ ...r, goldZutaten: (parseMaybe(r.zutaten) || []).length, goldStepChars: (parseMaybe(r.zubereitung) || []).join(' ').length, goldScore: qualityScore(r) }))
    .filter((r: any) => r.goldZutaten >= 6 && r.goldStepChars > 150)
    .sort((a: any, b: any) => b.goldScore - a.goldScore)
    .slice(0, 10);
  console.log(`Referenz: ${refs.length} TOP-Rezepte (Ø ${Math.round(refs.reduce((a: number, b: any) => a + b.goldZutaten, 0) / refs.length)} Zutaten)\n`);

  // V3 (V2 + Pflichtfelder) auf Groq — soll die 66% von V2 Richtung 85%+ heben.
  const testVariants = VARIANTS.filter((v) => v.id === 'V3');
  const summary: any = {};
  let aborted = false;

  for (const v of testVariants) {
    if (aborted) break;
    console.log(`\n📊 ${v.id} — ${v.label} (auf Groq)`);
    const scores: number[] = [], recalls: number[] = []; let fails = 0;
    for (const ref of refs) {
      const r = await parseGroq(v, ref.source_caption_raw, ref.source_url);
      if (r.ok) {
        scores.push(r.score);
        const pz = (parseMaybe(r.rez.zutaten) || []).length;
        const recall = ref.goldZutaten ? Math.min(pz / ref.goldZutaten, 1) : 1;
        recalls.push(recall);
        const flag = recall >= 0.9 ? '✅' : recall >= 0.7 ? '🟡' : '🔴';
        console.log(`  ${flag} ${ref.titel.slice(0, 32).padEnd(32)} Q:${r.score} Zut ${pz}/${ref.goldZutaten} (${Math.round(recall * 100)}%) ${r.dur}ms`);
      } else {
        fails++;
        console.log(`  ❌ ${ref.titel.slice(0, 32).padEnd(32)} ${r.err}`);
        if (r.rateLimit) { console.log('\n  ⚠️  Groq Rate-Limit erreicht — Test hier gestoppt (Daten bis hier gültig).'); aborted = true; break; }
      }
      await new Promise((x) => setTimeout(x, v.id === 'V0' ? 8000 : 3000)); // V0 ist token-schwer → mehr Delay
    }
    summary[v.id] = {
      label: v.label,
      avgQuality: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      avgRecall: recalls.length ? Math.round((recalls.reduce((a, b) => a + b, 0) / recalls.length) * 100) : 0,
      n: scores.length, fails,
    };
  }

  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('📊 GROQ-VERGLEICH (V0 Baseline vs V2 schlank)\n');
  console.log('Variante                  | Ø Qual | Zutaten-Recall | n  | Fails');
  console.log('──────────────────────────┼────────┼────────────────┼────┼──────');
  for (const v of testVariants) {
    const s = summary[v.id]; if (!s) continue;
    console.log(`${(v.id + ' ' + s.label).slice(0, 25).padEnd(25)} | ${(s.avgQuality + '%').padEnd(6)} | ${(s.avgRecall + '%').padEnd(14)} | ${String(s.n).padEnd(2)} | ${s.fails}`);
  }
  console.log('\n★ Hält V2 auf Groq den Recall+Qualität von V0? → dann ist V2 deploy-tauglich.\n');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'groq-prompt-eval.json'), JSON.stringify({ timestamp: new Date().toISOString(), summary }, null, 2));
  console.log('Report: scripts/output/groq-prompt-eval.json');
}
main().catch((e) => { console.error(e); process.exit(1); });
