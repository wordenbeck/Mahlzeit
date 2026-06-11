/**
 * Treiber für refresh-recipe-image: schickt die 55 Rezepte mit toten
 * Insta-CDN-Bildern in Batches an die Edge Function (Storage-Spiegelung).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const cfg: Record<string, string> = {};
env.split('\n').forEach((l) => { const [k, ...v] = l.split('='); if (k && v.length) cfg[k.trim()] = v.join('=').trim(); });
const SUPABASE_URL = cfg.VITE_SUPABASE_URL;
const ANON = cfg.VITE_SUPABASE_ANON_KEY;

async function main() {
  // IDs der 55 aus dem Block-2-Report (die mit altem Import / toten Bildern)
  const rep = JSON.parse(fs.readFileSync(path.join(__dirname, 'output/block2-match-report.json'), 'utf8'));
  const ids: string[] = rep.matches.map((m: any) => m.id);
  console.log(`🖼️  Bild-Reparatur für ${ids.length} Rezepte\n`);

  const BATCH = 10;
  let ok = 0, fail = 0;
  const failed: any[] = [];

  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH);
    process.stdout.write(`  Batch ${i / BATCH + 1} (${batch.length} IDs)... `);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/refresh-recipe-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: `Bearer ${ANON}` },
        body: JSON.stringify({ recipe_ids: batch }),
      });
      const data = await res.json();
      if (data.results) {
        const bOk = data.results.filter((r: any) => r.status === 'ok').length;
        ok += bOk; fail += batch.length - bOk;
        data.results.filter((r: any) => r.status !== 'ok').forEach((r: any) => failed.push(r));
        console.log(`✅ ${bOk}/${batch.length} gespiegelt`);
      } else {
        fail += batch.length;
        console.log(`❌ ${data.error ?? 'unbekannt'}`);
      }
    } catch (e: any) {
      fail += batch.length;
      console.log(`❌ ${e.message}`);
    }
    await new Promise((x) => setTimeout(x, 1000));
  }

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`✅ Repariert: ${ok}/${ids.length}`);
  console.log(`❌ Fehlgeschlagen: ${fail}`);
  if (failed.length) {
    console.log(`\nFehler-Details:`);
    failed.slice(0, 15).forEach((f) => console.log(`  ${f.status}: ${f.id} ${f.error ?? ''}`));
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
