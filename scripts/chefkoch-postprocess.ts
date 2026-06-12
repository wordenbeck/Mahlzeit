/**
 * CHEFKOCH-NACHBEARBEITUNG der 46 importierten Rezepte:
 *  1. Schritte feiner — HowToStep-Texte an Satzgrenzen splitten (statt 2 Blöcke → ~10 Schritte)
 *  2. Bilder spiegeln — Chefkoch-CDN → Supabase Storage (Unabhängigkeit + Konsistenz)
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
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';
const DRY = process.env.DRY_RUN === '1';

async function get(url: string): Promise<string> {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 15000);
  try { const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: ctrl.signal }); clearTimeout(t); return await r.text(); }
  catch { clearTimeout(t); return ''; }
}

// VERBESSERT: HowToStep-Text wird jetzt AUCH an Satzgrenzen gesplittet
function parseInstructionsFein(ri: any): string[] {
  if (!ri) return [];
  const out: string[] = [];
  const pushText = (txt: string) => {
    // an Zeilenumbrüchen ODER Satzende+Großbuchstabe splitten
    txt.split(/\n+|(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9])/).forEach((s) => {
      const t = s.trim();
      if (t.length > 8) out.push(t);
    });
  };
  const walk = (n: any) => {
    if (!n) return;
    if (typeof n === 'string') { pushText(n); return; }
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (n['@type'] === 'HowToSection' || n.itemListElement) { walk(n.itemListElement); return; }
    const t = (n.text || n.name || '').trim();
    if (t) pushText(t); // ← Kernfix: HowToStep-Text fein splitten statt als 1 Element
  };
  walk(ri);
  return out;
}

function extractRecipeLD(html: string): any | null {
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  for (const b of blocks) {
    try { const o = JSON.parse(b.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')); const arr = Array.isArray(o) ? o : o['@graph'] || [o]; const rec = arr.find((x: any) => x['@type'] === 'Recipe'); if (rec) return rec; } catch {}
  }
  return null;
}

// Bild von Chefkoch-CDN → Supabase Storage
async function mirrorImage(imageUrl: string): Promise<string | null> {
  try {
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 15000);
    const resp = await fetch(imageUrl, { headers: { 'User-Agent': UA }, signal: ctrl.signal });
    clearTimeout(t);
    if (!resp.ok) return null;
    const ct = resp.headers.get('content-type') || 'image/jpeg';
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
    const bytes = new Uint8Array(await resp.arrayBuffer());
    if (bytes.length > 5 * 1024 * 1024 || bytes.length < 1000) return null;
    const fp = `chefkoch/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const up = await fetch(`${BASE}/storage/v1/object/recipe-images/${fp}`, {
      method: 'POST',
      headers: { apikey: SR, Authorization: `Bearer ${SR}`, 'Content-Type': ct, 'Cache-Control': '31536000' },
      body: bytes,
    });
    if (!up.ok) { console.log('   ⚠️ Upload', up.status, (await up.text()).slice(0, 80)); return null; }
    return `${BASE}/storage/v1/object/public/recipe-images/${fp}`;
  } catch { return null; }
}

async function patch(id: string, upd: any): Promise<boolean> {
  const r = await fetch(`${BASE}/rest/v1/recipes?id=eq.${id}`, {
    method: 'PATCH',
    headers: { apikey: SR, Authorization: `Bearer ${SR}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(upd),
  });
  return r.status === 204 || r.status === 200;
}

async function main() {
  console.log(`🔧 CHEFKOCH-NACHBEARBEITUNG ${DRY ? '(DRY)' : '(schreibt DB)'}\n`);
  const all = await (await fetch(`${BASE}/rest/v1/recipes?select=id,titel,source_url,bild_url,zubereitung&source=eq.chefkoch&limit=100`, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })).json();
  console.log(`${all.length} Chefkoch-Rezepte\n`);

  let stepsImproved = 0, imgMirrored = 0, fail = 0;
  for (const r of all) {
    const html = await get(r.source_url);
    const ld = extractRecipeLD(html);
    const upd: any = {};

    // 1. Schritte feiner
    if (ld) {
      const fein = parseInstructionsFein(ld.recipeInstructions);
      const altLen = (typeof r.zubereitung === 'string' ? JSON.parse(r.zubereitung) : r.zubereitung || []).length;
      if (fein.length > altLen) { upd.zubereitung = fein; stepsImproved++; }
    }
    // 2. Bild spiegeln (nur wenn noch Chefkoch-CDN)
    if (r.bild_url && r.bild_url.includes('chefkoch-cdn')) {
      const mirrored = DRY ? 'DRY' : await mirrorImage(r.bild_url);
      if (mirrored) { if (!DRY) upd.bild_url = mirrored; imgMirrored++; }
      else fail++;
    }

    if (!DRY && Object.keys(upd).length) await patch(r.id, upd);
    const tag = [upd.zubereitung ? `Schritte→${upd.zubereitung.length}` : '', (imgMirrored && r.bild_url?.includes('chefkoch-cdn')) ? 'Bild✓' : ''].filter(Boolean).join(' ');
    if (tag) console.log(`  ${r.titel.slice(0, 40).padEnd(40)} ${tag}`);
    await new Promise((x) => setTimeout(x, 300));
  }

  console.log(`\n═══════════════════════════════════════════════════════`);
  console.log(`✅ Schritte verfeinert: ${stepsImproved}`);
  console.log(`🖼️  Bilder gespiegelt:   ${imgMirrored}`);
  console.log(`❌ Bild-Fehler:         ${fail}`);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'chefkoch-postprocess.json'), JSON.stringify({ stepsImproved, imgMirrored, fail }, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
