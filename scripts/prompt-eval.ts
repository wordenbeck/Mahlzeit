/**
 * PROMPT-EVAL — schlankster Prompt, der die volle Qualität hält.
 *
 * Methode (Thomas' Ansatz):
 *  - 10 Rezepte mit Original-Caption + DB-Version als Goldstandard
 *  - 3 Prompt-Varianten parsen dieselben Captions mit Haiku
 *  - Messen: Quality (Substanz-Score) + Input-Tokens + Feld-Treue vs. Gold
 *  - Gewinner wird separat auf Groq gegengeprüft
 *
 * KEIN Deploy — reine Evaluation vor der Entwicklung.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RECIPE_PARSER_SYSTEM_PROMPT, formatRecipeFewShotExamples, RECIPE_PARSER_EXAMPLES } from '../src/lib/prompts/recipeParserPrompt.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const cfg: Record<string, string> = {};
env.split('\n').forEach((l) => { const i = l.indexOf('='); if (i > 0) cfg[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
const BASE = cfg.VITE_SUPABASE_URL, ANON = cfg.VITE_SUPABASE_ANON_KEY, ANTHROPIC = cfg.ANTHROPIC_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'output');

// ---- Quality-Score (Substanz-Variante, wie chefkoch-fix) ----------------
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

// ---- PROMPT-VARIANTEN ----------------------------------------------------
const SCHEMA_KOMPAKT = `Antworte AUSSCHLIESSLICH mit gültigem JSON (kein Text drumherum):
{"status":"ok"|"not_a_recipe","rezept":{"titel":string,"beschreibung":string|null,"portionen":number,"zubereitungszeit_min":number|null,"schwierigkeit":"einfach"|"mittel"|"aufwendig"|null,"kategorie":string[],"zutaten":[{"name":string,"menge":number|null,"einheit":string,"hinweis":string|null}],"zubereitung":string[],"tags":string[],"ai_confidence":"low"|"medium"|"high"}}`;

// V1: schlank, 0 Few-Shots — gestraffte Regeln + Schema
const V1_SYSTEM = `Du bist ein präziser Rezept-Parser. Extrahiere aus einer Caption (Instagram/Web) ein strukturiertes Rezept.

REGELN:
- Alle Zutaten mit Menge+Einheit. "etwas Salz" → menge:null, einheit:"nach Geschmack". "200g Mehl" → menge:200, einheit:"g". Zusätze wie "fein gehackt" → hinweis.
- Zubereitung als Array, ein Schritt pro Element, KEINE führenden Nummern. Übernimm ALLE Schritte VOLLSTÄNDIG — niemals kürzen, weglassen oder zusammenfassen.
- schwierigkeit, kategorie (fruehstueck/mittag/abendessen/snack/dessert/getraenk/beilage), tags sinnvoll ableiten.
- Nicht halluzinieren: fehlt eine Info, weglassen statt erfinden.
- Kein Rezept erkennbar → status:"not_a_recipe".

${SCHEMA_KOMPAKT}`;

// V2: mittel — gestraffter Prompt + 1 kompaktes Few-Shot
const V2_EXAMPLE = RECIPE_PARSER_EXAMPLES[1]; // unstrukturierte Fließtext-Caption (lehrreichstes Beispiel)
const V2_SYSTEM = `${V1_SYSTEM}

# BEISPIEL
INPUT: "${V2_EXAMPLE.input.caption.replace(/"/g, "'").slice(0, 300)}"
OUTPUT: ${JSON.stringify({ status: 'ok', rezept: { titel: V2_EXAMPLE.output.rezept!.titel, portionen: V2_EXAMPLE.output.rezept!.portionen, zutaten: V2_EXAMPLE.output.rezept!.zutaten.slice(0, 3), zubereitung: V2_EXAMPLE.output.rezept!.zubereitung.slice(0, 2), tags: V2_EXAMPLE.output.rezept!.tags } })}`;

export type Variant = { id: string; label: string; system: string; userPrefix: string };
// V3: V2 + expliziter Pflichtfeld-Imperativ — zwingt auch schwächere Modelle (llama),
// die optionalen Metadaten zu füllen, ohne teure Few-Shots.
const V3_SYSTEM = V2_SYSTEM.replace(
  '- Nicht halluzinieren: fehlt eine Info, weglassen statt erfinden.',
  `- Nicht halluzinieren bei ZUTATEN/SCHRITTEN: fehlt eine Info, weglassen statt erfinden.
- PFLICHTFELDER immer ausfüllen (sinnvoll schätzen, niemals leer lassen): titel, portionen, zubereitungszeit_min (Dauer in Minuten schätzen), schwierigkeit, mind. 1 kategorie, mind. 3 tags, beschreibung (1 Satz), ai_confidence.`
);

export const VARIANTS: Variant[] = [
  { id: 'V0', label: 'Baseline (5 Few-Shots)', system: RECIPE_PARSER_SYSTEM_PROMPT, userPrefix: formatRecipeFewShotExamples() + '\n\n# AUFGABE\n' },
  { id: 'V1', label: 'Schlank (0 Few-Shots)', system: V1_SYSTEM, userPrefix: '' },
  { id: 'V2', label: 'Mittel (1 Few-Shot)', system: V2_SYSTEM, userPrefix: '' },
  { id: 'V3', label: 'V2 + Pflichtfelder', system: V3_SYSTEM, userPrefix: '' },
];

// ---- Parser-Call (Haiku) — mit Timeout + Retry --------------------------
async function parseOnce(v: Variant, caption: string) {
  const t0 = Date.now();
  const userMsg = `${v.userPrefix}Parse diese Caption als Rezept:\n\n${JSON.stringify({ caption, source: 'instagram' })}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 4000, system: v.system, messages: [{ role: 'user', content: userMsg }] }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const data = await res.json();
    if (!res.ok) return { ok: false as const, err: data?.error?.message ?? `HTTP ${res.status}`, dur: Date.now() - t0 };
    const text = data.content?.[0]?.text ?? '';
    let parsed: any;
    try { parsed = JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()); }
    catch { const m = text.match(/\{[\s\S]*\}/); if (m) { try { parsed = JSON.parse(m[0]); } catch {} } }
    if (!parsed) return { ok: false as const, err: 'JSON parse', dur: Date.now() - t0 };
    const rez = parsed.rezept ?? parsed;
    return { ok: true as const, rez, score: qualityScore(rez), dur: Date.now() - t0, inTok: data.usage?.input_tokens ?? 0, outTok: data.usage?.output_tokens ?? 0 };
  } catch (e: any) {
    clearTimeout(timer);
    return { ok: false as const, err: e.name === 'AbortError' ? 'timeout' : e.message, dur: Date.now() - t0 };
  }
}
async function parse(v: Variant, caption: string) {
  let r = await parseOnce(v, caption);
  if (!r.ok && (r.err === 'timeout' || r.err?.includes('fetch'))) {
    await new Promise((x) => setTimeout(x, 1500));
    r = await parseOnce(v, caption); // 1 Retry bei Netzfehler
  }
  return r;
}

async function main() {
  console.log('🧪 PROMPT-EVAL — 3 Varianten auf Haiku\n');

  // Referenz-Set: TOP-Quality Insta-Rezepte (viele Zutaten+Schritte = wirklich
  // optimiert) mit voller Caption. Sortiert nach Inhaltsfülle, Top 10.
  const q = `${BASE}/rest/v1/recipes?select=titel,source_caption_raw,zutaten,zubereitung&source=eq.instagram&source_caption_raw=not.is.null&limit=200`;
  const all = await (await fetch(q, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  const refs = all
    .filter((r: any) => r.source_caption_raw?.length > 150)
    .map((r: any) => {
      const gz = (parseMaybe(r.zutaten) || []).length;
      const gs = (parseMaybe(r.zubereitung) || []).join(' ').length;
      return { ...r, goldScore: qualityScore(r), goldZutaten: gz, goldStepChars: gs };
    })
    .filter((r: any) => r.goldZutaten >= 6 && r.goldStepChars > 150) // nur inhaltsreiche
    .sort((a: any, b: any) => b.goldScore - a.goldScore)
    .slice(0, 10);
  console.log(`Referenz-Set: ${refs.length} TOP-Rezepte (Ø ${Math.round(refs.reduce((a: number, b: any) => a + b.goldZutaten, 0) / refs.length)} Zutaten, Gold Ø ${Math.round(refs.reduce((a: number, b: any) => a + b.goldScore, 0) / refs.length)}%)\n`);

  const active = process.env.ONLY ? VARIANTS.filter((v) => process.env.ONLY!.split(',').includes(v.id)) : VARIANTS;
  const summary: any = {};
  for (const v of active) {
    console.log(`\n📊 ${v.id} — ${v.label}`);
    const scores: number[] = [], inToks: number[] = [], recalls: number[] = [], stepRecalls: number[] = [];
    const cov = { dauer: 0, schwierigkeit: 0, tags: 0 }; let n = 0;
    let fails = 0;
    for (const ref of refs) {
      const r = await parse(v, ref.source_caption_raw);
      if (r.ok) {
        scores.push(r.score); inToks.push(r.inTok); n++;
        const pz = (parseMaybe(r.rez.zutaten) || []).length;
        const recall = ref.goldZutaten ? Math.min(pz / ref.goldZutaten, 1) : 1;
        recalls.push(recall);
        const pChars = (parseMaybe(r.rez.zubereitung) || []).join(' ').length;
        const stepRecall = ref.goldStepChars ? Math.min(pChars / ref.goldStepChars, 1) : 1;
        stepRecalls.push(stepRecall);
        // Feld-Abdeckung: ist Dauer / Schwierigkeit / Tags(≥3) gefüllt?
        if (r.rez.zubereitungszeit_min) cov.dauer++;
        if (r.rez.schwierigkeit) cov.schwierigkeit++;
        if (Array.isArray(r.rez.tags) && r.rez.tags.length >= 3) cov.tags++;
        const flag = (recall >= 0.9 && stepRecall >= 0.9) ? '✅' : (recall >= 0.7 && stepRecall >= 0.7) ? '🟡' : '🔴';
        console.log(`  ${flag} ${ref.titel.slice(0, 28).padEnd(28)} Zut:${Math.round(recall * 100)}% Anl:${Math.round(stepRecall * 100)}% Dau:${r.rez.zubereitungszeit_min ? '✓' : '✗'} Schw:${r.rez.schwierigkeit ? '✓' : '✗'} Tags:${(parseMaybe(r.rez.tags) || []).length}`);
      } else { fails++; console.log(`  ❌ ${ref.titel.slice(0, 28).padEnd(28)} ${r.err}`); }
      await new Promise((x) => setTimeout(x, 200));
    }
    const avg = (a: number[]) => a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 100) : 0;
    const pct = (c: number) => n ? Math.round((c / n) * 100) : 0;
    summary[v.id] = {
      label: v.label,
      avgQuality: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      avgRecall: avg(recalls),
      avgStepRecall: avg(stepRecalls),
      covDauer: pct(cov.dauer), covSchwierigkeit: pct(cov.schwierigkeit), covTags: pct(cov.tags),
      avgInputTok: inToks.length ? Math.round(inToks.reduce((a, b) => a + b, 0) / inToks.length) : 0,
      fails,
    };
  }

  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('📊 PROMPT-VERGLEICH\n');
  console.log('Var | Zutaten | Anleit | Dauer | Schwier | Tags | Qual | Input-Tok');
  console.log('────┼─────────┼────────┼───────┼─────────┼──────┼──────┼──────────');
  const v0tok = summary['V0']?.avgInputTok ?? 5376;
  for (const v of active) {
    const s = summary[v.id];
    const saving = v.id === 'V0' ? '' : ` −${Math.round((1 - s.avgInputTok / v0tok) * 100)}%`;
    console.log(`${v.id.padEnd(3)} | ${(s.avgRecall + '%').padEnd(7)} | ${(s.avgStepRecall + '%').padEnd(6)} | ${(s.covDauer + '%').padEnd(5)} | ${(s.covSchwierigkeit + '%').padEnd(7)} | ${(s.covTags + '%').padEnd(4)} | ${(s.avgQuality + '%').padEnd(4)} | ${s.avgInputTok}${saving}`);
  }
  console.log('\n★ Zutaten/Anleitung = Recall vs. Gold (Vollständigkeit). Dauer/Schwier/Tags = % Rezepte mit Feld gefüllt.');
  console.log('★ ALLE 5 müssen zuverlässig kommen — das ist der echte Qualitätstest.\n');

  fs.writeFileSync(path.join(OUTPUT_DIR, 'prompt-eval.json'), JSON.stringify({ timestamp: new Date().toISOString(), summary }, null, 2));
  console.log(`Report: scripts/output/prompt-eval.json`);
}
// nur ausführen, wenn direkt gestartet (nicht beim Import durch groq-prompt-eval)
if (process.argv[1]?.endsWith('/prompt-eval.ts')) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
