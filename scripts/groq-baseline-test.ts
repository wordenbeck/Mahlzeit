/**
 * GROQ BASELINE TEST — über die echte Edge Function (Prod-Pfad)
 *
 * Nutzt manual_caption = source_caption_raw → Groq parsed exakt dieselbe
 * Caption wie die Claude-Modelle. Gleiche qualityScore → 1:1 vergleichbar.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  RECIPE_PARSER_SYSTEM_PROMPT,
  formatRecipeFewShotExamples,
} from '../src/lib/prompts/recipeParserPrompt.ts';

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

async function main() {
  const SAMPLE = Number(process.env.SAMPLE ?? 13);
  console.log('🔬 GROQ BASELINE TEST (Edge Function, Prod-Pfad)\n');

  const url = `${SUPABASE_URL}/rest/v1/recipes?select=*&source=eq.instagram&source_url=not.is.null&limit=500`;
  const all = await (await fetch(url, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  const baseline = all
    .filter((r: any) => r.source_caption_raw && r.source_caption_raw.length > 50)
    .map((r: any) => ({ ...r, dbScore: qualityScore(r) }))
    .filter((r: any) => r.dbScore >= 80)
    .sort((a: any, b: any) => b.dbScore - a.dbScore)
    .slice(0, SAMPLE);

  console.log(`Teste ${baseline.length} Baseline-Rezepte mit Groq (llama-3.3-70b)\n`);

  const sys = RECIPE_PARSER_SYSTEM_PROMPT;
  const few = formatRecipeFewShotExamples();
  const scores: number[] = [];
  const durs: number[] = [];
  let fails = 0;

  for (const r of baseline) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/import-recipe-from-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
        body: JSON.stringify({
          url: r.source_url,
          manual_caption: r.source_caption_raw,
          systemPrompt: sys,
          fewShotExamples: few,
        }),
      });
      const dur = Date.now() - t0;
      const data = await res.json();
      const rezept = data?.result?.rezept;
      if (data.status === 'ok' && rezept) {
        const score = qualityScore(rezept);
        scores.push(score); durs.push(dur);
        const flag = score >= 80 ? '✅' : score >= 60 ? '🟡' : '🔴';
        console.log(`  ${flag} ${r.titel.substring(0, 38).padEnd(38)} DB:${r.dbScore} → Groq:${score} (${dur}ms)`);
      } else {
        fails++;
        console.log(`  ❌ ${r.titel.substring(0, 38).padEnd(38)} ${data.error ?? data.status ?? 'unknown'}`);
      }
    } catch (e: any) {
      fails++;
      console.log(`  ❌ ${r.titel.substring(0, 38).padEnd(38)} ${e.message}`);
    }
    await new Promise((x) => setTimeout(x, Number(process.env.DELAY ?? 500))); // Groq rate-limit-freundlich
  }

  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const avgDur = durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0;
  const min = scores.length ? Math.min(...scores) : 0;
  const max = scores.length ? Math.max(...scores) : 0;

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 GROQ ERGEBNIS\n');
  console.log(`Erfolg:        ${scores.length}/${baseline.length} (${fails} fails)`);
  console.log(`Ø Quality:     ${avg}%  (min ${min}, max ${max})`);
  console.log(`Ø Speed:       ${avgDur}ms`);
  console.log(`Kosten:        $0 (Groq Free)\n`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'groq-baseline-FINAL.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), sample: baseline.length, success: scores.length, fails, avgQuality: avg, minQuality: min, maxQuality: max, avgSpeedMs: avgDur, scores }, null, 2),
  );
  console.log(`Report: ${path.join(OUTPUT_DIR, 'groq-baseline-FINAL.json')}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
