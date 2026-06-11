/**
 * clean-recipes.mjs
 *
 * Lädt Rezepte aus Supabase, bereinigt sie per Groq LLM und
 * schreibt das Ergebnis als Excel zur Review.
 *
 * Verwendung:
 *   GROQ_API_KEY=gsk_xxx node scripts/clean-recipes.mjs [--limit 10] [--all]
 *
 * Flags:
 *   --limit 10   Nur N Rezepte verarbeiten (default: 10)
 *   --all        Alle Rezepte verarbeiten
 *   --offset 10  Starte ab Rezept N (für Batch-Verarbeitung)
 */

import { writeFile } from 'fs/promises';
import { utils, write } from 'xlsx';

const SUPABASE_URL = 'https://oaaxmpbnpntimzbieifv.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hYXhtcGJucG50aW16YmllaWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTczOTAsImV4cCI6MjA5MzgzMzM5MH0.9B0jK1X7tSubdRpLeI0oaLZhDJyUanQ-9MeOWpq2bo0';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

if (!GROQ_API_KEY) {
  console.error('❌  GROQ_API_KEY fehlt. Ausführen mit:\n   GROQ_API_KEY=gsk_xxx node scripts/clean-recipes.mjs');
  process.exit(1);
}

const args = process.argv.slice(2);
const all = args.includes('--all');
const limitIdx = args.indexOf('--limit');
const offsetIdx = args.indexOf('--offset');
const LIMIT = all ? 9999 : (limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 10);
const OFFSET = offsetIdx >= 0 ? parseInt(args[offsetIdx + 1]) : 0;

// ── Supabase: alle Rezepte laden ──────────────────────────────────────────

async function fetchRecipes() {
  const url = `${SUPABASE_URL}/rest/v1/recipes?select=id,titel,beschreibung,portionen,zubereitungszeit_min,schwierigkeit,kategorie,tags,recipe_type,zutaten,zubereitung,source,source_url&order=created_at.asc&limit=500`;
  const res = await fetch(url, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase Fehler: ${res.status} ${await res.text()}`);
  return res.json();
}

// ── Duplikate prüfen ──────────────────────────────────────────────────────

function findDuplicates(recipes) {
  const seen = new Map();
  const dupes = [];
  for (const r of recipes) {
    const titleKey = r.titel?.toLowerCase().trim().replace(/\s+/g, ' ') ?? '';
    if (seen.has(titleKey)) {
      dupes.push({ id: r.id, titel: r.titel, duplicateOf: seen.get(titleKey) });
    } else {
      seen.set(titleKey, r.id);
    }
    // Source-URL Duplikat
    if (r.source_url) {
      const urlKey = `url::${r.source_url}`;
      if (seen.has(urlKey)) {
        dupes.push({ id: r.id, titel: r.titel, duplicateOf: seen.get(urlKey), reason: 'same source_url' });
      } else {
        seen.set(urlKey, r.id);
      }
    }
  }
  return dupes;
}

// ── Groq LLM-Cleaning ─────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Du bist ein Rezept-Daten-Bereiniger für eine deutsche Familien-Koch-App.
Deine Aufgabe: Rezeptdaten bereinigen und verbessern.

REGELN:
1. TITEL: Kurz (2-4 Wörter), deutsch, keine Emojis, kein Clickbait ("Die besten...", "Keine Zeit?"),
   keine Werbehinweise ("Anzeige |"), keine englischen Wörter wenn möglich.
   Beispiele: "Hot Honey Chicken" → "Honig-Hähnchen", "Ingredients 👇" → sinnvoller Titel ableiten,
   "Anzeige | High Protein Pasta" → "High-Protein-Pasta"

2. BESCHREIBUNG: 1 kurzer Satz was das Rezept besonders macht. Leer lassen ("") wenn nichts Sinnvolles
   ableitbar. Nicht die Zutaten aufzählen!

3. SCHWIERIGKEIT: Richtwert (Ausnahmen möglich z.B. Backen = lange Zeit aber einfach):
   - "einfach": bis ~20 Min, unkomplizierte Zubereitung
   - "mittel": 20-40 Min oder mehrere Schritte
   - "aufwendig": 40+ Min oder viele Schritte/Techniken
   Nur Werte: "einfach", "mittel", "aufwendig"

4. TAGS: Kategorie + Tags + Typ in EINEM tags-Array zusammenführen (Duplikate entfernen, lowercase).
   Sinnvolle Tags: mahlzeit-typ (hauptgericht, beilage, dessert, snack, frühstück),
   zutaten (hähnchen, pasta, salat...), diät (vegetarisch, vegan, highprotein, lowcarb),
   methode (mealprep, onepot, schnell, backrezept)

5. ZUTATEN: Hauptzutaten vorne, Gewürze/Würzmittel hinten. Format behalten.

6. ZUBEREITUNG: Wenn leer und Zutaten vorhanden → sinnvolle Schritte ableiten.
   Wenn unsicher → leer lassen.

WICHTIG: Wenn du dir bei einer Änderung nicht zu ~90% sicher bist → Original behalten.
Antworte NUR mit validem JSON, keine Erklärungen.`;

const FEW_SHOTS = [
  {
    role: 'user',
    content: JSON.stringify({
      titel: 'Die besten Low Calorie Chips 💪🏾🙌🏾',
      beschreibung: 'Die besten Low Calorie Chips 💪🏾🙌🏾',
      zubereitungszeit_min: 20,
      schwierigkeit: 'einfach',
      kategorie: ['vegetarisch'],
      tags: [],
      recipe_type: 'snack',
      zutaten: [{ name: 'Kartoffeln', menge: 300, einheit: 'g' }, { name: 'Olivenöl', menge: null, einheit: null }],
      zubereitung: ['Kartoffeln dünn schneiden', 'Mit Öl bestreichen', 'Bei 200°C 20 Min backen'],
    }),
  },
  {
    role: 'assistant',
    content: JSON.stringify({
      titel: 'Kartoffelchips',
      beschreibung: 'Gesunde Chips einfach selbst gemacht',
      zubereitungszeit_min: 20,
      schwierigkeit: 'einfach',
      tags: ['snack', 'vegetarisch', 'backrezept'],
    }),
  },
  {
    role: 'user',
    content: JSON.stringify({
      titel: 'Anzeige | High Protein Edamame Taccos',
      beschreibung: 'Anzeige | High Protein Edamame Taccos ✅High Protein',
      zubereitungszeit_min: 10,
      schwierigkeit: 'mittel',
      kategorie: ['vegetarisch'],
      tags: ['vegetarisch', 'high-protein'],
      recipe_type: 'hauptgericht',
      zutaten: [{ name: 'Edamame', menge: 200, einheit: 'g' }, { name: 'Taccos', menge: 4, einheit: 'Stk' }],
      zubereitung: ['Edamame kochen', 'In Taccos füllen'],
    }),
  },
  {
    role: 'assistant',
    content: JSON.stringify({
      titel: 'Edamame Tacos',
      beschreibung: 'Schnelle High-Protein-Tacos mit Edamame',
      zubereitungszeit_min: 10,
      schwierigkeit: 'einfach',
      tags: ['hauptgericht', 'vegetarisch', 'highprotein', 'schnell'],
    }),
  },
  {
    role: 'user',
    content: JSON.stringify({
      titel: 'Keine Zeit? Dann jetzt 5 Minuten Pasta mit mehr Protein!',
      beschreibung: '',
      zubereitungszeit_min: 5,
      schwierigkeit: 'mittel',
      kategorie: ['vegetarisch'],
      tags: ['vegetarisch', 'high-protein'],
      recipe_type: 'hauptgericht',
      zutaten: [
        { name: 'Cherry Tomaten', menge: 250, einheit: 'g' },
        { name: 'Knoblauch', menge: 2, einheit: 'Zehen' },
        { name: 'Kochsahne', menge: 125, einheit: 'ml' },
        { name: 'Pasta', menge: 200, einheit: 'g' },
      ],
      zubereitung: [],
    }),
  },
  {
    role: 'assistant',
    content: JSON.stringify({
      titel: 'Pasta mit Tomatensauce',
      beschreibung: 'Schnelle Pasta mit cremiger Tomatensauce',
      zubereitungszeit_min: 5,
      schwierigkeit: 'einfach',
      tags: ['hauptgericht', 'vegetarisch', 'highprotein', 'schnell'],
      zubereitung: [
        'Knoblauch und Tomaten in Olivenöl anbraten',
        'Tomatenmark und Kochsahne einrühren, 3 Min köcheln',
        'Mit gekochter Pasta vermengen und servieren',
      ],
    }),
  },
];

async function cleanRecipe(recipe) {
  const input = {
    titel: recipe.titel,
    beschreibung: recipe.beschreibung ?? '',
    zubereitungszeit_min: recipe.zubereitungszeit_min,
    schwierigkeit: recipe.schwierigkeit,
    kategorie: recipe.kategorie ?? [],
    tags: recipe.tags ?? [],
    recipe_type: recipe.recipe_type ?? '',
    zutaten: recipe.zutaten ?? [],
    zubereitung: recipe.zubereitung ?? [],
  };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...FEW_SHOTS,
        { role: 'user', content: JSON.stringify(input) },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Groq Fehler: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const text = data.choices[0].message.content.trim();

  try {
    const cleaned = JSON.parse(text);
    return {
      ...recipe,
      titel: cleaned.titel ?? recipe.titel,
      beschreibung: cleaned.beschreibung ?? recipe.beschreibung,
      zubereitungszeit_min: cleaned.zubereitungszeit_min ?? recipe.zubereitungszeit_min,
      schwierigkeit: cleaned.schwierigkeit ?? recipe.schwierigkeit,
      tags: cleaned.tags ?? recipe.tags,
      zubereitung: cleaned.zubereitung ?? recipe.zubereitung,
      // Kategorie und recipe_type werden in tags aufgelöst
      kategorie: [],
      recipe_type: (cleaned.tags ?? recipe.tags)?.[0] ?? recipe.recipe_type,
    };
  } catch {
    console.warn(`⚠️  JSON-Parse-Fehler bei "${recipe.titel}" — Original behalten`);
    return recipe;
  }
}

// ── Excel-Output ──────────────────────────────────────────────────────────

function zutatenToText(zutaten) {
  return (zutaten ?? []).map(z => {
    const menge = z.menge != null ? `${z.menge}${z.einheit ? ' ' + z.einheit : ''}` : 'n.G.';
    return `${menge} ${z.name}`;
  }).join(' | ');
}

function zubereitungToText(steps) {
  return (steps ?? []).map((s, i) => `${i + 1}. ${s}`).join(' | ');
}

function toExcelRow(orig, cleaned) {
  const changes = [];
  if (orig.titel !== cleaned.titel) changes.push(`Titel: "${orig.titel}" → "${cleaned.titel}"`);
  if ((orig.beschreibung ?? '') !== (cleaned.beschreibung ?? '')) changes.push('Beschreibung geändert');
  if (orig.schwierigkeit !== cleaned.schwierigkeit) changes.push(`Schwierigkeit: ${orig.schwierigkeit} → ${cleaned.schwierigkeit}`);
  if (JSON.stringify(orig.tags) !== JSON.stringify(cleaned.tags)) changes.push('Tags konsolidiert');
  if (JSON.stringify(orig.zubereitung) !== JSON.stringify(cleaned.zubereitung)) changes.push('Zubereitung ergänzt/geändert');

  return {
    'ID': cleaned.id,
    'Titel (bereinigt)': cleaned.titel,
    'Titel (original)': orig.titel,
    'Beschreibung (bereinigt)': cleaned.beschreibung ?? '',
    'Beschreibung (original)': orig.beschreibung ?? '',
    'Zeit (Min)': cleaned.zubereitungszeit_min ?? '',
    'Schwierigkeit (bereinigt)': cleaned.schwierigkeit ?? '',
    'Schwierigkeit (original)': orig.schwierigkeit ?? '',
    'Tags (bereinigt)': (cleaned.tags ?? []).join(', '),
    'Tags (original)': [...(orig.tags ?? []), ...(orig.kategorie ?? []), orig.recipe_type ?? ''].filter(Boolean).join(', '),
    'Zutaten': zutatenToText(cleaned.zutaten),
    'Zubereitung': zubereitungToText(cleaned.zubereitung),
    'Änderungen': changes.join(' | ') || '—',
    'Quelle': orig.source_url ?? '',
  };
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('📥  Lade Rezepte aus Supabase…');
  const all_recipes = await fetchRecipes();
  console.log(`✅  ${all_recipes.length} Rezepte geladen`);

  // Duplikate prüfen
  const dupes = findDuplicates(all_recipes);
  if (dupes.length > 0) {
    console.log(`\n⚠️  ${dupes.length} Duplikat(e) gefunden:`);
    dupes.forEach(d => console.log(`   "${d.titel}" (${d.id}) → Duplikat von ${d.duplicateOf}${d.reason ? ' [' + d.reason + ']' : ''}`));
  } else {
    console.log('✅  Keine Duplikate gefunden');
  }

  const toProcess = all_recipes.slice(OFFSET, OFFSET + LIMIT);
  console.log(`\n🧹  Bereinige ${toProcess.length} Rezepte (${OFFSET + 1}–${OFFSET + toProcess.length} von ${all_recipes.length})…\n`);

  const rows = [];
  for (let i = 0; i < toProcess.length; i++) {
    const r = toProcess[i];
    process.stdout.write(`   ${i + 1}/${toProcess.length}: "${r.titel}"… `);
    try {
      const cleaned = await cleanRecipe(r);
      rows.push(toExcelRow(r, cleaned));
      process.stdout.write('✓\n');
    } catch (e) {
      process.stdout.write(`❌ ${e.message}\n`);
      rows.push(toExcelRow(r, r)); // Original als Fallback
    }
    // Rate-Limit: kurze Pause
    if (i < toProcess.length - 1) await new Promise(r => setTimeout(r, 300));
  }

  // Excel schreiben
  const ws = utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 36 }, { wch: 35 }, { wch: 35 }, { wch: 50 }, { wch: 50 },
    { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 40 }, { wch: 40 },
    { wch: 60 }, { wch: 80 }, { wch: 50 }, { wch: 60 },
  ];
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Bereinigt');

  // Duplikate-Sheet
  if (dupes.length > 0) {
    const dupeWs = utils.json_to_sheet(dupes);
    utils.book_append_sheet(wb, dupeWs, 'Duplikate');
  }

  const date = new Date().toISOString().slice(0, 10);
  const suffix = all ? 'alle' : `${OFFSET + 1}-${OFFSET + toProcess.length}`;
  const outPath = `./scripts/output/rezepte-bereinigt-${suffix}-${date}.xlsx`;
  await writeFile(outPath, write(wb, { type: 'buffer' }));

  console.log(`\n📄  Excel gespeichert: ${outPath}`);
  console.log('👀  Bitte review und dann: node scripts/import-from-excel.mjs <datei>');
}

main().catch(e => { console.error(e); process.exit(1); });
