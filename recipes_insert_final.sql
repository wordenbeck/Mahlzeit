-- MealPlanner Recipes Insert (Sprint 15)
-- 66 Instagram Rezepte
-- Generated: 2026-05-26T07:58:03.557Z

BEGIN;

INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Einfach, gesund und so SAFTIG. Schokoladen Brownies OHNE ZUCKER und OHNE MEHL. 🍫 

Zutaten:
230g Kichererbsen
100g Haferflocken
1 EL Mandelmus
200g Joghurt
50g Leinsamen
5 EL Kakaopulver
1 TL Zimt
100 ml (pflanzliche) Milch
2 Bananen
2 EL Zartbitter Schokoladendrops

Alle Zutaten außer den Schokoladendrops mischen und pürieren. Den Teig in eine Form geben Die Schokoladenchips zum Schluss vorsichtig unterheben und für ca. 25-30 Minuten bei 180 Grad backen. Nach Belieben mit zusätzlicher Schokola'::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/671876087_18590543233059243_7440701318174008786_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=103&_nc_oc=Q6cZ2gHWhzb-wn-tKja8vi2rfjRpqYDb9MdE0kEb_A9islRF7PMc9-iKPO1fn9UTqtg7cPQ&_nc_ohc=wV0WEKbH9hMQ7kNvwHrJSuC&_nc_gid=-ETHZDqopPPRmCvUzj7V5A&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5cym_lfzmQvfmMAvOcni7oSZd1jg-YQyhCNgtrJDzWUQ&oe=6A1B0EF5&_nc_sid=57e406',
  'Einfach, gesund und so SAFTIG. Schokoladen Brownies OHNE ZUC...',
  'Einfach, gesund und so SAFTIG. Schokoladen Brownies OHNE ZUCKER und OHNE MEHL. 🍫',
  2,
  25,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Kichererbsen","menge":230,"einheit":"g","hinweis":null},{"name":"Haferflocken","menge":100,"einheit":"g","hinweis":null},{"name":"Mandelmus","menge":1,"einheit":"el","hinweis":null},{"name":"Joghurt","menge":200,"einheit":"g","hinweis":null},{"name":"Leinsamen","menge":50,"einheit":"g","hinweis":null},{"name":"Kakaopulver","menge":5,"einheit":"el","hinweis":null},{"name":"Zimt","menge":1,"einheit":"tl","hinweis":null},{"name":"Milch","menge":100,"einheit":"ml","hinweis":"pflanzliche"},{"name":"Bananen","menge":2,"einheit":"g","hinweis":null},{"name":"Zartbitter Schokoladendrops","menge":2,"einheit":"el","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","meal-prep"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  '155 Gramm Eiweiß, unter 15 Minuten Zubereitung – und kein einziges Stück Fleisch.

Das ist der komplette Tag, den ich mir selbst gewünscht hätte, als ich angefangen hab. Kein Meal Prep am Sonntag. Keine komplizierten Rezepte. Einfach vier Mahlzeiten, die funktionieren.

Über 20 Kilo Fett hab ich damit verloren. Nicht weil die Rezepte magisch sind – sondern weil sie so einfach sind, dass du sie auch an stressigen Tagen durchziehst.

Speicher dir das ab. Du wirst es öfter brauchen als du denkst.'::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.71878-15/656043516_922805840662779_3695981745779064484_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=103&_nc_oc=Q6cZ2gEMpVbv8W3FlUf_I7mLFW_FZOz3Sx0UxEKQO5lg82DGo9THVIN5IGSYem-GzJM9tp0&_nc_ohc=TL62RiOTXdwQ7kNvwFDHEG1&_nc_gid=_ajiZ2a2EbbNqDFUV5t9xg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af490hsGqdbQXeWn50BpdA93vN4h98cJEsIPmwWVzXaEuQ&oe=6A1B2722&_nc_sid=57e406',
  'Gramm Eiweiß, unter 15 Minuten Zubereitung – und kein einziges Stück Fleisch.',
  '155 Gramm Eiweiß, unter 15 Minuten Zubereitung – und kein einziges Stück Fleisch. Das ist der komplette Tag, den ich mir selbst gewünscht hätte, als ich angefangen hab. Kein Meal Prep am Sonntag. Kein...',
  2,
  15,
  'einfach',
  '{"fleisch"}'::text[],
  '[]'::jsonb,
  '["ist der komplette Tag, den ich mir selbst gewünscht hätte, als ich angefangen hab. Kein Meal Prep am Sonntag. Keine komplizierten Rezepte. Einfach vier Mahlzeiten, die funktionieren.","Speicher dir das ab. Du wirst es öfter brauchen als du denkst."]'::jsonb,
  '{"schnell","meal-prep"}'::text[],
  0.75::float,
  '{"Sehr wenige Zutaten extrahiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'veganer high protein crunch wrap 🥙 mach’s dir nach mit diesen einfach zutaten ⬇️ 
Oder mach’s dir ganz einfach als Bowl ohne Wrap :) 

Nährwerte für ein Wrap (ohne Guacamole) 
820kcal 
80g Protein 
75g Kohlenhydrate 
23g Fett

Crunch Wrap (1 Portion) 

-1 Wrap (Dürüm von Lidl) 
-75g Veggie Hack DM (oder eine Alternative deiner Wahl) 
-2EL Tomatenmark 
-200g Sojajoghurt (ich nutze Alpro Skyr) 

-Selbst-gemachtes Taco Gewürz: 
2EL Paprika Pulver 
1EL Knoblauch Pulver 
1/2EL Cumin 
Salz nach Bedar'::text,
  'https://scontent-fra3-2.cdninstagram.com/v/t51.82787-15/684169039_17923083372316984_9174879384044931789_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra3-2.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2gHs7e5bG5U8ZAN7nIalPW_s5NsaXaL0EgzipJe4M_KBguZ40gI-mUaKzFJjr6M4BxA&_nc_ohc=NyysyX0XgWIQ7kNvwHKGhoc&_nc_gid=aj8WL3WGICNs2snNLLv2Mw&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5WWlf9kPu5I5hD-uxxG-1c9Tr8_IGrBxj0iU-Bz6miGg&oe=6A1B28C8&_nc_sid=57e406',
  'veganer high protein crunch wrap 🥙 mach’s dir nach mit dies...',
  '',
  1,
  10,
  'einfach',
  '{"vegan"}'::text[],
  '[{"name":"mach’s dir ganz einfach als Bowl ohne Wrap :)","menge":null,"einheit":"Oder","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegan","high-protein"}'::text[],
  0.5::float,
  '{"Sehr wenige Zutaten extrahiert","Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Die besten Low Calorie Chips 💪🏾🙌🏾

Nährwerte pro 100 g

Kalorien 135 kcal
Eiweiß 2,1 g
Kohlenhydrate 26,5 g
Fett 2,7 g

Zutaten

2 bis 3 Kartoffeln
Öl Spray
1 TL Salz
1 TL Pfeffer
1 TL Paprika
1 TL Speisestärke

Zubereitung

Schneide die Kartoffeln in sehr dünne Scheiben oder hobel sie gleichmäßig. Lege die Scheiben für etwa 20 Minuten in kaltes Wasser, damit ein Teil der Stärke ausgewaschen wird. Nimm sie anschließend heraus und tupfe sie gründlich trocken.

Gib die Kartoffelscheiben in ein'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/682700688_17911215357388392_7505894508782816674_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gGrZ7QFdFGkvC0KoHFSdzA97VTJJ-ZnnHlI_XORXq2Yzr2E4xj4MG4VmOW_NSInU08&_nc_ohc=DUXLfHdgQUQQ7kNvwG3oMA2&_nc_gid=vPI4T9QE8f81kWmiPPSteQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4CNI4ynCAERKn-W15n9umW9XjlpXpO7NyQoVhmRbsd9g&oe=6A1B2CD4&_nc_sid=57e406',
  'Die besten Low Calorie Chips 💪🏾🙌🏾',
  'Die besten Low Calorie Chips 💪🏾🙌🏾',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[{"name":"3 Kartoffeln","menge":2,"einheit":"bis","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"Pfeffer","menge":1,"einheit":"tl","hinweis":null},{"name":"Paprika","menge":1,"einheit":"tl","hinweis":null},{"name":"Speisestärke","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  '["Schneide die Kartoffeln in sehr dünne Scheiben oder hobel sie gleichmäßig. Lege die Scheiben für etwa  Minuten in kaltes Wasser, damit ein Teil der Stärke ausgewaschen wird. Nimm sie anschließend heraus und tupfe sie gründlich trocken.","Gib die Kartoffelscheiben in eine Schüssel. Streue Salz, Pfeffer, Paprika und die Speisestärke darüber und mische alles gut durch. Gib drei bis vier Sprühstöße Öl dazu und vermenge alles erneut, sodass die Scheiben leicht benetzt sind.","Gib die Kartoffeln in den Airfryer und gare sie bei  Grad in der Funktion Roast für etwa  Minuten. Schüttle den Korb währenddessen zwei Mal, damit sich die Scheiben neu verteilen und gleichmäßig bräunen. Nimm kleinere oder bereits braune Chips zwischendurch heraus.","Breite die fertigen Chips nach dem Garen locker aus und lass sie abkühlen. So bleiben sie knusprig."]'::jsonb,
  '{"vegetarisch","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  '1.700 Kalorien. 175 Gramm Eiweiß. Unter 15 Minuten Zubereitung am Tag.

Kein Meal Prep Sonntag. Keine 47 Zutaten. Keine Rezepte, die du nach drei Tagen wieder aufgibst.

Das hier ist der Faul-aber-shredded-Plan – vier Mahlzeiten, die so einfach sind, dass du sie auch nach einer 10-Stunden-Schicht noch hinbekommst.

Und ja, da ist noch Platz für Snacks drin. Ohne dein Defizit zu sprengen.

Speicher dir das ab. Du wirst es brauchen. 📌'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.71878-15/653923913_1272170487572220_4487360074673392494_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gF40nWS_NVAcCZHm4h_fSH8aDQucZvfOZ8wwZx-194DHuvO0txzDmsHu4DKHts5y9o&_nc_ohc=jKd8YxPHlH8Q7kNvwECo3BA&_nc_gid=LJ1DXttJ-1MQ8sJ55Kf4oA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4l9R34jiE3oI1mFycsAaxx7a_zvEETe4lw1zeF8Zc7Xw&oe=6A1B2B18&_nc_sid=57e406',
  '.700 Kalorien. 175 Gramm Eiweiß. Unter 15 Minuten Zubereitung am Tag.',
  '',
  2,
  15,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[{"name":"hier ist der Faul-aber-shredded-Plan – vier Mahlzeiten, die so einfach sind, dass du sie auch nach einer 10-Stunden-Schicht noch hinbekommst.","menge":null,"einheit":"Das","hinweis":null},{"name":"ja, da ist noch Platz für Snacks drin. Ohne dein Defizit zu sprengen.","menge":null,"einheit":"Und","hinweis":null},{"name":"dir das ab. Du wirst es brauchen. 📌","menge":null,"einheit":"Speicher","hinweis":null}]'::jsonb,
  '["Kein Meal Prep Sonntag. Keine  Zutaten. Keine Rezepte, die du nach drei Tagen wieder aufgibst.","Und ja, da ist noch Platz für Snacks drin. Ohne dein Defizit zu sprengen.","Speicher dir das ab. Du wirst es brauchen."]'::jsonb,
  '{"vegetarisch","schnell","low-calorie","meal-prep"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Meine Go To Frühstücksbowl 💪🏻🌱

Wenn du mal keine Zeit hast, kannst du dir diese High Protein Frühstücksbowl mit über 50g Eiweiß zubereiten.🤝

⏱️ Zubereitungszeit: ca. 5min. (Haferflocken bereits eingeweicht)
⭐️ Schwierigkeitsgrad: Anfänger🤩
⏳Haltbarkeit: Bis zu 1 Tag im Kühlschrank 

#govegan #rezept #vegan #fitness'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.71878-15/671883485_826263723893054_6800495939645958339_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=102&_nc_oc=Q6cZ2gFhlbnFbfgdP0KwwCsKRf80NhwLWQfD8J5lSUKpzBbZaR4z_u0IZQ_jwrhaoZ737Zw&_nc_ohc=ocQDwJTY5v4Q7kNvwGB5HbH&_nc_gid=mkwQN1Am4NiTEkJKUQ3_oA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af55qkCoB9fezusyNHIpA4yRnozx-Wu9vMXb_d2mYqrrSg&oe=6A1B0AAA&_nc_sid=57e406',
  'Meine Go To Frühstücksbowl 💪🏻🌱',
  'Meine Go To Frühstücksbowl 💪🏻🌱 Wenn du mal keine Zeit hast, kannst du dir diese High Protein Frühstücksbowl mit über 50g Eiweiß zubereiten.🤝 ⏱️ Zubereitungszeit: ca. 5min. (Haferflocken bereits ei...',
  2,
  5,
  'einfach',
  '{"vegan"}'::text[],
  '[]'::jsonb,
  '["️ Schwierigkeitsgrad: Anfänger","Haltbarkeit: Bis zu  Tag im Kühlschrank","govegan rezept vegan fitness"]'::jsonb,
  '{"vegan","high-protein"}'::text[],
  0.75::float,
  '{"Sehr wenige Zutaten extrahiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  '☕ Kaffee liefert Koffein, das im Gehirn die Adenosin-Rezeptoren blockiert, sodass Müdigkeitssignale ausbleiben und gleichzeitig über erhöhte Dopaminaktivität Fokus und Stimmung verbessert werden, während Chlorogensäuren als starke Antioxidantien Entzündungswege wie NF-κB hemmen und so langfristig die Gefäßfunktion unterstützen.

🌱 Chiasamen bilden durch ihren hohen Anteil an löslichen Ballaststoffen ein visköses Gel, das die Magenentleerung verlangsamt, Blutzuckerspitzen dämpft und dank ihres A'::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/619873244_18532166854064297_5443246979316963907_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gHyrORZKpIaJ7zc6Ff7ln_ei7A-tOMwu2x8aLLfsCBf3OtQHo6R9kgcwYfTeJtmKPw&_nc_ohc=T-VSpTaxbZ0Q7kNvwEn_XAA&_nc_gid=AgK5zh1YxJ06qztQHUF2Xg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4iti92hrwPt7oJjuBbwoLIz7DmnrzMmH-MKjDQI0d6ug&oe=6A1B2A78&_nc_sid=57e406',
  'Kaffee liefert Koffein, das im Gehirn die Adenosin-Rezeptore...',
  '☕ Kaffee liefert Koffein, das im Gehirn die Adenosin-Rezeptoren blockiert, sodass Müdigkeitssignale ausbleiben und gleichzeitig über erhöhte Dopaminaktivität Fokus und Stimmung verbessert werden, währ...',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[{"name":"Kaffee","menge":80,"einheit":"ml","hinweis":null},{"name":"Chiasamen","menge":2,"einheit":"el","hinweis":null},{"name":"Skyr","menge":150,"einheit":"g","hinweis":null},{"name":"Milch","menge":60,"einheit":"ml","hinweis":null},{"name":"Whey-Protein","menge":1,"einheit":"Scoop","hinweis":null},{"name":"Belieben etwas Kakaopulver zum Bestäuben","menge":null,"einheit":"nach","hinweis":null}]'::jsonb,
  '["Alle Zutaten in einem kleinen Behälter gut vermischen → mindestens  Stunden kühlen, besser über Nacht.","Vor dem Servieren ganz leicht mit Kakao bestäuben.","Credits @balanewithnu"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Dieser Karotten-Wrap aus dem Ofen ist super einfach, schnell gemacht und richtig lecker. 

Zutaten (1–2 Portionen):
3–4 Karotten
1 Ei
Salz & Pfeffer
ca. 60–80 g geriebener Mozzarella
Für die Füllung (nach Geschmack):
z. B. Frischkäse, Avocado, Salat, Tomaten, Gurke, Hummus oder was ihr gerade da habt.

Zubereitung:
Ofen auf 180 °C Umluft vorheizen.

Karotten fein raspeln.
Mit Ei, Mozzarella, Salz und Pfeffer vermengen.

Die Masse auf ein mit Backpapier belegtes Blech geben und flach zu einem Rec'::text,
  'https://scontent-fra3-2.cdninstagram.com/v/t51.82787-15/653868650_17936278332192772_7252912854069796240_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra3-2.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2gHs4-R0rZGf3K9-Hd0J8RfHc5RdoiXjQgPJwyZwjI3DHR1EYX8POBhWoJXUznyt4DQ&_nc_ohc=AyIbKTR6_FwQ7kNvwH5mqlS&_nc_gid=wOcLeXtRxRSg4eKhPy_zrQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4OvuyIl7m6hAuiTVF5eke56hhJWhERK4IRytkwJYzcfA&oe=6A1B12E7&_nc_sid=57e406',
  'Dieser Karotten-Wrap aus dem Ofen ist super einfach, schnell...',
  'Dieser Karotten-Wrap aus dem Ofen ist super einfach, schnell gemacht und richtig lecker.',
  2,
  20,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"Ei","menge":1,"einheit":"g","hinweis":null},{"name":"& Pfeffer","menge":null,"einheit":"Salz","hinweis":null},{"name":"Für die Füllung :","menge":null,"einheit":"nach Geschmack","hinweis":null}]'::jsonb,
  '["Ofen auf  °C Umluft vorheizen.","Karotten fein raspeln.","Mit Ei, Mozzarella, Salz und Pfeffer vermengen.","Masse auf ein mit Backpapier belegtes Blech geben und flach zu einem Rechteck drücken.","Ca. – Minuten backen, bis der Wrap fest und leicht goldbraun ist.","Kurz abkühlen lassen, nach Belieben belegen, einrollen und genießen.","karottenwrap einfacherezepte schnellerezepte gesunderezepte rezepte"]'::jsonb,
  '{"vegetarisch","schnell"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Knuspriger Kartoffel Döner Salat🥗🥙

Heute ist Tag 8 von 10 meiner Serie mit leckeren und einfachen Salaten, folgt mir @liliyummy gerne um Nichts zu verpassen!❤️
In den Salat werdet ihr euch verlieben! Er ist sooooo unglaublich lecker und so einfach gemacht🥗😋

Zutaten:
ca. 500 g Drillinge 
etwas Olivenöl 
Gewürze(Salz, Pfeffer,Paprika)
ca.1/2 Kopfsalat
1-2 Minigurken
2 Handvoll Cherrytomaten
1/4 Rotkohl
1 Zwiebel
300g Hähnchenbrust
1 EL Olivenöl 
Döner Gewürz(Paprika, Knoblauchpulver, Pfeffer'::text,
  'https://scontent-fra3-2.cdninstagram.com/v/t51.71878-15/482320157_919362850272604_1772603488848236251_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra3-2.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2gHSobergpE2cmLJRPsK_ptsoiKWGeSqQWby12HR-5SWA2ZQ_2fDGZoTzgChT-jEbo4&_nc_ohc=8UoTo2HRzTkQ7kNvwEC8Z6c&_nc_gid=vcrEDRerfi56oPp_JTUKNA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af70uISHMrSMLQ1I3RaJ-rwiVZswKEPKhnu6YlVn5Lr0Cw&oe=6A1B2C96&_nc_sid=57e406',
  'Knuspriger Kartoffel Döner Salat🥗🥙',
  'Knuspriger Kartoffel Döner Salat🥗🥙 Heute ist Tag 8 von 10 meiner Serie mit leckeren und einfachen Salaten, folgt mir @liliyummy gerne um Nichts zu verpassen!❤️ In den Salat werdet ihr euch verlieben...',
  2,
  1,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Olivenöl","menge":null,"einheit":"etwas","hinweis":null},{"name":"Cherrytomaten","menge":2,"einheit":"Handvoll","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Hähnchenbrust","menge":300,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"el","hinweis":null},{"name":"Joghurt","menge":200,"einheit":"g","hinweis":"griechischer"},{"name":"Knoblauchzehe","menge":1,"einheit":"g","hinweis":null},{"name":"Tk Kräuter","menge":2,"einheit":"tl","hinweis":null}]'::jsonb,
  '["Zutaten:","ca.  g Drillinge","etwas Olivenöl","Gewürze(Salz, Pfeffer,Paprika)","ca./ Kopfsalat","Minigurken","Handvoll Cherrytomaten","/ Rotkohl","Zwiebel","g Hähnchenbrust","EL Olivenöl","Döner Gewürz(Paprika, Knoblauchpulver, Pfeffer, Chiliflocken, Kreuzkümmel,Oregano)","Für das Dressing:","g (griechischer)Joghurt","/ Zitronensaft","Knoblauchzehe","TL Tk Kräuter","Salz, Pfeffer","Hähnchen in Streifen schneiden und für mindestens  Minuten mit dem Gewürz und Olivenöl marinieren. Danach das Fleisch anbraten.","Drillinge waschen, kochen und danach auf ein mit Backpapier belegtes Backblech platt drücken. Etwas Olivenöl und Gewürze hinzufügen und bei  Grad - Minuten backen.","übrige Gemüse dünn schneiden und in eine Schüssel geben. Die Kartoffeln und das Fleisch abkühlen und dazugeben.","Alle Zutaten für das Dressing vermengen und zu dem Salat hinzufügen.","Schon ist der leckere Salat fertig. Guten Appetit ️","salat döner einfacherezepte schnellerezepte gesunderezepte einfachkochen gemüse","Gesunder einfacher Salat","Schnell kochen","Einfache Rezepte"]'::jsonb,
  '{"schnell"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Diese ￼High Protein Hackfleisch Ofentacos sind unglaublich lecker und haben 20g Eiweiß pro Stück 🌮💪🏾

Nährwerte pro Stück bei 10 Stück

Kalorien ca. 240 kcal
Eiweiß ca. 20 g
Kohlenhydrate ca. 23 g
Fett ca. 7 g

Nährwerte pro 100 g

Kalorien ca. 138 kcal
Eiweiß ca. 11,5 g
Kohlenhydrate ca. 13 g
Fett ca. 4 g

Zutaten

• 700 g Hackfleisch, 5 Prozent Fett
• 1 Zwiebel, gewürfelt
• 1 Paprika, gewürfelt
• 1 Dose Kidneybohnen, abgetropft

Gewürze
• 2 TL Paprikapulver
• 1 TL Knoblauchpulver
• 1 TL Sal'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/685344560_17911728945388392_2843446453117276075_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gFOmjvV1vwuwvJgfeAZ2994zUOM2K9v9FYgNb2CssmK9yoK5wf8NharlMbXqv1m6ls&_nc_ohc=hYphy3KeQcYQ7kNvwGptWyc&_nc_gid=1H1vOkXsijJXpOnLZZSeFQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4B0dFe7E3NE5q28_egXoPvr_c_a9V4YLtsPC3rfZyU-A&oe=6A1B1E56&_nc_sid=57e406',
  'Diese ￼High Protein Hackfleisch Ofentacos sind unglaublich l...',
  'Diese ￼High Protein Hackfleisch Ofentacos sind unglaublich lecker und haben 20g Eiweiß pro Stück 🌮💪🏾',
  2,
  10,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Hackfleisch, 5 Prozent Fett","menge":700,"einheit":"g","hinweis":null},{"name":"Zwiebel, gewürfelt","menge":1,"einheit":"g","hinweis":null},{"name":"Paprika, gewürfelt","menge":1,"einheit":"g","hinweis":null},{"name":"Kidneybohnen, abgetropft","menge":1,"einheit":"dose","hinweis":null},{"name":"Paprikapulver","menge":2,"einheit":"tl","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"1/2 TL Chipotle-Chili","menge":null,"einheit":"g","hinweis":null},{"name":"passierte Tomaten","menge":150,"einheit":"ml","hinweis":null},{"name":"Philadelphia Light Frischkäse","menge":70,"einheit":"g","hinweis":null},{"name":"Öl-Spray","menge":null,"einheit":"g","hinweis":null},{"name":"Tortilla Wraps","menge":10,"einheit":"Mini","hinweis":null},{"name":"fettarmer Streukäse","menge":150,"einheit":"g","hinweis":null}]'::jsonb,
  '["Zwiebel klein schneiden und mit etwas Öl-Spray scharf anbraten","Hackfleisch dazugeben und krümelig braten","Gewürze einrühren und kurz mitrösten","Paprika und Kidneybohnen dazugeben und  bis  Minuten mitbraten","Passierte Tomaten und Frischkäse einrühren und gut vermengen","Kurz köcheln lassen, bis die Masse cremig wird","Tortillas füllen und mit Käse bestreuen","Minuten bei  Grad im Ofen backen"]'::jsonb,
  '{"schnell","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Rezept 20/100 - „Big Mac“ Kartoffelsalat

Zutaten für 3 Portionen:
Für die Kartoffeln
- 600 g Kartoffeln
- 1 EL Olivenöl
- 1 TL Paprikapulver, rosenscharf
- 1/2 TL Salz
Für das Hack:
- 2 Packungen Veganes Hack (ins. 360g)
- 1 TL Olivenöl
- 1 Zwiebel
- 1/2 TL Paprikapulver, edelsüß
- 1/2 TL Knoblauchpulver
Sonstiges:
- 200 g Gewürzgurken
- 1 Eisbergsalat
- 250 g Kirschtomaten

Zutaten für die Sauce:
- 400 g Seidentofu
- 2 EL Senf
- 80 ml Gewürzgurkenwasser
- 1 EL Olivenöl
- 5 EL Ketchup
- 3/4 TL '::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.71878-15/662279019_839542568674686_5126248758430359455_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2gFVVunOzS_OmkHnojbvfzHX0xpeik6m8n3bK4Mzkh2Pv4cTeQkq-UcMBWwM1JhrBvY&_nc_ohc=M_dY7NJsxAoQ7kNvwEs0tx_&_nc_gid=WArokbSga2m7-c-WA1TNLw&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4DS208FsMm4Wk1hddhAPznviBRaFtt_WVRFkOfsQS0JQ&oe=6A1B109A&_nc_sid=57e406',
  'Rezept 20/100 - „Big Mac“ Kartoffelsalat',
  'Rezept 20/100 - „Big Mac“ Kartoffelsalat',
  3,
  25,
  'schwer',
  '{"vegan"}'::text[],
  '[{"name":"Kartoffeln","menge":600,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"el","hinweis":null},{"name":"Paprikapulver, rosenscharf","menge":1,"einheit":"tl","hinweis":null},{"name":"1/2 TL Salz","menge":null,"einheit":"g","hinweis":null},{"name":"Veganes Hack","menge":2,"einheit":"Packungen","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"tl","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"1/2 TL Paprikapulver, edelsüß","menge":null,"einheit":"g","hinweis":null},{"name":"1/2 TL Knoblauchpulver","menge":null,"einheit":"g","hinweis":null},{"name":"Gewürzgurken","menge":200,"einheit":"g","hinweis":null},{"name":"Eisbergsalat","menge":1,"einheit":"g","hinweis":null},{"name":"Kirschtomaten","menge":250,"einheit":"g","hinweis":null},{"name":"Seidentofu","menge":400,"einheit":"g","hinweis":null},{"name":"Senf","menge":2,"einheit":"el","hinweis":null},{"name":"Gewürzgurkenwasser","menge":80,"einheit":"ml","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"el","hinweis":null},{"name":"Ketchup","menge":5,"einheit":"el","hinweis":null},{"name":"3/4 TL Salz","menge":null,"einheit":"g","hinweis":null},{"name":"Chiliöl","menge":null,"einheit":"Etwas","hinweis":null},{"name":"Pfeffer","menge":null,"einheit":"g","hinweis":null}]'::jsonb,
  '["Kartoffeln würfeln und mit  EL Olivenöl,  TL Paprikapulver rosenscharf und / TL Salz vermengen. Bei  Grad für ca.  Minuten in den Ofen oder Airfryer geben. Anschließend Zwiebel würfeln und zusammen mit dem Hack in einer Pfanne mit dem Olivenöl anbraten und mit Paprika- und Knoblauchpulver würzen. Währenddessen Eiserbergsalat und Tomaten und Gewürzgurken klein schneiden. Für die Sauce alle Zutaten miteinander vermengen. Alle Zutaten in eine große Schüssel geben und miteinander vermengen. Wenn man ihn noch für ein paar Stunden im Kühlschrank durchziehen lässt, schmeckt er nochmal viel besser!"]'::jsonb,
  '{"vegan","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Vegane Bohnen-Burger 🍔🔥
knusprig außen, saftig innen – und SO easy!

Zutaten:
• 1 Dose Kidneybohnen (250 g Abtropfgewicht)
• 60 g zarte Haferflocken
• 85 g Zwiebel
• 25 g Mehl
• 1 EL Sojasauce
• 1 EL Senf
• Salz & Pfeffer
• Öl zum Braten

Zubereitung:
Alles außer Zwiebeln mixen ➝ Zwiebeln unterkneten ➝ Pattys formen ➝ goldbraun anbraten ✨
Burger nach Lust & Laune bauen 😍

Save & try it! 🌱💚
#veganburger #rezeptidee #einfachkochen #plantbased'::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.71878-15/686195579_921876690893245_343143960977975119_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=101&_nc_oc=Q6cZ2gHD4Iw8biwTDnp_iShgmYTnRqhOH48B2Bk5CeS-5shizB5TdbbcxcGlzPWvK1SfaKU&_nc_ohc=G6nWaww250IQ7kNvwHCSDtC&_nc_gid=a9YwPaaVpgHh_2_Krmlb8g&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6J5ed7poTJdqQnXvHeXeSjhNzvJN3gZMIsflF7kZ938g&oe=6A1B1E09&_nc_sid=57e406',
  'Vegane Bohnen-Burger 🍔🔥',
  'Vegane Bohnen-Burger 🍔🔥 knusprig außen, saftig innen – und SO easy!',
  2,
  20,
  'mittel',
  '{"vegan"}'::text[],
  '[{"name":"Kidneybohnen","menge":1,"einheit":"dose","hinweis":null},{"name":"zarte Haferflocken","menge":60,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":85,"einheit":"g","hinweis":null},{"name":"Mehl","menge":25,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null},{"name":"Senf","menge":1,"einheit":"el","hinweis":null},{"name":"& Pfeffer","menge":null,"einheit":"Salz","hinweis":null},{"name":"Öl zum Braten","menge":null,"einheit":"g","hinweis":null}]'::jsonb,
  '["Alles außer Zwiebeln mixen ➝ Zwiebeln unterkneten ➝ Pattys formen ➝ goldbraun anbraten","Burger nach Lust & Laune bauen","Save & try it!","veganburger rezeptidee einfachkochen plantbased"]'::jsonb,
  '{"vegan"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Köfte mal ganz anders 😇 
Ein Gericht aus meiner Heimat.

Zutaten:

120 g Berglinsen 
1 große Kartoffel 
1 große Karotte 
1 Zwiebel 
1 TL Salz 
ca. 1 Liter Wasser

Alles zusammen ca. 50 Minuten köcheln lassen, bis das Gemüse weich ist. Falls noch überschüssiges Wasser übrig ist, abschöpfen.

Danach alles gut miteinander zerstampfen.

Dann dazugeben:

150 g Paniermehl 
1 Handvoll gehackte Petersilie 

Gewürze: 
1 TL Paprikapulver 
1 TL Kreuzkümmel 
1 TL Pfeffer 

Alles gut vermengen und daraus kl'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.71878-15/686122856_27152085571052426_619723236533445507_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=102&_nc_oc=Q6cZ2gHXIygq_-1iUiDO3c2ymAdCKQKka6XNzlDDGU-f6ECB18zvBc68oE0OWESjQK0KqQ8&_nc_ohc=KWQla0zn8KQQ7kNvwH0J16B&_nc_gid=c9q6q88w4vELY9Y_3VIpJQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4mE7GAQzUch51SDLPLpREv77ys4Itwbrx3I0eIXNx6yg&oe=6A1B0966&_nc_sid=57e406',
  'Köfte mal ganz anders 😇',
  'Köfte mal ganz anders 😇 Ein Gericht aus meiner Heimat.',
  2,
  50,
  'schwer',
  '{"vegan"}'::text[],
  '[{"name":"Berglinsen","menge":120,"einheit":"g","hinweis":null},{"name":"große Kartoffel","menge":1,"einheit":"g","hinweis":null},{"name":"große Karotte","menge":1,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"zusammen ca. 50 Minuten köcheln lassen, bis das Gemüse weich ist. Falls noch überschüssiges Wasser übrig ist, abschöpfen.","menge":null,"einheit":"Alles","hinweis":null},{"name":"alles gut miteinander zerstampfen.","menge":null,"einheit":"Danach","hinweis":null},{"name":"dazugeben:","menge":null,"einheit":"Dann","hinweis":null},{"name":"Paniermehl","menge":150,"einheit":"g","hinweis":null},{"name":"gehackte Petersilie","menge":1,"einheit":"Handvoll","hinweis":null},{"name":"Paprikapulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Kreuzkümmel","menge":1,"einheit":"tl","hinweis":null},{"name":"Pfeffer","menge":1,"einheit":"tl","hinweis":null},{"name":"gut vermengen und daraus kleine Köfte formen.","menge":null,"einheit":"Alles","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegan"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'TESTO SPAGHETTI sind ein Bi⚡️tzrezept für den schnellen Feierabend! Würdest du sie testen? 🤔 so gehts ⤵️

Zutaten für 2 Portionen:
-2 Avocados
-2 Zehen Knoblauch
-100g Babyspinat 
-1 EL Frischkäse Light
-1 EL Olivenöl
-200g Edamame Spaghetti
-Salz, Pfeffer
-30g Parmesan

Zubereitung: 
So einfach wie im Video! 🤗

Nährwerte pro Portion:
767 kcal
51g Protein
18g KH
45g Fett

👉🏼Du würdest mir einen riesen Gefallen tun, wenn dir das Video gefällt es mit deinen Freunden zu teilen, zu kommentieren '::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/671730295_18582851557008730_7055551595891901524_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gEepn4c0nsStlv9zKHd4zr47XSkDoRsTRG_TUNjVI5SwvKq9QG7K2Mgvrjnz5w-sNo&_nc_ohc=pYarJvyX4jcQ7kNvwH9-Mhi&_nc_gid=N08mOkJDhgQYlLRctLK7ZQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af55dIrSsejwyKn2tmbkut7-GMtm1Mw3Sxi-xSWYUpFYvg&oe=6A1B0267&_nc_sid=57e406',
  'TESTO SPAGHETTI sind ein Bi⚡️tzrezept für den schnellen Feie...',
  'TESTO SPAGHETTI sind ein Bi⚡️tzrezept für den schnellen Feierabend! Würdest du sie testen? 🤔 so gehts ⤵️',
  2,
  20,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Avocados","menge":2,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":2,"einheit":"Zehen","hinweis":null},{"name":"Babyspinat","menge":100,"einheit":"g","hinweis":null},{"name":"Frischkäse Light","menge":1,"einheit":"el","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"el","hinweis":null},{"name":"Edamame Spaghetti","menge":200,"einheit":"g","hinweis":null},{"name":"Parmesan","menge":30,"einheit":"g","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","schnell","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Burger Salad Bowl 

(Per Serving - 2 Total)
593 Calories
56gP | 38gC | 25gF

Ingredients:
400g Extra Lean Ground Beef
300g Cubed Potatoes
½ Diced Red Onion
1 Diced Large Tomato
Diced Pickles
45g Low Fat Shredded Cheese
1 head of lettuce

Burger Sauce/Dressing:
125g Low Fat Greek Yogurt
1 Tbsp Light or Fat Free Mayonnaise
2 Tbsp Yellow Mustard
1½  Tbsp Low Cal Ketchup
2 Tbsp Pickle Juice
2 Tsp Sweetener
Diced Pickles
Diced Onions

Instructions:
1. On a medium high heat, spray your pan with cookin'::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/684732345_18189575968370305_8492451232436769728_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=101&_nc_oc=Q6cZ2gE6FsfnIUZCUOv9cXS6mgdmvLT2COAjloiROlGQ2KGeeTtPl7cySpxG2DgxFYx8IhY&_nc_ohc=wr6YqzvzKRwQ7kNvwF83Fcz&_nc_gid=vFlzy2E6a9fftRKYNcnysg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5nDPlnKn0-e4bePzreei-3M566DJP8ex2-mZkvj1NbhA&oe=6A1B0793&_nc_sid=57e406',
  'Burger Salad Bowl',
  'Burger Salad Bowl (Per Serving - 2 Total) 593 Calories',
  2,
  13,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"Extra Lean Ground Beef","menge":400,"einheit":"g","hinweis":null},{"name":"Cubed Potatoes","menge":300,"einheit":"g","hinweis":null},{"name":"Red Onion","menge":null,"einheit":"Diced","hinweis":null},{"name":"Large Tomato","menge":1,"einheit":"Diced","hinweis":null},{"name":"Pickles","menge":null,"einheit":"Diced","hinweis":null},{"name":"Low Fat Shredded Cheese","menge":45,"einheit":"g","hinweis":null},{"name":"of lettuce","menge":1,"einheit":"head","hinweis":null},{"name":"Sauce/Dressing:","menge":null,"einheit":"Burger","hinweis":null},{"name":"Low Fat Greek Yogurt","menge":125,"einheit":"g","hinweis":null},{"name":"Light or Fat Free Mayonnaise","menge":1,"einheit":"Tbsp","hinweis":null},{"name":"Yellow Mustard","menge":2,"einheit":"Tbsp","hinweis":null},{"name":"Low Cal Ketchup","menge":1,"einheit":"Tbsp","hinweis":null},{"name":"Pickle Juice","menge":2,"einheit":"Tbsp","hinweis":null},{"name":"Sweetener","menge":2,"einheit":"Tsp","hinweis":null},{"name":"Pickles","menge":null,"einheit":"Diced","hinweis":null},{"name":"Onions","menge":null,"einheit":"Diced","hinweis":null},{"name":"a medium high heat, spray your pan with cooking spray and cook the extra lean ground beef until it develops a nice golden colour.","menge":1,"einheit":"On","hinweis":null},{"name":"with seasonings of your choice, I used salt, pepper, garlic powder and onion powder.","menge":2,"einheit":"Season","hinweis":null},{"name":"up 300g of Potato, season with salt, garlic powder, and cook them in the air fryer or oven at 400F for 13-18mins  until golden brown","menge":4,"einheit":"Cubed","hinweis":"Depending on the size of the cubes"},{"name":"into 2 equal portions and enjoy!","menge":6,"einheit":"Divide","hinweis":null},{"name":"me for daily healthy recipes!","menge":null,"einheit":"Follow","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","low-calorie"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'High Protein Asia Nudeln für alle die es lieben beim Asiaten zu bestellen 🍜💪🏾

Pro Portion bei 4 Portionen
Kalorien: ca. 514 kcal
Eiweiß: ca. 55,6 g
Kohlenhydrate: ca. 56,3 g
Fett: ca. 5,0 g

Nährwerte pro 100 g
Kalorien: ca. 127 kcal
Eiweiß: ca. 13,8 g
Kohlenhydrate: ca. 13,9 g
Fett: ca. 1,2 g

Zutaten

Fleisch

* 800 g Hähnchenbrust
* 20 g Sojasauce
* 1 EL Hoisin Sauce
* 1 EL gehackter Knoblauch
* 1 TL Pfeffer
* 1 TL Backpulver
* Ölspray

Sauce

* 30 g dunkle Sojasauce
* 15 g helle Sojasauc'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/671835433_17909489685388392_9129096565483097316_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gFtHyFKHhgqw9GapGOkau5uHRZ7PMWjUnNMsgzCRwrPK_0nT8x0vTZGT5kiYHK9MsE&_nc_ohc=yCznY5V1zBoQ7kNvwEYxsFG&_nc_gid=Xp7SCe7Bgd2_5T1NzaYrCA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5_lqcPO5oOutYq-KtvPGMlq1dBCmV8rRQ2DAIusydShA&oe=6A1B285C&_nc_sid=57e406',
  'High Protein Asia Nudeln für alle die es lieben beim Asiaten zu bestellen 🍜💪🏾',
  'High Protein Asia Nudeln für alle die es lieben beim Asiaten zu bestellen 🍜💪🏾 Pro Portion bei 4 Portionen',
  4,
  20,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Hähnchenbrust","menge":800,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":20,"einheit":"g","hinweis":null},{"name":"Hoisin Sauce","menge":1,"einheit":"el","hinweis":null},{"name":"gehackter Knoblauch","menge":1,"einheit":"el","hinweis":null},{"name":"Pfeffer","menge":1,"einheit":"tl","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Ölspray","menge":null,"einheit":"g","hinweis":null},{"name":"dunkle Sojasauce","menge":30,"einheit":"g","hinweis":null},{"name":"helle Sojasauce","menge":15,"einheit":"g","hinweis":null},{"name":"Austernsauce","menge":15,"einheit":"g","hinweis":null},{"name":"Reisessig","menge":15,"einheit":"g","hinweis":null},{"name":"Stevia","menge":10,"einheit":"g","hinweis":null},{"name":"Maisstärke","menge":1,"einheit":"tl","hinweis":null},{"name":"Mie Nudeln","menge":250,"einheit":"g","hinweis":null},{"name":"Weißkohl","menge":200,"einheit":"g","hinweis":null},{"name":"Karotten","menge":150,"einheit":"g","hinweis":null},{"name":"Frühlingszwiebeln","menge":2,"einheit":"g","hinweis":null}]'::jsonb,
  '["Hähnchen klein schneiden","Mit Sojasauce, Hoisin Sauce, Knoblauch, Pfeffer und Backpulver vermengen","In zwei Portionen mit Ölspray scharf anbraten und durchgaren","Fleisch aus der Pfanne nehmen","Mie Nudeln in heißem Wasser garen und abgießen","Weißkohl in schmale Streifen schneiden","Karotten schälen und schneiden","Frühlingszwiebeln trennen. Das Weiße für die Pfanne, das Grüne für später","Karotten, Weißkohl und das Weiße der Frühlingszwiebeln in der Pfanne anbraten und kurz dünsten","Sauce anrühren und dazugeben","Nudeln und Fleisch wieder in die Pfanne geben","Alles gründlich umrühren","Mit dem Grünen der Frühlingszwiebeln servieren"]'::jsonb,
  '{"high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'High Protein Pizza 

Zutaten:

Teig:
250g Magerquark
140g Dinkelmehl
1 TL Backpulver 
1 Prise Salz 
1 TL Knoblauchpulver 
1 TL Thymian getrocknet 

Zubereitung:
Alle Zutaten miteinander vermengen und anschließend für 20 Minuten kaltstellen.
Nun ausrollen, nach Wahl belegen und bei 200 Grad für ca 15 -17 Minuten backen. 

#protein #pizza #spring #recipe #chef'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.71878-15/681271649_1683892396279946_8031730630856848316_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=102&_nc_oc=Q6cZ2gGyyGaJR38VPu-VQ_vQZvLDtZgA1k9q-_D-h-h7TBSxHnruFwKGLj9Ds7WfRY_wxB4&_nc_ohc=Z4oJUyP6PwkQ7kNvwFWfbUB&_nc_gid=ULRkVS3vN2uwAQw_XjhPqg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6IwHcgrS-BhGI6ZQl3MSWyHEfRBG0bgSz6ARpY-GOxTA&oe=6A1B1ADD&_nc_sid=57e406',
  'High Protein Pizza',
  'High Protein Pizza',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[{"name":"Magerquark","menge":250,"einheit":"g","hinweis":null},{"name":"Dinkelmehl","menge":140,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"prise","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Thymian getrocknet","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  '["Alle Zutaten miteinander vermengen und anschließend für  Minuten kaltstellen.","Nun ausrollen, nach Wahl belegen und bei  Grad für ca  - Minuten backen.","protein pizza spring recipe chef"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'So lecker geworden und noch mehr Medizin, die da drin steckt!

🍯 Datteln
Datteln liefern schnell verfügbare Glukose und Fruktose, die direkt in die Zellen aufgenommen werden. Pathophysiologisch steigt dadurch der Blutzucker zügig an, was kurzfristig Energie liefert. Gleichzeitig enthalten sie Polyphenole, die oxidativen Stress etwas abpuffern.
🥄 Tahini (Sesampaste)
Tahini ist reich an ungesättigten Fettsäuren und Magnesium, wichtig für Nerven- und Muskelfunktion. Auf Zellebene stabilisieren di'::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/675510611_18556717030064297_5163079036718884053_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gGLjLSDh_LXoTB7yPZ2kiIlnwex3GBs4PT3gT_NUdj5t29yQ6kzrKuAN4Ka2iXFnYM&_nc_ohc=2FXn6Hm496oQ7kNvwHn1JEd&_nc_gid=DHNaXZLcDbBTgbMHu4c1KQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4ij5rpv1u8aF7zEbj3yo0MVnHWxznZeFCGKbk2StIK9g&oe=6A1AFA59&_nc_sid=57e406',
  'So lecker geworden und noch mehr Medizin, die da drin steckt!',
  'So lecker geworden und noch mehr Medizin, die da drin steckt! Datteln liefern schnell verfügbare Glukose und Fruktose, die direkt in die Zellen aufgenommen werden. Pathophysiologisch steigt dadurch de...',
  2,
  10,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"8–10 Datteln","menge":null,"einheit":"g","hinweis":null},{"name":"Tahini","menge":2,"einheit":"el","hinweis":null},{"name":"ungesüßtes Kakaopulver","menge":1,"einheit":"el","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Zutat","menge":1,"einheit":"Ei","hinweis":"Größe M"},{"name":"Schokostücke zum Topping","menge":null,"einheit":"Dunkle","hinweis":null}]'::jsonb,
  '["️⃣ Die eingeweichten Datteln sehr fein zerdrücken oder pürieren, bis eine glatte Paste entsteht.","️⃣ Ei, Tahini, Kakaopulver und Backpulver hinzufügen und gut verrühren, bis ein homogener Teig entsteht.","️⃣ Aus dem Teig kleine Cookies formen und in den Airfryer-Korb legen (am besten mit Backpapier).","️⃣ Mit dunklen Schokostücken toppen.","️⃣ Bei  °C im Airfryer ca. – Minuten backen – außen fest, innen weich","Credits @tastyiri_en"]'::jsonb,
  '{"vegetarisch","schnell"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Meine High Protein Chicken Tikker Masala Burritos sind perfekt für ￼Mealprep 🌯💪🏾

Nährwerte pro Burrito bei 8 Stück
Kalorien 404 kcal
Kohlenhydrate 36,5 g
Eiweiß 39,9 g
Fett 8,5 g

Nährwerte pro 100 g
Kalorien 130 kcal
Kohlenhydrate 11,7 g
Eiweiß 12,8 g
Fett 2,7 g

Zutaten
800 g Hähnchenfleisch
140 g fettarmer griechischer Joghurt
Gewürzmischung (Hälfte fürs Fleisch, Hälfte für die Soße)
1 große Zwiebel
Ölspray
1 EL gepresster Knoblauch
2 EL Ingwer
3 EL Tomatenmark
300 ml passierte Tomaten
1 '::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/682096421_17910635814388392_3175842543123427981_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gF-6P6mwbKaCkh0LQfKulnyl0r0zFmAd0Da4giHawevsJc7VJ5uYP0FVSfq4wDCTNE&_nc_ohc=6dxKedAf8ywQ7kNvwEKVB3Z&_nc_gid=zyl_Is_aOAgkMJh5So_0Rg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4jsCy5XOwOQ2B0HjZZ0Kka6kR3jOrKAFxKmIdqRoisTg&oe=6A1AF99D&_nc_sid=57e406',
  'Meine High Protein Chicken Tikker Masala Burritos sind perfe...',
  'Meine High Protein Chicken Tikker Masala Burritos sind perfekt für ￼Mealprep 🌯💪🏾',
  2,
  20,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Hähnchenfleisch","menge":800,"einheit":"g","hinweis":null},{"name":"fettarmer griechischer Joghurt","menge":140,"einheit":"g","hinweis":null},{"name":"große Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"gepresster Knoblauch","menge":1,"einheit":"el","hinweis":null},{"name":"Ingwer","menge":2,"einheit":"el","hinweis":null},{"name":"Tomatenmark","menge":3,"einheit":"el","hinweis":null},{"name":"passierte Tomaten","menge":300,"einheit":"ml","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"fettarmer griechischer Joghurt","menge":140,"einheit":"g","hinweis":null},{"name":"High-Protein-Tortillas","menge":8,"einheit":"g","hinweis":null},{"name":"Reis, ungekocht","menge":130,"einheit":"g","hinweis":null},{"name":"geräuchertes Paprikapulver","menge":3,"einheit":"el","hinweis":null},{"name":"Kreuzkümmel","menge":2,"einheit":"el","hinweis":null},{"name":"Garam Masala","menge":1,"einheit":"el","hinweis":null},{"name":"Kurkuma","menge":1,"einheit":"tl","hinweis":null},{"name":"Cayennepfeffer","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  '["Reis direkt am Anfang nach Packungsangabe kochen","Hähnchen klein schneiden und mit  g Joghurt und der Hälfte der Gewürzmischung vermengen","Fleisch portionsweise mit Ölspray anbraten und danach herausnehmen","Zwiebel und Ingwer klein schneiden","In derselben Pfanne Zwiebel, gepressten Knoblauch und Ingwer mit Ölspray anbraten","Tomatenmark dazugeben und kurz anrösten","Zweite Hälfte der Gewürzmischung einrühren","Passierte Tomaten dazugeben und salzen","Fleisch zurück in die Pfanne geben","Restliche  g Joghurt unterrühren","Gekochten Reis direkt in die Pfanne geben und alles gründlich vermischen","Mischung auf  Tortillas verteilen und einrollen","Burritos in einer Pfanne mit etwas Ölspray rundum anbraten bis sie knusprig sind"]'::jsonb,
  '{"high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'So einfach kanns sein! 💪🏼🙂
Würdest du probieren? 

Zutaten für 2 Portionen:
-1 Gemüsezwiebeln
-1 TL Öl
-200g Frischkäse Light
-250ml Kochsahne Light
-400g Hähnchenbrust
-200g Proteinpasta
-Petersilie
-Paprikapulver, Salz, Pfeffer, Knoblauchpulver

Zubereitung: 
200 Grad Umluft für 20-25 Minuten. Geht auch im Ofen! 

Nährwerte pro Portion:
723 kcal
78,5g Protein
60g KH
15g Fett
#fitnessrezepte #highprotein #abnehmen #diät'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/672978464_18583106875008730_5627073870851062645_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gFW22lTdCU7DmJR4CZm9kgMaAqoXZ3A6W2Oba6vdD3DqJZpdS_HaaJqfI9yvZ550L0&_nc_ohc=z2YE4XUgchsQ7kNvwE7RmOH&_nc_gid=yTHAei_0nBYOjvLA5ekV2w&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5FKX-MUg0hD86jS2_uVNTH3kt8umBIZxnguPMnAZ5xMw&oe=6A1B210D&_nc_sid=57e406',
  'So einfach kanns sein! 💪🏼🙂',
  'So einfach kanns sein! 💪🏼🙂 Würdest du probieren?',
  2,
  20,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"Gemüsezwiebeln","menge":1,"einheit":"g","hinweis":null},{"name":"Öl","menge":1,"einheit":"tl","hinweis":null},{"name":"Frischkäse Light","menge":200,"einheit":"g","hinweis":null},{"name":"Kochsahne Light","menge":250,"einheit":"ml","hinweis":null},{"name":"Hähnchenbrust","menge":400,"einheit":"g","hinweis":null},{"name":"Proteinpasta","menge":200,"einheit":"g","hinweis":null}]'::jsonb,
  '["Würdest du probieren?","Zutaten für  Portionen:","Gemüsezwiebeln","g Frischkäse Light","ml Kochsahne Light","g Hähnchenbrust","g Proteinpasta","Petersilie","Paprikapulver, Salz, Pfeffer, Knoblauchpulver","Grad Umluft für - Minuten. Geht auch im Ofen!"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Tofu kann manchmal das bessere Hähnchen sein, oder? 🤔
Zutaten für 2 Portionen:
-200g Tofu
-1 EL Sojasauce
-1 EL Gara Masala Paste
-2 EL Joghurt
-1/2 rote Zwiebel
-1 Zehe Knoblauch
-400g stückige Tomaten
-250ml Kochsahne 7%
-Curry, Paprikapulver scharf
Zubereitung:
30-40 Minuten bei 180 Grad Umluft in den Ofen. Dazu Reis oder Brot 😍
Nährwerte pro Portion:
330 kcal
20g Protein
17g KH
20g Fett
#gesundeküche #gesunderezepte #muskelaufbau'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/684820823_18584568424008730_2701731696952526218_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gEwxvCIEFbUbOH038ZbyJ0xT5FlKLPIthoB7hXxF9oLiKFDheSA_vIljM2UvmfWOuU&_nc_ohc=ll7AJbbi-QwQ7kNvwEY3q1S&_nc_gid=U-IvZb0K6nMN8jiPZcNvJg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af7ERpS2gS6O8RIJyyokIkKBMncnO5S7PZzFZlT6JpaSUw&oe=6A1B0984&_nc_sid=57e406',
  'Tofu kann manchmal das bessere Hähnchen sein, oder? 🤔',
  'Tofu kann manchmal das bessere Hähnchen sein, oder? 🤔',
  2,
  30,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Tofu","menge":200,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null},{"name":"Gara Masala Paste","menge":1,"einheit":"el","hinweis":null},{"name":"Joghurt","menge":2,"einheit":"el","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"stückige Tomaten","menge":400,"einheit":"g","hinweis":null},{"name":"Kochsahne 7%","menge":250,"einheit":"ml","hinweis":null}]'::jsonb,
  '["Minuten bei  Grad Umluft in den Ofen. Dazu Reis oder Brot"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Anzeige | High Protein Edamame Taccos 

✅High Protein/ proteinreich 
✅low Calorie/ wenige Kalorien 
✅schnell und easy gemacht 

Nährwerte pro Stück: ⬇️
248 Kcal | 7g KH| 24g E| 13g F 

Zutaten pro Stück: 
. 75 g Edamame (TK)
. 20 g Gouda light Reibekäse
Gewürze: Salz, More Spices Knobilicous @morenutrition.de * aktuell gibt es noch -20% auf ALLES mit CODE : KRISI ✨

🔥Backofen vorheizen -200° Ober /Unterhitze: 
10-15 min goldbraun backen lassen - ca. 3-5 min abkühlen lassen , dann drehen ! 

Bel'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/659640257_18091008140239162_6831451153975979329_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gFMcOltCQyD3moYchDabgr9Poz2-wCcL4wIWZklQ4WElLguJ9JSqqJ7QUDQfLFP-Gg&_nc_ohc=MNOpA_6a6koQ7kNvwGn7w3F&_nc_gid=5iM15n0SAvb2R-BIb55tsA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af7Rp3ptWSid_xTczO17lgyGFTWOAWznKEfRr8pXG_yZZw&oe=6A1B17C7&_nc_sid=57e406',
  'Anzeige | High Protein Edamame Taccos',
  'Anzeige | High Protein Edamame Taccos ✅High Protein/ proteinreich',
  2,
  10,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"75 g Edamame","menge":null,"einheit":"g","hinweis":null},{"name":"20 g Gouda light Reibekäse","menge":null,"einheit":"g","hinweis":null},{"name":"nach Wahl:","menge":null,"einheit":"Belag","hinweis":null},{"name":"20 g Hüttenkäse","menge":null,"einheit":"g","hinweis":null},{"name":"10 g Avocado, frisch","menge":null,"einheit":"g","hinweis":null},{"name":"5 g Pesto Rosso","menge":null,"einheit":"g","hinweis":null},{"name":"40 g Lachsschinken, fettarm","menge":null,"einheit":"g","hinweis":null},{"name":"mir gerne nicht, nur um Neues auszuprobieren, sondern auch für viele weitere Rezepte ohne Verzicht in deiner Abnahme😉","menge":null,"einheit":"Folge","hinweis":null},{"name":"Creatorin: @coconutandbliss","menge":null,"einheit":"Orginal","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","schnell","high-protein","low-calorie"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Crunchy Tuna Salat😮‍💨

Ihr könnt den Tuna auch durch Chicken oder Tofu ersetzen 🥰

• 1 Dose Tuna
• ⁠1 Paprika
• ⁠4 Saure gurken viertel
• ⁠1 Dose mais angebraten 
• ⁠1/2 Feta 
• ⁠chili pulver
• ⁠knoblauch pulver
• 2 EL ⁠light mayo
• ⁠griechischer Joghurt'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/684129913_18588417904051986_1351751427937093191_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2gEBjGocCQYtV-bR57a2NLc8ip6_JjUc5HRC1liXB5AxnWzNKLbXC73DX1i7is1An8c&_nc_ohc=wy-PbwpCuZMQ7kNvwG7w67T&_nc_gid=BE6k-Lag2NSI411nWF1LGQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4HQVzt5eWohLtQYvawonZk4ZtxCFz5rA7OccvaCTkABg&oe=6A1AFAAA&_nc_sid=57e406',
  'Crunchy Tuna Salat😮‍💨',
  'Crunchy Tuna Salat😮‍💨 Ihr könnt den Tuna auch durch Chicken oder Tofu ersetzen 🥰 • 1 Dose Tuna',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch"}'::text[],
  0.5::float,
  '{"Sehr wenige Zutaten extrahiert","Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Ingredients 👇

50g medjool dates (1.8oz)
30ml boiling water (1oz)
160g high protein vanilla or Greek yoghurt (5.6oz)
15g peanut butter (0.5oz)
30g chia seeds (1oz)
80ml milk (almond or skim) (3.4oz)

Bowl size - 720ml / 24oz

Mix and refrigerate for ~4 hours or overnight

Enjoy immediately or prep up to 6 for the week ahead!

Multiply the ingredients if you want to make a family size version!

Calories 509
Carbs 61g
Fat 18g
Protein 30g

--- 

Comment “pepsi” if you wanna check out my recipe boo'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/672358057_18135094636526817_2128462333848758134_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=109&_nc_oc=Q6cZ2gFM043TFiivTy44a3bw3XCAblWmDSbxss4FjM40XoOpJWoYLP3kfzPkK3NDI7XOUc4&_nc_ohc=vpzWeObS_VUQ7kNvwHJplfM&_nc_gid=h_B6QaqqTU1O8dIc2CLJ_Q&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af7ScXyOG1483Md88or2SC4QnBe85Dq-mcifxUBFpTIYAA&oe=6A1AFB03&_nc_sid=57e406',
  'Ingredients 👇',
  'Ingredients 👇 50g medjool dates (1.8oz) 30ml boiling water (1oz)',
  2,
  20,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"medjool dates","menge":50,"einheit":"g","hinweis":null},{"name":"boiling water","menge":30,"einheit":"ml","hinweis":null},{"name":"high protein vanilla or Greek yoghurt","menge":160,"einheit":"g","hinweis":null},{"name":"peanut butter","menge":15,"einheit":"g","hinweis":null},{"name":"chia seeds","menge":30,"einheit":"g","hinweis":null},{"name":"milk","menge":80,"einheit":"ml","hinweis":null},{"name":"size - 720ml / 24oz","menge":null,"einheit":"Bowl","hinweis":null},{"name":"and refrigerate for ~4 hours or overnight","menge":null,"einheit":"Mix","hinweis":null},{"name":"immediately or prep up to 6 for the week ahead!","menge":null,"einheit":"Enjoy","hinweis":null},{"name":"509","menge":null,"einheit":"Calories","hinweis":null},{"name":"61g","menge":null,"einheit":"Carbs","hinweis":null},{"name":"18g","menge":null,"einheit":"Fat","hinweis":null},{"name":"30g","menge":null,"einheit":"Protein","hinweis":null},{"name":"“pepsi” if you wanna check out my recipe book with 200 recipes!! 🤗","menge":null,"einheit":"Comment","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'anzeige 🌯 Ich liebe LahmacunAber es gibt ne perfekte Möglichkeit, wie man die vegatarisch macht, ohne dass man irgendetwas vermisst. VEGACUN sozusagen! 
Das einzige, dass ich bisher in meinem Leben vermisst habe, war allerdings dieser einfach nur wundervolle Ofen von @aeg_de . 
Ich wusste nicht wie sehr mich ein Ofen glücklick machen kann, wirklich. 300°C in normaler Funktion und bis zu 340 Grad heiß wird er auf der Pizza Expert Funktion. Damit gelingt dir Pizza, Lahmacun oder vielleicht sogar '::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.71878-15/675448330_1153890780195869_1637251272235814956_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gEr7DwVVe_6XF3795SUyGH49sx1fy0ujysTkUx--SYGpPIY4vuJvi82jiOYylSTA2w&_nc_ohc=zPdO4qCyBJ8Q7kNvwG13x45&_nc_gid=uuGXUOf2Ma1QEqGeJmnpuA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4SeY00Qb4Nm6Io9OKgS-tP4kK1In9yoqIRWcDdGvkL_w&oe=6A1B0C2E&_nc_sid=57e406',
  'anzeige 🌯 Ich liebe LahmacunAber es gibt ne perfekte Möglic...',
  'anzeige 🌯 Ich liebe LahmacunAber es gibt ne perfekte Möglichkeit, wie man die vegatarisch macht, ohne dass man irgendetwas vermisst. VEGACUN sozusagen! Das einzige, dass ich bisher in meinem Leben ve...',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch"}'::text[],
  0.5::float,
  '{"Sehr wenige Zutaten extrahiert","Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Diese High Protein Schoko Brötchen sind unglaublich lecker und super um mitzunehmen 💪🏾🍪

Nährwerte pro Stück bei 16 Stück

Kalorien: ca. 110 kcal
Eiweiß: ca. 7,5 g
Kohlenhydrate: ca. 15 g
Fett: ca. 2–2,5 g

Nährwerte gesamt

Kalorien: ca. 1.760 kcal
Eiweiß: ca. 120 g
Kohlenhydrate: ca. 241 g
Fett: ca. 35–38 g

Zutaten

• 500 g Magerquark
• 300 g Dinkelmehl
• 80 g Stevia Schugga
• 1 Päckchen Backpulver
• 100 g Zartbitter Schokodrops
• 1 TL Vanilleextrakt
• 1 Prise Salz

Zubereitung

Alle Zutat'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/674480786_17909677275388392_140146548222446957_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gEZkWmBx0gEE15NglO1j82-FmeCL1XltNLCG1Z7jDSJbD1QaLQYd0sRpzkxzsFt3D0&_nc_ohc=_YB00UaRMj0Q7kNvwG4lKcR&_nc_gid=0v_gro09EzusGc9-iKcdJA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af76DA6ioWPp5e9WB2mdy0nhxpL8njYMBSM4SAuFd_b-vA&oe=6A1B265E&_nc_sid=57e406',
  'Diese High Protein Schoko Brötchen sind unglaublich lecker u...',
  'Diese High Protein Schoko Brötchen sind unglaublich lecker und super um mitzunehmen 💪🏾🍪',
  2,
  25,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Magerquark","menge":500,"einheit":"g","hinweis":null},{"name":"Dinkelmehl","menge":300,"einheit":"g","hinweis":null},{"name":"Stevia Schugga","menge":80,"einheit":"g","hinweis":null},{"name":"Päckchen Backpulver","menge":1,"einheit":"g","hinweis":null},{"name":"Zartbitter Schokodrops","menge":100,"einheit":"g","hinweis":null},{"name":"Vanilleextrakt","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"prise","hinweis":null}]'::jsonb,
  '["Alle Zutaten in eine große Schüssel geben und gründlich vermengen. Anschließend zu einem gleichmäßigen, geschmeidigen Teig kneten.","Teig auf einer leicht bemehlten Fläche zu einem länglichen Rechteck ausrollen. Das Rechteck der Länge nach halbieren. Anschließend beide Hälften in gleichmäßige Dreiecke schneiden.","Dreiecke von der breiten Seite zur Spitze hin aufrollen und in Form bringen.","Auf ein mit Backpapier belegtes Blech legen und bei  Grad für  bis  Minuten backen, bis sie goldbraun sind."]'::jsonb,
  '{"vegetarisch","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Zutaten:

1TL Chiasamen 
1TL Flohsamen
1TL Flohsamenschalen 
150g H²0 (pure Chemie 🥲) Wasser 
250g Magerquark 
½ Scoop Proteinpulver 
100g Himbeeren / Blaubeeren

👉🏾330kcal,  43g Eiweiß, 28g Kohlenhydrate 

✔️Warum genau dieses Rezept? 
Weil ich einen Vollzeitjob habe und keine Zeit habe, ständig zu kochen. 

✅️super schnell gemacht 10min/Woche

✅️super sättigend 500g und 43g Protein

✅️hält deinen Blutzuckerspiegel 3std stabil

✅️Darmfreundlich 20g Ballaststoffe

✅️sehr gesund.

Kommentiere '::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/632309864_18119874709608084_8143066344936652182_n.jpg?stp=dst-jpg_e15_p480x480_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gFan9zpVWHr0eYJN2VMa5jRzulIgZ4_rCkP9E-iCdCqJtKHfj5ny1ubK1PxflzTEv8&_nc_ohc=wXZ_vdd7HH4Q7kNvwHDMZh2&_nc_gid=CEF68BZlcZzEqZ9ihvAB4Q&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4wtUXdxsFoafI5i9Sa1LgwqoRUXMlBPoTeoCSB79SRDw&oe=6A1B0AFC&_nc_sid=57e406',
  'Zutaten:',
  '',
  2,
  10,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Chiasamen","menge":1,"einheit":"tl","hinweis":null},{"name":"Flohsamen","menge":1,"einheit":"tl","hinweis":null},{"name":"Flohsamenschalen","menge":1,"einheit":"tl","hinweis":null},{"name":"H²0  Wasser","menge":150,"einheit":"g","hinweis":"pure Chemie 🥲"},{"name":"Magerquark","menge":250,"einheit":"g","hinweis":null},{"name":"Proteinpulver","menge":null,"einheit":"Scoop","hinweis":null},{"name":"Himbeeren / Blaubeeren","menge":100,"einheit":"g","hinweis":null},{"name":"ich einen Vollzeitjob habe und keine Zeit habe, ständig zu kochen.","menge":null,"einheit":"Weil","hinweis":null},{"name":"\"Ing\", wenn du mit minimaler Aufwand das Maximum aus dir herausholen möchtest.","menge":null,"einheit":"Kommentiere","hinweis":null},{"name":"dir das Video gefallen? Teile es mit einem Freund oder Arbeitskollege","menge":null,"einheit":"Hat","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","schnell","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Mach dir diese High Protein Schüttel Pizza, anstatt den Skyr so zu essen 🍕💪🏾

￼Nährwerte:
Kalorien: ca. 1.259 kcal
Eiweiß: ca. 164 g
Kohlenhydrate: ca. 47 g
Fett: ca. 44 g

Nährwerte pro 100 g:

Kalorien: ca. 126 kcal
Eiweiß: ca. 16,4 g
Kohlenhydrate: ca. 4,7 g
Fett: ca. 4,4 g

Zutaten

500 g Skyr
150 g Thunfisch
110 g Zwiebeln
frische Petersilie
3 Eier, 165 g
90 g Mais
150 g Light Käse
Salz
Pfeffer

Zubereitung

Alle Zutaten in einer Schüssel zusammen mischen. Die Masse auf ein mit Backpapie'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/658339292_17906677749388392_7336567658382391564_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gGH-nmF5O12HfKnlLAKDVzLoFyEGubq_V_TegVtqAT_lOe4oOelGAIpXredB_vyZMk&_nc_ohc=PJuVg8AjOVwQ7kNvwH-dfnY&_nc_gid=QTykBdJRQ_zZbE8g9mi72g&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4GGp-YfUIDL6toxtXhBGer1KXnUTyl-cBdCVn3JYrbBw&oe=6A1B1242&_nc_sid=57e406',
  'Mach dir diese High Protein Schüttel Pizza, anstatt den Skyr so zu essen 🍕💪🏾',
  'Mach dir diese High Protein Schüttel Pizza, anstatt den Skyr so zu essen 🍕💪🏾',
  2,
  40,
  'mittel',
  '{"fisch"}'::text[],
  '[{"name":"Skyr","menge":500,"einheit":"g","hinweis":null},{"name":"Thunfisch","menge":150,"einheit":"g","hinweis":null},{"name":"Zwiebeln","menge":110,"einheit":"g","hinweis":null},{"name":"Petersilie","menge":null,"einheit":"frische","hinweis":null},{"name":"Eier, 165 g","menge":3,"einheit":"g","hinweis":null},{"name":"Mais","menge":90,"einheit":"g","hinweis":null},{"name":"Light Käse","menge":150,"einheit":"g","hinweis":null}]'::jsonb,
  '["Alle Zutaten in einer Schüssel zusammen mischen. Die Masse auf ein mit Backpapier ausgelegtes Blech verteilen. Dann bei  Grad Umluft  bis  Minuten backen.","highprotein instagram"]'::jsonb,
  '{"high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Gewinnspiel (beendet): Dein 5-Zutaten-Kuchen für Muskeln und Nerven ⤵️

Um einen von 5 @esncom -Gutscheinen zu gewinnen, like und speichere dieses Video und kommentiere einmal unten - was genau, verrate ich dir am Ende vom Video.
Und sag doch mal bescheid: sehen wir uns bei der FIBO?

🥚 Protein
Protein dient nicht nur dem Muskelaufbau, sondern kann als Baustein für Enzyme, Hormone und Signalstoffe zum Stoffwechsel, Immunsystem und zur Gewebereparatur beitragen.
🍎 Apfel
Äpfel liefern Ballaststo'::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/671117859_18553035622064297_3358818561814668890_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gFnMXvW_MRcxmVnJCjwCThYoxXiG_IieoX1zH7E5Ut4UqER1YvsTxKzljl_u5oq0bo&_nc_ohc=dSkTySlp-MMQ7kNvwFORZnx&_nc_gid=azOj9t_-ryEA61NoL40yow&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6W9mPl-0CTilsmQo_wGZhr4Dwh7eUBw1OKlnJ3H14wZQ&oe=6A1AFD87&_nc_sid=57e406',
  'Gewinnspiel (beendet): Dein 5-Zutaten-Kuchen für Muskeln und Nerven ⤵️',
  '',
  2,
  15,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"einen von 5 @esncom -Gutscheinen zu gewinnen, like und speichere dieses Video und kommentiere einmal unten - was genau, verrate ich dir am Ende vom Video.","menge":null,"einheit":"Um","hinweis":null},{"name":"sag doch mal bescheid: sehen wir uns bei der FIBO?","menge":null,"einheit":"Und","hinweis":null},{"name":"dient nicht nur dem Muskelaufbau, sondern kann als Baustein für Enzyme, Hormone und Signalstoffe zum Stoffwechsel, Immunsystem und zur Gewebereparatur beitragen.","menge":null,"einheit":"Protein","hinweis":null},{"name":"Apfel","menge":1,"einheit":"g","hinweis":null},{"name":"Ei","menge":1,"einheit":"g","hinweis":null},{"name":"Schoko-Proteinpulver","menge":30,"einheit":"g","hinweis":null},{"name":"Kakaopulver","menge":5,"einheit":"g","hinweis":null},{"name":"Schokodrops","menge":10,"einheit":"g","hinweis":null}]'::jsonb,
  '["Schneide den Apfel in kleine Stücke.","Gib Apfelstücke, Ei, Proteinpulver und Kakaopulver in einen Mixer und mixe alles zu einer glatten Masse.","Fülle den Teig in eine kleine ofenfeste Form und streue die Schokodrops darüber.","Backe den Kuchen bei  Grad Umluft etwa  Minuten, bis die Oberfläche leicht fest ist.","Credits @andisoergel","Gewinnspiel steht in keinem Zusammenhang mit Meta. Die Auslosung erfolgt am Sonntag, den .. um  Uhr. Gewinner werden per DM von diesem Kanal benachrichtigt."]'::jsonb,
  '{"vegetarisch","schnell","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Ich garantiere dir: Bei euch zu Hause wird das ein echter Publikumsliebling

Zutaten für 4 Personen:
3-5 Frühlingszwiebeln
100 g Shiitake Pilze
1 Knoblauchzehe
1 daumengroßes Stück Ingwer
500 g Schweinehackfleisch (Ihr könnt natürlich auch vegetarisches nehmen)
1 TL brauner Zucker
2 EL helle Sojasauce
1 EL Fischsauce
1 EL Reisessig
1 EL geröstetes Sesamöl
Salz
24 Wantan Teigblätter (ca. 250 g)
Crispy Chiliöl
Gerösteter Sesam

Zubereitung:

Die Frühlingszwiebeln bitte in dicke Ringe schneiden. Nu'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/639504188_18213283561316150_5323705068847142271_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=102&_nc_oc=Q6cZ2gHsGvzTGiPO-J2tskc4pRj2GZRPeP5JXIHzpTL7TpHE2twBEGnfQNB1ol9BuwdOAlA&_nc_ohc=0eb835rfwLMQ7kNvwEvHxsh&_nc_gid=tLOmZd1JFpmEc35Dga9Flg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6lhzf-wY9V1z2SeL7IFKm-w22tH96FoRdgdVWtobKz9A&oe=6A1B0EA6&_nc_sid=57e406',
  'Ich garantiere dir: Bei euch zu Hause wird das ein echter Publikumsliebling',
  'Ich garantiere dir: Bei euch zu Hause wird das ein echter Publikumsliebling',
  2,
  45,
  'schwer',
  '{"vegetarisch","fleisch","fisch"}'::text[],
  '[{"name":"Shiitake Pilze","menge":100,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"g","hinweis":null},{"name":"daumengroßes Stück Ingwer","menge":1,"einheit":"g","hinweis":null},{"name":"Schweinehackfleisch","menge":500,"einheit":"g","hinweis":null},{"name":"brauner Zucker","menge":1,"einheit":"tl","hinweis":null},{"name":"helle Sojasauce","menge":2,"einheit":"el","hinweis":null},{"name":"Fischsauce","menge":1,"einheit":"el","hinweis":null},{"name":"Reisessig","menge":1,"einheit":"el","hinweis":null},{"name":"geröstetes Sesamöl","menge":1,"einheit":"el","hinweis":null},{"name":"Teigblätter","menge":24,"einheit":"Wantan","hinweis":null},{"name":"Chiliöl","menge":null,"einheit":"Crispy","hinweis":null}]'::jsonb,
  '["Frühlingszwiebeln bitte in dicke Ringe schneiden. Nur  Frühlingszwiebel in feine Ringe für obendrauf, die legen wir in kaltes Wasser. Die Shiitake Pilze entweder mit einem Messer hacken oder mit den Händen auseinanderrupfen. Geht beides. Den Knoblauch und den Ingwer schälen und dann ganz fein reiben.","Alles mit dem Hackfleisch in eine ausreichend große Schüssel geben. Das Ganze kriegt jetzt dann die volle Asia Umamiklatsche mit dem braunen Zucker, Sojasauce, Fischsauce, Reisessig und Sesamöl. (Wichtig: achtet darauf, dass das Sesamöl aus geröstetem Sesam ist.) Eventuell noch mit Salz abschmecken. Jetzt alle Zutaten mischen.","Auflaufform mit den ungefähren Maßen  x  cm heraussuchen (plus minus). Als erstes mit  Wantan Teigblättern eine Teigschicht in die Form geben. Sie sollten leicht überlappen. Wir schichten jetzt abwechselnd die Fleischfüllung und die Teigblätter in die Form, bis wir  Schichten haben. Abschließen tun wir mit den Teigblättern.","Zum Schluss gießen wir ca.  ml Wasser drüber, decken die Form möglichst eng mit Alufolie ab und schieben das Ganze dann für ca.  Minuten in den vorgeheizten Ofen (E-Herd:  °C, Umluft:  °C, Gas: Stufe ).","fertige Dumplinglasagne mit Frühlingszwiebelringen, Crispy Chiliöl und Sesam toppen und heiß servieren. Trust me, das ist wirklich sehr lecker!!","Backzeit: ca.  Minuten"]'::jsonb,
  '{"vegetarisch"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Abendessen für Faule! Anzeige. Denn für 2 Portionen brauchst du nur folgende Zutaten: 

Zutaten für 2 Portionen:
-1 Paprika gelb
-1 Paprika rot
-1 Paprika grün
-1 rote Zwiebel
-1 Zehe Knoblauch
-400g Hähnchenbrust
-1 EL Tomatenmark
-250ml Kochsahne light
-2 cl Metaxa
-50g Reibekäse Light
-200g Reis
-Salz, Pfeffer, Paprikapulver, Oregano, Knoblauchgewürz

Zubereitung: 
Hähnchen in kleine Stücke schneiden, mit etwas Öl und Paprikapulver, Salz, Pfeffer, Knoblauchpulver, Oregano für 8 Minuten bei 19'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/688792993_18587903440008730_5054461167896645006_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGhU3f0aBrsJBy8KTytEyG7nJSTKTHvs8r5cWDnbbWXxASpOsmMZ7bUrNezDc5m3Rs&_nc_ohc=rx0EVxP8_r8Q7kNvwFk8qVX&_nc_gid=lV3Tc_acNWGy29nk0SRH8g&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af46bP6dN39-Wzv-3978ti-YS7VKaE6oWKqDm9Y_m73w9w&oe=6A1B2CC0&_nc_sid=57e406',
  'Abendessen für Faule! Anzeige. Denn für 2 Portionen brauchst...',
  '',
  2,
  8,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"gelb","menge":1,"einheit":"Paprika","hinweis":null},{"name":"rot","menge":1,"einheit":"Paprika","hinweis":null},{"name":"grün","menge":1,"einheit":"Paprika","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"rote","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Hähnchenbrust","menge":400,"einheit":"g","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"el","hinweis":null},{"name":"Kochsahne light","menge":250,"einheit":"ml","hinweis":null},{"name":"Metaxa","menge":2,"einheit":"cl","hinweis":null},{"name":"Reibekäse Light","menge":50,"einheit":"g","hinweis":null},{"name":"Reis","menge":200,"einheit":"g","hinweis":null}]'::jsonb,
  '["Hähnchen in kleine Stücke schneiden, mit etwas Öl und Paprikapulver, Salz, Pfeffer, Knoblauchpulver, Oregano für  Minuten bei  Grad in den @ninja.deutschland Crispy Pro geben.","Währenddessen die Sauce zubereiten.","Dann den Einsatz herausnehmen, mit der Sauce übergießen sowie Käse darüber verteilen. Für  Minuten bei  Grad wieder rein.","Dazu Reis oder Nudeln und fertig!"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Hättest du gedacht, dass es so einfach sein könnte abzunehmen?! Anzeige
⚡️Hier findest du die Rezepte ⤵️⚡️
🔥Für 24h (Montag 11.05. 23:59 Uhr) gibt es bei ESN 25% auf ALLES mit Code: KAY und keine Versandkosten ab 25€👉🏼 Meine Empfehlungen findet ihr im Link in meinem Profil🔥 

Rezept Spaghetti Eis⤵️
Zutaten:
-  200g gefrorene Erdbeeren
-  50ml Wasser
-  2 EL Erythrit
-  Saft einer halben Zitrone
-  200ml Sahne (fettreduziert)
-  1kg Skyr
-  1 Paket Puddingpulver
-  3 Scoops Flavor Powder (Süß'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/688745494_18587831266008730_4943734740993424254_n.jpg?stp=dst-jpg_e15_p640x640_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gFIGoihBxFiAXmDTAZogDJ9mNf26ei3k12daQkT7RHXS7CRK_d58qUl_rzXqNyX8l8&_nc_ohc=OjmwPwRA-YUQ7kNvwGYkVxv&_nc_gid=lk36UkbG6tho5nRJ3lPE_Q&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af7XTChpTC_5FmZsAW2CVxeW8jwM8QaG5QcunWQiecy_jg&oe=6A1B12AA&_nc_sid=57e406',
  'Hättest du gedacht, dass es so einfach sein könnte abzunehmen?! Anzeige',
  'Hättest du gedacht, dass es so einfach sein könnte abzunehmen?! Anzeige ⚡️Hier findest du die Rezepte ⤵️⚡️ 🔥Für 24h (Montag 11.05. 23:59 Uhr) gibt es bei ESN 25% auf ALLES mit Code: KAY und keine Ver...',
  2,
  20,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"gefrorene Erdbeeren","menge":200,"einheit":"g","hinweis":null},{"name":"Wasser","menge":50,"einheit":"ml","hinweis":null},{"name":"Erythrit","menge":2,"einheit":"el","hinweis":null},{"name":"einer halben Zitrone","menge":null,"einheit":"Saft","hinweis":null},{"name":"Sahne","menge":200,"einheit":"ml","hinweis":null},{"name":"Skyr","menge":1,"einheit":"kg","hinweis":null},{"name":"Puddingpulver","menge":1,"einheit":"Paket","hinweis":null},{"name":"Flavor Powder","menge":3,"einheit":"Scoops","hinweis":null},{"name":"Weiße Schokolade","menge":10,"einheit":"g","hinweis":null}]'::jsonb,
  '["️Hier findest du die Rezepte ️️","Für h (Montag .. : Uhr) gibt es bei ESN % auf ALLES mit Code: KAY und keine Versandkosten ab € Meine Empfehlungen findet ihr im Link in meinem Profil","Rezept Spaghetti Eis️","Zutaten:","g gefrorene Erdbeeren","ml Wasser","EL Erythrit","Saft einer halben Zitrone","ml Sahne (fettreduziert)","kg Skyr","Paket Puddingpulver","Scoops Flavor Powder (Süßungsmittel)","g Weiße Schokolade","Sahne schlagen. Puddingpulver mit Skyr und Flavor Powder vermischen. Sahne unterheben.","In einen Mixer gefrorene Erdbeeren, Wasser, Erythrit und Zitronensaft. Durchmixen.","Jetzt nur noch anrichten!","Rezept Abendessen:","Zutaten:","g Kartoffeln","g Hirtenkäse","g körniger Frischkäse","Frühlingszwiebel","EL Chiliöl","g Cocktailtomaten","Salz, Pfeffer, Oregano","Kartoffel kleinschneiden und mit Öl und Salz vermengen. Bei  Grad Umluft für  Minuten in den Ofen.","In eine Auflaufform Tomaten, Lauchzwiebeln, Knoblquch, Chiliöl, Hirtenkäse, Salz & Oregano. Gut durchmengen und mit in den Ofen.","Kartoffeln auf den Teller. In die Mitte körnigen Frischkäse mit Salz und darüber die Tomaten geben.","feierabend abendessen abnehmen diät"]'::jsonb,
  '{"vegetarisch"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Flammkuchen Kartoﬀeln machst du mit diesen Zutaten:
-500g Kartoﬀeln (vorw. Fest)
-6 Eier
-1 großer EL Creme Leicht
-100g magere Schinkenwürfel
-1 Zwiebel
-1 Lauchzwiebel
-Salz & Pfeﬀer

Zubereitung:
Kartoﬀeln schälen und in Würfel schneiden.
In einer Pfanne kurz scharf anbraten dann Hitze auf 2/3 stellen, Deckel drauf,
immer mal wieder durchmengen und nach ca 10-15 Minuten Schinkenwürfel
und Zwiebel dazu.
Richtig gut Salzen!
Dann das Ei mit dem Creme Leicht vermengen und über die Kartoﬀeln
geben'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/688893529_18587543359008730_2939742039877632634_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gHTKsiR-xqoTVonh-iVfALz8ZSZtdkcuNvjX-30_yk-idAa_GLwEBp0piNRk5_5fpA&_nc_ohc=ZZf7z7thv_kQ7kNvwGKE-c3&_nc_gid=JR9tD-9gAb33zh8lSvEy5Q&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5GDv4LUDMD_MRVvr5UHu6QtniSn82nrz20xkpgLmuVOw&oe=6A1AF7A8&_nc_sid=57e406',
  'Flammkuchen Kartoﬀeln machst du mit diesen Zutaten:',
  '',
  2,
  10,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"Kartoﬀeln","menge":500,"einheit":"g","hinweis":null},{"name":"Eier","menge":6,"einheit":"g","hinweis":null},{"name":"großer EL Creme Leicht","menge":1,"einheit":"g","hinweis":null},{"name":"magere Schinkenwürfel","menge":100,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Lauchzwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"& Pfeﬀer","menge":null,"einheit":"Salz","hinweis":null}]'::jsonb,
  '["Kartoﬀeln schälen und in Würfel schneiden.","In einer Pfanne kurz scharf anbraten dann Hitze auf / stellen, Deckel drauf,","immer mal wieder durchmengen und nach ca - Minuten Schinkenwürfel","und Zwiebel dazu.","Richtig gut Salzen!","Dann das Ei mit dem Creme Leicht vermengen und über die Kartoﬀeln","geben. Darüber die Lauchzwiebeln und auf / Hitze mit Deckel garen bis","Ei fest ist."]'::jsonb,
  '{"vegetarisch","schnell","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'CAESAR KARTOFFELN mit 433 Kcal! 💪🏼🤩
Zutaten:
-400g Kartoffeln
-400ml Wasser
-2 EL Skyr
-1 EL Mayo Light
-1 TL Senf
-Saft einer 1/2 Zitrone
-1 Zehe Knoblauch
-1 TL Olivenöl
-300g grüner Spargel 
-1 EL Worcestershire Sauce
-Schnittlauch
-Salz, Pfeffer

Zubereitung: 
Kartoffeln (roh) in die Pfanne und mit dem Wasser und Deckel ca. 15-20 Minuten köcheln lassen, bis das Wasser vollständig verdampft ist. 
Danach Öl und Salz dazu, kurz anknuspern bis ebenfalls der Spargel kommt. 
In der Zwischenzeit'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/687473103_18587261899008730_8975764756709312542_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gHDEfuRNvlr-S6NdiWtnEG--JgOuAd-2cwyklJKP20CqUsXsQQ3-T7J3J_Xd52mi3k&_nc_ohc=JaiaVQH3UCAQ7kNvwEhRc71&_nc_gid=SzU10K5pl6kgAqPdqJJKmw&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5vEffiew8u5r-kivAh0mDKkUV3yvnSoB4N8cTrewrm3Q&oe=6A1B0216&_nc_sid=57e406',
  'CAESAR KARTOFFELN mit 433 Kcal! 💪🏼🤩',
  'CAESAR KARTOFFELN mit 433 Kcal! 💪🏼🤩',
  2,
  15,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"Wasser","menge":400,"einheit":"ml","hinweis":null},{"name":"Skyr","menge":2,"einheit":"el","hinweis":null},{"name":"Mayo Light","menge":1,"einheit":"el","hinweis":null},{"name":"Senf","menge":1,"einheit":"tl","hinweis":null},{"name":"einer 1/2 Zitrone","menge":null,"einheit":"Saft","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"tl","hinweis":null},{"name":"grüner Spargel","menge":300,"einheit":"g","hinweis":null},{"name":"Worcestershire Sauce","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  '["Kartoffeln (roh) in die Pfanne und mit dem Wasser und Deckel ca. - Minuten köcheln lassen, bis das Wasser vollständig verdampft ist.","Danach Öl und Salz dazu, kurz anknuspern bis ebenfalls der Spargel kommt.","In der Zwischenzeit das Dressing zubereiten.","Mit Balsamico wie im Video anrichten!"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Benjamin Blümchen Oats mit 40g Protein pro Glas sind absolut köstlich! 🤩 Du brauchst diese
Zutaten für 3 Portionen:
-120g Haferflocken
-50g Whey Protein
-250ml Sahne light
-1 Scoop Flavour Powder
-150g Himbeeren
-500g Magerquark
-Bunte Streusel

Zubereitung: 
So einfach wie im Video! 

Nährwerte pro Portion:
509 kcal
40g Protein
37g KH
20g Fett
#frühstück #muskelaufbau #fitnesrezepte #benjaminblümchen'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/688428913_18586979194008730_4542065116490418941_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gF8nYd-RgbUXnmOu2o-D3QAxVMyqX3FIg329YvaW0pq5tPowZciY2aNnMeV0FRvzxg&_nc_ohc=m56gUtrsacwQ7kNvwFMl0x4&_nc_gid=PAf1Vr5X9j-Oi9OqaakFMg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5UzZguTy9MK_oWbxc3PMumF1uPAOjI9g3k77IOPEUd6A&oe=6A1B24D5&_nc_sid=57e406',
  'Benjamin Blümchen Oats mit 40g Protein pro Glas sind absolut...',
  'Benjamin Blümchen Oats mit 40g Protein pro Glas sind absolut köstlich! 🤩 Du brauchst diese',
  3,
  20,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Haferflocken","menge":120,"einheit":"g","hinweis":null},{"name":"Whey Protein","menge":50,"einheit":"g","hinweis":null},{"name":"Sahne light","menge":250,"einheit":"ml","hinweis":null},{"name":"Flavour Powder","menge":1,"einheit":"Scoop","hinweis":null},{"name":"Himbeeren","menge":150,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":500,"einheit":"g","hinweis":null},{"name":"Streusel","menge":null,"einheit":"Bunte","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  '1 Tag mit 1800 oder 2400 Kcal und viel Protein! Hier findest du alle Rezepte + Nährwerte⤵️
Zutaten: 🥔
-300g Kartoffeln
-80g Creme leicht
-100g Reibekäse Light
-50g magere Schinkenwürfel
-1 Lauchzwiebel
-Salz, Pfeffer

Zubereitung: 
Drillinge 20 Minuten vorkochen. 
Belegen und nochmal 15 Minuten bei 200 Grad Umluft in den Ofen. 

Nährwerte:
680 kcal
47g Protein
50g KH
28g Fett

Zutaten: 🥣 
-50g Haferflocken
-50ml Mandelmilch
-30g Whey
-200g Joghurt
-1 Banane
-10g Mandelsplitter
-5g Karamell Sau'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/686948097_18586824001008730_6906129542708774607_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGYnaucgPNhS_2hPnrhrj5C3eqehy3jBRe6YIEclhZ0zhytpiYEAv0YXnUs4M7scpo&_nc_ohc=3TJlD5Ak43wQ7kNvwFHZuft&_nc_gid=GzFrhCfQfoaVQg9hHLxihQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5zON830dttPhKkJrTpKVJO_JC_YPWp-JABtDal1BhWXw&oe=6A1B1C73&_nc_sid=57e406',
  'Tag mit 1800 oder 2400 Kcal und viel Protein! Hier findest d...',
  '',
  4,
  20,
  'einfach',
  '{"fleisch"}'::text[],
  '[{"name":"Kartoffeln","menge":300,"einheit":"g","hinweis":null},{"name":"Creme leicht","menge":80,"einheit":"g","hinweis":null},{"name":"Reibekäse Light","menge":100,"einheit":"g","hinweis":null},{"name":"magere Schinkenwürfel","menge":50,"einheit":"g","hinweis":null},{"name":"Lauchzwiebel","menge":1,"einheit":"g","hinweis":null}]'::jsonb,
  '["Drillinge  Minuten vorkochen.","Belegen und nochmal  Minuten bei  Grad Umluft in den Ofen."]'::jsonb,
  '{"schnell","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Auch einfache Zutaten können ziemlich spannende Biochemie enthalten 👀
🥔 Kleine Kartoffeln enthalten im Verhältnis mehr Schale – und direkt darunter sitzen viele Mineralstoffe und sekundäre Pflanzenstoffe. Außerdem liefern sie resistente Stärke, besonders wenn sie nach dem Kochen abkühlen. Das enthaltene Kalium spielt zusätzlich eine wichtige Rolle für Muskel- und Nervenfunktion.
🥣 Magerquark besteht überwiegend aus Casein, einem Milchprotein, das relativ langsam verdaut wird. Durch die Milchs'::text,
  'https://scontent-fra3-1.cdninstagram.com/v/t51.71878-15/687748522_27450284634574445_1711501751356573825_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gGGaxR_FbAToa-nyGnS7H4L08MQN_incOKkt3kvwwuGyiDy-pGbT3xq31Ns7fON97M&_nc_ohc=X3VfRTMGMVQQ7kNvwG4oNHR&_nc_gid=XgCQQzqiI0hc91bF9WS3bQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5n1alAhMYcurc_EBjkmkgZm1KP9IiguYb31c_sozRzZA&oe=6A1B04B6&_nc_sid=57e406',
  'Auch einfache Zutaten können ziemlich spannende Biochemie enthalten 👀',
  '',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":250,"einheit":"g","hinweis":null},{"name":"Kräuter Frischkäse Light","menge":180,"einheit":"g","hinweis":null},{"name":"Öl","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  '["Kartoffeln mit  Tasse Wasser in eine Pfanne geben und mit Deckel ca. - Minuten köcheln lassen. Immer mal schwenken bis das Wasser verdunstet ist.","Dann etwas Öl in die Pfanne geben, sowie ordentlich Salz und Kräuter. Nochmal anrösten und servieren.","Credits @schmaleschulter"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Keine Zeit? Dann jetzt 5 Minuten Pasta mit mehr Protein! Dafür brauchst du diese Zutaten für 2 Portionen:
-250g Cherry Tomaten
-2 Zehen Knoblauch
-2 EL Tomatenmark
-125ml Kochsahne Light
-100g Parmesan
-1 Kelle Nudelwasser
-250g Nudeln
-200g körniger Frischkäse
-Salz, Basilikum, Chili

Zubereitung: 
So einfach wie im Video! 

Nährwerte pro Portion:
800 kcal
50g Protein
102g KH
21g Fett
#nudeln #muskelaufbau #highprotein #fitnessrezepte'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/684989928_18585390670008730_2331252961309301180_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gFFVHpbPEGXdogvlJhi9cI734RWl3iVFD7xI-Ber0J3BILOt-cgOiccTMF4f9v-P_Q&_nc_ohc=dOBgyOUBTXUQ7kNvwHoxeXk&_nc_gid=Y1ALZw8mVBW_WhP8rfHNVA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af7pRDim3e-kAt2NXwtwWWB2uuoDa2b8V0fzTBGdhbH77Q&oe=6A1B10C1&_nc_sid=57e406',
  'Keine Zeit? Dann jetzt 5 Minuten Pasta mit mehr Protein! Daf...',
  '',
  2,
  5,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Cherry Tomaten","menge":250,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":2,"einheit":"Zehen","hinweis":null},{"name":"Tomatenmark","menge":2,"einheit":"el","hinweis":null},{"name":"Kochsahne Light","menge":125,"einheit":"ml","hinweis":null},{"name":"Parmesan","menge":100,"einheit":"g","hinweis":null},{"name":"Nudelwasser","menge":1,"einheit":"Kelle","hinweis":null},{"name":"Nudeln","menge":250,"einheit":"g","hinweis":null},{"name":"körniger Frischkäse","menge":200,"einheit":"g","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Wer würde? 😍POM DÖNER mit 495 Kalorien & 44g Protein zum Abnehmen! Machste dir mit diesen Zutaten:
-300g Kartoffeln
-150g Hähnchenbrust
-130g Gurke
-100g Tomate
-10g Zwiebel
-Petersilie
-50g Krautsalat
-1/2 Zitrone
-1 Zehe Knoblauch
-2 EL Joghurt
-Salz, Oregano, Gyrosgewürz

Zubereitung: 
Kartoffeln in Spalten schneiden. Etwas Öl und Salz dazu, dann bei 200 Grad Umluft für 20-25 Minuten in den Ofen. 
Hähnchenbrust mit Gyros Gewürz, Salz und etwas Öl einreiben und für 20 Minuten bei 200 Grad in '::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/684731801_18585065731008730_1337714123252947017_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gFvINROtsFLS6q1jwZRKcQeYjeiABpVRVl20eFj1k08vrb-WOvUbYPIPfpozMbW0vY&_nc_ohc=vE5fQkdExS8Q7kNvwEEMSlr&_nc_gid=CuNKde18ellJFKxWmiZmtA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6aFmC4UZaBFJZvvQGoav5xDNysYjW7TpjpOIPtWB7iCA&oe=6A1B1B97&_nc_sid=57e406',
  'Wer würde? 😍POM DÖNER mit 495 Kalorien & 44g Protein zum Ab...',
  '',
  2,
  20,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Kartoffeln","menge":300,"einheit":"g","hinweis":null},{"name":"Hähnchenbrust","menge":150,"einheit":"g","hinweis":null},{"name":"Gurke","menge":130,"einheit":"g","hinweis":null},{"name":"Tomate","menge":100,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":10,"einheit":"g","hinweis":null},{"name":"Krautsalat","menge":50,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Joghurt","menge":2,"einheit":"el","hinweis":null}]'::jsonb,
  '["Kartoffeln in Spalten schneiden. Etwas Öl und Salz dazu, dann bei  Grad Umluft für - Minuten in den Ofen.","Hähnchenbrust mit Gyros Gewürz, Salz und etwas Öl einreiben und für  Minuten bei  Grad in den AirFryer."]'::jsonb,
  '{"vegetarisch","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Schneller im Ofen als du Flammkuchen Gnocchis sagen kannst und so geht’s 💪🏼🙂 Zutaten für 2 Portionen:
-600g Gnocchis
-5 Eier
-1 EL Creme leicht
-2 Frühlingszwiebeln
-50g magere Schinkenwürfel
-50g Reibekäse Light
-Salz, Pfeffer

Zubereitung: 
≈Etwa 20 Minuten bei 180 Grad Umluft in den Ofen. Wenn vorhanden weitere 2-3 Minuten Grillfunktion an, wenn ihr die Oberfläche etwas knusprig mögt! 

Nährwerte pro Portion:
757 kcal
40g Protein
97g KH
21g Fett
#highprotein #fitnessrezepte #muskelaufbau #'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/683815105_18584834086008730_4883386894293106323_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGceaTfffeqipHRHwAimDA-t3dtMm8B3TVogaCv0JXipo5d_24IAg9wNkbIeHhUxgs&_nc_ohc=wIclMIFasW0Q7kNvwFI-x3L&_nc_gid=q14-e5xXiPmd0-sbxmkGRg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6201Hw_xHx0b827hdfY2-nLI8P6mlzYU6DNftsIHVnbw&oe=6A1AF945&_nc_sid=57e406',
  'Schneller im Ofen als du Flammkuchen Gnocchis sagen kannst u...',
  '',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[{"name":"Gnocchis","menge":600,"einheit":"g","hinweis":null},{"name":"Eier","menge":5,"einheit":"g","hinweis":null},{"name":"Creme leicht","menge":1,"einheit":"el","hinweis":null},{"name":"Frühlingszwiebeln","menge":2,"einheit":"g","hinweis":null},{"name":"magere Schinkenwürfel","menge":50,"einheit":"g","hinweis":null},{"name":"Reibekäse Light","menge":50,"einheit":"g","hinweis":null}]'::jsonb,
  '["≈Etwa  Minuten bei  Grad Umluft in den Ofen. Wenn vorhanden weitere - Minuten Grillfunktion an, wenn ihr die Oberfläche etwas knusprig mögt!"]'::jsonb,
  '{"vegetarisch","schnell","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Chili Cheese Burger Bowl! 😍
Hier sind Zutaten:
-400g Kartoffeln
-200g veganes Hack
-50ml Kochsahne Light
-1 TL Sambal Oelek
-30g Cheddar
-20g Eisbergsalat
-10g Jalapenos 
-1 TL Öl
-Salz, Pfeffer, Paprikapulver 

Welches vegane Hack könnt ihr empfehlen? Das Mühlenhack hat zwar stabile Werte, aber war echt nicht geil. 

Zubereitung: 
Kartoffeln bei 200 Grad Umluft für 20 Minuten in den Ofen. 

Nährwerte:
822 kcal
44g Protein
71g KH
36g Fett

Gefällt dir das Video? Dann abspeichern, an Freunde sen'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/672409004_18583682422008730_3141310102369337170_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGgcaKN0Xb5akUC28EY0Te8tUmsLr-nQaG16Rs8gEZQPUfPMDiMzV-RzC9dP-HgQag&_nc_ohc=mBBxy8q7xwAQ7kNvwGCk3EV&_nc_gid=QCHwHeM6ZV7vk8IvDm1KXQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5AKGoQTxIlH6aJQVJfxpmeWSvTTuz4iVTXt_Jo7k5_EQ&oe=6A1AFE7B&_nc_sid=57e406',
  'Chili Cheese Burger Bowl! 😍',
  'Chili Cheese Burger Bowl! 😍',
  2,
  20,
  'mittel',
  '{"vegan"}'::text[],
  '[{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"veganes Hack","menge":200,"einheit":"g","hinweis":null},{"name":"Kochsahne Light","menge":50,"einheit":"ml","hinweis":null},{"name":"Sambal Oelek","menge":1,"einheit":"tl","hinweis":null},{"name":"Cheddar","menge":30,"einheit":"g","hinweis":null},{"name":"Eisbergsalat","menge":20,"einheit":"g","hinweis":null},{"name":"Jalapenos","menge":10,"einheit":"g","hinweis":null},{"name":"Öl","menge":1,"einheit":"tl","hinweis":null},{"name":"vegane Hack könnt ihr empfehlen? Das Mühlenhack hat zwar stabile Werte, aber war echt nicht geil.","menge":null,"einheit":"Welches","hinweis":null}]'::jsonb,
  '["Kartoffeln bei  Grad Umluft für  Minuten in den Ofen."]'::jsonb,
  '{"vegan","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Alles in eine Schüssel & fertig! Dafür brauchst du⤵️
Zutaten für 2 Portionen:
-250g Nudeln
-1/2 rote Paprika
-1/2 gelbe Paprika
-1/2 grüne Paprika
-50g Hirtenkäse light
-1/2 rote Zwiebel
-200g Lachs
-1 EL Pesto
-1 EL Frischkäse Light
-Basilikum

Zubereitung: 
Lachs bei 180 Grad Umluft in den Ofen. Vorher etwas Salz, Zitrone, Knoblauch, Pfeffer und Öl drauf. Rest wie im Video 🙂🫶🏼

Nährwerte pro Portion:
745 kcal
43g Protein
103g KH
19g Fett

Gefällt dir das Rezept? Zeig es mir mit einem 👍🏼, '::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/674551620_18583373959008730_210538304909190590_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gF4rsT9u9dp--JDh-cJBacJD_CEZAukvQZMaONWrUfamelssZrKhNqpBFe-dDgRleg&_nc_ohc=aEDIXc9U9lkQ7kNvwEBolVZ&_nc_gid=3e0M7a36YaQ9_K1VSVKzjA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af40YA8_MzA_PWSYGKwN2RaX9rzWNnlosTLUgRPg2lcVqg&oe=6A1B07A2&_nc_sid=57e406',
  'Alles in eine Schüssel & fertig! Dafür brauchst du⤵️',
  'Alles in eine Schüssel & fertig! Dafür brauchst du⤵️',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[{"name":"Nudeln","menge":250,"einheit":"g","hinweis":null},{"name":"Hirtenkäse light","menge":50,"einheit":"g","hinweis":null},{"name":"Lachs","menge":200,"einheit":"g","hinweis":null},{"name":"Pesto","menge":1,"einheit":"el","hinweis":null},{"name":"Frischkäse Light","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  '["Lachs bei  Grad Umluft in den Ofen. Vorher etwas Salz, Zitrone, Knoblauch, Pfeffer und Öl drauf. Rest wie im Video"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Parmesan Chicken Bowl! Machste dir mit 
diesen Zutaten⤵️
-150g Hähnchenbrust
-40g Parmesan
-1 TL Öl
-400g Kartoffeln
-1 Zehe Knoblauch
-125ml Kochsahne Light
-30g Eisbergsalat
-Salz, Pfeffer, Paprikapulver, Oregano

Zubereitung: 
Kartoffeln in kleine Würfel schneiden. Etwas Öl und Salz dazu. Mit dem Parmesan Chicken auf ein Backblech und 15-20 Minuten bei 200 Grad Umluft backen. 

Nährwerte:
749 kcal
60g Protein
67g KH
25g Fett
#fitnessrezepte #muskelaufbau #diät #abnehmen'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/670752493_18582336034008730_6065708912014106218_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGSoAdASptwWJAH7YuzQtyMs0ZZlNQ--2TFvdCwhha0bgKfZ7xAUd_ZwHPvBiGzPSY&_nc_ohc=xKQf1YAo3ggQ7kNvwGdXAzF&_nc_gid=XYEQMNJEg490rQox-tAVpA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6mkxb-Zd6NVOAogO40P4AI17otXdF8nokJ8AmRWKA4tg&oe=6A1B1416&_nc_sid=57e406',
  'Parmesan Chicken Bowl! Machste dir mit',
  'Parmesan Chicken Bowl! Machste dir mit',
  2,
  15,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Hähnchenbrust","menge":150,"einheit":"g","hinweis":null},{"name":"Parmesan","menge":40,"einheit":"g","hinweis":null},{"name":"Öl","menge":1,"einheit":"tl","hinweis":null},{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Kochsahne Light","menge":125,"einheit":"ml","hinweis":null},{"name":"Eisbergsalat","menge":30,"einheit":"g","hinweis":null}]'::jsonb,
  '["Kartoffeln in kleine Würfel schneiden. Etwas Öl und Salz dazu. Mit dem Parmesan Chicken auf ein Backblech und - Minuten bei  Grad Umluft backen."]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Chili Cheese Rösti mit maximal wenig Aufwand und diesen Zutaten:
-6 Rösti
-300g Rindertartar
-50g Cheddar
-30g Eisbergsalat
-1 EL Mayo Light
-10g Zwiebel
-10g Jalapenos
-Salz, Pfeffer, Paprikapulver

Zubereitung: 
15 Minuten bei 200 Grad Umluft in den Ofen! 

Nährwerte:
1026 kcal
85g Protein
70g KH
39g Fett
#highprotein #feierabend #kartoffeln #muskelaufbau'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/670763629_18581415055008730_2327088393351173695_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGkmxW87nnOdjRQ8dHmGthdqGfo_JhIzOXD7MKTt8gIwouma6EQDeF0S5QhralREVQ&_nc_ohc=pVeKauDu9nQQ7kNvwGnfvaM&_nc_gid=_L1ofDpH3MkvuVM-m5wkZA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5STw8ros-D8IdoB2u2_HcCxkhqyZrBt4i-9rNbs4WsFA&oe=6A1B1513&_nc_sid=57e406',
  'Chili Cheese Rösti mit maximal wenig Aufwand und diesen Zutaten:',
  '',
  2,
  15,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Rösti","menge":6,"einheit":"g","hinweis":null},{"name":"Rindertartar","menge":300,"einheit":"g","hinweis":null},{"name":"Cheddar","menge":50,"einheit":"g","hinweis":null},{"name":"Eisbergsalat","menge":30,"einheit":"g","hinweis":null},{"name":"Mayo Light","menge":1,"einheit":"el","hinweis":null},{"name":"Zwiebel","menge":10,"einheit":"g","hinweis":null},{"name":"Jalapenos","menge":10,"einheit":"g","hinweis":null}]'::jsonb,
  '["Minuten bei  Grad Umluft in den Ofen!"]'::jsonb,
  '{"vegetarisch","schnell","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Kein Bock auf Kochen? Mach das⤵️
Zutaten für 2 Portionen:
-1 Baguette
-1 Dose Thunfisch
-200g körniger Frischkäse
-1 Avocado
-2 EL Mayo Light
-100g Reibekäse Light
-20g Jalapenos 
-1/2 Zwiebel
-Knoblauchgewürz, Oregano

Zubereitung: 
Bei 180 Grad Umluft für 15-20 Minuten backen. 

Nährwerte pro Portion:
701 kcal
52g Protein
65g KH
26g Fett
#faul #highprotein #einfacherezepte #schnellerezepte'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/670147582_18581004364008730_1048855468560639437_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGUQIyb03hKLu_oiHlxygUc4FyQPtZOCtvadlTahAt3NLtrqoVlb97vmHkFU_A3Drs&_nc_ohc=cLdUNdATMKkQ7kNvwGdapOX&_nc_gid=3mh1j-SR6dnxXIsgIYYKPw&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4CKPHOeB0Y4dYoryooZ9wHVx1AH-eMNiyZd0wWXiXIEA&oe=6A1B2998&_nc_sid=57e406',
  'Kein Bock auf Kochen? Mach das⤵️',
  'Kein Bock auf Kochen? Mach das⤵️',
  2,
  15,
  'mittel',
  '{"fisch"}'::text[],
  '[{"name":"Baguette","menge":1,"einheit":"g","hinweis":null},{"name":"Thunfisch","menge":1,"einheit":"dose","hinweis":null},{"name":"körniger Frischkäse","menge":200,"einheit":"g","hinweis":null},{"name":"Avocado","menge":1,"einheit":"g","hinweis":null},{"name":"Mayo Light","menge":2,"einheit":"el","hinweis":null},{"name":"Reibekäse Light","menge":100,"einheit":"g","hinweis":null},{"name":"Jalapenos","menge":20,"einheit":"g","hinweis":null}]'::jsonb,
  '["Bei  Grad Umluft für - Minuten backen."]'::jsonb,
  '{"schnell","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Schnelle Feierabendplatte zum Abnehmen! Hier ist das Rezept & die Nährwerte👇🏽
Zutaten für 4 Portionen:
-400g Reis
-1 Paprika gelb
-1 Paprika rot
-1 Paprika grün
-1 Zwiebel
-1 Zehe Knoblauch
-400g Hähnchenbrust
-400g stückige Tomaten aus der Dose 
-100g Reibekäse light
-Petersilie
-Knoblauchpulver, Paprikapulver, Salz

Zubereitung: 
So einfach wie im Video! Perfekt als Foodprep geeignet! 

Nährwerte pro Portion:
602 kcal
39g Protein
90g KH
7g Fett
#highprotein #abnehmen #diät #kalorien'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/656856327_18579685969008730_5302696372868675723_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gEIoqS-Irk8ZYD9htzwJ9m6EVKSUKD8zv4dwH-UbhEwitUWkj8mmA4IK0ieITUgMh4&_nc_ohc=4n8zyRxGyxAQ7kNvwFmN8az&_nc_gid=44rGSuYsMCmvUC7pmhBI8Q&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af4zfU-qTSeVTCwSfVPc2f_O9n7luEUjNuvg8CXWrb0hDg&oe=6A1B0221&_nc_sid=57e406',
  'Schnelle Feierabendplatte zum Abnehmen! Hier ist das Rezept & die Nährwerte👇🏽',
  '',
  4,
  20,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Reis","menge":400,"einheit":"g","hinweis":null},{"name":"gelb","menge":1,"einheit":"Paprika","hinweis":null},{"name":"rot","menge":1,"einheit":"Paprika","hinweis":null},{"name":"grün","menge":1,"einheit":"Paprika","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Hähnchenbrust","menge":400,"einheit":"g","hinweis":null},{"name":"stückige Tomaten aus der Dose","menge":400,"einheit":"g","hinweis":null},{"name":"Reibekäse light","menge":100,"einheit":"g","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"vegetarisch","schnell","high-protein","low-calorie"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Einfaches & köstliches Abendessen! ⤵️
Zutaten für 2 Portionen:
-750g Kartoffeln
-1 Zwiebel
-1 Zehe Knoblauch
-150g magere Schinkenwürfel 
-250ml Kochsahne 7%
-100ml Milch
-100g Parmesan
-Salz

Zubereitung: 
Bei 180 Grad Umluft für ca. 45 Minuten backen. 

Nährwerte pro Portion:
684 kcal
42g Protein
68g KH
26g Fett
#abendessen #feierabend #highprotein'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/662264110_18579342679008730_8666621059382981418_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gEtyURmLRTnkbJYPQ7DGidMt7QVScb12YlTnkSuU136QZB5loLHeLKhnC-uXez0XMA&_nc_ohc=tdjPVICKfqsQ7kNvwEuJOZY&_nc_gid=LLJTCCLnsS1pY5WTIKfAYA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5dl2kunre2t2yTBXhTZjakSVJ786VRMuoguiIvuHEyPQ&oe=6A1B1CAB&_nc_sid=57e406',
  'Einfaches & köstliches Abendessen! ⤵️',
  'Einfaches & köstliches Abendessen! ⤵️',
  2,
  45,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Kartoffeln","menge":750,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"magere Schinkenwürfel","menge":150,"einheit":"g","hinweis":null},{"name":"Kochsahne 7%","menge":250,"einheit":"ml","hinweis":null},{"name":"Milch","menge":100,"einheit":"ml","hinweis":null},{"name":"Parmesan","menge":100,"einheit":"g","hinweis":null}]'::jsonb,
  '["Bei  Grad Umluft für ca.  Minuten backen."]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Burger aus Kidneybohnen zum Burgerstag?!🫣 Am besten testen!⤵️

Zutaten für 2 Burger:
-2 Burger Buns
-2 Salat Blätter
-1 Tomate
-250g Kidneybohnen (Abtropfgewicht)
-60g Haferflocken
-1 Zwiebel
-25g Mehl
-1 Zehe Knoblauch
-1 TL Senf
-1 EL Sojasauce
-4 Scheiben Käse
-Chilisauce
-Paprikapulver, Cayennepfeffer, Gemüsebrühe

Zubereitung: 
Alles vermengen, Burger formen und je 10 Minuten bei mittlerer Hitze von beiden anbraten. Fertig ✅

Nährwerte pro Burger:
568 kcal
24g Protein
83g KH
12g Fett
#high'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/657717540_18578338300008730_2859779602894842203_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gFuDQ7YVFqg2eEBUagBUNLSaK8kINBOODSf1n4VtlQsXKSuX2v6jMnpWuI2b0qneKc&_nc_ohc=_zD4iRgOclQQ7kNvwFJZ5g2&_nc_gid=e_DaMMQ4YC4eZLvheFvVqw&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af7c-sGCzKHSBXCpZhYOnBrMJwS2s38yP0m8knsV7UzhCA&oe=6A1B022B&_nc_sid=57e406',
  'Burger aus Kidneybohnen zum Burgerstag?!🫣 Am besten testen!⤵️',
  'Burger aus Kidneybohnen zum Burgerstag?!🫣 Am besten testen!⤵️',
  2,
  10,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"Buns","menge":2,"einheit":"Burger","hinweis":null},{"name":"Blätter","menge":2,"einheit":"Salat","hinweis":null},{"name":"Tomate","menge":1,"einheit":"g","hinweis":null},{"name":"Kidneybohnen","menge":250,"einheit":"g","hinweis":null},{"name":"Haferflocken","menge":60,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Mehl","menge":25,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Senf","menge":1,"einheit":"tl","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null},{"name":"Käse","menge":4,"einheit":"Scheiben","hinweis":null}]'::jsonb,
  '["Alles vermengen, Burger formen und je  Minuten bei mittlerer Hitze von beiden anbraten. Fertig"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Eines der günstigsten Protein Sparrezepte, die es gibt und noch dazu einfach köstlich dafür brauchst du diese Zutaten:
-100g Reis
-4 Eier
-50g Erbsen
-50g Möhre
-1/2 Frühlingszwiebel
-1 EL Sojasauce
-Schnittlauch

Zubereitung: 
Gekochten Reis in etwas Sesamöl anbraten. Verquirltes Ei darüber geben, genauso wie Sojasauce, Erbsen, Schnittlauch und Möhren. Einfach scharf weiterbraten, bis die Erbsen gar sind. Dann nur noch ein paar Frühlingszwiebeln und fertig!

Nährwerte:
784 kcal
41g Protein
91g '::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/655385120_18574152787008730_5236416491321960550_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGy0XhfcLOiWR7Gh-k3FLKW5qhnClDs3zV8iZA0bIq6l0pNmE3ndILfk8ohRn2B29M&_nc_ohc=k-2CqbT_YO8Q7kNvwGIAAnh&_nc_gid=t3WMLFNUM5Nsh8hPcixF-Q&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5L2_rAR2N1PdXfIlVnjPHQytZQJgnPLb5RA9aladnMyQ&oe=6A1B02F2&_nc_sid=57e406',
  'Eines der günstigsten Protein Sparrezepte, die es gibt und n...',
  '',
  2,
  20,
  'einfach',
  '{"vegetarisch"}'::text[],
  '[{"name":"Reis","menge":100,"einheit":"g","hinweis":null},{"name":"Eier","menge":4,"einheit":"g","hinweis":null},{"name":"Erbsen","menge":50,"einheit":"g","hinweis":null},{"name":"Möhre","menge":50,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  '["Gekochten Reis in etwas Sesamöl anbraten. Verquirltes Ei darüber geben, genauso wie Sojasauce, Erbsen, Schnittlauch und Möhren. Einfach scharf weiterbraten, bis die Erbsen gar sind. Dann nur noch ein paar Frühlingszwiebeln und fertig!"]'::jsonb,
  '{"vegetarisch","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  '160g Protein Butter Chicken Pizza! 🤯 machste dir mit diesen Zutaten für 2 Portionen:
-300g Magerquark
-200g Mehl
-1 Pack Backpulver
-300g Hähnchenbrust
-1 rote Zwiebel
-1 Zehe Knoblauch
-1 TL Tandoori Paste
-2 EL Joghurt
-50ml Kochsahne Light
-100ml passierte Tomaten
-100g Reibekäse Light
-Petersilie

Zubereitung: 
Hähnchen nur von allen Seiten kurz anbraten, dann den Rest hinzugeben, auf der Pizza verteilen und bei 200 Grad Umluft für 15 Minuten backen.

Nährwerte pro Portion:
815 kcal
80g Pro'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/653984855_18573711886008730_8076790551826595133_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gGJ3XtCpKBFh6mhaDqf3HWAT_i8mo-Eje8P1sKLf62kc2tFVNXX5JTjcj9rW-X81cs&_nc_ohc=MeKgI3xl_XIQ7kNvwEvCeuH&_nc_gid=2VAnjb4k1VtRqxHH7EXIdQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af67w74O26HHF_g0zbpDQHFgWxRjkHtAJ4pzLlVM8JiHnQ&oe=6A1B09A3&_nc_sid=57e406',
  'g Protein Butter Chicken Pizza! 🤯 machste dir mit diesen Zu...',
  '',
  2,
  15,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"Magerquark","menge":300,"einheit":"g","hinweis":null},{"name":"Mehl","menge":200,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"Pack","hinweis":null},{"name":"Hähnchenbrust","menge":300,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"rote","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Tandoori Paste","menge":1,"einheit":"tl","hinweis":null},{"name":"Joghurt","menge":2,"einheit":"el","hinweis":null},{"name":"Kochsahne Light","menge":50,"einheit":"ml","hinweis":null},{"name":"passierte Tomaten","menge":100,"einheit":"ml","hinweis":null},{"name":"Reibekäse Light","menge":100,"einheit":"g","hinweis":null}]'::jsonb,
  '["Hähnchen nur von allen Seiten kurz anbraten, dann den Rest hinzugeben, auf der Pizza verteilen und bei  Grad Umluft für  Minuten backen."]'::jsonb,
  '{"vegetarisch","schnell","high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'So bereitest du dir Hähnchenbrust für Bowls, Döner, Mealprep usw. für mehrere Tage richtig lecker vor! 
Zutaten für das Fleisch:
-600g Hähnchenbrust
-100g Joghurt
-1 rote Zwiebel
-1 EL Ajvar
-Salz, Paprikapulver, Oregano

Zubereitung: 
Hähnchenbrust in dünne Schnitzel schneiden. Wie im Video marinieren. Am besten 30 Minuten einziehen lassen und dann in eine Auflaufform für ca. 50 Minuten bei 180 Grad Umluft in den Ofen geben. Wird super zart und würzig. 

Nährwerte pro Portion: (150g)
178 kcal
3'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/652606472_18572347069008730_5237683520780025067_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gE2fr2AAQ-D-vw5_xi12GuhuRgs8RRRnjy0dG4Qd8RWQ9STWThRq4m2DlVYG7AeFd4&_nc_ohc=CT291LW_ZccQ7kNvwEkWkoQ&_nc_gid=TEhwL_uFf_u0ZKebMlN8GA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af569e3E4efBMStFi0O0Jf5tRAdVt5N5kLE2h0G3_X7-pw&oe=6A1B0684&_nc_sid=57e406',
  'So bereitest du dir Hähnchenbrust für Bowls, Döner, Mealprep...',
  'So bereitest du dir Hähnchenbrust für Bowls, Döner, Mealprep usw. für mehrere Tage richtig lecker vor!',
  2,
  30,
  'einfach',
  '{"fleisch"}'::text[],
  '[{"name":"Hähnchenbrust","menge":600,"einheit":"g","hinweis":null},{"name":"Joghurt","menge":100,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"rote","hinweis":null},{"name":"Ajvar","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  '["Hähnchenbrust in dünne Schnitzel schneiden. Wie im Video marinieren. Am besten  Minuten einziehen lassen und dann in eine Auflaufform für ca.  Minuten bei  Grad Umluft in den Ofen geben. Wird super zart und würzig."]'::jsonb,
  '{"high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'POM DÖNER mit 495 Kalorien & 44g Protein zum Abnehmen! Machste dir mit diesen Zutaten:
-300g Kartoffeln
-150g Hähnchenbrust
-130g Gurke
-100g Tomate
-10g Zwiebel
-Petersilie
-50g Krautsalat
-1/2 Zitrone
-1 Zehe Knoblauch
-2 EL Joghurt
-Salz, Oregano, Gyrosgewürz

Zubereitung: 
Kartoffeln in Spalten schneiden. Etwas Öl und Salz dazu, dann bei 200 Grad Umluft für 20-25 Minuten in den Ofen. 
Hähnchenbrust mit Gyros Gewürz, Salz und etwas Öl einreiben und für 20 Minuten bei 200 Grad in den AirFryer.'::text,
  'https://scontent-fra5-2.cdninstagram.com/v/t51.82787-15/641824504_18569810962008730_6482486156538199648_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gEjXZiNoDAVeXVa_7Rp6-KgBCOSQ7UYk8cscBQqHNZwPqIGpgXY6KHMUVsmg5Dxuu0&_nc_ohc=Qj9k3upZbHMQ7kNvwEZBrUb&_nc_gid=8m1Ck5WQBzAdDewqKvLx-Q&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6v3gEmqo0dE10LcRgwneb8ntMMp5kkX_j7AxWpq0t2Xg&oe=6A1B002B&_nc_sid=57e406',
  'POM DÖNER mit 495 Kalorien & 44g Protein zum Abnehmen! Machs...',
  '',
  2,
  20,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Kartoffeln","menge":300,"einheit":"g","hinweis":null},{"name":"Hähnchenbrust","menge":150,"einheit":"g","hinweis":null},{"name":"Gurke","menge":130,"einheit":"g","hinweis":null},{"name":"Tomate","menge":100,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":10,"einheit":"g","hinweis":null},{"name":"Krautsalat","menge":50,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Joghurt","menge":2,"einheit":"el","hinweis":null}]'::jsonb,
  '["Kartoffeln in Spalten schneiden. Etwas Öl und Salz dazu, dann bei  Grad Umluft für - Minuten in den Ofen.","Hähnchenbrust mit Gyros Gewürz, Salz und etwas Öl einreiben und für  Minuten bei  Grad in den AirFryer."]'::jsonb,
  '{"vegetarisch","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Unglaublich leckere High Protein Shawarma Tacos 🌮💪🏾￼

Nährwerte pro Taco bei 10 Stück:
293 kcal
25,0 g Eiweiß
14,0 g Kohlenhydrate
15,5 g Fett

Nährwerte pro 100 g:
166 kcal
14,2 g Eiweiß
7,9 g Kohlenhydrate
8,8 g Fett

Zutaten:
900 g Hähnchenschenkel ohne Knochen
1 TL gepresster Knoblauch
2 EL Tomatenmark
60 g Joghurt
1 EL Zitronensaft
Ölspray

Gewürze:
1 TL Rauchpaprika
1 TL Koriander
1 TL Kreuzkümmel
½ TL Chilipulver
1 TL Salz

Knoblauchsoße:
195 g Philadelphia Balance
1 TL Knoblauchpulver'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/689476428_17912536692388392_7794518301052479275_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gFclJMCJGAJvFdspchw8pigEuxb2y4Myq63wi7-PVoJE4gLPC-FAqptr5qFUSnwIrA&_nc_ohc=bsb8rWE6BJ4Q7kNvwE9YhSX&_nc_gid=y1AZlZr7rP94zTYfvsFlCQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af59JHDlTc5FRYgnGn0vuc-7_G2XMsREsgJqw3q0iCjzUw&oe=6A1B0B92&_nc_sid=57e406',
  'Unglaublich leckere High Protein Shawarma Tacos 🌮💪🏾￼',
  'Unglaublich leckere High Protein Shawarma Tacos 🌮💪🏾￼',
  2,
  10,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Hähnchenschenkel ohne Knochen","menge":900,"einheit":"g","hinweis":null},{"name":"gepresster Knoblauch","menge":1,"einheit":"tl","hinweis":null},{"name":"Tomatenmark","menge":2,"einheit":"el","hinweis":null},{"name":"Joghurt","menge":60,"einheit":"g","hinweis":null},{"name":"Zitronensaft","menge":1,"einheit":"el","hinweis":null},{"name":"Rauchpaprika","menge":1,"einheit":"tl","hinweis":null},{"name":"Koriander","menge":1,"einheit":"tl","hinweis":null},{"name":"Kreuzkümmel","menge":1,"einheit":"tl","hinweis":null},{"name":"Chilipulver","menge":null,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"Philadelphia Balance","menge":195,"einheit":"g","hinweis":null},{"name":"Knoblauchpulver oder gepresster Knoblauch","menge":1,"einheit":"tl","hinweis":null},{"name":"nach Geschmack","menge":null,"einheit":"Salz","hinweis":null},{"name":"nach Geschmack","menge":null,"einheit":"Pfeffer","hinweis":null},{"name":"Mini-Tortillas","menge":10,"einheit":"g","hinweis":null},{"name":"Essiggurken","menge":150,"einheit":"g","hinweis":null},{"name":"Streukäse","menge":150,"einheit":"g","hinweis":null}]'::jsonb,
  '["Hähnchen mit Knoblauch, Tomatenmark, Joghurt, Zitronensaft und den Gewürzen marinieren. Das Fleisch in zwei Portionen mit Ölspray in der Pfanne anbraten, damit es schön bräunt und nicht zu viel Flüssigkeit zieht. Philadelphia Balance mit Knoblauch, Salz und Pfeffer zu einer Knoblauchsoße verrühren. Essiggurken klein schneiden. Mini-Tortillas mit Streukäse, Hähnchen, Essiggurken und Knoblauchsoße belegen und anschließend bei  Grad für etwa  Minuten im Ofen backen."]'::jsonb,
  '{"high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Diese kalorienarmen Zwiebelringe passen in jede Diät ￼🧅💪🏾

Nährwerte pro Portion bei 4 Portionen
Kalorien: ca. 225 kcal
Eiweiß: ca. 9 g
Kohlenhydrate: ca. 30 g
Fett: ca. 8 g

Nährwerte pro 100 g
Kalorien: ca. 170 kcal
Eiweiß: ca. 7 g
Kohlenhydrate: ca. 23 g
Fett: ca. 6 g

Zutaten
• 1 große Zwiebel
• 3 Eier
• 1 TL Chipotle Chili
• 2 TL Paprikapulver
• 1 TL Salz
• 50 g Mehl
• 100 g Panko Paniermehl

Zubereitung
Die Zwiebel schälen und in breite Ringe schneiden. Anschließend die einzelnen Zwiebe'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/689245583_17912176683388392_556146922175476478_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gGR6g_R9Ga5eSWpAMXH9kGDMovI1QSHNGPR5LmIfWGKC9Y7kAaabAb9-8uNcPAD9yg&_nc_ohc=WeDp1bsmwHIQ7kNvwG107HG&_nc_gid=LOsOe-f6DEbGv5FEh8RYoQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af537bD6PSGlIsBBPSVFGTXRMdw8-XwxT-PChQOPAXxaJQ&oe=6A1B1245&_nc_sid=57e406',
  'Diese kalorienarmen Zwiebelringe passen in jede Diät ￼🧅💪🏾',
  '',
  4,
  10,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"große Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Eier","menge":3,"einheit":"g","hinweis":null},{"name":"Chipotle Chili","menge":1,"einheit":"tl","hinweis":null},{"name":"Paprikapulver","menge":2,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"Mehl","menge":50,"einheit":"g","hinweis":null},{"name":"Panko Paniermehl","menge":100,"einheit":"g","hinweis":null}]'::jsonb,
  '["Zwiebel schälen und in breite Ringe schneiden. Anschließend die einzelnen Zwiebelschichten vorsichtig voneinander trennen.","Für die Panierstraße das Mehl mit Chipotle Chili, Paprikapulver und Salz vermischen. In einen zweiten Teller die verquirlten Eier geben und in einen dritten Teller das Panko füllen.","Zwiebelringe zuerst im gewürzten Mehl wenden, danach im Ei. Anschließend nochmals im Mehl und erneut im Ei wenden. Zum Schluss vollständig mit Panko panieren.","Je nach Größe der Zwiebel und Dicke der Panade müssen die Zutaten der Panierstraße bei Bedarf etwas aufgefüllt werden.","panierten Zwiebelringe von beiden Seiten leicht mit Ölspray besprühen und im Airfryer bei  Grad circa  bis  Minuten goldbraun backen."]'::jsonb,
  '{"vegetarisch","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'High Protein Zimtrollen mit 7 g Eiweiß pro Stück 💪🏾

Nährwerte pro Stück (50 g)

Kalorien: ca. 84 kcal
Eiweiß: ca. 7 g
Kohlenhydrate: ca. 10 g
Fett: ca. 1,2 g

Nährwerte pro 100 g

Kalorien: ca. 167 kcal
Eiweiß: ca. 14 g
Kohlenhydrate: ca. 20 g
Fett: ca. 2,4 g

Zutaten

Teig

• 500 g Magerquark
• 300 g Dinkelmehl
• 80 g Stevia
• 1 Päckchen Backpulver
• 1 TL Vanilleextrakt
• 1 Prise Salz

Füllung

• 50 g Stevia
• 1 EL Zimt

Zubereitung

Alle Zutaten für den Teig in eine große Schüssel geben und'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/683761874_17911844748388392_1597222485814200992_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gGXOE7Wt8CZem9uMOzv3i1J_1D-6N7n9iSsKv4DxZ0__gry2PfkP0ktMp0DE_ZzCA8&_nc_ohc=KpnO2nTKeigQ7kNvwHTlJUG&_nc_gid=GniarzQg4ziuKwGL6y5Ylw&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6rWHwHSwmDPRaSKVx5jt7jB78kYxCS-7uCzrUcT8-HpA&oe=6A1B07E9&_nc_sid=57e406',
  'High Protein Zimtrollen mit 7 g Eiweiß pro Stück 💪🏾',
  'High Protein Zimtrollen mit 7 g Eiweiß pro Stück 💪🏾',
  2,
  20,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Magerquark","menge":500,"einheit":"g","hinweis":null},{"name":"Dinkelmehl","menge":300,"einheit":"g","hinweis":null},{"name":"Stevia","menge":80,"einheit":"g","hinweis":null},{"name":"Päckchen Backpulver","menge":1,"einheit":"g","hinweis":null},{"name":"Vanilleextrakt","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"prise","hinweis":null},{"name":"Stevia","menge":50,"einheit":"g","hinweis":null},{"name":"Zimt","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  '["Alle Zutaten für den Teig in eine große Schüssel geben und gründlich vermengen. Anschließend zu einem glatten, geschmeidigen Teig verkneten.","Teig in zwei Hälften teilen und auf einer leicht bemehlten Fläche rechteckig ausrollen. Die Stevia-Zimt-Mischung gleichmäßig darauf verteilen.","Teig eng aufrollen und in gleichmäßige Stücke schneiden. Die Zimtschnecken auf ein mit Backpapier belegtes Blech legen.","Bei  Grad Umluft circa  Minuten goldbraun backen"]'::jsonb,
  '{"vegetarisch","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Diese High Protein Hackfleisch Pockets sind unglaublich lecker und perfekt für Mealprep 💪🏾￼

Pro Stück bei 6 Stück:

* Kalorien: 407 kcal
* Eiweiß: 28 g
* Kohlenhydrate: 42 g
* Fett: 12,5 g

Pro 100 g:

* Kalorien: 172 kcal
* Eiweiß: 12 g
* Kohlenhydrate: 18 g
* Fett: 5 g

Zutaten

Teig
330 g Mehl
400 g Magerquark
1 TL Backpulver
Salz

Füllung
1 kleine Zwiebel
400 g Hackfleisch
Gewürzmischung: 0,5 TL Salz, 0,5 TL Pfeffer, 1 TL Paprika, 1 TL Knoblauchpulver, 1 TL Oregano
1 EL Tomatenmark
100 g '::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/682072050_17911021926388392_1399513262039916897_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gHDdFBtF7H9LLRQgDSAkf1H5tZuMg_uzyDpekrib5L0aHhpZ_54vWxMrO3Op-j9vxs&_nc_ohc=gAkZWNQwlN0Q7kNvwFsLOMi&_nc_gid=9enqFUbljIWsMJA_Xb1Big&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6tqWXAc0gRhgb1y72uxbjHD_0WauZ8pZwmg04TxN8zYg&oe=6A1B2007&_nc_sid=57e406',
  'Diese High Protein Hackfleisch Pockets sind unglaublich leck...',
  'Diese High Protein Hackfleisch Pockets sind unglaublich lecker und perfekt für Mealprep 💪🏾￼ Pro Stück bei 6 Stück:',
  2,
  20,
  'mittel',
  '{"fleisch"}'::text[],
  '[{"name":"Mehl","menge":330,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":400,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"kleine","hinweis":null},{"name":"Hackfleisch","menge":400,"einheit":"g","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"el","hinweis":null},{"name":"Light Frischkäse","menge":100,"einheit":"g","hinweis":null},{"name":"Reibekäse, je 20 g pro Stück","menge":120,"einheit":"g","hinweis":null}]'::jsonb,
  '["Gib Mehl, Magerquark, Backpulver und Salz in eine Schüssel und knete alles zu einem glatten Teig. Lass ihn etwa  Minuten ruhen. Schneide die Zwiebel fein und brate sie mit etwas Ölspray in der Pfanne an. Gib das Hackfleisch dazu und brate es kräftig durch. Rühre die Gewürzmischung ein und gib das Tomatenmark dazu. Lass alles kurz weiterbraten, bis es durchgegart ist, und rühre anschließend den Light Frischkäse unter.","Teile den Teig in sechs gleich große Stücke und rolle sie jeweils rund aus. Gib in die Mitte  g Reibekäse und ein Sechstel der Füllung. Schließe den Teig nach oben und drücke die Taschen leicht flach. Brate sie in einer Pfanne mit etwas Ölspray von beiden Seiten scharf an, bis sie Farbe bekommen. Lege sie danach auf ein Backblech und backe sie bei  Grad Umluft für etwa  bis  Minuten im Ofen fertig, bis der Teig vollständig durchgebacken ist und der Käse innen geschmolzen ist."]'::jsonb,
  '{"schnell","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Schnelle High Protein und Low Cal Flammkuchen 💪🏾￼

Flammkuchen:
Nährwerte pro Stück
Kalorien: 264 kcal
Eiweiß: 24 g
Kohlenhydrate: 28 g
Fett: 8 g

Nährwerte pro 100 g
Kalorien: 145 kcal
Eiweiß: 13 g
Kohlenhydrate: 15 g
Fett: 4 g

Zutaten
• 2 High Protein Tortilla Wraps ca. 120 g
• 75 g fettarme Schinkenwürfel
• 80 g Crème Légère
• 40 g Streukäse light
• 1 kleine rote Zwiebel ca. 50 g
• Pfeffer

Zubereitung
• Backofen auf 170 Grad Umluft vorheizen
• Zwiebel fein würfeln
• Wraps auf ein Backblec'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/681425545_17910199098388392_4885420266721602712_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gG81lIwJ6ACPF5xJ3nZRptzibRAkJtyS3iVpg9By5OsVHalBN3NaMNFR9OQbMFJv3w&_nc_ohc=yauVfDpS15QQ7kNvwG-6nIY&_nc_gid=CrgqY1sLo09u85wOAj9gCg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6sdqtJ1dqWex4l4jBSGyoxia2rcUDkDNVaEJUDH3DZYQ&oe=6A1AF80C&_nc_sid=57e406',
  'Schnelle High Protein und Low Cal Flammkuchen 💪🏾￼',
  'Schnelle High Protein und Low Cal Flammkuchen 💪🏾￼ Flammkuchen:',
  2,
  10,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"Protein Tortilla Wraps ca. 120 g","menge":2,"einheit":"High","hinweis":null},{"name":"fettarme Schinkenwürfel","menge":75,"einheit":"g","hinweis":null},{"name":"Crème Légère","menge":80,"einheit":"g","hinweis":null},{"name":"Streukäse light","menge":40,"einheit":"g","hinweis":null},{"name":"rote Zwiebel ca. 50 g","menge":1,"einheit":"kleine","hinweis":null},{"name":"Pfeffer","menge":null,"einheit":"g","hinweis":null}]'::jsonb,
  '["Backofen auf  Grad Umluft vorheizen","Zwiebel fein würfeln","Wraps auf ein Backblech legen","Mit Crème Légère bestreichen","Schinkenwürfel, Zwiebel und Streukäse darauf verteilen","Mit Pfeffer würzen","Ca.  Minuten backen bis der Käse geschmolzen ist und die Ränder leicht knusprig sin"]'::jsonb,
  '{"vegetarisch","schnell","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'High Protein crispy Chicken Tenders mit Low cal spicy Garlic Mayo 🍗💪🏾

Nährwerte pro Portion
Kalorien: 585 kcal
Eiweiß: 61 g
Kohlenhydrate: 42 g
Fett: 17 g
(bei 2 Portionen)

Nährwerte pro 100 g Crispy Chicken Tenders
Kalorien: 113 kcal
Eiweiß: 12,6 g
Kohlenhydrate: 8,2 g
Fett: 3 g

Nährwerte pro 100 g Soße
Kalorien: 106 kcal
Eiweiß: 6,5 g
Kohlenhydrate: 7,1 g
Fett: 4,5 g

Zutaten
• 600 g Hähnchenbrust
• Gewürze: 1 TL Salz, 1 TL Pfeffer, 2 TL Rauchpaprika
• 50 g Mehl
• 2 bis 3 Eier je nach Gr'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/681185872_17910039642388392_3582088647539026813_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gFQ3sY0XkdPm2FNC0ZGrYO21-IhzXq5Rhlqd82a0CiF2NVCSr3SoiJD1WwwcNM17rk&_nc_ohc=hbHuDjw5N54Q7kNvwG2u4qQ&_nc_gid=zdbej8PV_u1q-XO6zEHXqg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af7RHSTktuCQDqH7elXOKzInwgXkZYjEtGDURz7gMZz9FQ&oe=6A1B05F8&_nc_sid=57e406',
  'High Protein crispy Chicken Tenders mit Low cal spicy Garlic Mayo 🍗💪🏾',
  'High Protein crispy Chicken Tenders mit Low cal spicy Garlic Mayo 🍗💪🏾',
  2,
  15,
  'schwer',
  '{"vegetarisch"}'::text[],
  '[{"name":"Hähnchenbrust","menge":600,"einheit":"g","hinweis":null},{"name":"Gewürze: 1 TL Salz, 1 TL Pfeffer, 2 TL Rauchpaprika","menge":null,"einheit":"g","hinweis":null},{"name":"Mehl","menge":50,"einheit":"g","hinweis":null},{"name":"3 Eier je nach Größe","menge":2,"einheit":"bis","hinweis":null},{"name":"Cornflakes","menge":120,"einheit":"g","hinweis":null},{"name":"Öl Spray","menge":null,"einheit":"g","hinweis":null},{"name":"Soße: 100 g fettarmer griechischer Joghurt, 20 g Light Mayo, 20 g Light Ketchup, 1 TL Knoblauchpulver, 15 g Sriracha","menge":null,"einheit":"g","hinweis":null}]'::jsonb,
  '["Backofen auf  Grad Umluft vorheizen","Hähnchen in Stücke schneiden und mit den Gewürzen vermengen","Cornflakes grob zerdrücken","Hähnchen im Mehl wenden","Durch die verquirlten Eier ziehen","In den Cornflakes panieren","Auf ein Backblech legen und mit Öl Spray besprühen","Ca.  Minuten backen bis sie knusprig und durch sind","Für die Soße alle Zutaten glatt verrühren","Hähnchen mit der Soße servieren"]'::jsonb,
  '{"vegetarisch","schnell","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'High Protein Butter Chicken￼ 🥘💪🏾

Nährwerte pro Portion(1/4) ohne Reis:

Kalorien ca. 189 kcal
Eiweiß ca. 20.2 g
Kohlenhydrate ca. 12.1 g
Fett ca. 3.1 g

Nährwerte pro 100 g (ohne Reis)

Kalorien ca. 72 kcal
Eiweiß ca. 7.7 g
Kohlenhydrate ca. 4.6 g
Fett ca. 1.2 g

Zutaten

300 g Hähnchen
150 g Joghurt
Gewürzmischung
1 TL Light Butter
3 Tomaten
2 Zwiebeln
15 g Cashews
100 g passierte Tomaten

Gewürzmischung
Paprikapulver edelsüß 2 TL, Kreuzkümmel 1 TL, Koriander 1 TL, Kurkuma 1 TL, Garam Masal'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/675453771_17909836881388392_8396221000577689434_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gFysmMhP8fTg1XdoP0LcSb2hjT1U7mw2q5zNq2n1jDdPXq-V05-3QnkrU1sb_CEaGE&_nc_ohc=O00knnCn_dYQ7kNvwH-ej76&_nc_gid=mUkgGLwSb1mt7qvEyM-WSA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6KDw37ADMuFw6Kbmzk7jMxtavacURzUxgZXGPsr4wLqA&oe=6A1B1613&_nc_sid=57e406',
  'High Protein Butter Chicken￼ 🥘💪🏾',
  'High Protein Butter Chicken￼ 🥘💪🏾',
  2,
  20,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Hähnchen","menge":300,"einheit":"g","hinweis":null},{"name":"Joghurt","menge":150,"einheit":"g","hinweis":null},{"name":"Light Butter","menge":1,"einheit":"tl","hinweis":null},{"name":"Tomaten","menge":3,"einheit":"g","hinweis":null},{"name":"Zwiebeln","menge":2,"einheit":"g","hinweis":null},{"name":"Cashews","menge":15,"einheit":"g","hinweis":null},{"name":"passierte Tomaten","menge":100,"einheit":"g","hinweis":null},{"name":"edelsüß 2 TL, Kreuzkümmel 1 TL, Koriander 1 TL, Kurkuma 1 TL, Garam Masala 1 TL, Knoblauchpulver ½ TL, Chilipulver ½ TL, Zimt ½ TL, schwarzer Pfeffer ¼ TL, Salz 1 TL","menge":null,"einheit":"Paprikapulver","hinweis":null}]'::jsonb,
  '["Hähnchen klein schneiden.","g Joghurt und Gewürzmischung dazugeben. Gut vermengen.","Pfanne erhitzen. Butter rein. Fleisch scharf anbraten bis es durch ist. Danach aus der Pfanne nehmen.","Tomaten und Zwiebeln klein schneiden.","Zwiebeln in der gleichen Pfanne andünsten. Tomaten, Cashews und passierte Tomaten dazugeben.","g Joghurt einrühren. Hitze niedrig halten. Nicht kochen lassen.","Alles in den Mixer geben und fein pürieren.","Soße zurück in die Pfanne geben. Fleisch dazugeben und kurz ziehen lassen. Mit Reis servieren","highprotein instagram"]'::jsonb,
  '{"high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Du musst Magerquark nicht pur essen. Mach dir einfach diese High Protein Waffeln 🧇💪🏾￼

Nährwerte pro 100 g:

Kalorien: ca. 127 kcal
Eiweiß: ca. 8,3 g
Kohlenhydrate: ca. 18,9 g
Fett: ca. 1,5 g

Nährwerte gesamt:

Kalorien: ca. 830 kcal
Eiweiß: ca. 54 g
Kohlenhydrate: ca. 123 g
Fett: ca. 10 g

Zutaten:

200 g Magerquark
130 g Mehl
1 Ei
125 ml Milch, 1,5 %
5 g Backpulver
50 g Stevia
1 TL Vanilleextrakt

Hinweis: Waffeleisen vor jeder Portion mit Ölspray einsprühen

Zubereitung:

Alle Zutaten in '::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/670982645_17908540260388392_6653285731661419787_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gE3S6LcModn5X7pwfOXzoCmofLa9wcEZC2IdWF2Dt6hAvyzjB-9PEQ3iNrfMLl4wEk&_nc_ohc=sRg9edw8qjAQ7kNvwHqpFNV&_nc_gid=uQMgJKwLdyKiXjOVd3BtSQ&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6kd_Wwyej3dOEt1Zwd2ThO07NYLSUIdaeVEMsq2Qrzkg&oe=6A1B0C6B&_nc_sid=57e406',
  'Du musst Magerquark nicht pur essen. Mach dir einfach diese...',
  'Du musst Magerquark nicht pur essen. Mach dir einfach diese High Protein Waffeln 🧇💪🏾￼',
  2,
  20,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Magerquark","menge":200,"einheit":"g","hinweis":null},{"name":"Mehl","menge":130,"einheit":"g","hinweis":null},{"name":"Ei","menge":1,"einheit":"g","hinweis":null},{"name":"Milch, 1,5 %","menge":125,"einheit":"ml","hinweis":null},{"name":"Backpulver","menge":5,"einheit":"g","hinweis":null},{"name":"Stevia","menge":50,"einheit":"g","hinweis":null},{"name":"Vanilleextrakt","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  '["Alle Zutaten in eine Schüssel geben und mit dem Handmixer gründlich zu einem glatten Teig verrühren.","Waffeleisen vorheizen und leicht einsprühen.","Teig portionsweise hineingeben und ausbacken, bis die Waffeln durchgebacken und goldbraun sind.","Waffeln herausnehmen und direkt servieren.","Nach Wunsch mit Puderzucker bestreuen.","highprotein instagram"]'::jsonb,
  '{"vegetarisch","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Diese High Protein Ofentacos sind unglaublich lecker und gehen schnell 🌮💪🏾￼

Nährwerte pro Taco

Kalorien: ca. 240 kcal
Eiweiß: ca. 18 g
Kohlenhydrate: ca. 20 g
Fett: ca. 6 g

Nährwerte für 10 Stück

Kalorien: ca. 2.400 kcal
Eiweiß: ca. 180 g
Kohlenhydrate: ca. 200 g
Fett: ca. 60 g

Zutaten

• 450 g Hähnchenbrust
• Gewürze: 1 EL Paprikapulver, 1 TL Knoblauchpulver, 1 TL Zwiebelpulver, 1 TL Salz, 1 TL Pfeffer, 1/2 TL Chipotle-Chili
• 1 rote Paprika, gewürfelt
• 120 g Mais
• 1 gelbe Zwiebel, ge'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/670906099_17908494693388392_2918860213973167853_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gFpN9nkv50DqSKtGXGScdvJvkeNTHRKbchBAS8ydu5R0rimTYmm4w50MQJaN-azaeg&_nc_ohc=NqxgOrXNdyQQ7kNvwGTrb8O&_nc_gid=BFuy1yrirfLLB8jegmpuKA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af7j3crdUDqTjJgv0HOIpW5dxbi_QIXAigRfBidI-UJFVQ&oe=6A1B0EC4&_nc_sid=57e406',
  'Diese High Protein Ofentacos sind unglaublich lecker und gehen schnell 🌮💪🏾￼',
  'Diese High Protein Ofentacos sind unglaublich lecker und gehen schnell 🌮💪🏾￼',
  2,
  15,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Hähnchenbrust","menge":450,"einheit":"g","hinweis":null},{"name":"Gewürze: 1 EL Paprikapulver, 1 TL Knoblauchpulver, 1 TL Zwiebelpulver, 1 TL Salz, 1 TL Pfeffer, 1/2 TL Chipotle-Chili","menge":null,"einheit":"g","hinweis":null},{"name":"Paprika, gewürfelt","menge":1,"einheit":"rote","hinweis":null},{"name":"Mais","menge":120,"einheit":"g","hinweis":null},{"name":"Zwiebel, gewürfelt","menge":1,"einheit":"gelbe","hinweis":null},{"name":"Jalapeño, eingelegt, klein geschnitten","menge":1,"einheit":"g","hinweis":null},{"name":"Zitronensaft","menge":1,"einheit":"el","hinweis":null},{"name":"Frischkäse","menge":60,"einheit":"g","hinweis":null},{"name":"Wasser","menge":60,"einheit":"ml","hinweis":null},{"name":"Öl-Spray","menge":null,"einheit":"g","hinweis":null},{"name":"Tortillas","menge":10,"einheit":"kleine","hinweis":null},{"name":"ca. 150 g geriebener Käse","menge":null,"einheit":"g","hinweis":null}]'::jsonb,
  '["Hähnchen in kleine Stücke schneiden und mit den Gewürzen vermischen","Mit etwas Öl-Spray scharf anbraten","Wenn das Fleisch fast durch ist, Mais, Paprika, Zwiebel und Jalapeño zugeben und kurz anbraten","Frischkäse und Wasser einrühren, dann Zitronensaft zugeben","Alles köcheln lassen, bis die Flüssigkeit etwas reduziert ist","Tortillas auf einer Seite mit Öl-Spray besprühen","Umdrehen und mit der Hähnchenmasse befüllen","Ergibt etwa  Tacos","Tacos in eine ofenfeste Form setzen","Mit Käse bestreuen, ca.  g pro Taco","Bei  Grad Ober-/Unterhitze ca.  Minuten backen","highprotein instagram"]'::jsonb,
  '{"schnell","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Piccolinis aber in High Protein 🍕💪🏾

Nährwerte pro Mini-Pizza
	•	Kalorien: ca. 66 kcal
	•	Eiweiß: ca. 6,7 g
	•	Kohlenhydrate: ca. 8,4 g
	•	Fett: ca. 0,9 g

⸻

Nährwerte pro 100 g
	•	Kalorien: ca. 172 kcal
	•	Eiweiß: ca. 17,4 g
	•	Kohlenhydrate: ca. 21,7 g
	•	Fett: ca. 2,2 g

⸻

Zutaten

Teig
	•	140 g Dinkelmehl
	•	170 g Magerquark
	•	1/2 Päckchen Backpulver
	•	Salz

Belag
	•	100 ml passierte Tomaten
	•	1 TL Oregano
	•	1/2 TL Pfeffer
	•	1/2 TL Salz
	•	70 g fettarmer Streukäse
	•	60 g fettarmer'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/670752561_17908063107388392_3947877792144695558_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gEEkmW0V9tj3sWipcdu-cUjRn6s5BZmF8qlhU7-ChFJf_CljxUOWyLT9RoqITdl_U0&_nc_ohc=EvFBOyBi1egQ7kNvwHDeuoy&_nc_gid=q34AWr7vekpYIeSZyObofg&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af46-PZogVDlwRo605NemUzKTv588qgYFdu5o49Li5fjnw&oe=6A1B08F3&_nc_sid=57e406',
  'Piccolinis aber in High Protein 🍕💪🏾',
  'Piccolinis aber in High Protein 🍕💪🏾',
  2,
  7,
  'mittel',
  '{"vegetarisch"}'::text[],
  '[{"name":"Dinkelmehl","menge":140,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":170,"einheit":"g","hinweis":null},{"name":"1/2 Päckchen Backpulver","menge":null,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":"g","hinweis":null},{"name":"passierte Tomaten","menge":100,"einheit":"ml","hinweis":null},{"name":"Oregano","menge":1,"einheit":"tl","hinweis":null},{"name":"1/2 TL Pfeffer","menge":null,"einheit":"g","hinweis":null},{"name":"1/2 TL Salz","menge":null,"einheit":"g","hinweis":null},{"name":"fettarmer Streukäse","menge":70,"einheit":"g","hinweis":null},{"name":"fettarmer Speckwürfel","menge":60,"einheit":"g","hinweis":null}]'::jsonb,
  '["Mehl, Magerquark, Backpulver und etwas Salz in eine Schüssel geben und zu einem glatten Teig verkneten. Den Teig ausrollen und mit einer Tasse  kleine Kreise ausstechen und auf ein mit Backpapier belegtes Blech legen. Die passierten Tomaten mit Oregano, Pfeffer und Salz verrühren und auf die Teigstücke streichen. Anschließend den Streukäse darauf verteilen und die Speckwürfel darüber geben. Die Mini Pizzen bei  Grad Umluft für  bis  Minuten backen, bis der Käse geschmolzen ist und der Rand leicht gebräunt ist.","highprotein instagram"]'::jsonb,
  '{"vegetarisch","high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'High Protein Thai Nudelpfanne mit Chicken 💪🏾🍜

Nährwerte pro Portion bei 4 Portionen:
	•	Kalorien: ca. 460 kcal
	•	Eiweiß: ca. 46,25 g
	•	Kohlenhydrate: ca. 52,5 g
	•	Fett: ca. 5 g

⸻

Nährwerte pro 100 g
	•	Kalorien: ca. 153 kcal
	•	Eiweiß: ca. 15,4 g
	•	Kohlenhydrate: ca. 17,5 g
	•	Fett: ca. 1,7 g

⸻

Zutaten
	•	700 g Hähnchenbrust
	•	1 EL Sojasauce
	•	1 TL Sriracha
	•	250 g Reisbandnudeln

Sauce
	•	60 ml Sojasauce
	•	30 g Hoisinsauce
	•	20 g Honig
	•	1 EL Reisessig
	•	1 EL Speisestärke
	•	'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/670367728_17907927300388392_8418935123577728926_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gE0xNiTcJZ4p809teUPh6ATUEOljcIAsPwtSVJB4FuFDR79yktbHc0xsw15RGNqRkA&_nc_ohc=3YnsIq1Niv4Q7kNvwE9MZtC&_nc_gid=CwW5wr4ZZ6lJrTF1FR5Flw&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6T_YoAQmtWJexO6NmPksapWoeS9S9b2TexNDYGMMVucQ&oe=6A1B2321&_nc_sid=57e406',
  'High Protein Thai Nudelpfanne mit Chicken 💪🏾🍜',
  'High Protein Thai Nudelpfanne mit Chicken 💪🏾🍜',
  4,
  45,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Hähnchenbrust","menge":700,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null},{"name":"Sriracha","menge":1,"einheit":"tl","hinweis":null},{"name":"Reisbandnudeln","menge":250,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":60,"einheit":"ml","hinweis":null},{"name":"Hoisinsauce","menge":30,"einheit":"g","hinweis":null},{"name":"Honig","menge":20,"einheit":"g","hinweis":null},{"name":"Reisessig","menge":1,"einheit":"el","hinweis":null},{"name":"Speisestärke","menge":1,"einheit":"el","hinweis":null},{"name":"Sriracha","menge":1,"einheit":"el","hinweis":null},{"name":"Ingwer, fein gehackt","menge":2,"einheit":"el","hinweis":null},{"name":"Knoblauchpaste","menge":1,"einheit":"tl","hinweis":null},{"name":"Ölspray","menge":null,"einheit":"g","hinweis":null},{"name":"Frühlingszwiebeln, gehackt","menge":3,"einheit":"g","hinweis":null},{"name":"nach Geschmack","menge":null,"einheit":"Sesam","hinweis":null}]'::jsonb,
  '["Reisbandnudeln zuerst  Minuten in lauwarmem Wasser einweichen, anschließend abgießen und in heißem Wasser mit etwas Salz und einem Schuss Öl für  bis  Minuten garen, danach kalt abspülen und beiseitestellen. Währenddessen das Hähnchen in Stücke schneiden und mit Sojasauce und Sriracha marinieren. Das Fleisch in zwei Portionen in einer heißen Pfanne mit etwas Ölspray scharf anbraten, bis es gut gebräunt ist, dann herausnehmen und zur Seite stellen. In der gleichen Pfanne erneut etwas Ölspray erhitzen, Ingwer und Knoblauchpaste kurz anbraten, dann die zuvor angerührte Sauce dazugeben und zusammen mit den Frühlingszwiebeln kurz aufkochen lassen, bis sie leicht andickt. Die gekochten Nudeln in die Pfanne geben und alles gut vermengen, anschließend das Fleisch wieder dazugeben oder separat servieren. Zum Schluss mit frischen Frühlingszwiebeln und etwas Sesam toppen.","highprotein instagram"]'::jsonb,
  '{"high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Mit dieser High Protein Chicken Kartoffelpfanne kommst du sicher auf deine Proteine 💪🏾￼🥘

Nährwerte pro Portion bei 4 Portionen, ca.

Kalorien: 660 kcal
Eiweiß: 73 g
Kohlenhydrate: 49 g
Fett: 16 g

Nährwerte pro 100 g, ca.

Kalorien: 106 kcal
Eiweiß: 12 g
Kohlenhydrate: 9 g
Fett: 2,6 g

Zutaten
	•	1000 g Kartoffeln
Gewürze: 1 TL geräucherter Paprika, 1 TL Oregano, 1 TL schwarzer Pfeffer, 1,5 TL Salz, 0,25 TL Cayennepfeffer
	•	Ölspray
	•	1000 g Hähnchenbrust
Gewürze: 1,5 TL Salz, 1 TL Oregano,'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/669683651_17907314631388392_5680033909987398761_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gGIh6xu7IpXHUIo-BS6IJghEELQXWKOtUa2LjFLaBfVEKXPl8oQI_vldF0gCgzQ7i8&_nc_ohc=06tAp5Lmtb4Q7kNvwHxZDAj&_nc_gid=0iMVFGZ4cVOHb1bALOL-yA&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6vjYUvx6Cg7xworpFvPafkq-rnbzeOMxZzHE-8P99PSQ&oe=6A1B0888&_nc_sid=57e406',
  'Mit dieser High Protein Chicken Kartoffelpfanne kommst du si...',
  'Mit dieser High Protein Chicken Kartoffelpfanne kommst du sicher auf deine Proteine 💪🏾￼🥘',
  4,
  20,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Kartoffeln","menge":1000,"einheit":"g","hinweis":null},{"name":"Ölspray","menge":null,"einheit":"g","hinweis":null},{"name":"Hähnchenbrust","menge":1000,"einheit":"g","hinweis":null},{"name":"Ölspray","menge":null,"einheit":"g","hinweis":null},{"name":"Knoblauchsauce","menge":null,"einheit":"Cremige","hinweis":null},{"name":"Ölspray","menge":null,"einheit":"g","hinweis":null},{"name":"rote Zwiebel, gewürfelt","menge":1,"einheit":"kleine","hinweis":null},{"name":"Knoblauchpaste","menge":1,"einheit":"tl","hinweis":null},{"name":"Hühnerbrühe","menge":150,"einheit":"ml","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"el","hinweis":null},{"name":"Salz","menge":null,"einheit":"g","hinweis":null},{"name":"leichter Frischkäse","menge":100,"einheit":"g","hinweis":null},{"name":"Parmesan","menge":10,"einheit":"g","hinweis":null},{"name":"fettarmer Käse","menge":80,"einheit":"g","hinweis":null}]'::jsonb,
  '["Kartoffeln schälen und würfeln. Mit den Gewürzen mischen, Ölspray dazugeben. Auf ein Blech geben und bei  Grad Umluft  Minuten backen.","Hähnchen schneiden. Mit den Gewürzen mischen. In zwei Portionen mit Ölspray anbraten. Beiseitestellen.","In derselben Pfanne Ölspray erhitzen. Zwiebel anbraten. Knoblauchpaste dazugeben. Tomatenmark einrühren und kurz anrösten. Hühnerbrühe, Frischkäse, Parmesan und Käse dazugeben. Erhitzen, bis alles cremig ist. Mit Salz abschmecken.","Kartoffeln und Fleisch zurück in die Pfanne geben. Vermischen. Streukäse drauf. Deckel drauf. Kurz erhitzen, bis der Käse geschmolzen ist.","Wer mag, gibt das Ganze am Ende in den Backofen und lässt den Käse unter dem Grill kurz überbacken.","highprotein instagram"]'::jsonb,
  '{"high-protein","low-calorie"}'::text[],
  1::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'High Protein Crispy Chicken Shawarma 💪🏾

PRO SHAWARMA 1 STÜCK
(mit Piadina berechnet)
KCAL 840
Eiweiß 88 gr
Kohlenhydrate 67 gr
Fett 15 gr

GESAMT ALLE 3 SHAWARMA
(mit Piadina berechnet)
KCAL 2520
Eiweiß 265 gr
Kohlenhydrate 200 gr
Fett 46 gr

Zutatenliste:
Fleisch
• 800 g Hähnchenbrust
• 70 g fettarmer griechischer Joghurt

Gewürzmischung
• 2 TL geräucherter Paprika
• 1 TL Knoblauchpulver
• 1 TL Zwiebelpulver
• 1 TL Cayennepfeffer
• 1 TL Oregano
• 0,5 TL Kreuzkümmel
• 2 TL Salz

• 1 EL Tomate'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/617139688_17894758683388392_8619586313765748285_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gGruELJKetMekAzIVp89-Ii5kiqKmVKic-e1H1iBzq4EET54c4cH8VQ8rHbOMjNjyI&_nc_ohc=oBfYQCjpF5MQ7kNvwGVN-V8&_nc_gid=nqB7pN2kQfWdr2B-CM7RKw&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af5rn4tIQ5rAooxPyk2klURhACrpjTMfmYZvfWnta6R7Hg&oe=6A1AFD66&_nc_sid=57e406',
  'High Protein Crispy Chicken Shawarma 💪🏾',
  'High Protein Crispy Chicken Shawarma 💪🏾 PRO SHAWARMA 1 STÜCK (mit Piadina berechnet)',
  2,
  20,
  'schwer',
  '{"fleisch"}'::text[],
  '[{"name":"Hähnchenbrust","menge":800,"einheit":"g","hinweis":null},{"name":"fettarmer griechischer Joghurt","menge":70,"einheit":"g","hinweis":null},{"name":"geräucherter Paprika","menge":2,"einheit":"tl","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Zwiebelpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Cayennepfeffer","menge":1,"einheit":"tl","hinweis":null},{"name":"Oregano","menge":1,"einheit":"tl","hinweis":null},{"name":"Kreuzkümmel","menge":0.5,"einheit":"tl","hinweis":null},{"name":"Salz","menge":2,"einheit":"tl","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"el","hinweis":null},{"name":"Anbraten","menge":null,"einheit":"Zum","hinweis":null},{"name":"Tomatenmark","menge":3,"einheit":"tl","hinweis":null},{"name":"Light Ketchup","menge":3,"einheit":"tl","hinweis":null},{"name":"Öl Spray","menge":1,"einheit":"tl","hinweis":null},{"name":"fettarmer griechischer Joghurt","menge":150,"einheit":"g","hinweis":null},{"name":"Salz","menge":0.5,"einheit":"tl","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Zitronensaft","menge":1,"einheit":"tl","hinweis":null},{"name":"Essiggurken","menge":180,"einheit":"g","hinweis":null},{"name":"Pitabrot, ersatzweise Piadina","menge":3,"einheit":"g","hinweis":null}]'::jsonb,
  '[]'::jsonb,
  '{"high-protein"}'::text[],
  0.7000000000000001::float,
  '{"Zubereitung unklar strukturiert"}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, source_author, source_caption_raw, bild_url, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'instagram',
  'www.instagram.com',
  'Bulking Hackfleisch Nudelplanne für den Muskelaufbau 💪🏾🥘

Pro Portion (bei 4 Portionen)
	•	Kalorien: ca. 600 kcal
	•	Eiweiß: ca. 58 g
	•	Fett: ca. 19 g
	•	Kohlenhydrate: ca. 50 g

Gesamtrezept
	•	Kalorien: ca. 2.400 kcal
	•	Eiweiß: ca. 230 g
	•	Fett: ca. 75 g
	•	Kohlenhydrate: ca. 200 g

⸻

•	300 g ungekochte Nudeln
	•	800 g fettarmes Rinderhack (5 % Fett)
Gewürze fürs Fleisch: 1 TL Knoblauchpulver, 1 TL Rauchpaprika, 1 TL Salz
	•	Ölspray für die Pfanne
	•	1 mittlere Zwiebel
	•	2–3 Knoblauchz'::text,
  'https://scontent-fra5-1.cdninstagram.com/v/t51.82787-15/559728656_17883358341388392_124133418086865354_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gEtVyEhqChG8ASxhaCsf1S5MF6_CpbfAWVDFevoQNc8onz8AFMCSEy9QRQ3QbjtmBs&_nc_ohc=ZZ1q1ivKJ0MQ7kNvwGbKtDV&_nc_gid=9dLZ9xkes3EH3JbwzTp82g&edm=ALY_pVYBAAAA&ccb=7-5&oh=00_Af6N-RNBOxIXutsxdSyXw4Y7M802267y_4NPNH0HRVyQeA&oe=6A1AFFD9&_nc_sid=57e406',
  'Bulking Hackfleisch Nudelplanne für den Muskelaufbau 💪🏾🥘',
  'Bulking Hackfleisch Nudelplanne für den Muskelaufbau 💪🏾🥘 Pro Portion (bei 4 Portionen)',
  4,
  20,
  'einfach',
  '{"fleisch"}'::text[],
  '[]'::jsonb,
  '[]'::jsonb,
  '{"high-protein","low-calorie"}'::text[],
  0.5::float,
  '{"Sehr wenige Zutaten extrahiert","Zubereitung unklar strukturiert"}'::text[]
);

COMMIT;
