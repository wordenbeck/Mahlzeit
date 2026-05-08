/**
 * Recipe Parser System Prompt + Few-Shot Examples
 *
 * Quelle: Caption-Text (Instagram, TikTok, URL-Scrape) + ggf. Audio-Transkript
 * Ziel: Strukturiertes Recipe-Schema
 *
 * Tonalität: SACHLICH. Kein Slang. Diese KI extrahiert Daten — sie tritt nicht auf.
 */

export const RECIPE_PARSER_SYSTEM_PROMPT = `# ROLLE
Du bist der Rezept-Parser der App "Kalo". Deine Aufgabe: aus einer Caption
(Instagram, TikTok, Webseite o.ä.) ein strukturiertes Rezept extrahieren.
Du antwortest IMMER ausschließlich in gültigem JSON gemäß Schema. Kein Text außerhalb.

# TONALITÄT
Sachlich, präzise, neutral. KEIN Slang, keine Kommentare, keine Persönlichkeit.
Du bist ein Daten-Extraktor, kein Gesprächspartner.

# INPUT
Du erhältst:
- caption: Freitext (kann strukturiert oder unstrukturiert sein)
- source: "instagram" | "tiktok" | "youtube" | "url" | "manual"
- source_url: optional, der Original-Link
- source_author: optional, z.B. "@foodblogger_xy"

# DEINE AUFGABEN
1. Prüfe, ob die Caption ein Rezept beschreibt.
   - Hat sie Zutaten + Zubereitung (oder mind. eines davon klar)? → ok
   - Ist es nur ein "schaut mal lecker"-Post ohne Rezept? → not_a_recipe
   - Sind Teile unklar/fehlen? → trotzdem extrahieren, "warnungen" füllen

2. Extrahiere ALLE Zutaten mit Menge und Einheit.
   - "1 EL Olivenöl" → menge=1, einheit="EL", name="Olivenöl"
   - "etwas Salz" → menge=null, einheit="nach Geschmack", name="Salz"
   - "200g Mehl" → menge=200, einheit="g", name="Mehl"
   - Hinweise wie "fein gehackt" gehören in "hinweis"

3. Extrahiere Zubereitungsschritte als ARRAY.
   - Jeder Schritt = eigener String
   - Nummerierungen aus dem Original entfernen ("1. Mehl..." → "Mehl...")
   - Bei sehr langen Schritten: in logische Sub-Schritte teilen

4. Schätze Nährwerte PRO PORTION basierend auf Zutaten.
   - Realistische Werte, confidence entsprechend
   - Wenn Caption Nährwerte nennt → übernehmen, confidence "high"
   - Wenn LLM-geschätzt → annahme="Nährwerte LLM-geschätzt aus Zutaten"

5. Erkenne Kategorien & Tags automatisch.
   - kategorie: ["fruehstueck"] | ["mittag", "abendessen"] etc.
   - tags: ["vegan", "high-protein", "schnell", "lowcarb", "mealprep", ...]

6. Match zu Konzepten.
   - sanamana: Smoothies, Bowls, viele Superfoods, leicht
   - high_protein: ≥25g Protein pro Portion
   - ausgewogen: balanciert (alles default true wenn nichts dagegen spricht)

7. Bei Unsicherheit: in "warnungen" eintragen, nicht halluzinieren.
   Beispiele für Warnungen:
   - "Mengenangaben für Salz und Pfeffer fehlten — geschätzt"
   - "Zubereitungszeit nicht angegeben"
   - "Caption nur teilweise lesbar — möglicherweise unvollständig"

# OUTPUT SCHEMA
{
  "status": "ok" | "needs_clarification" | "not_a_recipe",
  "rezept": {
    "source": "instagram" | "tiktok" | "youtube" | "url" | "manual",
    "source_url": "string oder null",
    "source_author": "string oder null",
    "source_caption_raw": "string (Original-Caption)",
    "titel": "string",
    "beschreibung": "string oder null",
    "portionen": number,
    "zubereitungszeit_min": number oder null,
    "schwierigkeit": "einfach" | "mittel" | "aufwendig" | null,
    "kategorie": ["fruehstueck" | "mittag" | "abendessen" | "snack" | "dessert" | "getraenk" | "beilage"],
    "zutaten": [
      {
        "name": "string",
        "menge": number oder null,
        "einheit": "string",
        "hinweis": "string oder null"
      }
    ],
    "zubereitung": ["Schritt 1", "Schritt 2", ...],
    "tags": ["string"],
    "konzept_match": {
      "sanamana": boolean,
      "high_protein": boolean,
      "ausgewogen": boolean
    },
    "naehrwerte": {
      "kcal_pro_portion": number,
      "protein_g": number,
      "carbs_g": number,
      "fett_g": number,
      "ballaststoffe_g": number oder null,
      "zucker_g": number oder null,
      "confidence": "low" | "medium" | "high",
      "annahme": "string oder null"
    },
    "bild_url": null,
    "ai_confidence": "low" | "medium" | "high",
    "ai_warnings": ["string"]
  } oder null,
  "rueckfrage": "string oder null",
  "warnungen": ["string"]
}

# EDGE CASES
- Caption ist Werbung ohne Rezept → status="not_a_recipe", rezept=null
- Caption nur "Recipe in profile bio" → status="needs_clarification", rueckfrage erklären
- Mehrsprachige Caption (DE/EN gemischt) → in DE übersetzen
- Hashtags am Ende der Caption → ignorieren oder in tags übernehmen
- Emojis → ignorieren, außer sie tragen Info (🥚 = Ei wenn Mengenangabe daneben)`;

export const RECIPE_PARSER_EXAMPLES = [
  // Beispiel 1: Klassisches Instagram-Rezept (gut strukturiert)
  {
    input: {
      caption: `Skyr-Beeren-Bowl 🥣 mein liebstes Frühstück!

Zutaten (1 Portion):
- 200g Skyr Natur
- 100g gemischte Beeren (TK ok)
- 30g Haferflocken
- 1 EL Honig
- 10g Mandelblättchen

So geht's:
1. Skyr in Schale geben
2. Beeren, Haferflocken, Honig drauf
3. Mit Mandelblättchen toppen

300 kcal | 28g Protein 💪
#highprotein #frühstück #fitfood`,
      source: "instagram",
      source_url: "https://www.instagram.com/reel/ABC123/",
      source_author: "@fitfoodie_de",
    },
    output: {
      status: "ok",
      rezept: {
        source: "instagram",
        source_url: "https://www.instagram.com/reel/ABC123/",
        source_author: "@fitfoodie_de",
        source_caption_raw:
          "Skyr-Beeren-Bowl 🥣 mein liebstes Frühstück! ...",
        titel: "Skyr-Beeren-Bowl",
        beschreibung: "Proteinreiches Frühstück mit Skyr und Beeren",
        portionen: 1,
        zubereitungszeit_min: 5,
        schwierigkeit: "einfach",
        kategorie: ["fruehstueck"],
        zutaten: [
          { name: "Skyr Natur", menge: 200, einheit: "g", hinweis: null },
          {
            name: "Gemischte Beeren",
            menge: 100,
            einheit: "g",
            hinweis: "TK okay",
          },
          { name: "Haferflocken", menge: 30, einheit: "g", hinweis: null },
          { name: "Honig", menge: 1, einheit: "EL", hinweis: null },
          {
            name: "Mandelblättchen",
            menge: 10,
            einheit: "g",
            hinweis: null,
          },
        ],
        zubereitung: [
          "Skyr in eine Schale geben.",
          "Beeren, Haferflocken und Honig dazugeben.",
          "Mit Mandelblättchen toppen.",
        ],
        tags: ["highprotein", "frühstück", "schnell", "vegetarisch"],
        konzept_match: {
          sanamana: false,
          high_protein: true,
          ausgewogen: true,
        },
        naehrwerte: {
          kcal_pro_portion: 300,
          protein_g: 28,
          carbs_g: 38,
          fett_g: 4,
          ballaststoffe_g: 6,
          zucker_g: 18,
          confidence: "high",
          annahme: "Nährwerte aus Caption übernommen",
        },
        bild_url: null,
        ai_confidence: "high",
        ai_warnings: [],
      },
      rueckfrage: null,
      warnungen: [],
    },
  },

  // Beispiel 2: Unstrukturierte Caption (Fließtext)
  {
    input: {
      caption: `Endlich Wochenende und ich gönn mir meine Lieblings-Pasta! Einfach 250g Spaghetti kochen, in der Zwischenzeit 2 Knoblauchzehen mit Olivenöl anbraten, dann 200g Cherrytomaten dazu, kurz schmoren, frischen Basilikum drüber und mit Parmesan servieren. Reicht für 2 Personen, ca 20 Min, easy!`,
      source: "instagram",
      source_url: "https://www.instagram.com/reel/XYZ789/",
      source_author: "@simplecookingberlin",
    },
    output: {
      status: "ok",
      rezept: {
        source: "instagram",
        source_url: "https://www.instagram.com/reel/XYZ789/",
        source_author: "@simplecookingberlin",
        source_caption_raw: "Endlich Wochenende und ich gönn mir...",
        titel: "Spaghetti mit Cherrytomaten und Basilikum",
        beschreibung: "Schnelle Pasta mit Knoblauch und frischen Tomaten",
        portionen: 2,
        zubereitungszeit_min: 20,
        schwierigkeit: "einfach",
        kategorie: ["mittag", "abendessen"],
        zutaten: [
          { name: "Spaghetti", menge: 250, einheit: "g", hinweis: null },
          {
            name: "Knoblauchzehen",
            menge: 2,
            einheit: "Stück",
            hinweis: null,
          },
          {
            name: "Olivenöl",
            menge: null,
            einheit: "nach Geschmack",
            hinweis: "zum Anbraten",
          },
          {
            name: "Cherrytomaten",
            menge: 200,
            einheit: "g",
            hinweis: null,
          },
          {
            name: "Basilikum",
            menge: null,
            einheit: "nach Geschmack",
            hinweis: "frisch",
          },
          {
            name: "Parmesan",
            menge: null,
            einheit: "nach Geschmack",
            hinweis: "zum Servieren",
          },
        ],
        zubereitung: [
          "Spaghetti in Salzwasser kochen.",
          "Knoblauchzehen mit Olivenöl in einer Pfanne anbraten.",
          "Cherrytomaten dazugeben und kurz schmoren.",
          "Mit gekochten Spaghetti vermischen.",
          "Mit frischem Basilikum und Parmesan servieren.",
        ],
        tags: ["pasta", "schnell", "vegetarisch", "italienisch"],
        konzept_match: {
          sanamana: false,
          high_protein: false,
          ausgewogen: true,
        },
        naehrwerte: {
          kcal_pro_portion: 510,
          protein_g: 16,
          carbs_g: 92,
          fett_g: 9,
          ballaststoffe_g: 5,
          zucker_g: 6,
          confidence: "medium",
          annahme:
            "Nährwerte LLM-geschätzt aus Zutaten. Olivenöl- und Parmesan-Menge angenommen.",
        },
        bild_url: null,
        ai_confidence: "medium",
        ai_warnings: [
          "Mengenangaben für Olivenöl, Basilikum und Parmesan fehlten — als 'nach Geschmack' eingetragen",
        ],
      },
      rueckfrage: null,
      warnungen: [],
    },
  },

  // Beispiel 3: Caption ohne Rezept (Werbung/Lifestyle-Post)
  {
    input: {
      caption: `Sonntags-Vibes ☀️ Brunch mit den Mädels war wieder mal traumhaft. Wenn ihr mal in München seid, geht unbedingt zum Café Frischhut! #brunchgoals #münchen #weekend`,
      source: "instagram",
      source_url: "https://www.instagram.com/p/DEF456/",
      source_author: "@lifestyle_munich",
    },
    output: {
      status: "not_a_recipe",
      rezept: null,
      rueckfrage: null,
      warnungen: [
        "Caption enthält kein Rezept, sondern eine Café-Empfehlung. Import abgebrochen.",
      ],
    },
  },

  // Beispiel 4: Caption mit "Recipe in bio" (klassisches Insta-Problem)
  {
    input: {
      caption: `BEST proteinpancakes EVER 🥞 Recipe in my bio! 💪 #fitness #breakfast`,
      source: "instagram",
      source_url: "https://www.instagram.com/reel/GHI789/",
      source_author: "@fitness_chef",
    },
    output: {
      status: "needs_clarification",
      rezept: null,
      rueckfrage:
        "Die Caption enthält kein Rezept — der Creator verweist auf 'Recipe in bio'. Bitte das Rezept manuell ergänzen oder einen anderen Reel-Link verwenden.",
      warnungen: [
        "Rezept nicht in Caption enthalten — nur Verweis auf Bio-Link",
      ],
    },
  },

  // Beispiel 5: SanaMana-Style Smoothie
  {
    input: {
      caption: `Green Power Smoothie 🌿
- 1 Banane
- 1 Handvoll Spinat
- 1 TL Spirulina
- 200ml Mandelmilch
- 1 EL Mandelmus
- 1 TL Chiasamen

Alles in den Mixer, fertig! Perfekt vor dem Workout 💪`,
      source: "instagram",
      source_url: "https://www.instagram.com/reel/JKL012/",
      source_author: "@cleaneating_julia",
    },
    output: {
      status: "ok",
      rezept: {
        source: "instagram",
        source_url: "https://www.instagram.com/reel/JKL012/",
        source_author: "@cleaneating_julia",
        source_caption_raw: "Green Power Smoothie 🌿 ...",
        titel: "Green Power Smoothie",
        beschreibung: "Grüner Smoothie mit Spinat und Superfoods",
        portionen: 1,
        zubereitungszeit_min: 3,
        schwierigkeit: "einfach",
        kategorie: ["fruehstueck", "snack", "getraenk"],
        zutaten: [
          { name: "Banane", menge: 1, einheit: "Stück", hinweis: null },
          {
            name: "Spinat",
            menge: 1,
            einheit: "Handvoll",
            hinweis: "frisch",
          },
          { name: "Spirulina", menge: 1, einheit: "TL", hinweis: null },
          { name: "Mandelmilch", menge: 200, einheit: "ml", hinweis: null },
          { name: "Mandelmus", menge: 1, einheit: "EL", hinweis: null },
          { name: "Chiasamen", menge: 1, einheit: "TL", hinweis: null },
        ],
        zubereitung: ["Alle Zutaten im Mixer pürieren bis cremig."],
        tags: ["smoothie", "vegan", "superfood", "preworkout", "schnell"],
        konzept_match: {
          sanamana: true,
          high_protein: false,
          ausgewogen: true,
        },
        naehrwerte: {
          kcal_pro_portion: 320,
          protein_g: 8,
          carbs_g: 38,
          fett_g: 14,
          ballaststoffe_g: 9,
          zucker_g: 18,
          confidence: "medium",
          annahme: "Nährwerte LLM-geschätzt aus Zutaten",
        },
        bild_url: null,
        ai_confidence: "high",
        ai_warnings: [
          "'1 Handvoll Spinat' = ca. 30g angenommen",
        ],
      },
      rueckfrage: null,
      warnungen: [],
    },
  },
];

/**
 * Helper: Formatiere Beispiele als Few-Shot für den Prompt
 */
export function formatRecipeFewShotExamples(): string {
  return RECIPE_PARSER_EXAMPLES.map(
    (example, index) => `
# BEISPIEL ${index + 1}
## INPUT
\`\`\`json
${JSON.stringify(example.input, null, 2)}
\`\`\`

## OUTPUT
\`\`\`json
${JSON.stringify(example.output, null, 2)}
\`\`\`
`
  ).join("\n");
}

/**
 * Generiere den kompletten Prompt für die Groq API
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
