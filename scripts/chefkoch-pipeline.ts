/**
 * CHEFKOCH-PIPELINE — gratis, kein LLM (JSON-LD direkt).
 *
 * Multi-Query nach Gewichtung → JSON-LD parsen → Quality-Gate (Rating≥4.0,
 * vollständig) → Dedupe (gegen DB + untereinander) → direkt INSERT via Service-Role.
 *
 * Gewichtung (~50): Fitness 40% / Kalorienarm 20% / Vegetarisch 15% / Schnell 15%.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const cfg: Record<string, string> = {};
env.split('\n').forEach((l) => { const i = l.indexOf('='); if (i > 0) cfg[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
const BASE = cfg.VITE_SUPABASE_URL, ANON = cfg.VITE_SUPABASE_ANON_KEY, SR = cfg.SUPABASE_SERVICE_ROLE_KEY;
const OUTPUT_DIR = path.join(__dirname, 'output');
const CREATED_BY = 'a4e6d906-309b-42b4-924a-fa1c9472cd70';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';
const DRY = process.env.DRY_RUN === '1';

// Themen mit Zielzahl + Suchbegriffen (nach Bewertung sortiert: o3)
const THEMES = [
  { name: 'Fitness', ziel: 20, queries: ['high+protein', 'proteinreich+fitness'], veg: false },
  { name: 'Kalorienarm', ziel: 10, queries: ['kalorienarm+gesund', 'low+carb'], veg: false },
  { name: 'Vegetarisch', ziel: 8, queries: ['vegetarisch+high+protein', 'vegetarisch+gesund'], veg: true },
  { name: 'Schnell', ziel: 8, queries: ['schnell+einfach+gesund', '30+minuten'], veg: false },
];

// Fleisch/Fisch-Indikatoren → fürs Vegetarisch-Theme ausschließen
const FLEISCH = ['hack', 'fleisch', 'hähnchen', 'hühn', 'rind', 'schwein', 'pute', 'wurst', 'speck', 'schinken', 'salami', 'bacon', 'lachs', 'thunfisch', 'fisch', 'garnel', 'shrimp', 'krabbe', 'ente', 'lamm', 'kalb', 'gulasch', 'döner', 'gyros', 'chicken'];
function istVegetarisch(zutaten: any[]): boolean {
  const txt = zutaten.map((z) => (z.name || '').toLowerCase()).join(' ');
  return !FLEISCH.some((f) => txt.includes(f));
}

async function get(url: string): Promise<string> {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 15000);
  try { const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'de-DE,de;q=0.9' }, signal: ctrl.signal }); clearTimeout(t); return await r.text(); }
  catch { clearTimeout(t); return ''; }
}

function isoToMin(iso?: string): number | null {
  if (!iso) return null; const h = iso.match(/(\d+)H/); const m = iso.match(/(\d+)M/);
  return ((h ? +h[1] * 60 : 0) + (m ? +m[1] : 0)) || null;
}
const EINHEITEN = ['g', 'kg', 'ml', 'l', 'EL', 'TL', 'Prise', 'Prisen', 'Stück', 'Dose', 'Dosen', 'Packung', 'Bund', 'Zehe', 'Zehen', 'Scheibe', 'Scheiben', 'Tasse', 'Tassen', 'Handvoll'];
function parseIngredient(s: string) {
  const clean = s.replace(/\s+/g, ' ').trim();
  const m = clean.match(/^([\d.,/]+)?\s*([A-Za-zÄÖÜäöüß]+)?\s*(.*)$/);
  if (!m) return { name: clean, menge: null, einheit: 'nach Geschmack', hinweis: null };
  let [, mengeStr, maybeUnit, rest] = m; let menge: number | null = null;
  if (mengeStr) { if (mengeStr.includes('/')) { const [a, b] = mengeStr.split('/').map(Number); menge = b ? a / b : null; } else menge = parseFloat(mengeStr.replace(',', '.')); }
  let einheit = 'Stück', name = rest;
  if (maybeUnit && EINHEITEN.some((e) => e.toLowerCase() === maybeUnit.toLowerCase())) einheit = maybeUnit;
  else if (maybeUnit) { name = (maybeUnit + ' ' + rest).trim(); einheit = menge ? 'Stück' : 'nach Geschmack'; }
  if (!name) name = clean;
  return { name: name.trim(), menge, einheit, hinweis: null };
}
function parseInstructions(ri: any): string[] {
  if (!ri) return []; const out: string[] = [];
  const walk = (n: any) => {
    if (!n) return;
    if (typeof n === 'string') { n.split(/\n+|(?<=\.)\s+(?=[A-ZÄÖÜ])/).forEach((s) => { const t = s.trim(); if (t.length > 5) out.push(t); }); return; }
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (n['@type'] === 'HowToSection' || n.itemListElement) { walk(n.itemListElement); return; }
    const t = (n.text || n.name || '').trim(); if (t.length > 5) out.push(t);
  };
  walk(ri); return out;
}
function extractDifficulty(html: string): string | null {
  const m = html.match(/ds-recipe-info__text">\s*(simpel|normal|pfiffig)\s*</i);
  return m ? ({ simpel: 'einfach', normal: 'mittel', pfiffig: 'aufwendig' } as any)[m[1].toLowerCase()] : null;
}
function extractRecipeLD(html: string): any | null {
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  for (const b of blocks) {
    try { const o = JSON.parse(b.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')); const arr = Array.isArray(o) ? o : o['@graph'] || [o]; const rec = arr.find((x: any) => x['@type'] === 'Recipe'); if (rec) return rec; } catch {}
  }
  return null;
}
// Mahlzeit-Kategorie aus Chefkoch recipeCategory + keywords ableiten
function mapKategorie(ld: any): string[] {
  const txt = `${ld.recipeCategory || ''} ${ld.keywords || ''}`.toLowerCase();
  if (/dessert|kuchen|süß|backen|torte/.test(txt)) return ['dessert'];
  if (/frühstück|breakfast|oats|porridge/.test(txt)) return ['fruehstueck'];
  if (/snack|fingerfood|aufstrich/.test(txt)) return ['snack'];
  if (/getränk|smoothie|shake|drink/.test(txt)) return ['getraenk'];
  if (/beilage|dip|soße|sauce/.test(txt)) return ['beilage'];
  if (/salat/.test(txt)) return ['mittag', 'abendessen'];
  return ['mittag', 'abendessen'];
}

async function dbSourceUrls(): Promise<Set<string>> {
  const r = await (await fetch(`${BASE}/rest/v1/recipes?select=source_url&source_url=not.is.null&limit=500`, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  return new Set(r.map((x: any) => x.source_url));
}

async function harvestLinks(query: string, want: number): Promise<string[]> {
  const links: string[] = [];
  for (const offset of [0, 30, 60]) { // bis zu 3 Seiten (nach Bewertung o3)
    if (links.length >= want * 2) break;
    const html = await get(`https://www.chefkoch.de/rs/s${offset}o3/${query}/Rezepte.html`);
    const found = [...new Set((html.match(/https:\/\/www\.chefkoch\.de\/rezepte\/\d+\/[a-z0-9-]+\.html/gi) || []))];
    links.push(...found);
    await new Promise((x) => setTimeout(x, 400));
  }
  return [...new Set(links)];
}

async function buildRecipe(link: string): Promise<any | null> {
  const html = await get(link);
  const ld = extractRecipeLD(html);
  if (!ld) return null;
  const rating = ld.aggregateRating ? parseFloat(ld.aggregateRating.ratingValue) : 0;
  const ratingCount = ld.aggregateRating ? parseInt(ld.aggregateRating.ratingCount) : 0;
  const zutaten = (ld.recipeIngredient || []).map(parseIngredient);
  const zubereitung = parseInstructions(ld.recipeInstructions);
  // Quality-Gate
  if (rating < 4.0 || ratingCount < 5 || zutaten.length < 3 || zubereitung.length === 0) return null;
  const nameRaw = (ld.name || '').trim();
  const autorMatch = nameRaw.match(/ von (.+)$/);
  return {
    rating, ratingCount,
    row: {
      workspace_id: null,
      created_by: CREATED_BY,
      source: 'chefkoch',
      source_url: link,
      source_author: autorMatch ? autorMatch[1] : null,
      source_caption_raw: null,
      titel: nameRaw.replace(/ von .*$/, '').trim(),
      beschreibung: ld.description || null,
      portionen: ld.recipeYield ? parseInt(String(ld.recipeYield)) || 2 : 2,
      zubereitungszeit_min: isoToMin(ld.totalTime || ld.cookTime || ld.prepTime),
      schwierigkeit: extractDifficulty(html) || 'mittel',
      kategorie: mapKategorie(ld),
      zutaten,
      zubereitung,
      tags: ld.keywords ? String(ld.keywords).split(',').map((k: string) => k.trim()).filter(Boolean).slice(0, 8) : [],
      bild_url: Array.isArray(ld.image) ? ld.image[0] : ld.image || null,
      is_favorite: false,
      ai_confidence: 'high',
      recipe_type: 'hauptgericht',
      is_shared: true,
    },
  };
}

async function insertBatch(rows: any[]): Promise<number> {
  const res = await fetch(`${BASE}/rest/v1/recipes`, {
    method: 'POST',
    headers: { apikey: SR, Authorization: `Bearer ${SR}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(rows),
  });
  if (res.status === 201 || res.status === 200 || res.status === 204) return rows.length;
  console.log('   ⚠️ Insert-Fehler:', res.status, (await res.text()).slice(0, 200));
  return 0;
}

async function main() {
  console.log(`🍳 CHEFKOCH-PIPELINE ${DRY ? '(DRY-RUN)' : '(SCHREIBT IN DB)'}\n`);
  const seen = await dbSourceUrls();
  console.log(`DB hat ${seen.size} bekannte URLs (Dedupe-Basis)\n`);

  const collected: any[] = [];
  for (const theme of THEMES) {
    console.log(`\n📦 ${theme.name} (Ziel ${theme.ziel})`);
    const themeRecipes: any[] = [];
    for (const q of theme.queries) {
      if (themeRecipes.length >= theme.ziel) break;
      const links = (await harvestLinks(q, theme.ziel)).filter((l) => !seen.has(l));
      for (const link of links) {
        if (themeRecipes.length >= theme.ziel) break;
        if (seen.has(link)) continue;
        const rec = await buildRecipe(link);
        await new Promise((x) => setTimeout(x, 300));
        if (!rec) continue;
        if (theme.veg && !istVegetarisch(rec.row.zutaten)) { seen.add(link); continue; } // Fleisch raus aus Veg-Theme
        seen.add(link);
        themeRecipes.push(rec);
        console.log(`  ✅ ${rec.rating}★ ${rec.row.titel.slice(0, 42)} (${rec.row.zutaten.length} Zut, ${rec.row.zubereitung.length} Schr)`);
      }
    }
    collected.push(...themeRecipes.map((r) => ({ ...r, theme: theme.name })));
  }

  console.log(`\n═══════════════════════════════════════════════════════`);
  console.log(`📊 ${collected.length} Rezepte gesammelt (Quality-Gate bestanden)\n`);
  const byTheme: Record<string, number> = {};
  collected.forEach((r) => { byTheme[r.theme] = (byTheme[r.theme] || 0) + 1; });
  console.log('Verteilung:', JSON.stringify(byTheme));

  let inserted = 0;
  if (!DRY && collected.length) {
    console.log('\n💾 Insert in DB...');
    inserted = await insertBatch(collected.map((r) => r.row));
    console.log(`   ✅ ${inserted} eingefügt`);
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'chefkoch-pipeline.json'), JSON.stringify({ dryRun: DRY, collected: collected.length, byTheme, inserted, titles: collected.map((r) => r.row.titel) }, null, 2));
  console.log(`\nReport: scripts/output/chefkoch-pipeline.json`);
  if (DRY) console.log('→ Für echten Insert: DRY_RUN weglassen');
}
main().catch((e) => { console.error(e); process.exit(1); });
