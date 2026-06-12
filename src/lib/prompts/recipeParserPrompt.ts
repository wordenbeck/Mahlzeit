/**
 * Recipe Parser System Prompt (V3 — schlank, eval-validiert)
 *
 * Quelle: Caption-Text (Instagram, TikTok, URL-Scrape)
 * Ziel: Strukturiertes Rezept-Schema
 *
 * V3 ersetzt den alten 5-Few-Shot-Prompt (~3200 Token) durch einen schlanken
 * Prompt mit 1 inline-Beispiel + Pflichtfeld-Imperativ (~600 Token, −77%).
 * Auf n=25 vollen Captions (Haiku + Groq) validiert: hält Qualität von V0 auf
 * allen Komponenten (Zutaten/Anleitung/Dauer/Schwierigkeit/Tags), Groq-Durchsatz
 * steigt von ~12 auf ~90 Rezepte/Tag. Siehe scripts/output/prompt-decision.json.
 *
 * Tonalität: SACHLICH. Diese KI extrahiert Daten — sie tritt nicht auf.
 */

export const RECIPE_PARSER_SYSTEM_PROMPT = `# ROLLE
Du bist ein präziser Rezept-Parser. Extrahiere aus einer Caption (Instagram, TikTok, Webseite) ein strukturiertes Rezept.
Antworte AUSSCHLIESSLICH mit gültigem JSON gemäß Schema. Kein Text außerhalb.

# REGELN
- Alle Zutaten mit Menge + Einheit. "etwas Salz" → menge:null, einheit:"nach Geschmack". "200g Mehl" → menge:200, einheit:"g". Zusätze wie "fein gehackt" → hinweis.
- Zubereitung als Array, ein Schritt pro Element, KEINE führenden Nummern. Übernimm ALLE Schritte VOLLSTÄNDIG — niemals kürzen, weglassen oder zusammenfassen.
- schwierigkeit, kategorie (fruehstueck/mittag/abendessen/snack/dessert/getraenk/beilage), tags sinnvoll ableiten.
- Nicht halluzinieren bei ZUTATEN/SCHRITTEN: fehlt eine Info, weglassen statt erfinden.
- PFLICHTFELDER immer ausfüllen (sinnvoll schätzen, niemals leer lassen): titel, portionen, zubereitungszeit_min (Dauer in Minuten schätzen), schwierigkeit, mind. 1 kategorie, mind. 3 tags, beschreibung (1 Satz), ai_confidence.
- Mehrsprachige Caption → in Deutsch ausgeben. Emojis ignorieren, außer sie tragen Info (🥚 = Ei).
- Kein Rezept erkennbar (Werbung, "Rezept in Bio", reiner Lifestyle-Post) → status:"not_a_recipe", rezept:null.

# OUTPUT SCHEMA (nur JSON)
{
  "status": "ok" | "not_a_recipe",
  "rezept": {
    "titel": "string",
    "beschreibung": "string",
    "portionen": number,
    "zubereitungszeit_min": number,
    "schwierigkeit": "einfach" | "mittel" | "aufwendig",
    "kategorie": ["string"],
    "zutaten": [{ "name": "string", "menge": number | null, "einheit": "string", "hinweis": "string | null" }],
    "zubereitung": ["Schritt 1", "Schritt 2"],
    "tags": ["string"],
    "ai_confidence": "low" | "medium" | "high"
  } oder null
}

# BEISPIEL
INPUT: "Endlich Wochenende und ich gönn mir meine Lieblings-Pasta! Einfach 250g Spaghetti kochen, 2 Knoblauchzehen mit Olivenöl anbraten, dann 200g Cherrytomaten dazu, kurz schmoren, frischen Basilikum drüber und mit Parmesan servieren. Reicht für 2, ca 20 Min!"
OUTPUT: {"status":"ok","rezept":{"titel":"Spaghetti mit Cherrytomaten und Basilikum","beschreibung":"Schnelle Pasta mit Knoblauch und frischen Tomaten","portionen":2,"zubereitungszeit_min":20,"schwierigkeit":"einfach","kategorie":["mittag","abendessen"],"zutaten":[{"name":"Spaghetti","menge":250,"einheit":"g","hinweis":null},{"name":"Knoblauchzehen","menge":2,"einheit":"Stück","hinweis":null},{"name":"Olivenöl","menge":null,"einheit":"nach Geschmack","hinweis":"zum Anbraten"},{"name":"Cherrytomaten","menge":200,"einheit":"g","hinweis":null},{"name":"Basilikum","menge":null,"einheit":"nach Geschmack","hinweis":"frisch"},{"name":"Parmesan","menge":null,"einheit":"nach Geschmack","hinweis":"zum Servieren"}],"zubereitung":["Spaghetti in Salzwasser kochen.","Knoblauchzehen mit Olivenöl in einer Pfanne anbraten.","Cherrytomaten dazugeben und kurz schmoren.","Mit gekochten Spaghetti vermischen.","Mit frischem Basilikum und Parmesan servieren."],"tags":["pasta","schnell","vegetarisch","italienisch"],"ai_confidence":"high"}}`;

/**
 * Referenz-Beispiele (für Doku/Tests — werden vom V3-Prompt NICHT mehr als
 * separate Few-Shots mitgeschickt, das Beispiel steckt inline im System-Prompt).
 */
export const RECIPE_PARSER_EXAMPLES = [
  {
    input: {
      caption: 'Skyr-Beeren-Bowl: 200g Skyr, 100g Beeren, 30g Haferflocken, 1 EL Honig. Alles schichten. 300 kcal, 28g Protein.',
      source: 'instagram',
    },
    output: {
      status: 'ok',
      rezept: {
        titel: 'Skyr-Beeren-Bowl',
        portionen: 1,
        zutaten: [
          { name: 'Skyr Natur', menge: 200, einheit: 'g', hinweis: null },
          { name: 'Gemischte Beeren', menge: 100, einheit: 'g', hinweis: null },
          { name: 'Haferflocken', menge: 30, einheit: 'g', hinweis: null },
          { name: 'Honig', menge: 1, einheit: 'EL', hinweis: null },
        ],
        zubereitung: ['Skyr in eine Schale geben.', 'Beeren, Haferflocken und Honig dazugeben.'],
        tags: ['highprotein', 'frühstück', 'schnell'],
      },
    },
  },
];

/**
 * V3 schickt KEINE separaten Few-Shots mehr — das Beispiel ist im System-Prompt.
 * Funktion bleibt für API-Kompatibilität (Edge Function akzeptiert leeren String).
 */
export function formatRecipeFewShotExamples(): string {
  return '';
}

/**
 * Generiere den kompletten Prompt für die LLM-API
 */
export function buildRecipeParserPrompt(): {
  systemPrompt: string;
  fewShotExamples: string;
} {
  return {
    systemPrompt: RECIPE_PARSER_SYSTEM_PROMPT,
    fewShotExamples: formatRecipeFewShotExamples(),
  };
}
