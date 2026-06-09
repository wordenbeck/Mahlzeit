/**
 * import-from-excel.mjs
 *
 * Liest die exportierte Excel-Datei und generiert SQL UPDATE-Statements
 * → Output in scripts/output/recipe-updates.sql
 * → Inhalt in Supabase SQL-Editor einfügen und ausführen
 *
 * Verwendung:
 *   node scripts/import-from-excel.mjs pfad/zur/datei.xlsx
 *
 * Welche Felder werden aktualisiert:
 *   titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit,
 *   kategorie, tags, recipe_type, zutaten, zubereitung
 *
 * Nicht überschrieben: id, workspace_id, created_by, created_at,
 *   source, source_url, source_author, bild_url (Bilder bleiben)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { read, utils } from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Argumente ──────────────────────────────────────────────────────────────
const xlsxPath = process.argv[2];
if (!xlsxPath) {
  console.error('Verwendung: node scripts/import-from-excel.mjs <datei.xlsx>');
  process.exit(1);
}
if (!fs.existsSync(xlsxPath)) {
  console.error(`Datei nicht gefunden: ${xlsxPath}`);
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Zutaten-Text → [{name, menge, einheit, hinweis}] */
function parseZutaten(text) {
  if (!text || !text.trim()) return [];
  return text.split('\n').map(line => {
    line = line.trim();
    if (!line) return null;

    // "n.G. Name (hinweis)" oder "n.G. Name"
    const ngMatch = line.match(/^n\.G\.\s+(.+?)(?:\s+\((.+)\))?$/i);
    if (ngMatch) {
      return { name: ngMatch[1].trim(), menge: null, einheit: null, hinweis: ngMatch[2] ?? null };
    }

    // "200 g Name (hinweis)"  oder  "3 Stk Name"  oder  "0.5 TL Name"
    const numMatch = line.match(/^([\d.,]+)\s+(\S+)\s+(.+?)(?:\s+\((.+)\))?$/);
    if (numMatch) {
      const menge = parseFloat(numMatch[1].replace(',', '.'));
      const einheit = numMatch[2];
      const name = numMatch[3].trim();
      const hinweis = numMatch[4] ?? null;
      // Einheit könnte auch der Name sein wenn kein Einheit-Wort (z.B. "3 Eier")
      return { name, menge, einheit, hinweis };
    }

    // Fallback: nur Name
    return { name: line, menge: null, einheit: null, hinweis: null };
  }).filter(Boolean);
}

/** Zubereitung-Text → ["Schritt 1", "Schritt 2", ...] */
function parseZubereitung(text) {
  if (!text || !text.trim()) return [];
  return text.split('\n')
    .map(line => line.replace(/^\d+\.\s+/, '').trim())
    .filter(Boolean);
}

/** Komma-getrennte Liste → Array, leer → [] */
function parseList(text) {
  if (!text || !text.trim()) return [];
  return text.split(',').map(s => s.trim()).filter(Boolean);
}

/** SQL-String escapen */
function esc(str) {
  if (str == null) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escJson(obj) {
  return esc(JSON.stringify(obj));
}

// ── Excel lesen ────────────────────────────────────────────────────────────
const workbook = read(fs.readFileSync(xlsxPath));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = utils.sheet_to_json(sheet, { defval: '' });

console.log(`📊 ${rows.length} Rezepte geladen aus ${path.basename(xlsxPath)}`);

// ── Validieren ─────────────────────────────────────────────────────────────
const missing = rows.filter(r => !r['ID']);
if (missing.length > 0) {
  console.warn(`⚠️  ${missing.length} Zeile(n) ohne ID — werden übersprungen:`);
  missing.forEach(r => console.warn(`   → "${r['Titel'] || '(kein Titel)'}"`));
}

const valid = rows.filter(r => r['ID']);
console.log(`✅ ${valid.length} Rezepte mit ID → werden als UPDATE generiert\n`);

// ── SQL generieren ─────────────────────────────────────────────────────────
const statements = valid.map(r => {
  const id       = r['ID'];
  const titel    = esc(r['Titel'] || null);
  const beschr   = r['Beschreibung'] ? esc(r['Beschreibung']) : 'NULL';
  const port     = r['Portionen'] ? parseInt(r['Portionen']) || 'NULL' : 'NULL';
  const zeit     = r['Zeit (Min)'] ? parseInt(r['Zeit (Min)']) || 'NULL' : 'NULL';
  const schwier  = r['Schwierigkeit'] ? esc(r['Schwierigkeit'].toLowerCase()) : 'NULL';
  const kategorie = escJson(parseList(r['Kategorie']));
  const tags     = escJson(parseList(r['Tags']));
  const typ      = r['Typ'] ? esc(r['Typ']) : 'NULL';
  const zutaten  = escJson(parseZutaten(r['Zutaten']));
  const zuberei  = escJson(parseZubereitung(r['Zubereitung']));

  return `-- ${r['Titel'] || id}
UPDATE recipes SET
  titel               = ${titel},
  beschreibung        = ${beschr},
  portionen           = ${port},
  zubereitungszeit_min = ${zeit},
  schwierigkeit       = ${schwier},
  kategorie           = ${kategorie}::jsonb,
  tags                = ${tags}::jsonb,
  recipe_type         = ${typ},
  zutaten             = ${zutaten}::jsonb,
  zubereitung         = ${zuberei}::jsonb,
  updated_at          = now()
WHERE id = '${id}';`;
});

// ── Ausgabe ────────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, 'output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const outPath = path.join(outDir, 'recipe-updates.sql');
const sql = [
  '-- Generiert von import-from-excel.mjs',
  `-- Quelle: ${path.basename(xlsxPath)}`,
  `-- Datum: ${new Date().toLocaleString('de')}`,
  `-- ${valid.length} Rezepte`,
  '',
  ...statements,
  '',
  `SELECT COUNT(*) AS aktualisiert FROM recipes WHERE updated_at > now() - interval '1 minute';`,
].join('\n\n');

fs.writeFileSync(outPath, sql, 'utf8');

console.log(`📄 SQL geschrieben nach:\n   ${outPath}`);
console.log('\nNächste Schritte:');
console.log('  1. Datei öffnen und kurz prüfen');
console.log('  2. Inhalt kopieren');
console.log('  3. Supabase → SQL-Editor → einfügen → Run');
console.log('  4. Letzter SELECT zeigt wie viele Rezepte aktualisiert wurden\n');
