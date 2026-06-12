/**
 * Chefkoch-Prototyp: 10 high-protein Rezepte via JSON-LD (kein LLM, gratis).
 *
 * Proof: zeigt Struktur-Qualität von Chefkoch-Rezepten. Noch KEIN DB-Insert.
 * Nur gut bewertete Rezepte (rating >= 4) — "top Rezepte".
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'output');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

async function get(url: string): Promise<string> {
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' } });
  return r.text();
}

// ISO-8601 Duration (PT30M, P0DT0H30M) → Minuten
function isoToMin(iso?: string): number | null {
  if (!iso) return null;
  const h = iso.match(/(\d+)H/); const m = iso.match(/(\d+)M/);
  const min = (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
  return min || null;
}

// "200 g Mehl" / "1 EL Olivenöl" / "etwas Salz" → {menge, einheit, name}
const EINHEITEN = ['g', 'kg', 'ml', 'l', 'EL', 'TL', 'Prise', 'Prisen', 'Stück', 'Dose', 'Dosen', 'Packung', 'Bund', 'Zehe', 'Zehen', 'Scheibe', 'Scheiben', 'Tasse', 'Tassen', 'Handvoll'];
function parseIngredient(s: string) {
  const clean = s.replace(/\s+/g, ' ').trim();
  const m = clean.match(/^([\d.,/]+)?\s*([A-Za-zÄÖÜäöüß]+)?\s*(.*)$/);
  if (!m) return { name: clean, menge: null as number | null, einheit: 'nach Geschmack', hinweis: null };
  let [, mengeStr, maybeUnit, rest] = m;
  let menge: number | null = null;
  if (mengeStr) {
    if (mengeStr.includes('/')) { const [a, b] = mengeStr.split('/').map(Number); menge = b ? a / b : null; }
    else menge = parseFloat(mengeStr.replace(',', '.'));
  }
  let einheit = 'Stück';
  let name = rest;
  if (maybeUnit && EINHEITEN.some((e) => e.toLowerCase() === maybeUnit.toLowerCase())) {
    einheit = maybeUnit;
  } else if (maybeUnit) {
    name = (maybeUnit + ' ' + rest).trim();
    einheit = menge ? 'Stück' : 'nach Geschmack';
  }
  if (!name) name = clean;
  return { name: name.trim(), menge, einheit, hinweis: null };
}

function parseInstructions(ri: any): string[] {
  if (!ri) return [];
  const out: string[] = [];
  const walk = (node: any) => {
    if (!node) return;
    if (typeof node === 'string') {
      // langer Freitext → an Zeilenumbrüchen / Satzenden splitten
      node.split(/\n+|(?<=\.)\s+(?=[A-ZÄÖÜ])/).forEach((s) => {
        const t = s.trim();
        if (t.length > 5) out.push(t);
      });
      return;
    }
    if (Array.isArray(node)) { node.forEach(walk); return; }
    // HowToSection (Chefkoch) → Schritte liegen in itemListElement
    if (node['@type'] === 'HowToSection' || node.itemListElement) { walk(node.itemListElement); return; }
    // HowToStep → text (fallback name)
    const t = (node.text || node.name || '').trim();
    if (t.length > 5) out.push(t);
  };
  walk(ri);
  return out;
}

function parseMaybe(v: any) { return Array.isArray(v) ? v : null; }
function qualityScore(r: any): number {
  let s = 0;
  if (r.titel) s += 15; if (r.beschreibung) s += 10; if (r.portionen) s += 5;
  if (r.zubereitungszeit_min) s += 5; if (r.schwierigkeit) s += 5;
  if (Array.isArray(r.kategorie) && r.kategorie.length) s += 10;
  if (Array.isArray(r.tags) && r.tags.length) s += 5;
  const z = parseMaybe(r.zutaten);
  if (z && z.length) s += (z.filter((x: any) => x?.name && x?.einheit).length / z.length) * 20;
  // Zubereitung nach SUBSTANZ (Gesamt-Textlänge), nicht nach Schritt-Anzahl —
  // bestraft nicht Quellen mit wenigen, dafür langen Schritten (z.B. Chefkoch).
  const zb = parseMaybe(r.zubereitung);
  if (zb && zb.length) {
    const chars = zb.join(' ').length;
    s += chars > 200 ? 25 : chars > 80 ? 18 : chars > 30 ? 10 : 5;
  }
  return Math.min(100, Math.round(s));
}

// Chefkoch-Schwierigkeit aus HTML (simpel/normal/pfiffig) → unser Schema
function extractDifficulty(html: string): string | null {
  const m = html.match(/ds-recipe-info__text">\s*(simpel|normal|pfiffig)\s*</i);
  if (!m) return null;
  return { simpel: 'einfach', normal: 'mittel', pfiffig: 'aufwendig' }[m[1].toLowerCase()] || null;
}

function extractRecipeLD(html: string): any | null {
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  for (const b of blocks) {
    const json = b.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    try {
      const o = JSON.parse(json);
      const arr = Array.isArray(o) ? o : o['@graph'] ? o['@graph'] : [o];
      const rec = arr.find((x: any) => x['@type'] === 'Recipe');
      if (rec) return rec;
    } catch { /* skip */ }
  }
  return null;
}

async function main() {
  const SEARCH = process.env.QUERY || 'high+protein';
  console.log(`🍳 Chefkoch-Prototyp — Suche: "${SEARCH.replace(/\+/g, ' ')}"\n`);

  const searchHtml = await get(`https://www.chefkoch.de/rs/s0o3/${SEARCH}/Rezepte.html`); // o3 = nach Bewertung sortiert
  const links = [...new Set((searchHtml.match(/https:\/\/www\.chefkoch\.de\/rezepte\/\d+\/[a-z0-9-]+\.html/gi) || []))];
  console.log(`Gefundene Rezept-Links: ${links.length}\n`);

  const results: any[] = [];
  for (const link of links) {
    if (results.length >= 10) break;
    try {
      const html = await get(link);
      const ld = extractRecipeLD(html);
      if (!ld) continue;

      const rating = ld.aggregateRating ? parseFloat(ld.aggregateRating.ratingValue) : 0;
      const ratingCount = ld.aggregateRating ? parseInt(ld.aggregateRating.ratingCount) : 0;
      // Filter: nur top-bewertete (>=4.0, mind. 5 Bewertungen)
      if (rating < 4.0 || ratingCount < 5) continue;

      const zutaten = (ld.recipeIngredient || []).map(parseIngredient);
      const zubereitung = parseInstructions(ld.recipeInstructions);
      const recipe = {
        titel: (ld.name || '').replace(/ von .*$/, '').trim(), // "X von User" → "X"
        beschreibung: ld.description || null,
        portionen: ld.recipeYield ? parseInt(String(ld.recipeYield)) || null : null,
        zubereitungszeit_min: isoToMin(ld.totalTime || ld.cookTime || ld.prepTime),
        schwierigkeit: extractDifficulty(html),
        kategorie: ld.recipeCategory ? [String(ld.recipeCategory).toLowerCase()] : [],
        tags: ld.keywords ? String(ld.keywords).split(',').map((k: string) => k.trim()).filter(Boolean).slice(0, 8) : [],
        zutaten,
        zubereitung,
        bild_url: Array.isArray(ld.image) ? ld.image[0] : ld.image || null,
        source_url: link,
        rating, ratingCount,
        nutrition: ld.nutrition || null,
      };
      results.push({ ...recipe, qualityScore: qualityScore(recipe) });
    } catch { /* skip */ }
    await new Promise((x) => setTimeout(x, 300));
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📊 ${results.length} TOP-bewertete Rezepte (Rating ≥4.0)\n`);
  console.log('Qual | ⭐Rating  | Zut | Schr | Titel');
  console.log('─────┼──────────┼─────┼──────┼──────');
  results.forEach((r) => {
    console.log(`${String(r.qualityScore).padEnd(4)} | ${(r.rating + ' (' + r.ratingCount + ')').padEnd(8)} | ${String(r.zutaten.length).padEnd(3)} | ${String(r.zubereitung.length).padEnd(4)} | ${r.titel.substring(0, 40)}`);
  });

  const avgQ = Math.round(results.reduce((a, b) => a + b.qualityScore, 0) / results.length);
  console.log(`\nØ Quality: ${avgQ}%  | mit Nutrition: ${results.filter((r) => r.nutrition).length}/${results.length} | mit Bild: ${results.filter((r) => r.bild_url).length}/${results.length}`);

  // Detail-Beispiel
  const ex = results[0];
  console.log(`\n─── Beispiel: ${ex.titel} ───`);
  console.log(`Portionen: ${ex.portionen} | Zeit: ${ex.zubereitungszeit_min}min | Rating: ${ex.rating}`);
  console.log(`Zutaten (erste 5):`);
  ex.zutaten.slice(0, 5).forEach((z: any) => console.log(`  - ${z.menge ?? ''} ${z.einheit} ${z.name}`));
  console.log(`Schritte (erste 2):`);
  ex.zubereitung.slice(0, 2).forEach((s: string, i: number) => console.log(`  ${i + 1}. ${s.substring(0, 70)}...`));

  fs.writeFileSync(path.join(OUTPUT_DIR, 'chefkoch-prototype.json'), JSON.stringify(results, null, 2));
  console.log(`\n📋 Report: scripts/output/chefkoch-prototype.json (volle Daten)`);
}
main().catch((e) => { console.error(e); process.exit(1); });
