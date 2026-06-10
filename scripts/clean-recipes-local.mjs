/**
 * clean-recipes-local.mjs
 * Bereinigt Rezepte ohne externe API — regelbasiert + manuell kuratiert.
 * Ausgabe: Excel zur Review, dann import-from-excel.mjs → SQL
 *
 * Verwendung:
 *   node scripts/clean-recipes-local.mjs [--limit 10] [--all] [--offset N]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { utils, write } from 'xlsx';

const args = process.argv.slice(2);
const doAll = args.includes('--all');
const limitIdx = args.indexOf('--limit');
const offsetIdx = args.indexOf('--offset');
const LIMIT = doAll ? 9999 : (limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 10);
const OFFSET = offsetIdx >= 0 ? parseInt(args[offsetIdx + 1]) : 0;

const recipes = JSON.parse(readFileSync('./scripts/output/recipes-raw.json', 'utf8'));

// ── Manuelle Korrekturen (ID → Patch) ────────────────────────────────────
// Für Fälle die kein Regex lösen kann
const MANUAL_PATCHES = {
  // ── Bereits validiert (erste 10) ──────────────────────────────────────────
  'f32e6a55-3237-4017-bc6a-07972374cef2': {
    titel: 'Kartoffelchips',
    beschreibung: 'Knusprige Kartoffelchips kalorienarm selbst gemacht',
  },
  'f03e7bba-a1e0-4d88-a28a-401b89dd2cf1': {
    titel: 'Erdnuss-Maggi mit Paneer',
    beschreibung: 'Würzige Maggi-Nudeln mit Erdnussbutter und Paneer Katsu',
  },

  // ── Review-Fälle 1-15 (Thomas bestätigt) ──────────────────────────────────
  '46ca7d36-4c0e-4929-a22c-e7b588f37cb3': { // Schnelle High Protein Flammkuchen
    titel: 'Flammkuchen-Wraps mit Schinken',
    beschreibung: 'Schnelle Flammkuchen-Wraps mit Schinken und Crème Légère',
  },
  'efadfc2e-2f87-49a6-88ab-65028bc05351': { // Dieser Karotten-Wrap... (Duplikat-Titel)
    titel: 'Karotten-Wrap aus dem Ofen',
    beschreibung: 'Einfacher Wrap aus geriebenen Karotten, Ei und Mozzarella',
  },
  '2cab7387-f9d7-43bd-b631-5074942d2fe0': { // Diese High Protein Hackfleisch Ofentacos...
    titel: 'Hackfleisch-Ofentacos',
    beschreibung: 'Saftige Ofentacos mit Hackfleisch und Kidneybohnen',
  },
  '036b24a0-2eaa-4ab8-a571-29dbc80fb4aa': { // Rezept 20/100 - Big Mac Kartoffelsalat (DUPLIKAT → wird gelöscht)
    titel: 'Big Mac Kartoffelsalat',
  },
  'f9d9492e-5113-41b5-aa58-1bf985e5a2c6': { // Köfte mal ganz anders
    titel: 'Linsen-Köfte',
    beschreibung: 'Vegane Köfte aus Berglinsen, Kartoffel und Karotte',
  },
  'f45819f1-0c7f-4b33-8006-d48a701605d3': { // High Protein Asia Nudeln für alle...
    titel: 'Asia-Nudeln mit Hähnchen',
    beschreibung: 'Würzige Asia-Nudeln mit Hähnchen und Weißkohl',
  },
  '6738915b-75b4-40c3-902c-a59c45295fdd': { // So lecker geworden und noch mehr Medizin...
    titel: 'Tahini-Schoko-Bällchen',
    beschreibung: '',
  },
  '017cbbaf-677e-4a9e-9888-7f66dfa0ab79': { // Meine High Protein Chicken Tikker Masala Burritos...
    titel: 'Chicken Tikka Masala Burrito',
    beschreibung: 'Burrito mit Hähnchen in Tikka-Masala-Sauce und Reis',
  },
  'a05d7774-d83e-4020-b545-17a2f19f3e8c': { // So einfach kanns sein!
    titel: 'Hähnchen-Pasta mit Frischkäse',
    beschreibung: 'Cremige Hähnchen-Pasta mit Frischkäsesauce',
  },
  '4a292e21-7936-4252-a45e-f6f1063ba4fc': { // Ingredients 👇
    titel: 'Dattel-Erdnuss-Joghurt',
    beschreibung: 'Mealprep-Joghurt mit Datteln, Erdnussbutter und Chia',
  },
  '06473b0e-a627-456a-bb46-13fd95b31b64': { // Diese High Protein Schoko Brötchen...
    titel: 'Schoko-Brötchen mit Quark',
    beschreibung: 'Saftige Schoko-Brötchen aus Magerquark und Dinkelmehl',
  },
  'ce5fb379-6b62-4e78-8050-b277afd7d7e3': { // Zutaten:
    titel: 'Himbeer-Chia-Quark',
    beschreibung: 'Leichter Chia-Quark mit Himbeeren und Flohsamen',
  },
  'b20a07a7-4802-41be-8dcc-145752b8455b': { // Mach dir diese High Protein Schüttel Pizza...
    titel: 'Thunfisch-Schüttel-Pizza',
    beschreibung: 'Protein-reiche Pizza aus Skyr, Thunfisch und Eiern',
  },
  'ea95933b-54de-4e65-b3a0-4f15f440e4b1': { // Gewinnspiel: 5-Zutaten-Kuchen...
    titel: 'Apfel-Schoko-Proteinkuchen',
    beschreibung: 'Saftiger Kuchen mit Apfel, Kakao und Proteinpulver',
  },
  'b2f0d214-f5d0-472f-9a5e-5003708f3f32': { // Ich garantiere dir: Publikumsliebling
    titel: 'Gyoza mit Shiitake und Hackfleisch',
    beschreibung: 'Asiatische Teigtaschen mit Shiitake-Pilzen und Schweinehack',
  },

  // ── Weitere offensichtliche Fälle ──────────────────────────────────────────
  '4ea14f06-21a0-4027-a02b-dcbb658cb48b': { // Kaffee liefert Koffein...
    titel: 'Kaffee-Chia-Bowl',
    beschreibung: 'Cremige Chia-Bowl mit Kaffee, Skyr und Whey-Protein',
  },
  '7d74f307-d095-48df-b018-8bcc9bd410e3': { // POM DÖNER mit 495 Kalorien...
    titel: 'Pom Döner',
    beschreibung: 'Döner mit Pommes, Hähnchen und Joghurt-Knoblauch-Sauce',
  },
  '967103d3-04de-433c-870e-32a58cfcade6': { // Wer würde? POM DÖNER... (DUPLIKAT → wird gelöscht)
    titel: 'Pom Döner',
  },
  '0882eb52-8d9b-47d5-9b2f-bab43dd995fb': { // g Protein Butter Chicken Pizza!
    titel: 'Butter Chicken Pizza',
    beschreibung: 'Pizza mit Quark-Teig und Butter-Chicken-Topping',
  },
  'fa11bc43-4645-43f8-9a1d-801ddf658682': { // Einfach, gesund und so SAFTIG... (DUPLIKAT → wird gelöscht)
    titel: 'Schokoladen Brownies',
  },
  '360117ba-aea3-4681-bfdf-f6709b81cca4': { // CAESAR KARTOFFELN mit 433 Kcal!
    titel: 'Caesar-Kartoffeln',
    beschreibung: 'Knusprige Ofenkartoffeln mit Caesar-Dressing',
  },
  'e51f897d-292d-4ee6-a6f2-6c4cfad6f2ad': { // Benjamin Blümchen Oats...
    titel: 'Blaue Protein-Oats',
    beschreibung: 'Overnight Oats mit Heidelbeeren und Whey-Protein',
  },
  '4b1be165-f723-4d60-8fed-9ff9a9673e5f': { // Tag mit 1800 oder 2400 Kcal...
    titel: 'Kartoffel-Crème-fraîche-Pfanne',
    beschreibung: 'Schnelle Kartoffelpfanne mit Crème fraîche',
  },
  'd322b0db-a8aa-49ce-8c64-378e8918e1cc': {
    titel: 'Kartoffel-Quark-Pfanne',
    beschreibung: 'Einfache Pfanne aus Kartoffeln und Magerquark',
  },

  // ── Letzte 15 NEEDS_REVIEW ────────────────────────────────────────────────
  '7beab749-cedd-4780-bbad-4acf3b839e74': { // Hättest du gedacht... (Erdbeeren, Sahne)
    titel: 'Erdbeer-Eis',
    beschreibung: 'Cremiges Eis aus gefrorenen Erdbeeren und Sahne',
  },
  '9e62ca1f-09b9-4d1b-bbdb-de083ca5b597': { // Keine Zeit? 5 Minuten Pasta (Thomas: "Pasta mit schneller Tomatensauce")
    titel: 'Pasta mit Tomatensauce',
    beschreibung: 'Schnelle Pasta mit Tomatensauce und Kochsahne',
  },
  '7bc95e62-d24f-447f-b643-341ed7d9f616': { // Schneller im Ofen... Flammkuchen Gnocchis
    titel: 'Flammkuchen-Gnocchis',
    beschreibung: 'Gnocchis im Flammkuchen-Stil mit Schinken und Crème fraîche',
  },
  'e8c9892d-b593-4a59-8b2e-63c16d5545c0': { // Alles in eine Schüssel... (Nudeln, Lachs, Pesto)
    titel: 'Lachs-Nudeln mit Pesto',
    beschreibung: 'Schnelle Nudeln mit Lachs, Hirtenkäse und Pesto',
  },
  'dc19450e-ac09-40a7-b65f-5d7abda1f473': { // Kein Bock auf Kochen... (Baguette, Thunfisch, Avocado)
    titel: 'Thunfisch-Avocado-Baguette',
    beschreibung: 'Belegtes Baguette mit Thunfisch, Frischkäse und Avocado',
  },
  '1f407697-5d34-453b-82df-c52a7374a072': { // Einfaches Abendessen... (Kartoffeln, Schinken)
    titel: 'Kartoffel-Schinken-Pfanne',
    beschreibung: 'Herzhafte Pfanne mit Kartoffeln und Schinken',
  },
  'c88dec16-1b62-43a0-a52f-c4a9d3775b9b': { // Burger aus Kidneybohnen (10 min, Buns, Kidneybohnen)
    titel: 'Kidneybohnen-Burger',
    beschreibung: 'Schneller Burger mit Kidneybohnen-Patty',
  },
  'c28c0adb-cb67-4aea-84e8-2e560de2be50': { // Günstigstes Protein Sparrezept... (Reis, Eier, Erbsen)
    titel: 'Gebratener Reis mit Ei',
    beschreibung: 'Günstiges Protein-Rezept mit Reis, Eiern und Gemüse',
  },
  'd3c3b1e4-ad70-4796-bacb-8762342cb2a6': { // So bereitest du Hähnchenbrust... (Joghurt, Ajvar)
    titel: 'Marinierte Hähnchenbrust',
    beschreibung: 'Saftige Hähnchenbrust in Joghurt-Ajvar-Marinade',
  },
  'd4fb9bea-4246-4b43-9bbe-f3dd2bdcbbbd': { // Hackfleisch Pockets (Mehl, Quark, Hackfleisch)
    titel: 'Hackfleisch-Pockets',
    beschreibung: 'Gefüllte Teigtaschen mit würzigem Hackfleisch',
  },
  '58013f1b-7512-46f0-b981-54af4938577d': { // Ofentacos (Hähnchen, Paprika, Mais)
    titel: 'Hähnchen-Ofentacos',
    beschreibung: 'Knusprige Ofentacos mit Hähnchen, Paprika und Mais',
  },
  '1f56a382-48ca-4827-a221-8aadc5979c5e': { // Chicken Kartoffelpfanne
    titel: 'Hähnchen-Kartoffelpfanne',
    beschreibung: 'Schnelle Pfanne mit Hähnchen, Kartoffeln und Knoblauch',
  },
  'aa5b4380-414c-415c-924a-a70d64e68513': { // Kalorienarme Zwiebelringe (Zwiebel, Eier, Chipotle)
    titel: 'Zwiebelringe',
    beschreibung: 'Kalorienarme Zwiebelringe mit Chipotle-Gewürz',
  },
  '18bde451-8307-4838-9491-2d8fc4cd88af': { // Gramm Eiweiß, 15 Min — keine Zutaten
    titel: 'BRAUCHT TITEL',
    beschreibung: '',
  },
  '21f52971-5102-46a1-906e-13bb87c1ff8d': { // .700 Kalorien — keine Zutaten
    titel: 'BRAUCHT TITEL',
    beschreibung: '',
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function removeEmojis(str) {
  if (!str) return str;
  return str
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[︀-️]/gu, '')   // variation selectors
    .replace(/�/g, '')              // replacement character (corrupt emoji)
    .replace(/￼/g, '')                  // object replacement char
    .trim();
}

function cleanTitle(titel) {
  if (!titel) return titel;
  let t = removeEmojis(titel);

  // Werbung & Füllwörter entfernen
  t = t.replace(/^Anzeige\s*\|\s*/i, '');
  t = t.replace(/^Werbung\s*\|\s*/i, '');
  t = t.replace(/\.\s*Anzeige\.?\s*$/i, '');
  t = t.replace(/\bAnzeige\b\.?\s*$/i, '');

  // Clickbait-Muster → leer für manuelle Bearbeitung
  const clickbait = [
    /^(Keine Zeit\?|Kein Bock|Hättest du|Wer würde|Ich garantiere|Dieser\s|Diese\s|So lecker|So einfach|So bereitest|Mach dir|Alles in eine|Mit dieser|Bei euch|Eines der|Meine High)/i,
    /^(Rezept \d+\/\d+\s*[-–]\s*)/i,
    /^(Ingredients|Zutaten:|Zutaten\s*👇|g Protein|\.?\d+\s*Kalorien)/i,
    /^(Tag mit|Benjamin Blümchen|Auch einfache|Gramm Eiweiß|Gewinnspiel)/i,
    /^(Schneller im|Einfaches? &|Burger aus|Eines der)/i,
  ];
  for (const rx of clickbait) {
    if (rx.test(t)) return `__NEEDS_REVIEW__: ${t.substring(0, 60)}`;
  }

  // Englische Wörter im Titel ersetzen (häufige)
  t = t.replace(/\bHot\b/g, 'Scharfer');
  t = t.replace(/\bSpicy\b/g, 'Scharfer');
  t = t.replace(/\bCrispy\b/g, 'Knuspriger');
  t = t.replace(/\bCrunchy\b/g, 'Knuspriger');
  t = t.replace(/\bCreamy\b/g, 'Cremiger');
  t = t.replace(/^Low Calorie\s+/i, '');   // "Low Calorie Chips" → "Chips"
  t = t.replace(/^Low Cal\s+/i, '');
  t = t.replace(/\bHighprotein\s+/gi, ''); // "Highprotein Chips" → "Chips" (Tag genug)
  t = t.replace(/\bHigh Protein\b/gi, 'Highprotein');
  t = t.replace(/\bProtein\b/g, 'Protein'); // behalten, bekannter Begriff
  t = t.replace(/\bMaggie\b/g, 'Maggi');

  // "Schnelle/r/s" am Anfang + mehr als 6 Wörter → kürzen Hinweis
  const wordCount = t.split(/\s+/).length;
  if (wordCount > 7) {
    // Ersten sinnvollen Teil nehmen (bis zum ersten Satzzeichen oder Komma)
    const shortMatch = t.match(/^([^,!?:]+)/);
    if (shortMatch && shortMatch[1].split(/\s+/).length <= 6) {
      t = shortMatch[1].trim();
    }
  }

  // Untertitel-Phrasen kürzen: "X ohne Y und Z" → "X" wenn Y+Z keine Hauptinfo
  t = t.replace(/\s+ohne\s+(Zucker\s+und\s+Mehl|Mehl|Kohlenhydrate|Gluten)\s*$/i, '');

  // Trailing Punkte/Ausrufer entfernen
  t = t.replace(/[!?.]+$/, '').trim();

  // Doppelte Leerzeichen
  t = t.replace(/\s+/g, ' ').trim();

  return t;
}

function generateBeschreibung(titel, zutaten, zubereitung) {
  if (!titel) return '';
  const t = titel.toLowerCase();
  // Overnight Oats → spezifischer
  if (t.includes('overnight oats')) return `Gesundes Overnight-Oat-${titel.replace(/Overnight Oats/i,'').trim() || 'Rezept'}`.replace(/\s+/g,' ').trim();
  // Bowl → kurz
  if (t.includes('bowl')) return `Nährstoffreiche ${titel}`;
  // Wrap → kurz
  if (t.includes('wrap')) return `Einfacher ${titel} als schnelle Mahlzeit`;
  // Fallback: top 2 Zutaten
  const top = (zutaten ?? []).filter(z => z.menge != null).slice(0, 2).map(z => z.name);
  if (top.length === 0) return '';
  return `${titel} mit ${top.join(' und ')}`;
}

function cleanBeschreibung(beschr, titel) {
  if (!beschr) return '';
  let b = removeEmojis(beschr);

  // Wenn Beschreibung = Titel → löschen
  if (b.toLowerCase().trim() === removeEmojis(titel ?? '').toLowerCase().trim()) return '';

  // Instagram-Caption-Muster → löschen (zu lang, kein echter Beschreibungstext)
  if (b.length > 200) return '';
  if (/^(Zutaten:|Ingredients|✅|👇|⤵)/.test(b)) return '';
  if (/\d+\s*g\s+\w+.*\d+\s*g\s+\w+/.test(b)) return ''; // Zutaten-Liste
  if (b.includes('kcal') && b.includes('\n')) return '';

  // "Gesunde, ausgewogene Mahlzeit mit hoher Leistung" o.ä. → weg
  if (/hoher\s+Leistung|gesund(e)? und\s+so\s+\w+/.test(b)) return '';

  b = b.replace(/\s+/g, ' ').trim();
  return b;
}

function cleanSchwierigkeit(schw, zeit, zubereitung) {
  const steps = zubereitung?.length ?? 0;
  // Wenn null oder leer → schätzen
  if (!schw || schw === 'null') {
    if (!zeit) return null; // keine Info → leer lassen
    if (zeit <= 20) return 'einfach';
    if (zeit <= 40) return 'mittel';
    return 'aufwendig';
  }
  const s = schw.toLowerCase();
  // "schwer" → "aufwendig"
  if (s === 'schwer') return 'aufwendig';
  // Plausibilität prüfen (Richtwert, kein Dogma)
  if (s === 'mittel' && zeit && zeit <= 15 && steps <= 3) return 'einfach';
  if (s === 'mittel' && zeit && zeit <= 10) return 'einfach';
  return s;
}

// Tags die BEHALTEN werden (Whitelist-Ansatz)
const KEEP_TAGS = new Set([
  // Mahlzeit-Typ
  'hauptgericht', 'beilage', 'dessert', 'snack', 'frühstück', 'suppe', 'salat',
  // Diät
  'vegan', 'vegetarisch', 'highprotein', 'lowcal', 'lowcarb', 'glutenfrei', 'zuckerfrei',
  // Methode
  'mealprep', 'onepot', 'schnell', 'backrezept', 'airfryer',
  // Küche
  'indisch', 'asiatisch', 'italienisch', 'mexikanisch', 'orientalisch',
]);

function consolidateTags(kategorie, tags, recipe_type) {
  const all = [
    ...(Array.isArray(kategorie) ? kategorie : []),
    ...(Array.isArray(tags) ? tags : []),
    recipe_type,
  ]
    .filter(Boolean)
    .map(t => t.toLowerCase().trim()
      .replace(/high_protein|high-protein/g, 'highprotein')
      .replace(/lowcalorie|low_calorie|low-calorie|low.?cal\b/g, 'lowcal')
      .replace(/low.?carb/g, 'lowcarb')
      .replace(/plant.?based/g, 'vegan')
      .replace(/fruehstueck/g, 'frühstück')
      .replace(/overnightoats|overnight.?oats/g, 'snack')
      .replace(/proteinfruehstueck/g, 'highprotein')
    )
    .filter(t => KEEP_TAGS.has(t)) // nur bekannte, sinnvolle Tags behalten
    .filter((t, i, arr) => arr.indexOf(t) === i); // deduplizieren

  return all;
}

function fixZutaten(zutaten) {
  if (!zutaten || zutaten.length === 0) return zutaten;

  const fixed = zutaten.map(z => {
    let { name, menge, einheit, hinweis } = z;

    // "2 Saft Limette" → einheit="Saft von", name="Limetten"
    if (einheit === 'Saft' && name) {
      einheit = 'Stk';
      name = name.replace(/^Limette$/, 'Limetten (Saft)');
      hinweis = hinweis ?? 'Saft auspressen';
    }

    // Hauptzutat ohne Menge bei erkennbaren Lebensmitteln → n.G. lassen,
    // aber wenn es die EINZIGE Zutat oder offensichtlich Hauptzutat ist,
    // → markieren damit Thomas es prüfen kann
    return { name, menge, einheit, hinweis };
  });

  // Gewürze (menge==null) nach hinten
  const main = fixed.filter(z => z.menge != null);
  const spice = fixed.filter(z => z.menge == null);
  return [...main, ...spice];
}

// ── Duplikate finden ────────────────────────────────────────────────────────

function findDuplicates(all) {
  const byTitle = new Map();
  const dupes = [];
  for (const r of all) {
    const key = removeEmojis(r.titel ?? '').toLowerCase().replace(/[-\s]+/g, ' ').trim();
    if (byTitle.has(key)) {
      dupes.push({ duplicate_id: r.id, duplicate_titel: r.titel, original_id: byTitle.get(key) });
    } else {
      byTitle.set(key, r.id);
    }
  }
  return dupes;
}

// ── Hauptbereinigung ────────────────────────────────────────────────────────

function cleanRecipe(r) {
  const manual = MANUAL_PATCHES[r.id] ?? {};
  const titel = manual.titel ?? cleanTitle(r.titel);
  const beschreibungRaw = manual.beschreibung ?? cleanBeschreibung(r.beschreibung, r.titel);
  const beschreibung = beschreibungRaw || generateBeschreibung(titel, r.zutaten, r.zubereitung);
  const schwierigkeit = cleanSchwierigkeit(r.schwierigkeit, r.zubereitungszeit_min, r.zubereitung);
  const tags = consolidateTags(r.kategorie, r.tags, r.recipe_type);
  const zutaten = fixZutaten(r.zutaten);

  const changes = [];
  if (titel !== r.titel) changes.push(`Titel`);
  if (beschreibung !== (r.beschreibung ?? '')) changes.push(`Beschreibung`);
  if (schwierigkeit !== r.schwierigkeit) changes.push(`Schwierigkeit: ${r.schwierigkeit}→${schwierigkeit}`);
  if (JSON.stringify(tags) !== JSON.stringify([...(r.tags??[]), ...(r.kategorie??[]), r.recipe_type].filter(Boolean))) changes.push(`Tags`);

  return {
    ...r,
    titel,
    beschreibung,
    schwierigkeit,
    tags,
    kategorie: [],
    recipe_type: tags[0] ?? r.recipe_type,
    zutaten,
    _changes: changes.join(', ') || '—',
    _needsReview: titel.startsWith('__NEEDS_REVIEW__'),
  };
}

// ── Excel-Output ────────────────────────────────────────────────────────────

function zutatenText(zutaten) {
  return (zutaten ?? []).map(z => {
    const m = z.menge != null ? `${z.menge}${z.einheit ? ' '+z.einheit : ''}` : 'n.G.';
    return `${m} ${z.name}`;
  }).join(' | ');
}

function zubereitungText(steps) {
  return (steps ?? []).map((s, i) => `${i+1}. ${s}`).join(' | ');
}

// ── Main ────────────────────────────────────────────────────────────────────

const dupes = findDuplicates(recipes);
console.log(`📊 ${recipes.length} Rezepte geladen`);
if (dupes.length > 0) {
  console.log(`\n⚠️  ${dupes.length} Duplikat(e):`);
  dupes.forEach(d => console.log(`   LÖSCHEN: "${d.duplicate_titel}" (${d.duplicate_id}) → Duplikat von ${d.original_id}`));
}

const toProcess = recipes.slice(OFFSET, OFFSET + LIMIT);
console.log(`\n🧹  Bereinige ${toProcess.length} Rezepte (${OFFSET+1}–${OFFSET+toProcess.length})…`);

const cleaned = toProcess.map(cleanRecipe);
const needsReview = cleaned.filter(r => r._needsReview);
if (needsReview.length > 0) {
  console.log(`\n👀  ${needsReview.length} Rezepte brauchen manuellen Titel (markiert mit __NEEDS_REVIEW__):`);
  needsReview.forEach(r => console.log(`   - ${r.id}: ${r.titel}`));
}

// Excel
const rows = cleaned.map(r => ({
  'ID':                    r.id,
  'Titel (bereinigt)':     r.titel,
  'Titel (original)':      recipes.find(o=>o.id===r.id)?.titel ?? '',
  'Beschreibung (bereinigt)': r.beschreibung ?? '',
  'Beschreibung (original)':  recipes.find(o=>o.id===r.id)?.beschreibung ?? '',
  'Zeit (Min)':            r.zubereitungszeit_min ?? '',
  'Schwierigkeit (ber.)':  r.schwierigkeit ?? '',
  'Schwierigkeit (orig.)': recipes.find(o=>o.id===r.id)?.schwierigkeit ?? '',
  'Tags (bereinigt)':      (r.tags ?? []).join(', '),
  'Tags+Kat+Typ (orig.)':  [...(recipes.find(o=>o.id===r.id)?.tags??[]), ...(recipes.find(o=>o.id===r.id)?.kategorie??[]), recipes.find(o=>o.id===r.id)?.recipe_type??''].filter(Boolean).join(', '),
  'Zutaten':               zutatenText(r.zutaten),
  'Zubereitung':           zubereitungText(r.zubereitung),
  'Änderungen':            r._changes,
  'Review nötig':          r._needsReview ? 'JA ⚠️' : '',
  'Source-URL':            r.source_url ?? '',
}));

if (!existsSync('./scripts/output')) mkdirSync('./scripts/output', { recursive: true });

const wb = utils.book_new();
const ws = utils.json_to_sheet(rows);
ws['!cols'] = [
  {wch:36},{wch:35},{wch:35},{wch:50},{wch:50},
  {wch:10},{wch:16},{wch:16},{wch:40},{wch:40},
  {wch:70},{wch:80},{wch:30},{wch:12},{wch:60},
];
utils.book_append_sheet(wb, ws, 'Bereinigt');

// Duplikate-Sheet
if (dupes.length > 0) {
  const dupeWs = utils.json_to_sheet(dupes);
  dupeWs['!cols'] = [{wch:36},{wch:35},{wch:36}];
  utils.book_append_sheet(wb, dupeWs, 'Duplikate — LÖSCHEN');
}

const suffix = doAll ? 'alle' : `${OFFSET+1}-${OFFSET+toProcess.length}`;
const date = new Date().toISOString().slice(0,10);
const outPath = `./scripts/output/rezepte-bereinigt-${suffix}-${date}.xlsx`;
writeFileSync(outPath, write(wb, {type:'buffer'}));

console.log(`\n✅  Excel: ${outPath}`);
console.log(`   ${cleaned.filter(r=>!r._needsReview).length} automatisch bereinigt`);
console.log(`   ${needsReview.length} brauchen manuellen Titel`);
console.log(`   ${dupes.length} Duplikate im Sheet "Duplikate — LÖSCHEN"`);
