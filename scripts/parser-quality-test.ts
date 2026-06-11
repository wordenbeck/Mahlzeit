/**
 * PARSER QUALITY TEST — sauber, 1:1 wie die App
 *
 * Behebt die zwei Bugs der vorherigen Versuche:
 *   1. KEIN .substring() auf die Caption (zerschneidet Emojis → lone surrogate)
 *   2. KEIN manuelles String-Escaping (JSON.stringify macht das korrekt)
 *
 * Methode exakt wie supabase/functions/import-recipe-from-url/index.ts:
 *   - volle source_caption_raw als Objekt-Wert
 *   - JSON.stringify() für den ganzen Request-Body
 *   - echter System-Prompt + Few-Shots aus src/lib/prompts/
 *
 * Vergleicht Modelle auf den 13 TOP-Quality Baseline-Rezepten.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  RECIPE_PARSER_SYSTEM_PROMPT,
  formatRecipeFewShotExamples,
} from '../src/lib/prompts/recipeParserPrompt.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- env laden -----------------------------------------------------------
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const cfg: Record<string, string> = {};
env.split('\n').forEach((line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) cfg[k.trim()] = v.join('=').trim();
});

const SUPABASE_URL = cfg.VITE_SUPABASE_URL;
const ANON_KEY = cfg.VITE_SUPABASE_ANON_KEY;
const ANTHROPIC_KEY = cfg.ANTHROPIC_API_KEY;
const GROQ_KEY = cfg.GROQ_API_KEY; // evtl. leer
const OUTPUT_DIR = path.join(__dirname, 'output');

// ---- Quality-Scoring (gleich für DB-Version und Parser-Output) ----------
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

function parseMaybe(v: any): any {
  if (!v) return null;
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return null; }
  }
  return v;
}

// ---- DB fetch ------------------------------------------------------------
async function fetchBaseline(): Promise<any[]> {
  const url = `${SUPABASE_URL}/rest/v1/recipes?select=*&source=eq.instagram&source_url=not.is.null&limit=500`;
  const res = await fetch(url, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  const all = await res.json();
  // nur die mit voller Caption + TOP-Quality (so wie Groq sie damals geschafft hat)
  return all
    .filter((r: any) => r.source_caption_raw && r.source_caption_raw.length > 50)
    .map((r: any) => ({ ...r, dbScore: qualityScore(r) }))
    .filter((r: any) => r.dbScore >= 80)
    .sort((a: any, b: any) => b.dbScore - a.dbScore);
}

// ---- Parser-Aufruf: EXAKT wie die Edge Function -------------------------
const SYSTEM_PROMPT = RECIPE_PARSER_SYSTEM_PROMPT;
const FEW_SHOTS = formatRecipeFewShotExamples();

function buildUserMessage(caption: string, sourceUrl: string, author: string | null): string {
  // 1:1 wie callGroqRecipeParser in der Edge Function
  return `${FEW_SHOTS}

# AKTUELLE AUFGABE
INPUT:
\`\`\`json
${JSON.stringify(
    { caption, source: 'instagram', source_url: sourceUrl, source_author: author },
    null,
    2,
  )}
\`\`\`

Antworte nur mit dem JSON-Output gemäß Schema.`;
}

// Claude (Anthropic Messages API)
async function parseWithClaude(model: string, caption: string, sourceUrl: string, author: string | null) {
  const t0 = Date.now();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    // JSON.stringify encodiert die volle Caption korrekt — kein substring, kein escape
    // temperature weggelassen: Opus 4.8 deprecated custom temperature
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserMessage(caption, sourceUrl, author) }],
    }),
  });
  const dur = Date.now() - t0;
  const data = await res.json();
  if (!res.ok) return { ok: false as const, err: data?.error?.message ?? `HTTP ${res.status}`, dur };

  const text = data.content?.[0]?.text ?? '';
  const parsed = extractJson(text);
  if (!parsed) return { ok: false as const, err: 'JSON parse', dur };
  const rezept = parsed.rezept ?? parsed;
  return {
    ok: true as const,
    dur,
    score: rezept && (parsed.status === 'ok' || rezept.titel) ? qualityScore(rezept) : 0,
    status: parsed.status ?? (rezept?.titel ? 'ok' : 'unknown'),
    inTok: data.usage?.input_tokens ?? 0,
    outTok: data.usage?.output_tokens ?? 0,
  };
}

// Groq (OpenAI-kompatibel) — nur wenn Key vorhanden
async function parseWithGroq(caption: string, sourceUrl: string, author: string | null) {
  const t0 = Date.now();
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserMessage(caption, sourceUrl, author) },
      ],
    }),
  });
  const dur = Date.now() - t0;
  const data = await res.json();
  if (!res.ok) return { ok: false as const, err: data?.error?.message ?? `HTTP ${res.status}`, dur };
  const text = data.choices?.[0]?.message?.content ?? '';
  const parsed = extractJson(text);
  if (!parsed) return { ok: false as const, err: 'JSON parse', dur };
  const rezept = parsed.rezept ?? parsed;
  return {
    ok: true as const,
    dur,
    score: rezept && (parsed.status === 'ok' || rezept.titel) ? qualityScore(rezept) : 0,
    status: parsed.status ?? (rezept?.titel ? 'ok' : 'unknown'),
    inTok: data.usage?.prompt_tokens ?? 0,
    outTok: data.usage?.completion_tokens ?? 0,
  };
}

function extractJson(text: string): any {
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

// ---- Pricing -------------------------------------------------------------
const PRICING: Record<string, { in: number; out: number; label: string }> = {
  'groq': { in: 0, out: 0, label: 'Groq llama-3.3' },
  'claude-haiku-4-5': { in: 0.8e-6, out: 4e-6, label: 'Haiku 4.5' },
  'claude-sonnet-4-6': { in: 3e-6, out: 15e-6, label: 'Sonnet 4.6' },
  'claude-opus-4-8': { in: 15e-6, out: 45e-6, label: 'Opus 4.8' },
};

// ---- Main ----------------------------------------------------------------
async function main() {
  const SAMPLE = Number(process.env.SAMPLE ?? 8);
  console.log('🔬 PARSER QUALITY TEST (saubere Methode, volle Caption)\n');

  const baseline = await fetchBaseline();
  console.log(`Baseline: ${baseline.length} TOP-Quality Instagram-Rezepte mit Caption`);
  const sample = baseline.slice(0, SAMPLE);
  console.log(`Teste ${sample.length} davon\n`);

  const models = ['claude-haiku-4-5', 'claude-sonnet-4-6', 'claude-opus-4-8'];
  if (GROQ_KEY) models.unshift('groq');
  else console.log('⚠️  Kein GROQ_API_KEY in .env.local — Groq wird übersprungen\n');

  const summary: Record<string, any> = {};

  for (const model of models) {
    const label = PRICING[model].label;
    process.stdout.write(`\n📊 ${label}\n`);
    const scores: number[] = [];
    const durs: number[] = [];
    let inTok = 0, outTok = 0, fails = 0;

    for (let i = 0; i < sample.length; i++) {
      const r = sample[i];
      const res = model === 'groq'
        ? await parseWithGroq(r.source_caption_raw, r.source_url, r.source_author)
        : await parseWithClaude(model, r.source_caption_raw, r.source_url, r.source_author);

      if (res.ok) {
        scores.push(res.score);
        durs.push(res.dur);
        inTok += res.inTok; outTok += res.outTok;
        const flag = res.score >= 80 ? '✅' : res.score >= 60 ? '🟡' : '🔴';
        console.log(`  ${flag} ${r.titel.substring(0, 38).padEnd(38)} DB:${r.dbScore} → Parse:${res.score} (${res.dur}ms)`);
      } else {
        fails++;
        console.log(`  ❌ ${r.titel.substring(0, 38).padEnd(38)} ${res.err}`);
      }
      await new Promise((x) => setTimeout(x, 250));
    }

    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const avgDur = durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0;
    const cost = inTok * PRICING[model].in + outTok * PRICING[model].out;
    const costPer100 = scores.length ? (cost / scores.length) * 100 : 0;

    summary[model] = {
      label, avgQuality: avg, avgSpeedMs: avgDur,
      success: scores.length, fails,
      costPer100Recipes: `$${costPer100.toFixed(3)}`,
    };
  }

  // ---- Tabelle ----
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 ERGEBNIS\n');
  console.log('Modell          | Quality | Speed   | Erfolg | Kosten/100');
  console.log('────────────────┼─────────┼─────────┼────────┼───────────');
  for (const m of models) {
    const s = summary[m];
    console.log(
      `${s.label.padEnd(15)} | ${(s.avgQuality + '%').padEnd(7)} | ${(s.avgSpeedMs + 'ms').padEnd(7)} | ${(s.success + '/' + sample.length).padEnd(6)} | ${s.costPer100Recipes}`,
    );
  }
  console.log('\n(Baseline-DB-Score liegt bei 80+ — Parser sollte das treffen)\n');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'parser-quality-FINAL.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), sampleSize: sample.length, summary }, null, 2),
  );
  console.log(`Report: ${path.join(OUTPUT_DIR, 'parser-quality-FINAL.json')}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
