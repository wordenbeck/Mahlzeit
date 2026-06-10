-- Rezept-Bereinigung — generiert 2026-06-10

-- 120 Rezepte (Duplikate + Nicht-Rezepte bereits gelöscht)

-- tags/kategorie = text[], zutaten/zubereitung = jsonb



-- Veganer Highprotein Crunch Wrap
UPDATE recipes SET
  titel         = 'Veganer Highprotein Crunch Wrap',
  beschreibung  = 'Ein leckerer und gesunder Wrap mit vielen Proteinen',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegan','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Dürüm (Wrap)","menge":1,"einheit":"Stück","hinweis":null},{"name":"Veggie Hack","menge":75,"einheit":"g","hinweis":null},{"name":"Tomatenmark","menge":2,"einheit":"EL","hinweis":null},{"name":"Sojajoghurt","menge":200,"einheit":"g","hinweis":null},{"name":"Paprika Pulver","menge":2,"einheit":"EL","hinweis":null},{"name":"Knoblauch Pulver","menge":1,"einheit":"EL","hinweis":null},{"name":"Cumin","menge":0.5,"einheit":"EL","hinweis":null},{"name":"Paprika","menge":1,"einheit":"Stück","hinweis":null},{"name":"Avocado","menge":2,"einheit":"Stück","hinweis":null},{"name":"Rote Zwiebel","menge":0.5,"einheit":"Stück","hinweis":null},{"name":"Koriander oder Petersilie","menge":0.25,"einheit":"Bund","hinweis":null},{"name":"Limetten (Saft)","menge":2,"einheit":"Stk","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Eisberg Salat","menge":null,"einheit":null,"hinweis":null},{"name":"Tomate","menge":null,"einheit":null,"hinweis":null},{"name":"Veganer Frischkäse","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Veggie Hack nach Packungsanweisung zubereiten und anbraten.","Hitze reduzieren und Gewürze hinzugeben.","Tomatenmark, Sojajoghurt und Paprika hinzugeben und köcheln lassen.","Den Wrap nach Belieben belegen und zusammenfalten.","Bei 195 Grad für 10 Minuten in Airfryer backen."]'::jsonb,
  updated_at    = now()
WHERE id = '0b967925-d838-49ca-abc7-9be155dfba38';

-- Vegane Bohnen-Burger
UPDATE recipes SET
  titel         = 'Vegane Bohnen-Burger',
  beschreibung  = 'Vegane Burger-Pattys aus Kidneybohnen und Haferflocken',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegan','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kidneybohnen","menge":250,"einheit":"g","hinweis":null},{"name":"Haferflocken","menge":60,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":85,"einheit":"g","hinweis":null},{"name":"Mehl","menge":25,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"EL","hinweis":null},{"name":"Senf","menge":1,"einheit":"EL","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Öl","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten außer Zwiebeln in einer Schüssel vermischen.","Zwiebeln unterkneten, bis eine homogene Masse entsteht.","Pattys formen.","Pattys in Öl goldbraun anbraten.","Burger nach Belieben mit weiteren Zutaten anrichten."]'::jsonb,
  updated_at    = now()
WHERE id = '3b43d96e-ccc2-4061-a3f3-28532ab9b307';

-- Schokoladen Brownies
UPDATE recipes SET
  titel         = 'Schokoladen Brownies',
  beschreibung  = 'Gesunde Brownies mit Kichererbsen und Haferflocken',
  schwierigkeit = 'mittel',
  tags          = ARRAY['dessert','zuckerfrei','mealprep'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kichererbsen","menge":230,"einheit":"g","hinweis":null},{"name":"Haferflocken","menge":100,"einheit":"g","hinweis":null},{"name":"Mandelmus","menge":1,"einheit":"EL","hinweis":null},{"name":"Joghurt","menge":200,"einheit":"g","hinweis":null},{"name":"Leinsamen","menge":50,"einheit":"g","hinweis":null},{"name":"Kakaopulver","menge":5,"einheit":"EL","hinweis":null},{"name":"Zimt","menge":1,"einheit":"TL","hinweis":null},{"name":"Milch (pflanzlich)","menge":100,"einheit":"ml","hinweis":null},{"name":"Bananen","menge":2,"einheit":"Stück","hinweis":null},{"name":"Zartbitter Schokoladendrops","menge":2,"einheit":"EL","hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten außer den Schokoladendrops mischen und pürieren.","Den Teig in eine Form geben.","Die Schokoladendrops vorsichtig unterheben.","Für ca. 25-30 Minuten bei 180 Grad backen.","Nach Belieben mit zusätzlicher Schokolade, Nussmus oder Marmelade toppen."]'::jsonb,
  updated_at    = now()
WHERE id = '0fc3fd1f-d400-47da-9bc6-2d014b5f7f35';

-- Rote Linsen Pizza
UPDATE recipes SET
  titel         = 'Rote Linsen Pizza',
  beschreibung  = 'Eiweißreiche Pizza mit roten Linsen und Hähnchenbrust',
  schwierigkeit = NULL,
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Rote Linsen","menge":100,"einheit":"g","hinweis":null},{"name":"Gekochte Hähnchenbrust","menge":150,"einheit":"g","hinweis":null},{"name":"Tomatensauce","menge":2,"einheit":"EL","hinweis":null},{"name":"Fettarmer geriebener Käse","menge":60,"einheit":"g","hinweis":null},{"name":"Rote Zwiebel","menge":0.5,"einheit":"Stück","hinweis":null},{"name":"Paprika","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = '33e575ce-a2af-45b7-82ca-09937979337f';

-- Kartoffelchips
UPDATE recipes SET
  titel         = 'Kartoffelchips',
  beschreibung  = 'Knusprige Kartoffelchips kalorienarm selbst gemacht',
  schwierigkeit = 'mittel',
  tags          = ARRAY['snack','lowcal','vegan','schnell'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Salz","menge":1,"einheit":"TL","hinweis":null},{"name":"Pfeffer","menge":1,"einheit":"TL","hinweis":null},{"name":"Paprika","menge":1,"einheit":"TL","hinweis":null},{"name":"Speisestärke","menge":1,"einheit":"TL","hinweis":null},{"name":"Kartoffeln","menge":null,"einheit":null,"hinweis":null},{"name":"Öl Spray","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Schneide die Kartoffeln in sehr dünne Scheiben oder hobel sie gleichmäßig.","Lege die Scheiben für etwa 20 Minuten in kaltes Wasser, damit ein Teil der Stärke ausgewaschen wird.","Nimm sie anschließend heraus und tupfe sie gründlich trocken.","Gib die Kartoffelscheiben in eine Schüssel und streue Salz, Pfeffer, Paprika und die Speisestärke darüber.","Mische alles gut durch und gib drei bis vier Sprühstöße Öl dazu, vermenge alles erneut, sodass die Scheiben leicht benetzt sind.","Gib die Kartoffeln in den Airfryer und gare sie bei 180 Grad in der Funktion Roast für etwa 20 Minuten.","Schüttle den Korb währenddessen zwei Mal, damit sich die Scheiben neu verteilen und gleichmäßig bräunen.","Nimm kleinere oder bereits braune Chips zwischendurch heraus.","Breite die fertigen Chips nach dem Garen locker aus und lass sie abkühlen, damit sie knusprig bleiben."]'::jsonb,
  updated_at    = now()
WHERE id = 'f32e6a55-3237-4017-bc6a-07972374cef2';

-- Kaffee-Chia-Skyr-Bowl
UPDATE recipes SET
  titel         = 'Kaffee-Chia-Skyr-Bowl',
  beschreibung  = 'Gesunde Bowl mit Kaffee, Chiasamen und Skyr',
  schwierigkeit = 'einfach',
  tags          = ARRAY['frühstück','snack','vegan','schnell'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kaffee","menge":80,"einheit":"ml","hinweis":null},{"name":"Chiasamen","menge":2,"einheit":"EL","hinweis":null},{"name":"Skyr","menge":150,"einheit":"g","hinweis":null},{"name":"Milch","menge":60,"einheit":"ml","hinweis":null},{"name":"Whey-Protein (Vanille)","menge":1,"einheit":"Scoop","hinweis":null},{"name":"Süßlungsmittel","menge":null,"einheit":null,"hinweis":null},{"name":"Kakaopulver","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten in einem kleinen Behälter gut vermischen.","Mindestens 2 Stunden kühlen, besser über Nacht.","Vor dem Servieren ganz leicht mit Kakao bestäuben."]'::jsonb,
  updated_at    = now()
WHERE id = '5d2ba18f-05bc-4f7d-abfd-75be664c9324';

-- Tiramisu Overnight Oats
UPDATE recipes SET
  titel         = 'Tiramisu Overnight Oats',
  beschreibung  = 'Gesundes Overnight-Oat-Tiramisu',
  schwierigkeit = 'einfach',
  tags          = ARRAY['frühstück','snack'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Haferflocken","menge":1,"einheit":"Tasse","hinweis":null},{"name":"Rohkakao-Pulver","menge":3,"einheit":"EL","hinweis":null},{"name":"Chiasamen","menge":1.5,"einheit":"EL","hinweis":null},{"name":"Espresso","menge":3,"einheit":"EL","hinweis":null},{"name":"Mandelmilch","menge":1.25,"einheit":"Tassen","hinweis":null},{"name":"Rohhonig","menge":2,"einheit":"EL","hinweis":null},{"name":"Vanille-Extrakt","menge":1,"einheit":"TL","hinweis":null},{"name":"Vanille-Protein-Pulver","menge":30,"einheit":"g","hinweis":null},{"name":"Vollfett-Joghurt","menge":1.5,"einheit":"Tassen","hinweis":null},{"name":"Himalaja-Salz","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Die trockenen Zutaten in einer Schüssel vermischen, bis sie gut kombiniert sind.","Den Espresso, die Mandelmilch, 2 EL Rohhonig und 1 TL Vanille-Extrakt hinzufügen und gut vermischen.","In ein verschließbares Glasgefäß umfüllen.","Für die Proteinyoghurt-Topping die Vanille-Extrakt, 1/2 EL Rohhonig und Proteinpulver in den Joghurt rühren.","Die Yoghurt-Mischung über die Haferflocken-Mischung streichen und mit etwas Kakao-Pulver bestreuen.","Im Kühlschrank für 8 Stunden oder über Nacht aufbewahren."]'::jsonb,
  updated_at    = now()
WHERE id = '62441bc4-9e2b-4660-8e4d-9035f61a50ca';

-- Karotten-Wrap aus dem Ofen
UPDATE recipes SET
  titel         = 'Karotten-Wrap aus dem Ofen',
  beschreibung  = 'Einfacher und gesunder Wrap aus Karotten, Ei und Mozzarella',
  schwierigkeit = 'einfach',
  tags          = ARRAY['snack','vegetarisch','schnell'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Karotten","menge":3,"einheit":"Stück","hinweis":null},{"name":"Ei","menge":1,"einheit":"Stück","hinweis":null},{"name":"Mozzarella","menge":70,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Frischkäse","menge":null,"einheit":null,"hinweis":null},{"name":"Avocado","menge":null,"einheit":null,"hinweis":null},{"name":"Salat","menge":null,"einheit":null,"hinweis":null},{"name":"Tomaten","menge":null,"einheit":null,"hinweis":null},{"name":"Gurke","menge":null,"einheit":null,"hinweis":null},{"name":"Hummus","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Ofen auf 180 °C Umluft vorheizen.","Karotten fein raspeln.","Mit Ei, Mozzarella, Salz und Pfeffer vermengen.","Die Masse auf ein mit Backpapier belegtes Blech geben und flach zu einem Rechteck drücken.","Ca. 15–20 Minuten backen, bis der Wrap fest und leicht goldbraun ist.","Kurz abkühlen lassen, nach Belieben belegen, einrollen und genießen."]'::jsonb,
  updated_at    = now()
WHERE id = 'ada1462c-bd93-4f0a-a2e2-6b97e150ec31';

-- Erdnuss-Maggi mit Paneer
UPDATE recipes SET
  titel         = 'Erdnuss-Maggi mit Paneer',
  beschreibung  = 'Würzige Maggi-Nudeln mit Erdnussbutter und Paneer Katsu',
  schwierigkeit = 'mittel',
  tags          = ARRAY['indisch','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Peanutbutter","menge":2,"einheit":"EL","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"EL","hinweis":null},{"name":"Maggi-Masala-Päckchen","menge":2,"einheit":"Stück","hinweis":null},{"name":"Schezwan-Ketchup","menge":0.5,"einheit":"EL","hinweis":null},{"name":"Rotes Chili-Pulver","menge":1,"einheit":"EL","hinweis":null},{"name":"Frische Sahne","menge":0.5,"einheit":"Tasse","hinweis":null},{"name":"Öl","menge":1,"einheit":"TL","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"TL","hinweis":null},{"name":"Ginger","menge":1,"einheit":"TL","hinweis":null},{"name":"Maida (Allzweckmehl)","menge":0.5,"einheit":"Tasse","hinweis":null},{"name":"Paneer-Scheiben","menge":null,"einheit":null,"hinweis":null},{"name":"Breadcrumbs","menge":null,"einheit":null,"hinweis":null},{"name":"Wasser","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Peanutbutter, Sojasauce, Maggi-Masala-Päckchen, Schezwan-Ketchup, rotes Chili-Pulver und Wasser zu einer Sauce vermischen.","Maggi-Nudeln 70% kochen, abgießen und beiseite stellen.","Öl in einer Pfanne erhitzen, Knoblauch und Ginger anbraten, dann die Sauce hinzufügen und 1 Minute kochen.","Nudeln, Sahne und Wasser (falls nötig) hinzufügen und 2 Minuten kochen.","Paneer-Scheiben in einer Maida-Slurry tauchen, mit Breadcrumbs bestreuen und in Öl goldbraun backen.","Maggi auf einem Teller anrichten, mit Paneer-Katsu belegen, Chili-Öl drüber träufeln und mit Frühlingszwiebeln garnieren."]'::jsonb,
  updated_at    = now()
WHERE id = 'f03e7bba-a1e0-4d88-a28a-401b89dd2cf1';

-- Big Mac Tacos
UPDATE recipes SET
  titel         = 'Big Mac Tacos',
  beschreibung  = 'Eine Variante der berühmten Big Mac Tacos, leicht und proteinreich',
  schwierigkeit = 'einfach',
  tags          = ARRAY['highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Fettreduziertes Rinderhackfleisch","menge":300,"einheit":"g","hinweis":null},{"name":"Protein Wraps","menge":3,"einheit":"Stück","hinweis":null},{"name":"Eisbergsalat","menge":100,"einheit":"g","hinweis":null},{"name":"Gewürzgurken","menge":50,"einheit":"g","hinweis":null},{"name":"Rote Zwiebel","menge":0.5,"einheit":"Stück","hinweis":null},{"name":"Senf","menge":1,"einheit":"EL","hinweis":null},{"name":"Mayo (Light)","menge":2,"einheit":"EL","hinweis":null},{"name":"Curry Ketchup (Light)","menge":2,"einheit":"EL","hinweis":null},{"name":"Gurkenwasser","menge":2,"einheit":"EL","hinweis":null},{"name":"Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Knoblauchpulver","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zutaten vorbereiten.","Rinderhackfleisch anbraten.","Salat, Gurken, Zwiebel und Gewürze hinzufügen.","In Protein Wraps füllen und mit Senf, Mayo, Curry Ketchup und Gurkenwasser toppen."]'::jsonb,
  updated_at    = now()
WHERE id = '1ddec38a-279a-49a4-801f-135cf601bc23';

-- Highprotein Hackfleisch Ofentacos
UPDATE recipes SET
  titel         = 'Highprotein Hackfleisch Ofentacos',
  beschreibung  = 'Leckere Ofentacos mit Hackfleisch und hohem Eiweißgehalt',
  schwierigkeit = 'mittel',
  tags          = ARRAY['highprotein','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hackfleisch","menge":700,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Paprika","menge":1,"einheit":"Stück","hinweis":null},{"name":"Kidneybohnen","menge":1,"einheit":"Dose","hinweis":null},{"name":"Paprikapulver","menge":2,"einheit":"TL","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"TL","hinweis":null},{"name":"Salz","menge":1,"einheit":"TL","hinweis":null},{"name":"Chipotle-Chili","menge":0.5,"einheit":"TL","hinweis":null},{"name":"Passierte Tomaten","menge":150,"einheit":"ml","hinweis":null},{"name":"Philadelphia Light Frischkäse","menge":70,"einheit":"g","hinweis":null},{"name":"Mini Tortilla Wraps","menge":10,"einheit":"Stück","hinweis":null},{"name":"Fettarmer Streukäse","menge":150,"einheit":"g","hinweis":null},{"name":"Öl-Spray","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zwiebel klein schneiden und mit etwas Öl-Spray scharf anbraten.","Hackfleisch dazugeben und krümelig braten.","Gewürze einrühren und kurz mitrösten.","Paprika und Kidneybohnen dazugeben und 2 bis 3 Minuten mitbraten.","Passierte Tomaten und Frischkäse einrühren und gut vermengen.","Kurz köcheln lassen, bis die Masse cremig wird.","Tortillas füllen und mit Käse bestreuen.","15 Minuten bei 200 Grad im Ofen backen."]'::jsonb,
  updated_at    = now()
WHERE id = '14379271-97d4-4cb7-a58d-ff5e4a21bda2';

-- Big Mac Kartoffelsalat
UPDATE recipes SET
  titel         = 'Big Mac Kartoffelsalat',
  beschreibung  = 'Vegane Variante des klassischen Big Mac, aber als Kartoffelsalat',
  schwierigkeit = 'mittel',
  tags          = ARRAY['beilage','vegan','schnell'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":600,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":3,"einheit":"EL","hinweis":null},{"name":"Paprikapulver, rosenscharf","menge":1,"einheit":"TL","hinweis":null},{"name":"Salz","menge":1.5,"einheit":"TL","hinweis":null},{"name":"Veganes Hack","menge":360,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Paprikapulver, edelsüß","menge":0.5,"einheit":"TL","hinweis":null},{"name":"Knoblauchpulver","menge":0.5,"einheit":"TL","hinweis":null},{"name":"Gewürzgurken","menge":200,"einheit":"g","hinweis":null},{"name":"Eisbergsalat","menge":1,"einheit":"Kopf","hinweis":null},{"name":"Kirschtomaten","menge":250,"einheit":"g","hinweis":null},{"name":"Seidentofu","menge":400,"einheit":"g","hinweis":null},{"name":"Senf","menge":2,"einheit":"EL","hinweis":null},{"name":"Gewürzgurkenwasser","menge":80,"einheit":"ml","hinweis":null},{"name":"Ketchup","menge":5,"einheit":"EL","hinweis":null},{"name":"Chiliöl","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln würfeln und mit Olivenöl, Paprikapulver rosenscharf und Salz vermengen.","Kartoffeln bei 190 Grad für ca. 25 Minuten in den Ofen oder Airfryer geben.","Zwiebel würfeln und zusammen mit dem Hack in einer Pfanne mit Olivenöl anbraten.","Mit Paprika- und Knoblauchpulver würzen.","Währenddessen Eisbergsalat, Tomaten und Gewürzgurken klein schneiden.","Für die Sauce alle Zutaten miteinander vermengen.","Alle Zutaten in eine große Schüssel geben und miteinander vermengen."]'::jsonb,
  updated_at    = now()
WHERE id = 'd81b7eff-5b0a-4877-9da6-90afb7c4a557';

-- Vegane Köfte
UPDATE recipes SET
  titel         = 'Vegane Köfte',
  beschreibung  = 'Ein traditionelles Gericht aus der Heimat, vegan interpretiert',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegan','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Berglinsen","menge":120,"einheit":"g","hinweis":null},{"name":"Kartoffel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Karotte","menge":1,"einheit":"Stück","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Salz","menge":1,"einheit":"TL","hinweis":null},{"name":"Wasser","menge":1000,"einheit":"ml","hinweis":null},{"name":"Paniermehl","menge":150,"einheit":"g","hinweis":null},{"name":"Petersilie","menge":1,"einheit":"Handvoll","hinweis":null},{"name":"Paprikapulver","menge":1,"einheit":"TL","hinweis":null},{"name":"Kreuzkümmel","menge":1,"einheit":"TL","hinweis":null},{"name":"Pfeffer","menge":1,"einheit":"TL","hinweis":null},{"name":"Olivenöl","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Berglinsen, Kartoffel, Karotte, Zwiebel und Salz in Wasser ca. 50 Minuten köcheln lassen, bis das Gemüse weich ist.","Überschüssiges Wasser abschöpfen.","Alles gut miteinander zerstampfen.","Paniermehl, Petersilie, Paprikapulver, Kreuzkümmel und Pfeffer dazugeben und alles gut vermengen.","Daraus kleine Köfte formen.","Köfte in Olivenöl von beiden Seiten jeweils 3–4 Minuten knusprig anbraten."]'::jsonb,
  updated_at    = now()
WHERE id = '29844a0f-0b7a-4251-bc7e-67a6758ad0b4';

-- Testo Spaghetti
UPDATE recipes SET
  titel         = 'Testo Spaghetti',
  beschreibung  = 'Schnelles und proteinreiches Spaghetti-Rezept mit Avocado und Edamame',
  schwierigkeit = 'einfach',
  tags          = ARRAY['highprotein','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Avocados","menge":2,"einheit":"Stück","hinweis":null},{"name":"Knoblauchzehen","menge":2,"einheit":"Stück","hinweis":null},{"name":"Babyspinat","menge":100,"einheit":"g","hinweis":null},{"name":"Frischkäse Light","menge":1,"einheit":"EL","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"EL","hinweis":null},{"name":"Edamame Spaghetti","menge":200,"einheit":"g","hinweis":null},{"name":"Parmesan","menge":30,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zubereitung wie im Video beschrieben."]'::jsonb,
  updated_at    = now()
WHERE id = '77a2dfb4-074c-467b-9b13-97edfd2cc4ea';

-- Flammkuchen-Wraps mit Schinken
UPDATE recipes SET
  titel         = 'Flammkuchen-Wraps mit Schinken',
  beschreibung  = 'Schnelle Flammkuchen-Wraps mit Schinken und Crème Légère',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','schnell','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Protein Tortilla Wraps ca. 120 g","menge":2,"einheit":"High","hinweis":null},{"name":"fettarme Schinkenwürfel","menge":75,"einheit":"g","hinweis":null},{"name":"Crème Légère","menge":80,"einheit":"g","hinweis":null},{"name":"Streukäse light","menge":40,"einheit":"g","hinweis":null},{"name":"rote Zwiebel ca. 50 g","menge":1,"einheit":"kleine","hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Backofen auf  Grad Umluft vorheizen","Zwiebel fein würfeln","Wraps auf ein Backblech legen","Mit Crème Légère bestreichen","Schinkenwürfel, Zwiebel und Streukäse darauf verteilen","Mit Pfeffer würzen","Ca.  Minuten backen bis der Käse geschmolzen ist und die Ränder leicht knusprig sin"]'::jsonb,
  updated_at    = now()
WHERE id = '46ca7d36-4c0e-4929-a22c-e7b588f37cb3';

-- Karotten-Wrap aus dem Ofen
UPDATE recipes SET
  titel         = 'Karotten-Wrap aus dem Ofen',
  beschreibung  = 'Einfacher Wrap aus geriebenen Karotten, Ei und Mozzarella',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Ei","menge":1,"einheit":"g","hinweis":null},{"name":"& Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Für die Füllung :","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Ofen auf  °C Umluft vorheizen.","Karotten fein raspeln.","Mit Ei, Mozzarella, Salz und Pfeffer vermengen.","Masse auf ein mit Backpapier belegtes Blech geben und flach zu einem Rechteck drücken.","Ca. – Minuten backen, bis der Wrap fest und leicht goldbraun ist.","Kurz abkühlen lassen, nach Belieben belegen, einrollen und genießen.","karottenwrap einfacherezepte schnellerezepte gesunderezepte rezepte"]'::jsonb,
  updated_at    = now()
WHERE id = 'efadfc2e-2f87-49a6-88ab-65028bc05351';

-- Knuspriger Kartoffel Döner Salat
UPDATE recipes SET
  titel         = 'Knuspriger Kartoffel Döner Salat',
  beschreibung  = 'Knuspriger Kartoffel Döner Salat Heute ist Tag 8 von 10 meiner Serie mit leckeren und einfachen Salaten, folgt mir @liliyummy gerne um Nichts zu verpassen! In den Salat werdet ihr euch verlieben...',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Cherrytomaten","menge":2,"einheit":"Handvoll","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Hähnchenbrust","menge":300,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"el","hinweis":null},{"name":"Joghurt","menge":200,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"g","hinweis":null},{"name":"Tk Kräuter","menge":2,"einheit":"tl","hinweis":null},{"name":"Olivenöl","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zutaten:","ca.  g Drillinge","etwas Olivenöl","Gewürze(Salz, Pfeffer,Paprika)","ca./ Kopfsalat","Minigurken","Handvoll Cherrytomaten","/ Rotkohl","Zwiebel","g Hähnchenbrust","EL Olivenöl","Döner Gewürz(Paprika, Knoblauchpulver, Pfeffer, Chiliflocken, Kreuzkümmel,Oregano)","Für das Dressing:","g (griechischer)Joghurt","/ Zitronensaft","Knoblauchzehe","TL Tk Kräuter","Salz, Pfeffer","Hähnchen in Streifen schneiden und für mindestens  Minuten mit dem Gewürz und Olivenöl marinieren. Danach das Fleisch anbraten.","Drillinge waschen, kochen und danach auf ein mit Backpapier belegtes Backblech platt drücken. Etwas Olivenöl und Gewürze hinzufügen und bei  Grad - Minuten backen.","übrige Gemüse dünn schneiden und in eine Schüssel geben. Die Kartoffeln und das Fleisch abkühlen und dazugeben.","Alle Zutaten für das Dressing vermengen und zu dem Salat hinzufügen.","Schon ist der leckere Salat fertig. Guten Appetit ️","salat döner einfacherezepte schnellerezepte gesunderezepte einfachkochen gemüse","Gesunder einfacher Salat","Schnell kochen","Einfache Rezepte"]'::jsonb,
  updated_at    = now()
WHERE id = '942ff9cb-51af-4c30-85e5-86a0ee2bedd2';

-- Hackfleisch-Ofentacos
UPDATE recipes SET
  titel         = 'Hackfleisch-Ofentacos',
  beschreibung  = 'Saftige Ofentacos mit Hackfleisch und Kidneybohnen',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['schnell','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hackfleisch, 5 Prozent Fett","menge":700,"einheit":"g","hinweis":null},{"name":"Zwiebel, gewürfelt","menge":1,"einheit":"g","hinweis":null},{"name":"Paprika, gewürfelt","menge":1,"einheit":"g","hinweis":null},{"name":"Kidneybohnen, abgetropft","menge":1,"einheit":"dose","hinweis":null},{"name":"Paprikapulver","menge":2,"einheit":"tl","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"passierte Tomaten","menge":150,"einheit":"ml","hinweis":null},{"name":"Philadelphia Light Frischkäse","menge":70,"einheit":"g","hinweis":null},{"name":"Tortilla Wraps","menge":10,"einheit":"Mini","hinweis":null},{"name":"fettarmer Streukäse","menge":150,"einheit":"g","hinweis":null},{"name":"1/2 TL Chipotle-Chili","menge":null,"einheit":null,"hinweis":null},{"name":"Öl-Spray","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zwiebel klein schneiden und mit etwas Öl-Spray scharf anbraten","Hackfleisch dazugeben und krümelig braten","Gewürze einrühren und kurz mitrösten","Paprika und Kidneybohnen dazugeben und  bis  Minuten mitbraten","Passierte Tomaten und Frischkäse einrühren und gut vermengen","Kurz köcheln lassen, bis die Masse cremig wird","Tortillas füllen und mit Käse bestreuen","Minuten bei  Grad im Ofen backen"]'::jsonb,
  updated_at    = now()
WHERE id = '2cab7387-f9d7-43bd-b631-5074942d2fe0';

-- Linsen-Köfte
UPDATE recipes SET
  titel         = 'Linsen-Köfte',
  beschreibung  = 'Vegane Köfte aus Berglinsen, Kartoffel und Karotte',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegan','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Berglinsen","menge":120,"einheit":"g","hinweis":null},{"name":"große Kartoffel","menge":1,"einheit":"g","hinweis":null},{"name":"große Karotte","menge":1,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"Paniermehl","menge":150,"einheit":"g","hinweis":null},{"name":"gehackte Petersilie","menge":1,"einheit":"Handvoll","hinweis":null},{"name":"Paprikapulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Kreuzkümmel","menge":1,"einheit":"tl","hinweis":null},{"name":"Pfeffer","menge":1,"einheit":"tl","hinweis":null},{"name":"zusammen ca. 50 Minuten köcheln lassen, bis das Gemüse weich ist. Falls noch überschüssiges Wasser übrig ist, abschöpfen.","menge":null,"einheit":null,"hinweis":null},{"name":"alles gut miteinander zerstampfen.","menge":null,"einheit":null,"hinweis":null},{"name":"dazugeben:","menge":null,"einheit":null,"hinweis":null},{"name":"gut vermengen und daraus kleine Köfte formen.","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = 'f9d9492e-5113-41b5-aa58-1bf985e5a2c6';

-- Burger Salad Bowl
UPDATE recipes SET
  titel         = 'Burger Salad Bowl',
  beschreibung  = 'Burger Salad Bowl (Per Serving - 2 Total) 593 Calories',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Extra Lean Ground Beef","menge":400,"einheit":"g","hinweis":null},{"name":"Cubed Potatoes","menge":300,"einheit":"g","hinweis":null},{"name":"Large Tomato","menge":1,"einheit":"Diced","hinweis":null},{"name":"Low Fat Shredded Cheese","menge":45,"einheit":"g","hinweis":null},{"name":"of lettuce","menge":1,"einheit":"head","hinweis":null},{"name":"Low Fat Greek Yogurt","menge":125,"einheit":"g","hinweis":null},{"name":"Light or Fat Free Mayonnaise","menge":1,"einheit":"Tbsp","hinweis":null},{"name":"Yellow Mustard","menge":2,"einheit":"Tbsp","hinweis":null},{"name":"Low Cal Ketchup","menge":1,"einheit":"Tbsp","hinweis":null},{"name":"Pickle Juice","menge":2,"einheit":"Tbsp","hinweis":null},{"name":"Sweetener","menge":2,"einheit":"Tsp","hinweis":null},{"name":"a medium high heat, spray your pan with cooking spray and cook the extra lean ground beef until it develops a nice golden colour.","menge":1,"einheit":"On","hinweis":null},{"name":"with seasonings of your choice, I used salt, pepper, garlic powder and onion powder.","menge":2,"einheit":"Season","hinweis":null},{"name":"up 300g of Potato, season with salt, garlic powder, and cook them in the air fryer or oven at 400F for 13-18mins  until golden brown","menge":4,"einheit":"Cubed","hinweis":null},{"name":"into 2 equal portions and enjoy!","menge":6,"einheit":"Divide","hinweis":null},{"name":"Red Onion","menge":null,"einheit":null,"hinweis":null},{"name":"Pickles","menge":null,"einheit":null,"hinweis":null},{"name":"Sauce/Dressing:","menge":null,"einheit":null,"hinweis":null},{"name":"Pickles","menge":null,"einheit":null,"hinweis":null},{"name":"Onions","menge":null,"einheit":null,"hinweis":null},{"name":"me for daily healthy recipes!","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = 'b0a6f2cc-235d-4e98-8fb0-5d0b7ddd1cc9';

-- Asia-Nudeln mit Hähnchen
UPDATE recipes SET
  titel         = 'Asia-Nudeln mit Hähnchen',
  beschreibung  = 'Würzige Asia-Nudeln mit Hähnchen und Weißkohl',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust","menge":800,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":20,"einheit":"g","hinweis":null},{"name":"Hoisin Sauce","menge":1,"einheit":"el","hinweis":null},{"name":"gehackter Knoblauch","menge":1,"einheit":"el","hinweis":null},{"name":"Pfeffer","menge":1,"einheit":"tl","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"dunkle Sojasauce","menge":30,"einheit":"g","hinweis":null},{"name":"helle Sojasauce","menge":15,"einheit":"g","hinweis":null},{"name":"Austernsauce","menge":15,"einheit":"g","hinweis":null},{"name":"Reisessig","menge":15,"einheit":"g","hinweis":null},{"name":"Stevia","menge":10,"einheit":"g","hinweis":null},{"name":"Maisstärke","menge":1,"einheit":"tl","hinweis":null},{"name":"Mie Nudeln","menge":250,"einheit":"g","hinweis":null},{"name":"Weißkohl","menge":200,"einheit":"g","hinweis":null},{"name":"Karotten","menge":150,"einheit":"g","hinweis":null},{"name":"Frühlingszwiebeln","menge":2,"einheit":"g","hinweis":null},{"name":"Ölspray","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchen klein schneiden","Mit Sojasauce, Hoisin Sauce, Knoblauch, Pfeffer und Backpulver vermengen","In zwei Portionen mit Ölspray scharf anbraten und durchgaren","Fleisch aus der Pfanne nehmen","Mie Nudeln in heißem Wasser garen und abgießen","Weißkohl in schmale Streifen schneiden","Karotten schälen und schneiden","Frühlingszwiebeln trennen. Das Weiße für die Pfanne, das Grüne für später","Karotten, Weißkohl und das Weiße der Frühlingszwiebeln in der Pfanne anbraten und kurz dünsten","Sauce anrühren und dazugeben","Nudeln und Fleisch wieder in die Pfanne geben","Alles gründlich umrühren","Mit dem Grünen der Frühlingszwiebeln servieren"]'::jsonb,
  updated_at    = now()
WHERE id = 'f45819f1-0c7f-4b33-8006-d48a701605d3';

-- Highprotein Pizza
UPDATE recipes SET
  titel         = 'Highprotein Pizza',
  beschreibung  = 'Highprotein Pizza mit Magerquark und Dinkelmehl',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Magerquark","menge":250,"einheit":"g","hinweis":null},{"name":"Dinkelmehl","menge":140,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"prise","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Thymian getrocknet","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten miteinander vermengen und anschließend für  Minuten kaltstellen.","Nun ausrollen, nach Wahl belegen und bei  Grad für ca  - Minuten backen.","protein pizza spring recipe chef"]'::jsonb,
  updated_at    = now()
WHERE id = 'e79f5618-dfc3-4f4a-ba54-4a151805843d';

-- Tahini-Schoko-Bällchen
UPDATE recipes SET
  titel         = 'Tahini-Schoko-Bällchen',
  beschreibung  = 'Tahini-Schoko-Bällchen mit Tahini und ungesüßtes Kakaopulver',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Tahini","menge":2,"einheit":"el","hinweis":null},{"name":"ungesüßtes Kakaopulver","menge":1,"einheit":"el","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Zutat","menge":1,"einheit":"Ei","hinweis":null},{"name":"8–10 Datteln","menge":null,"einheit":null,"hinweis":null},{"name":"Schokostücke zum Topping","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["️⃣ Die eingeweichten Datteln sehr fein zerdrücken oder pürieren, bis eine glatte Paste entsteht.","️⃣ Ei, Tahini, Kakaopulver und Backpulver hinzufügen und gut verrühren, bis ein homogener Teig entsteht.","️⃣ Aus dem Teig kleine Cookies formen und in den Airfryer-Korb legen (am besten mit Backpapier).","️⃣ Mit dunklen Schokostücken toppen.","️⃣ Bei  °C im Airfryer ca. – Minuten backen – außen fest, innen weich","Credits @tastyiri_en"]'::jsonb,
  updated_at    = now()
WHERE id = '6738915b-75b4-40c3-902c-a59c45295fdd';

-- Chicken Tikka Masala Burrito
UPDATE recipes SET
  titel         = 'Chicken Tikka Masala Burrito',
  beschreibung  = 'Burrito mit Hähnchen in Tikka-Masala-Sauce und Reis',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenfleisch","menge":800,"einheit":"g","hinweis":null},{"name":"fettarmer griechischer Joghurt","menge":140,"einheit":"g","hinweis":null},{"name":"große Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"gepresster Knoblauch","menge":1,"einheit":"el","hinweis":null},{"name":"Ingwer","menge":2,"einheit":"el","hinweis":null},{"name":"Tomatenmark","menge":3,"einheit":"el","hinweis":null},{"name":"passierte Tomaten","menge":300,"einheit":"ml","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"fettarmer griechischer Joghurt","menge":140,"einheit":"g","hinweis":null},{"name":"High-Protein-Tortillas","menge":8,"einheit":"g","hinweis":null},{"name":"Reis, ungekocht","menge":130,"einheit":"g","hinweis":null},{"name":"geräuchertes Paprikapulver","menge":3,"einheit":"el","hinweis":null},{"name":"Kreuzkümmel","menge":2,"einheit":"el","hinweis":null},{"name":"Garam Masala","menge":1,"einheit":"el","hinweis":null},{"name":"Kurkuma","menge":1,"einheit":"tl","hinweis":null},{"name":"Cayennepfeffer","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  zubereitung   = '["Reis direkt am Anfang nach Packungsangabe kochen","Hähnchen klein schneiden und mit  g Joghurt und der Hälfte der Gewürzmischung vermengen","Fleisch portionsweise mit Ölspray anbraten und danach herausnehmen","Zwiebel und Ingwer klein schneiden","In derselben Pfanne Zwiebel, gepressten Knoblauch und Ingwer mit Ölspray anbraten","Tomatenmark dazugeben und kurz anrösten","Zweite Hälfte der Gewürzmischung einrühren","Passierte Tomaten dazugeben und salzen","Fleisch zurück in die Pfanne geben","Restliche  g Joghurt unterrühren","Gekochten Reis direkt in die Pfanne geben und alles gründlich vermischen","Mischung auf  Tortillas verteilen und einrollen","Burritos in einer Pfanne mit etwas Ölspray rundum anbraten bis sie knusprig sind"]'::jsonb,
  updated_at    = now()
WHERE id = '017cbbaf-677e-4a9e-9888-7f66dfa0ab79';

-- Hähnchen-Pasta mit Frischkäse
UPDATE recipes SET
  titel         = 'Hähnchen-Pasta mit Frischkäse',
  beschreibung  = 'Cremige Hähnchen-Pasta mit Frischkäsesauce',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Gemüsezwiebeln","menge":1,"einheit":"g","hinweis":null},{"name":"Öl","menge":1,"einheit":"tl","hinweis":null},{"name":"Frischkäse Light","menge":200,"einheit":"g","hinweis":null},{"name":"Kochsahne Light","menge":250,"einheit":"ml","hinweis":null},{"name":"Hähnchenbrust","menge":400,"einheit":"g","hinweis":null},{"name":"Proteinpasta","menge":200,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Würdest du probieren?","Zutaten für  Portionen:","Gemüsezwiebeln","g Frischkäse Light","ml Kochsahne Light","g Hähnchenbrust","g Proteinpasta","Petersilie","Paprikapulver, Salz, Pfeffer, Knoblauchpulver","Grad Umluft für - Minuten. Geht auch im Ofen!"]'::jsonb,
  updated_at    = now()
WHERE id = 'a05d7774-d83e-4020-b545-17a2f19f3e8c';

-- Tofu kann manchmal das bessere Hähnchen sein, oder
UPDATE recipes SET
  titel         = 'Tofu kann manchmal das bessere Hähnchen sein, oder',
  beschreibung  = 'Tofu kann manchmal das bessere Hähnchen sein, oder mit Tofu und Sojasauce',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Tofu","menge":200,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null},{"name":"Gara Masala Paste","menge":1,"einheit":"el","hinweis":null},{"name":"Joghurt","menge":2,"einheit":"el","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"stückige Tomaten","menge":400,"einheit":"g","hinweis":null},{"name":"Kochsahne 7%","menge":250,"einheit":"ml","hinweis":null}]'::jsonb,
  zubereitung   = '["Minuten bei  Grad Umluft in den Ofen. Dazu Reis oder Brot"]'::jsonb,
  updated_at    = now()
WHERE id = '6ccd36a1-fad5-498c-b6b7-c5192e19a536';

-- Highprotein Edamame Taccos
UPDATE recipes SET
  titel         = 'Highprotein Edamame Taccos',
  beschreibung  = 'Anzeige | High Protein Edamame Taccos High Protein/ proteinreich',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','schnell','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"75 g Edamame","menge":null,"einheit":null,"hinweis":null},{"name":"20 g Gouda light Reibekäse","menge":null,"einheit":null,"hinweis":null},{"name":"nach Wahl:","menge":null,"einheit":null,"hinweis":null},{"name":"20 g Hüttenkäse","menge":null,"einheit":null,"hinweis":null},{"name":"10 g Avocado, frisch","menge":null,"einheit":null,"hinweis":null},{"name":"5 g Pesto Rosso","menge":null,"einheit":null,"hinweis":null},{"name":"40 g Lachsschinken, fettarm","menge":null,"einheit":null,"hinweis":null},{"name":"mir gerne nicht, nur um Neues auszuprobieren, sondern auch für viele weitere Rezepte ohne Verzicht in deiner Abnahme😉","menge":null,"einheit":null,"hinweis":null},{"name":"Creatorin: @coconutandbliss","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = 'a82cc2a5-1523-4f7f-bb9c-27c4d49e5e4f';

-- Dattel-Erdnuss-Joghurt
UPDATE recipes SET
  titel         = 'Dattel-Erdnuss-Joghurt',
  beschreibung  = 'Mealprep-Joghurt mit Datteln, Erdnussbutter und Chia',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"medjool dates","menge":50,"einheit":"g","hinweis":null},{"name":"boiling water","menge":30,"einheit":"ml","hinweis":null},{"name":"high protein vanilla or Greek yoghurt","menge":160,"einheit":"g","hinweis":null},{"name":"peanut butter","menge":15,"einheit":"g","hinweis":null},{"name":"chia seeds","menge":30,"einheit":"g","hinweis":null},{"name":"milk","menge":80,"einheit":"ml","hinweis":null},{"name":"size - 720ml / 24oz","menge":null,"einheit":null,"hinweis":null},{"name":"and refrigerate for ~4 hours or overnight","menge":null,"einheit":null,"hinweis":null},{"name":"immediately or prep up to 6 for the week ahead!","menge":null,"einheit":null,"hinweis":null},{"name":"509","menge":null,"einheit":null,"hinweis":null},{"name":"61g","menge":null,"einheit":null,"hinweis":null},{"name":"18g","menge":null,"einheit":null,"hinweis":null},{"name":"30g","menge":null,"einheit":null,"hinweis":null},{"name":"“pepsi” if you wanna check out my recipe book with 200 recipes!! 🤗","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = '4a292e21-7936-4252-a45e-f6f1063ba4fc';

-- Schoko-Brötchen mit Quark
UPDATE recipes SET
  titel         = 'Schoko-Brötchen mit Quark',
  beschreibung  = 'Saftige Schoko-Brötchen aus Magerquark und Dinkelmehl',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Magerquark","menge":500,"einheit":"g","hinweis":null},{"name":"Dinkelmehl","menge":300,"einheit":"g","hinweis":null},{"name":"Stevia Schugga","menge":80,"einheit":"g","hinweis":null},{"name":"Päckchen Backpulver","menge":1,"einheit":"g","hinweis":null},{"name":"Zartbitter Schokodrops","menge":100,"einheit":"g","hinweis":null},{"name":"Vanilleextrakt","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"prise","hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten in eine große Schüssel geben und gründlich vermengen. Anschließend zu einem gleichmäßigen, geschmeidigen Teig kneten.","Teig auf einer leicht bemehlten Fläche zu einem länglichen Rechteck ausrollen. Das Rechteck der Länge nach halbieren. Anschließend beide Hälften in gleichmäßige Dreiecke schneiden.","Dreiecke von der breiten Seite zur Spitze hin aufrollen und in Form bringen.","Auf ein mit Backpapier belegtes Blech legen und bei  Grad für  bis  Minuten backen, bis sie goldbraun sind."]'::jsonb,
  updated_at    = now()
WHERE id = '06473b0e-a627-456a-bb46-13fd95b31b64';

-- Himbeer-Chia-Quark
UPDATE recipes SET
  titel         = 'Himbeer-Chia-Quark',
  beschreibung  = 'Leichter Chia-Quark mit Himbeeren und Flohsamen',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Chiasamen","menge":1,"einheit":"tl","hinweis":null},{"name":"Flohsamen","menge":1,"einheit":"tl","hinweis":null},{"name":"Flohsamenschalen","menge":1,"einheit":"tl","hinweis":null},{"name":"H²0  Wasser","menge":150,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":250,"einheit":"g","hinweis":null},{"name":"Himbeeren / Blaubeeren","menge":100,"einheit":"g","hinweis":null},{"name":"Proteinpulver","menge":null,"einheit":null,"hinweis":null},{"name":"ich einen Vollzeitjob habe und keine Zeit habe, ständig zu kochen.","menge":null,"einheit":null,"hinweis":null},{"name":"\"Ing\", wenn du mit minimaler Aufwand das Maximum aus dir herausholen möchtest.","menge":null,"einheit":null,"hinweis":null},{"name":"dir das Video gefallen? Teile es mit einem Freund oder Arbeitskollege","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = 'ce5fb379-6b62-4e78-8050-b277afd7d7e3';

-- Thunfisch-Schüttel-Pizza
UPDATE recipes SET
  titel         = 'Thunfisch-Schüttel-Pizza',
  beschreibung  = 'Protein-reiche Pizza aus Skyr, Thunfisch und Eiern',
  schwierigkeit = 'mittel',
  tags          = ARRAY['highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Skyr","menge":500,"einheit":"g","hinweis":null},{"name":"Thunfisch","menge":150,"einheit":"g","hinweis":null},{"name":"Zwiebeln","menge":110,"einheit":"g","hinweis":null},{"name":"Eier, 165 g","menge":3,"einheit":"g","hinweis":null},{"name":"Mais","menge":90,"einheit":"g","hinweis":null},{"name":"Light Käse","menge":150,"einheit":"g","hinweis":null},{"name":"Petersilie","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten in einer Schüssel zusammen mischen. Die Masse auf ein mit Backpapier ausgelegtes Blech verteilen. Dann bei  Grad Umluft  bis  Minuten backen.","highprotein instagram"]'::jsonb,
  updated_at    = now()
WHERE id = 'b20a07a7-4802-41be-8dcc-145752b8455b';

-- Apfel-Schoko-Proteinkuchen
UPDATE recipes SET
  titel         = 'Apfel-Schoko-Proteinkuchen',
  beschreibung  = 'Saftiger Kuchen mit Apfel, Kakao und Proteinpulver',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Apfel","menge":1,"einheit":"g","hinweis":null},{"name":"Ei","menge":1,"einheit":"g","hinweis":null},{"name":"Schoko-Proteinpulver","menge":30,"einheit":"g","hinweis":null},{"name":"Kakaopulver","menge":5,"einheit":"g","hinweis":null},{"name":"Schokodrops","menge":10,"einheit":"g","hinweis":null},{"name":"einen von 5 @esncom -Gutscheinen zu gewinnen, like und speichere dieses Video und kommentiere einmal unten - was genau, verrate ich dir am Ende vom Video.","menge":null,"einheit":null,"hinweis":null},{"name":"sag doch mal bescheid: sehen wir uns bei der FIBO?","menge":null,"einheit":null,"hinweis":null},{"name":"dient nicht nur dem Muskelaufbau, sondern kann als Baustein für Enzyme, Hormone und Signalstoffe zum Stoffwechsel, Immunsystem und zur Gewebereparatur beitragen.","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Schneide den Apfel in kleine Stücke.","Gib Apfelstücke, Ei, Proteinpulver und Kakaopulver in einen Mixer und mixe alles zu einer glatten Masse.","Fülle den Teig in eine kleine ofenfeste Form und streue die Schokodrops darüber.","Backe den Kuchen bei  Grad Umluft etwa  Minuten, bis die Oberfläche leicht fest ist.","Credits @andisoergel","Gewinnspiel steht in keinem Zusammenhang mit Meta. Die Auslosung erfolgt am Sonntag, den .. um  Uhr. Gewinner werden per DM von diesem Kanal benachrichtigt."]'::jsonb,
  updated_at    = now()
WHERE id = 'ea95933b-54de-4e65-b3a0-4f15f440e4b1';

-- Gyoza mit Shiitake und Hackfleisch
UPDATE recipes SET
  titel         = 'Gyoza mit Shiitake und Hackfleisch',
  beschreibung  = 'Asiatische Teigtaschen mit Shiitake-Pilzen und Schweinehack',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Shiitake Pilze","menge":100,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"g","hinweis":null},{"name":"daumengroßes Stück Ingwer","menge":1,"einheit":"g","hinweis":null},{"name":"Schweinehackfleisch","menge":500,"einheit":"g","hinweis":null},{"name":"brauner Zucker","menge":1,"einheit":"tl","hinweis":null},{"name":"helle Sojasauce","menge":2,"einheit":"el","hinweis":null},{"name":"Fischsauce","menge":1,"einheit":"el","hinweis":null},{"name":"Reisessig","menge":1,"einheit":"el","hinweis":null},{"name":"geröstetes Sesamöl","menge":1,"einheit":"el","hinweis":null},{"name":"Teigblätter","menge":24,"einheit":"Wantan","hinweis":null},{"name":"Chiliöl","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Frühlingszwiebeln bitte in dicke Ringe schneiden. Nur  Frühlingszwiebel in feine Ringe für obendrauf, die legen wir in kaltes Wasser. Die Shiitake Pilze entweder mit einem Messer hacken oder mit den Händen auseinanderrupfen. Geht beides. Den Knoblauch und den Ingwer schälen und dann ganz fein reiben.","Alles mit dem Hackfleisch in eine ausreichend große Schüssel geben. Das Ganze kriegt jetzt dann die volle Asia Umamiklatsche mit dem braunen Zucker, Sojasauce, Fischsauce, Reisessig und Sesamöl. (Wichtig: achtet darauf, dass das Sesamöl aus geröstetem Sesam ist.) Eventuell noch mit Salz abschmecken. Jetzt alle Zutaten mischen.","Auflaufform mit den ungefähren Maßen  x  cm heraussuchen (plus minus). Als erstes mit  Wantan Teigblättern eine Teigschicht in die Form geben. Sie sollten leicht überlappen. Wir schichten jetzt abwechselnd die Fleischfüllung und die Teigblätter in die Form, bis wir  Schichten haben. Abschließen tun wir mit den Teigblättern.","Zum Schluss gießen wir ca.  ml Wasser drüber, decken die Form möglichst eng mit Alufolie ab und schieben das Ganze dann für ca.  Minuten in den vorgeheizten Ofen (E-Herd:  °C, Umluft:  °C, Gas: Stufe ).","fertige Dumplinglasagne mit Frühlingszwiebelringen, Crispy Chiliöl und Sesam toppen und heiß servieren. Trust me, das ist wirklich sehr lecker!!","Backzeit: ca.  Minuten"]'::jsonb,
  updated_at    = now()
WHERE id = 'b2f0d214-f5d0-472f-9a5e-5003708f3f32';

-- Erdbeer-Eis
UPDATE recipes SET
  titel         = 'Erdbeer-Eis',
  beschreibung  = 'Cremiges Eis aus gefrorenen Erdbeeren und Sahne',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"gefrorene Erdbeeren","menge":200,"einheit":"g","hinweis":null},{"name":"Wasser","menge":50,"einheit":"ml","hinweis":null},{"name":"Erythrit","menge":2,"einheit":"el","hinweis":null},{"name":"Sahne","menge":200,"einheit":"ml","hinweis":null},{"name":"Skyr","menge":1,"einheit":"kg","hinweis":null},{"name":"Puddingpulver","menge":1,"einheit":"Paket","hinweis":null},{"name":"Flavor Powder","menge":3,"einheit":"Scoops","hinweis":null},{"name":"Weiße Schokolade","menge":10,"einheit":"g","hinweis":null},{"name":"einer halben Zitrone","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["️Hier findest du die Rezepte ️️","Für h (Montag .. : Uhr) gibt es bei ESN % auf ALLES mit Code: KAY und keine Versandkosten ab € Meine Empfehlungen findet ihr im Link in meinem Profil","Rezept Spaghetti Eis️","Zutaten:","g gefrorene Erdbeeren","ml Wasser","EL Erythrit","Saft einer halben Zitrone","ml Sahne (fettreduziert)","kg Skyr","Paket Puddingpulver","Scoops Flavor Powder (Süßungsmittel)","g Weiße Schokolade","Sahne schlagen. Puddingpulver mit Skyr und Flavor Powder vermischen. Sahne unterheben.","In einen Mixer gefrorene Erdbeeren, Wasser, Erythrit und Zitronensaft. Durchmixen.","Jetzt nur noch anrichten!","Rezept Abendessen:","Zutaten:","g Kartoffeln","g Hirtenkäse","g körniger Frischkäse","Frühlingszwiebel","EL Chiliöl","g Cocktailtomaten","Salz, Pfeffer, Oregano","Kartoffel kleinschneiden und mit Öl und Salz vermengen. Bei  Grad Umluft für  Minuten in den Ofen.","In eine Auflaufform Tomaten, Lauchzwiebeln, Knoblquch, Chiliöl, Hirtenkäse, Salz & Oregano. Gut durchmengen und mit in den Ofen.","Kartoffeln auf den Teller. In die Mitte körnigen Frischkäse mit Salz und darüber die Tomaten geben.","feierabend abendessen abnehmen diät"]'::jsonb,
  updated_at    = now()
WHERE id = '7beab749-cedd-4780-bbad-4acf3b839e74';

-- Flammkuchen Kartoﬀeln machst du mit diesen Zutaten:
UPDATE recipes SET
  titel         = 'Flammkuchen Kartoﬀeln machst du mit diesen Zutaten:',
  beschreibung  = 'Flammkuchen Kartoﬀeln machst du mit diesen Zutaten: mit Kartoﬀeln und Eier',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoﬀeln","menge":500,"einheit":"g","hinweis":null},{"name":"Eier","menge":6,"einheit":"g","hinweis":null},{"name":"großer EL Creme Leicht","menge":1,"einheit":"g","hinweis":null},{"name":"magere Schinkenwürfel","menge":100,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Lauchzwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"& Pfeﬀer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoﬀeln schälen und in Würfel schneiden.","In einer Pfanne kurz scharf anbraten dann Hitze auf / stellen, Deckel drauf,","immer mal wieder durchmengen und nach ca - Minuten Schinkenwürfel","und Zwiebel dazu.","Richtig gut Salzen!","Dann das Ei mit dem Creme Leicht vermengen und über die Kartoﬀeln","geben. Darüber die Lauchzwiebeln und auf / Hitze mit Deckel garen bis","Ei fest ist."]'::jsonb,
  updated_at    = now()
WHERE id = 'f5f4e48d-4dba-44a0-bc4e-49b9da0606b9';

-- Caesar-Kartoffeln
UPDATE recipes SET
  titel         = 'Caesar-Kartoffeln',
  beschreibung  = 'Knusprige Ofenkartoffeln mit Caesar-Dressing',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"Wasser","menge":400,"einheit":"ml","hinweis":null},{"name":"Skyr","menge":2,"einheit":"el","hinweis":null},{"name":"Mayo Light","menge":1,"einheit":"el","hinweis":null},{"name":"Senf","menge":1,"einheit":"tl","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"tl","hinweis":null},{"name":"grüner Spargel","menge":300,"einheit":"g","hinweis":null},{"name":"Worcestershire Sauce","menge":1,"einheit":"el","hinweis":null},{"name":"einer 1/2 Zitrone","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln (roh) in die Pfanne und mit dem Wasser und Deckel ca. - Minuten köcheln lassen, bis das Wasser vollständig verdampft ist.","Danach Öl und Salz dazu, kurz anknuspern bis ebenfalls der Spargel kommt.","In der Zwischenzeit das Dressing zubereiten.","Mit Balsamico wie im Video anrichten!"]'::jsonb,
  updated_at    = now()
WHERE id = '360117ba-aea3-4681-bfdf-f6709b81cca4';

-- Blaue Protein-Oats
UPDATE recipes SET
  titel         = 'Blaue Protein-Oats',
  beschreibung  = 'Overnight Oats mit Heidelbeeren und Whey-Protein',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Haferflocken","menge":120,"einheit":"g","hinweis":null},{"name":"Whey Protein","menge":50,"einheit":"g","hinweis":null},{"name":"Sahne light","menge":250,"einheit":"ml","hinweis":null},{"name":"Flavour Powder","menge":1,"einheit":"Scoop","hinweis":null},{"name":"Himbeeren","menge":150,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":500,"einheit":"g","hinweis":null},{"name":"Streusel","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = 'e51f897d-292d-4ee6-a6f2-6c4cfad6f2ad';

-- Kartoffel-Crème-fraîche-Pfanne
UPDATE recipes SET
  titel         = 'Kartoffel-Crème-fraîche-Pfanne',
  beschreibung  = 'Schnelle Kartoffelpfanne mit Crème fraîche',
  schwierigkeit = 'einfach',
  tags          = ARRAY['schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":300,"einheit":"g","hinweis":null},{"name":"Creme leicht","menge":80,"einheit":"g","hinweis":null},{"name":"Reibekäse Light","menge":100,"einheit":"g","hinweis":null},{"name":"magere Schinkenwürfel","menge":50,"einheit":"g","hinweis":null},{"name":"Lauchzwiebel","menge":1,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Drillinge  Minuten vorkochen.","Belegen und nochmal  Minuten bei  Grad Umluft in den Ofen."]'::jsonb,
  updated_at    = now()
WHERE id = '4b1be165-f723-4d60-8fed-9ff9a9673e5f';

-- Kartoffel-Quark-Pfanne
UPDATE recipes SET
  titel         = 'Kartoffel-Quark-Pfanne',
  beschreibung  = 'Einfache Pfanne aus Kartoffeln und Magerquark',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":250,"einheit":"g","hinweis":null},{"name":"Kräuter Frischkäse Light","menge":180,"einheit":"g","hinweis":null},{"name":"Öl","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln mit  Tasse Wasser in eine Pfanne geben und mit Deckel ca. - Minuten köcheln lassen. Immer mal schwenken bis das Wasser verdunstet ist.","Dann etwas Öl in die Pfanne geben, sowie ordentlich Salz und Kräuter. Nochmal anrösten und servieren.","Credits @schmaleschulter"]'::jsonb,
  updated_at    = now()
WHERE id = 'd322b0db-a8aa-49ce-8c64-378e8918e1cc';

-- Pasta mit Tomatensauce
UPDATE recipes SET
  titel         = 'Pasta mit Tomatensauce',
  beschreibung  = 'Schnelle Pasta mit Tomatensauce und Kochsahne',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Cherry Tomaten","menge":250,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":2,"einheit":"Zehen","hinweis":null},{"name":"Tomatenmark","menge":2,"einheit":"el","hinweis":null},{"name":"Kochsahne Light","menge":125,"einheit":"ml","hinweis":null},{"name":"Parmesan","menge":100,"einheit":"g","hinweis":null},{"name":"Nudelwasser","menge":1,"einheit":"Kelle","hinweis":null},{"name":"Nudeln","menge":250,"einheit":"g","hinweis":null},{"name":"körniger Frischkäse","menge":200,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = '9e62ca1f-09b9-4d1b-bbdb-de083ca5b597';

-- Flammkuchen-Gnocchis
UPDATE recipes SET
  titel         = 'Flammkuchen-Gnocchis',
  beschreibung  = 'Gnocchis im Flammkuchen-Stil mit Schinken und Crème fraîche',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Gnocchis","menge":600,"einheit":"g","hinweis":null},{"name":"Eier","menge":5,"einheit":"g","hinweis":null},{"name":"Creme leicht","menge":1,"einheit":"el","hinweis":null},{"name":"Frühlingszwiebeln","menge":2,"einheit":"g","hinweis":null},{"name":"magere Schinkenwürfel","menge":50,"einheit":"g","hinweis":null},{"name":"Reibekäse Light","menge":50,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["≈Etwa  Minuten bei  Grad Umluft in den Ofen. Wenn vorhanden weitere - Minuten Grillfunktion an, wenn ihr die Oberfläche etwas knusprig mögt!"]'::jsonb,
  updated_at    = now()
WHERE id = '7bc95e62-d24f-447f-b643-341ed7d9f616';

-- Chili Cheese Burger Bowl
UPDATE recipes SET
  titel         = 'Chili Cheese Burger Bowl',
  beschreibung  = 'Nährstoffreiche Chili Cheese Burger Bowl',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegan','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"veganes Hack","menge":200,"einheit":"g","hinweis":null},{"name":"Kochsahne Light","menge":50,"einheit":"ml","hinweis":null},{"name":"Sambal Oelek","menge":1,"einheit":"tl","hinweis":null},{"name":"Cheddar","menge":30,"einheit":"g","hinweis":null},{"name":"Eisbergsalat","menge":20,"einheit":"g","hinweis":null},{"name":"Jalapenos","menge":10,"einheit":"g","hinweis":null},{"name":"Öl","menge":1,"einheit":"tl","hinweis":null},{"name":"vegane Hack könnt ihr empfehlen? Das Mühlenhack hat zwar stabile Werte, aber war echt nicht geil.","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln bei  Grad Umluft für  Minuten in den Ofen."]'::jsonb,
  updated_at    = now()
WHERE id = '5ef3e1a5-062e-429f-8653-270079ce5f14';

-- Lachs-Nudeln mit Pesto
UPDATE recipes SET
  titel         = 'Lachs-Nudeln mit Pesto',
  beschreibung  = 'Schnelle Nudeln mit Lachs, Hirtenkäse und Pesto',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Nudeln","menge":250,"einheit":"g","hinweis":null},{"name":"Hirtenkäse light","menge":50,"einheit":"g","hinweis":null},{"name":"Lachs","menge":200,"einheit":"g","hinweis":null},{"name":"Pesto","menge":1,"einheit":"el","hinweis":null},{"name":"Frischkäse Light","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  zubereitung   = '["Lachs bei  Grad Umluft in den Ofen. Vorher etwas Salz, Zitrone, Knoblauch, Pfeffer und Öl drauf. Rest wie im Video"]'::jsonb,
  updated_at    = now()
WHERE id = 'e8c9892d-b593-4a59-8b2e-63c16d5545c0';

-- Parmesan Chicken Bowl! Machste dir mit
UPDATE recipes SET
  titel         = 'Parmesan Chicken Bowl! Machste dir mit',
  beschreibung  = 'Nährstoffreiche Parmesan Chicken Bowl! Machste dir mit',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust","menge":150,"einheit":"g","hinweis":null},{"name":"Parmesan","menge":40,"einheit":"g","hinweis":null},{"name":"Öl","menge":1,"einheit":"tl","hinweis":null},{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Kochsahne Light","menge":125,"einheit":"ml","hinweis":null},{"name":"Eisbergsalat","menge":30,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln in kleine Würfel schneiden. Etwas Öl und Salz dazu. Mit dem Parmesan Chicken auf ein Backblech und - Minuten bei  Grad Umluft backen."]'::jsonb,
  updated_at    = now()
WHERE id = 'a2092cb9-2777-4c2b-b558-cf96eb076f89';

-- Chili Cheese Rösti mit maximal wenig Aufwand und diesen Zutaten:
UPDATE recipes SET
  titel         = 'Chili Cheese Rösti mit maximal wenig Aufwand und diesen Zutaten:',
  beschreibung  = 'Chili Cheese Rösti mit maximal wenig Aufwand und diesen Zutaten: mit Rösti und Rindertartar',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Rösti","menge":6,"einheit":"g","hinweis":null},{"name":"Rindertartar","menge":300,"einheit":"g","hinweis":null},{"name":"Cheddar","menge":50,"einheit":"g","hinweis":null},{"name":"Eisbergsalat","menge":30,"einheit":"g","hinweis":null},{"name":"Mayo Light","menge":1,"einheit":"el","hinweis":null},{"name":"Zwiebel","menge":10,"einheit":"g","hinweis":null},{"name":"Jalapenos","menge":10,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Minuten bei  Grad Umluft in den Ofen!"]'::jsonb,
  updated_at    = now()
WHERE id = 'e6ca508b-f6a7-4249-bd84-780ae72b5a23';

-- Thunfisch-Avocado-Baguette
UPDATE recipes SET
  titel         = 'Thunfisch-Avocado-Baguette',
  beschreibung  = 'Belegtes Baguette mit Thunfisch, Frischkäse und Avocado',
  schwierigkeit = 'einfach',
  tags          = ARRAY['schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Baguette","menge":1,"einheit":"g","hinweis":null},{"name":"Thunfisch","menge":1,"einheit":"dose","hinweis":null},{"name":"körniger Frischkäse","menge":200,"einheit":"g","hinweis":null},{"name":"Avocado","menge":1,"einheit":"g","hinweis":null},{"name":"Mayo Light","menge":2,"einheit":"el","hinweis":null},{"name":"Reibekäse Light","menge":100,"einheit":"g","hinweis":null},{"name":"Jalapenos","menge":20,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Bei  Grad Umluft für - Minuten backen."]'::jsonb,
  updated_at    = now()
WHERE id = 'dc19450e-ac09-40a7-b65f-5d7abda1f473';

-- Schnelle Feierabendplatte zum Abnehmen
UPDATE recipes SET
  titel         = 'Schnelle Feierabendplatte zum Abnehmen',
  beschreibung  = 'Schnelle Feierabendplatte zum Abnehmen mit Reis und gelb',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','schnell','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Reis","menge":400,"einheit":"g","hinweis":null},{"name":"gelb","menge":1,"einheit":"Paprika","hinweis":null},{"name":"rot","menge":1,"einheit":"Paprika","hinweis":null},{"name":"grün","menge":1,"einheit":"Paprika","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Hähnchenbrust","menge":400,"einheit":"g","hinweis":null},{"name":"stückige Tomaten aus der Dose","menge":400,"einheit":"g","hinweis":null},{"name":"Reibekäse light","menge":100,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = 'd18cef05-8e74-4099-8b5d-6ab99319ba52';

-- Kartoffel-Schinken-Pfanne
UPDATE recipes SET
  titel         = 'Kartoffel-Schinken-Pfanne',
  beschreibung  = 'Herzhafte Pfanne mit Kartoffeln und Schinken',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":750,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"magere Schinkenwürfel","menge":150,"einheit":"g","hinweis":null},{"name":"Kochsahne 7%","menge":250,"einheit":"ml","hinweis":null},{"name":"Milch","menge":100,"einheit":"ml","hinweis":null},{"name":"Parmesan","menge":100,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Bei  Grad Umluft für ca.  Minuten backen."]'::jsonb,
  updated_at    = now()
WHERE id = '1f407697-5d34-453b-82df-c52a7374a072';

-- Kidneybohnen-Burger
UPDATE recipes SET
  titel         = 'Kidneybohnen-Burger',
  beschreibung  = 'Schneller Burger mit Kidneybohnen-Patty',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Buns","menge":2,"einheit":"Burger","hinweis":null},{"name":"Blätter","menge":2,"einheit":"Salat","hinweis":null},{"name":"Tomate","menge":1,"einheit":"g","hinweis":null},{"name":"Kidneybohnen","menge":250,"einheit":"g","hinweis":null},{"name":"Haferflocken","menge":60,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Mehl","menge":25,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Senf","menge":1,"einheit":"tl","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null},{"name":"Käse","menge":4,"einheit":"Scheiben","hinweis":null}]'::jsonb,
  zubereitung   = '["Alles vermengen, Burger formen und je  Minuten bei mittlerer Hitze von beiden anbraten. Fertig"]'::jsonb,
  updated_at    = now()
WHERE id = 'c88dec16-1b62-43a0-a52f-c4a9d3775b9b';

-- Gebratener Reis mit Ei
UPDATE recipes SET
  titel         = 'Gebratener Reis mit Ei',
  beschreibung  = 'Günstiges Protein-Rezept mit Reis, Eiern und Gemüse',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Reis","menge":100,"einheit":"g","hinweis":null},{"name":"Eier","menge":4,"einheit":"g","hinweis":null},{"name":"Erbsen","menge":50,"einheit":"g","hinweis":null},{"name":"Möhre","menge":50,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  zubereitung   = '["Gekochten Reis in etwas Sesamöl anbraten. Verquirltes Ei darüber geben, genauso wie Sojasauce, Erbsen, Schnittlauch und Möhren. Einfach scharf weiterbraten, bis die Erbsen gar sind. Dann nur noch ein paar Frühlingszwiebeln und fertig!"]'::jsonb,
  updated_at    = now()
WHERE id = 'c28c0adb-cb67-4aea-84e8-2e560de2be50';

-- Butter Chicken Pizza
UPDATE recipes SET
  titel         = 'Butter Chicken Pizza',
  beschreibung  = 'Pizza mit Quark-Teig und Butter-Chicken-Topping',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Magerquark","menge":300,"einheit":"g","hinweis":null},{"name":"Mehl","menge":200,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"Pack","hinweis":null},{"name":"Hähnchenbrust","menge":300,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"rote","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Tandoori Paste","menge":1,"einheit":"tl","hinweis":null},{"name":"Joghurt","menge":2,"einheit":"el","hinweis":null},{"name":"Kochsahne Light","menge":50,"einheit":"ml","hinweis":null},{"name":"passierte Tomaten","menge":100,"einheit":"ml","hinweis":null},{"name":"Reibekäse Light","menge":100,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchen nur von allen Seiten kurz anbraten, dann den Rest hinzugeben, auf der Pizza verteilen und bei  Grad Umluft für  Minuten backen."]'::jsonb,
  updated_at    = now()
WHERE id = '0882eb52-8d9b-47d5-9b2f-bab43dd995fb';

-- Marinierte Hähnchenbrust
UPDATE recipes SET
  titel         = 'Marinierte Hähnchenbrust',
  beschreibung  = 'Saftige Hähnchenbrust in Joghurt-Ajvar-Marinade',
  schwierigkeit = 'einfach',
  tags          = ARRAY['highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust","menge":600,"einheit":"g","hinweis":null},{"name":"Joghurt","menge":100,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"rote","hinweis":null},{"name":"Ajvar","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchenbrust in dünne Schnitzel schneiden. Wie im Video marinieren. Am besten  Minuten einziehen lassen und dann in eine Auflaufform für ca.  Minuten bei  Grad Umluft in den Ofen geben. Wird super zart und würzig."]'::jsonb,
  updated_at    = now()
WHERE id = 'd3c3b1e4-ad70-4796-bacb-8762342cb2a6';

-- Pom Döner
UPDATE recipes SET
  titel         = 'Pom Döner',
  beschreibung  = 'Döner mit Pommes, Hähnchen und Joghurt-Knoblauch-Sauce',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":300,"einheit":"g","hinweis":null},{"name":"Hähnchenbrust","menge":150,"einheit":"g","hinweis":null},{"name":"Gurke","menge":130,"einheit":"g","hinweis":null},{"name":"Tomate","menge":100,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":10,"einheit":"g","hinweis":null},{"name":"Krautsalat","menge":50,"einheit":"g","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Joghurt","menge":2,"einheit":"el","hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln in Spalten schneiden. Etwas Öl und Salz dazu, dann bei  Grad Umluft für - Minuten in den Ofen.","Hähnchenbrust mit Gyros Gewürz, Salz und etwas Öl einreiben und für  Minuten bei  Grad in den AirFryer."]'::jsonb,
  updated_at    = now()
WHERE id = '7d74f307-d095-48df-b018-8bcc9bd410e3';

-- Unglaublich leckere Highprotein Shawarma Tacos
UPDATE recipes SET
  titel         = 'Unglaublich leckere Highprotein Shawarma Tacos',
  beschreibung  = 'Unglaublich leckere Highprotein Shawarma Tacos mit Hähnchenschenkel ohne Knochen und gepresster Knoblauch',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenschenkel ohne Knochen","menge":900,"einheit":"g","hinweis":null},{"name":"gepresster Knoblauch","menge":1,"einheit":"tl","hinweis":null},{"name":"Tomatenmark","menge":2,"einheit":"el","hinweis":null},{"name":"Joghurt","menge":60,"einheit":"g","hinweis":null},{"name":"Zitronensaft","menge":1,"einheit":"el","hinweis":null},{"name":"Rauchpaprika","menge":1,"einheit":"tl","hinweis":null},{"name":"Koriander","menge":1,"einheit":"tl","hinweis":null},{"name":"Kreuzkümmel","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"Philadelphia Balance","menge":195,"einheit":"g","hinweis":null},{"name":"Knoblauchpulver oder gepresster Knoblauch","menge":1,"einheit":"tl","hinweis":null},{"name":"Mini-Tortillas","menge":10,"einheit":"g","hinweis":null},{"name":"Essiggurken","menge":150,"einheit":"g","hinweis":null},{"name":"Streukäse","menge":150,"einheit":"g","hinweis":null},{"name":"Chilipulver","menge":null,"einheit":null,"hinweis":null},{"name":"nach Geschmack","menge":null,"einheit":null,"hinweis":null},{"name":"nach Geschmack","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchen mit Knoblauch, Tomatenmark, Joghurt, Zitronensaft und den Gewürzen marinieren. Das Fleisch in zwei Portionen mit Ölspray in der Pfanne anbraten, damit es schön bräunt und nicht zu viel Flüssigkeit zieht. Philadelphia Balance mit Knoblauch, Salz und Pfeffer zu einer Knoblauchsoße verrühren. Essiggurken klein schneiden. Mini-Tortillas mit Streukäse, Hähnchen, Essiggurken und Knoblauchsoße belegen und anschließend bei  Grad für etwa  Minuten im Ofen backen."]'::jsonb,
  updated_at    = now()
WHERE id = '69cd1eba-9f35-48b5-83ca-0ec6bd5bdb77';

-- Highprotein Zimtrollen mit 7 g Eiweiß pro Stück
UPDATE recipes SET
  titel         = 'Highprotein Zimtrollen mit 7 g Eiweiß pro Stück',
  beschreibung  = 'Highprotein Zimtrollen mit 7 g Eiweiß pro Stück mit Magerquark und Dinkelmehl',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Magerquark","menge":500,"einheit":"g","hinweis":null},{"name":"Dinkelmehl","menge":300,"einheit":"g","hinweis":null},{"name":"Stevia","menge":80,"einheit":"g","hinweis":null},{"name":"Päckchen Backpulver","menge":1,"einheit":"g","hinweis":null},{"name":"Vanilleextrakt","menge":1,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"prise","hinweis":null},{"name":"Stevia","menge":50,"einheit":"g","hinweis":null},{"name":"Zimt","menge":1,"einheit":"el","hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten für den Teig in eine große Schüssel geben und gründlich vermengen. Anschließend zu einem glatten, geschmeidigen Teig verkneten.","Teig in zwei Hälften teilen und auf einer leicht bemehlten Fläche rechteckig ausrollen. Die Stevia-Zimt-Mischung gleichmäßig darauf verteilen.","Teig eng aufrollen und in gleichmäßige Stücke schneiden. Die Zimtschnecken auf ein mit Backpapier belegtes Blech legen.","Bei  Grad Umluft circa  Minuten goldbraun backen"]'::jsonb,
  updated_at    = now()
WHERE id = 'e66b6871-e176-48df-a063-cc63c4e5d82c';

-- Hackfleisch-Pockets
UPDATE recipes SET
  titel         = 'Hackfleisch-Pockets',
  beschreibung  = 'Gefüllte Teigtaschen mit würzigem Hackfleisch',
  schwierigkeit = 'mittel',
  tags          = ARRAY['schnell','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Mehl","menge":330,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":400,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"kleine","hinweis":null},{"name":"Hackfleisch","menge":400,"einheit":"g","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"el","hinweis":null},{"name":"Light Frischkäse","menge":100,"einheit":"g","hinweis":null},{"name":"Reibekäse, je 20 g pro Stück","menge":120,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Gib Mehl, Magerquark, Backpulver und Salz in eine Schüssel und knete alles zu einem glatten Teig. Lass ihn etwa  Minuten ruhen. Schneide die Zwiebel fein und brate sie mit etwas Ölspray in der Pfanne an. Gib das Hackfleisch dazu und brate es kräftig durch. Rühre die Gewürzmischung ein und gib das Tomatenmark dazu. Lass alles kurz weiterbraten, bis es durchgegart ist, und rühre anschließend den Light Frischkäse unter.","Teile den Teig in sechs gleich große Stücke und rolle sie jeweils rund aus. Gib in die Mitte  g Reibekäse und ein Sechstel der Füllung. Schließe den Teig nach oben und drücke die Taschen leicht flach. Brate sie in einer Pfanne mit etwas Ölspray von beiden Seiten scharf an, bis sie Farbe bekommen. Lege sie danach auf ein Backblech und backe sie bei  Grad Umluft für etwa  bis  Minuten im Ofen fertig, bis der Teig vollständig durchgebacken ist und der Käse innen geschmolzen ist."]'::jsonb,
  updated_at    = now()
WHERE id = 'd4fb9bea-4246-4b43-9bbe-f3dd2bdcbbbd';

-- Piccolinis aber in Highprotein
UPDATE recipes SET
  titel         = 'Piccolinis aber in Highprotein',
  beschreibung  = 'Piccolinis aber in Highprotein mit Dinkelmehl und Magerquark',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Dinkelmehl","menge":140,"einheit":"g","hinweis":null},{"name":"Magerquark","menge":170,"einheit":"g","hinweis":null},{"name":"passierte Tomaten","menge":100,"einheit":"ml","hinweis":null},{"name":"Oregano","menge":1,"einheit":"tl","hinweis":null},{"name":"fettarmer Streukäse","menge":70,"einheit":"g","hinweis":null},{"name":"fettarmer Speckwürfel","menge":60,"einheit":"g","hinweis":null},{"name":"1/2 Päckchen Backpulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"1/2 TL Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"1/2 TL Salz","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Mehl, Magerquark, Backpulver und etwas Salz in eine Schüssel geben und zu einem glatten Teig verkneten. Den Teig ausrollen und mit einer Tasse  kleine Kreise ausstechen und auf ein mit Backpapier belegtes Blech legen. Die passierten Tomaten mit Oregano, Pfeffer und Salz verrühren und auf die Teigstücke streichen. Anschließend den Streukäse darauf verteilen und die Speckwürfel darüber geben. Die Mini Pizzen bei  Grad Umluft für  bis  Minuten backen, bis der Käse geschmolzen ist und der Rand leicht gebräunt ist.","highprotein instagram"]'::jsonb,
  updated_at    = now()
WHERE id = '302fe7fd-5b64-4436-bdec-a5c4d328154d';

-- Highprotein Thai Nudelpfanne mit Chicken
UPDATE recipes SET
  titel         = 'Highprotein Thai Nudelpfanne mit Chicken',
  beschreibung  = 'Highprotein Thai Nudelpfanne mit Chicken mit Hähnchenbrust und Sojasauce',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust","menge":700,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":1,"einheit":"el","hinweis":null},{"name":"Sriracha","menge":1,"einheit":"tl","hinweis":null},{"name":"Reisbandnudeln","menge":250,"einheit":"g","hinweis":null},{"name":"Sojasauce","menge":60,"einheit":"ml","hinweis":null},{"name":"Hoisinsauce","menge":30,"einheit":"g","hinweis":null},{"name":"Honig","menge":20,"einheit":"g","hinweis":null},{"name":"Reisessig","menge":1,"einheit":"el","hinweis":null},{"name":"Speisestärke","menge":1,"einheit":"el","hinweis":null},{"name":"Sriracha","menge":1,"einheit":"el","hinweis":null},{"name":"Ingwer, fein gehackt","menge":2,"einheit":"el","hinweis":null},{"name":"Knoblauchpaste","menge":1,"einheit":"tl","hinweis":null},{"name":"Frühlingszwiebeln, gehackt","menge":3,"einheit":"g","hinweis":null},{"name":"Ölspray","menge":null,"einheit":null,"hinweis":null},{"name":"nach Geschmack","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Reisbandnudeln zuerst  Minuten in lauwarmem Wasser einweichen, anschließend abgießen und in heißem Wasser mit etwas Salz und einem Schuss Öl für  bis  Minuten garen, danach kalt abspülen und beiseitestellen. Währenddessen das Hähnchen in Stücke schneiden und mit Sojasauce und Sriracha marinieren. Das Fleisch in zwei Portionen in einer heißen Pfanne mit etwas Ölspray scharf anbraten, bis es gut gebräunt ist, dann herausnehmen und zur Seite stellen. In der gleichen Pfanne erneut etwas Ölspray erhitzen, Ingwer und Knoblauchpaste kurz anbraten, dann die zuvor angerührte Sauce dazugeben und zusammen mit den Frühlingszwiebeln kurz aufkochen lassen, bis sie leicht andickt. Die gekochten Nudeln in die Pfanne geben und alles gut vermengen, anschließend das Fleisch wieder dazugeben oder separat servieren. Zum Schluss mit frischen Frühlingszwiebeln und etwas Sesam toppen.","highprotein instagram"]'::jsonb,
  updated_at    = now()
WHERE id = 'f2ab869e-e648-4297-9948-1a9e273110dc';

-- Highprotein crispy Chicken Tenders mit Low cal spicy Garlic Mayo
UPDATE recipes SET
  titel         = 'Highprotein crispy Chicken Tenders mit Low cal spicy Garlic Mayo',
  beschreibung  = 'Highprotein crispy Chicken Tenders mit Low cal spicy Garlic Mayo mit Hähnchenbrust und Mehl',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','schnell','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust","menge":600,"einheit":"g","hinweis":null},{"name":"Mehl","menge":50,"einheit":"g","hinweis":null},{"name":"3 Eier je nach Größe","menge":2,"einheit":"bis","hinweis":null},{"name":"Cornflakes","menge":120,"einheit":"g","hinweis":null},{"name":"Gewürze: 1 TL Salz, 1 TL Pfeffer, 2 TL Rauchpaprika","menge":null,"einheit":null,"hinweis":null},{"name":"Öl Spray","menge":null,"einheit":null,"hinweis":null},{"name":"Soße: 100 g fettarmer griechischer Joghurt, 20 g Light Mayo, 20 g Light Ketchup, 1 TL Knoblauchpulver, 15 g Sriracha","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Backofen auf  Grad Umluft vorheizen","Hähnchen in Stücke schneiden und mit den Gewürzen vermengen","Cornflakes grob zerdrücken","Hähnchen im Mehl wenden","Durch die verquirlten Eier ziehen","In den Cornflakes panieren","Auf ein Backblech legen und mit Öl Spray besprühen","Ca.  Minuten backen bis sie knusprig und durch sind","Für die Soße alle Zutaten glatt verrühren","Hähnchen mit der Soße servieren"]'::jsonb,
  updated_at    = now()
WHERE id = '909bdf9b-123a-4b1e-9ba3-e292d17a14e6';

-- Highprotein Butter Chicken
UPDATE recipes SET
  titel         = 'Highprotein Butter Chicken',
  beschreibung  = 'Highprotein Butter Chicken mit Hähnchen und Joghurt',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchen","menge":300,"einheit":"g","hinweis":null},{"name":"Joghurt","menge":150,"einheit":"g","hinweis":null},{"name":"Light Butter","menge":1,"einheit":"tl","hinweis":null},{"name":"Tomaten","menge":3,"einheit":"g","hinweis":null},{"name":"Zwiebeln","menge":2,"einheit":"g","hinweis":null},{"name":"Cashews","menge":15,"einheit":"g","hinweis":null},{"name":"passierte Tomaten","menge":100,"einheit":"g","hinweis":null},{"name":"edelsüß 2 TL, Kreuzkümmel 1 TL, Koriander 1 TL, Kurkuma 1 TL, Garam Masala 1 TL, Knoblauchpulver ½ TL, Chilipulver ½ TL, Zimt ½ TL, schwarzer Pfeffer ¼ TL, Salz 1 TL","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchen klein schneiden.","g Joghurt und Gewürzmischung dazugeben. Gut vermengen.","Pfanne erhitzen. Butter rein. Fleisch scharf anbraten bis es durch ist. Danach aus der Pfanne nehmen.","Tomaten und Zwiebeln klein schneiden.","Zwiebeln in der gleichen Pfanne andünsten. Tomaten, Cashews und passierte Tomaten dazugeben.","g Joghurt einrühren. Hitze niedrig halten. Nicht kochen lassen.","Alles in den Mixer geben und fein pürieren.","Soße zurück in die Pfanne geben. Fleisch dazugeben und kurz ziehen lassen. Mit Reis servieren","highprotein instagram"]'::jsonb,
  updated_at    = now()
WHERE id = 'f51dae40-f5f7-4304-a806-a40f74371271';

-- Du musst Magerquark nicht pur essen. Mach dir einfach diese
UPDATE recipes SET
  titel         = 'Du musst Magerquark nicht pur essen. Mach dir einfach diese',
  beschreibung  = 'Du musst Magerquark nicht pur essen. Mach dir einfach diese High Protein Waffeln',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Magerquark","menge":200,"einheit":"g","hinweis":null},{"name":"Mehl","menge":130,"einheit":"g","hinweis":null},{"name":"Ei","menge":1,"einheit":"g","hinweis":null},{"name":"Milch, 1,5 %","menge":125,"einheit":"ml","hinweis":null},{"name":"Backpulver","menge":5,"einheit":"g","hinweis":null},{"name":"Stevia","menge":50,"einheit":"g","hinweis":null},{"name":"Vanilleextrakt","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten in eine Schüssel geben und mit dem Handmixer gründlich zu einem glatten Teig verrühren.","Waffeleisen vorheizen und leicht einsprühen.","Teig portionsweise hineingeben und ausbacken, bis die Waffeln durchgebacken und goldbraun sind.","Waffeln herausnehmen und direkt servieren.","Nach Wunsch mit Puderzucker bestreuen.","highprotein instagram"]'::jsonb,
  updated_at    = now()
WHERE id = '64b0b232-93d5-41c1-8005-412acda01df1';

-- Hähnchen-Ofentacos
UPDATE recipes SET
  titel         = 'Hähnchen-Ofentacos',
  beschreibung  = 'Knusprige Ofentacos mit Hähnchen, Paprika und Mais',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['schnell','highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust","menge":450,"einheit":"g","hinweis":null},{"name":"Paprika, gewürfelt","menge":1,"einheit":"rote","hinweis":null},{"name":"Mais","menge":120,"einheit":"g","hinweis":null},{"name":"Zwiebel, gewürfelt","menge":1,"einheit":"gelbe","hinweis":null},{"name":"Jalapeño, eingelegt, klein geschnitten","menge":1,"einheit":"g","hinweis":null},{"name":"Zitronensaft","menge":1,"einheit":"el","hinweis":null},{"name":"Frischkäse","menge":60,"einheit":"g","hinweis":null},{"name":"Wasser","menge":60,"einheit":"ml","hinweis":null},{"name":"Tortillas","menge":10,"einheit":"kleine","hinweis":null},{"name":"Gewürze: 1 EL Paprikapulver, 1 TL Knoblauchpulver, 1 TL Zwiebelpulver, 1 TL Salz, 1 TL Pfeffer, 1/2 TL Chipotle-Chili","menge":null,"einheit":null,"hinweis":null},{"name":"Öl-Spray","menge":null,"einheit":null,"hinweis":null},{"name":"ca. 150 g geriebener Käse","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchen in kleine Stücke schneiden und mit den Gewürzen vermischen","Mit etwas Öl-Spray scharf anbraten","Wenn das Fleisch fast durch ist, Mais, Paprika, Zwiebel und Jalapeño zugeben und kurz anbraten","Frischkäse und Wasser einrühren, dann Zitronensaft zugeben","Alles köcheln lassen, bis die Flüssigkeit etwas reduziert ist","Tortillas auf einer Seite mit Öl-Spray besprühen","Umdrehen und mit der Hähnchenmasse befüllen","Ergibt etwa  Tacos","Tacos in eine ofenfeste Form setzen","Mit Käse bestreuen, ca.  g pro Taco","Bei  Grad Ober-/Unterhitze ca.  Minuten backen","highprotein instagram"]'::jsonb,
  updated_at    = now()
WHERE id = '58013f1b-7512-46f0-b981-54af4938577d';

-- Abendessen für Faule
UPDATE recipes SET
  titel         = 'Abendessen für Faule',
  beschreibung  = 'Abendessen für Faule mit gelb und rot',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"gelb","menge":1,"einheit":"Paprika","hinweis":null},{"name":"rot","menge":1,"einheit":"Paprika","hinweis":null},{"name":"grün","menge":1,"einheit":"Paprika","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"rote","hinweis":null},{"name":"Knoblauch","menge":1,"einheit":"zehe","hinweis":null},{"name":"Hähnchenbrust","menge":400,"einheit":"g","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"el","hinweis":null},{"name":"Kochsahne light","menge":250,"einheit":"ml","hinweis":null},{"name":"Metaxa","menge":2,"einheit":"cl","hinweis":null},{"name":"Reibekäse Light","menge":50,"einheit":"g","hinweis":null},{"name":"Reis","menge":200,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchen in kleine Stücke schneiden, mit etwas Öl und Paprikapulver, Salz, Pfeffer, Knoblauchpulver, Oregano für  Minuten bei  Grad in den @ninja.deutschland Crispy Pro geben.","Währenddessen die Sauce zubereiten.","Dann den Einsatz herausnehmen, mit der Sauce übergießen sowie Käse darüber verteilen. Für  Minuten bei  Grad wieder rein.","Dazu Reis oder Nudeln und fertig!"]'::jsonb,
  updated_at    = now()
WHERE id = 'aaf43b71-f7b7-4fa4-84ed-05ef9b68d53f';

-- Meine Go To Frühstücksbowl
UPDATE recipes SET
  titel         = 'Meine Go To Frühstücksbowl',
  beschreibung  = 'Meine Go To Frühstücksbowl Wenn du mal keine Zeit hast, kannst du dir diese High Protein Frühstücksbowl mit über 50g Eiweiß zubereiten. ⏱ Zubereitungszeit: ca. 5min. (Haferflocken bereits ei...',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegan','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[]'::jsonb,
  zubereitung   = '["️ Schwierigkeitsgrad: Anfänger","Haltbarkeit: Bis zu  Tag im Kühlschrank","govegan rezept vegan fitness"]'::jsonb,
  updated_at    = now()
WHERE id = 'ec9d9a08-4772-4779-89df-5d981d8915fe';

-- Hähnchen-Kartoffelpfanne
UPDATE recipes SET
  titel         = 'Hähnchen-Kartoffelpfanne',
  beschreibung  = 'Schnelle Pfanne mit Hähnchen, Kartoffeln und Knoblauch',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['highprotein','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":1000,"einheit":"g","hinweis":null},{"name":"Hähnchenbrust","menge":1000,"einheit":"g","hinweis":null},{"name":"rote Zwiebel, gewürfelt","menge":1,"einheit":"kleine","hinweis":null},{"name":"Knoblauchpaste","menge":1,"einheit":"tl","hinweis":null},{"name":"Hühnerbrühe","menge":150,"einheit":"ml","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"el","hinweis":null},{"name":"leichter Frischkäse","menge":100,"einheit":"g","hinweis":null},{"name":"Parmesan","menge":10,"einheit":"g","hinweis":null},{"name":"fettarmer Käse","menge":80,"einheit":"g","hinweis":null},{"name":"Ölspray","menge":null,"einheit":null,"hinweis":null},{"name":"Ölspray","menge":null,"einheit":null,"hinweis":null},{"name":"Knoblauchsauce","menge":null,"einheit":null,"hinweis":null},{"name":"Ölspray","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln schälen und würfeln. Mit den Gewürzen mischen, Ölspray dazugeben. Auf ein Blech geben und bei  Grad Umluft  Minuten backen.","Hähnchen schneiden. Mit den Gewürzen mischen. In zwei Portionen mit Ölspray anbraten. Beiseitestellen.","In derselben Pfanne Ölspray erhitzen. Zwiebel anbraten. Knoblauchpaste dazugeben. Tomatenmark einrühren und kurz anrösten. Hühnerbrühe, Frischkäse, Parmesan und Käse dazugeben. Erhitzen, bis alles cremig ist. Mit Salz abschmecken.","Kartoffeln und Fleisch zurück in die Pfanne geben. Vermischen. Streukäse drauf. Deckel drauf. Kurz erhitzen, bis der Käse geschmolzen ist.","Wer mag, gibt das Ganze am Ende in den Backofen und lässt den Käse unter dem Grill kurz überbacken.","highprotein instagram"]'::jsonb,
  updated_at    = now()
WHERE id = '1f56a382-48ca-4827-a221-8aadc5979c5e';

-- Highprotein Knuspriger Chicken Shawarma
UPDATE recipes SET
  titel         = 'Highprotein Knuspriger Chicken Shawarma',
  beschreibung  = 'High Protein Crispy Chicken Shawarma PRO SHAWARMA 1 STÜCK (mit Piadina berechnet)',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust","menge":800,"einheit":"g","hinweis":null},{"name":"fettarmer griechischer Joghurt","menge":70,"einheit":"g","hinweis":null},{"name":"geräucherter Paprika","menge":2,"einheit":"tl","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Zwiebelpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Cayennepfeffer","menge":1,"einheit":"tl","hinweis":null},{"name":"Oregano","menge":1,"einheit":"tl","hinweis":null},{"name":"Kreuzkümmel","menge":0.5,"einheit":"tl","hinweis":null},{"name":"Salz","menge":2,"einheit":"tl","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"el","hinweis":null},{"name":"Tomatenmark","menge":3,"einheit":"tl","hinweis":null},{"name":"Light Ketchup","menge":3,"einheit":"tl","hinweis":null},{"name":"Öl Spray","menge":1,"einheit":"tl","hinweis":null},{"name":"fettarmer griechischer Joghurt","menge":150,"einheit":"g","hinweis":null},{"name":"Salz","menge":0.5,"einheit":"tl","hinweis":null},{"name":"Knoblauchpulver","menge":1,"einheit":"tl","hinweis":null},{"name":"Zitronensaft","menge":1,"einheit":"tl","hinweis":null},{"name":"Essiggurken","menge":180,"einheit":"g","hinweis":null},{"name":"Pitabrot, ersatzweise Piadina","menge":3,"einheit":"g","hinweis":null},{"name":"Anbraten","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '[]'::jsonb,
  updated_at    = now()
WHERE id = '006531dc-b874-402f-acda-9202232af58b';

-- Zwiebelringe
UPDATE recipes SET
  titel         = 'Zwiebelringe',
  beschreibung  = 'Kalorienarme Zwiebelringe mit Chipotle-Gewürz',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"große Zwiebel","menge":1,"einheit":"g","hinweis":null},{"name":"Eier","menge":3,"einheit":"g","hinweis":null},{"name":"Chipotle Chili","menge":1,"einheit":"tl","hinweis":null},{"name":"Paprikapulver","menge":2,"einheit":"tl","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"Mehl","menge":50,"einheit":"g","hinweis":null},{"name":"Panko Paniermehl","menge":100,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Zwiebel schälen und in breite Ringe schneiden. Anschließend die einzelnen Zwiebelschichten vorsichtig voneinander trennen.","Für die Panierstraße das Mehl mit Chipotle Chili, Paprikapulver und Salz vermischen. In einen zweiten Teller die verquirlten Eier geben und in einen dritten Teller das Panko füllen.","Zwiebelringe zuerst im gewürzten Mehl wenden, danach im Ei. Anschließend nochmals im Mehl und erneut im Ei wenden. Zum Schluss vollständig mit Panko panieren.","Je nach Größe der Zwiebel und Dicke der Panade müssen die Zutaten der Panierstraße bei Bedarf etwas aufgefüllt werden.","panierten Zwiebelringe von beiden Seiten leicht mit Ölspray besprühen und im Airfryer bei  Grad circa  bis  Minuten goldbraun backen."]'::jsonb,
  updated_at    = now()
WHERE id = 'aa5b4380-414c-415c-924a-a70d64e68513';

-- Die besten Low Calorie Chips
UPDATE recipes SET
  titel         = 'Die besten Low Calorie Chips',
  beschreibung  = 'Die besten Low Calorie Chips mit 3 Kartoffeln und Salz',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','lowcal','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"3 Kartoffeln","menge":2,"einheit":"bis","hinweis":null},{"name":"Salz","menge":1,"einheit":"tl","hinweis":null},{"name":"Pfeffer","menge":1,"einheit":"tl","hinweis":null},{"name":"Paprika","menge":1,"einheit":"tl","hinweis":null},{"name":"Speisestärke","menge":1,"einheit":"tl","hinweis":null}]'::jsonb,
  zubereitung   = '["Schneide die Kartoffeln in sehr dünne Scheiben oder hobel sie gleichmäßig. Lege die Scheiben für etwa  Minuten in kaltes Wasser, damit ein Teil der Stärke ausgewaschen wird. Nimm sie anschließend heraus und tupfe sie gründlich trocken.","Gib die Kartoffelscheiben in eine Schüssel. Streue Salz, Pfeffer, Paprika und die Speisestärke darüber und mische alles gut durch. Gib drei bis vier Sprühstöße Öl dazu und vermenge alles erneut, sodass die Scheiben leicht benetzt sind.","Gib die Kartoffeln in den Airfryer und gare sie bei  Grad in der Funktion Roast für etwa  Minuten. Schüttle den Korb währenddessen zwei Mal, damit sich die Scheiben neu verteilen und gleichmäßig bräunen. Nimm kleinere oder bereits braune Chips zwischendurch heraus.","Breite die fertigen Chips nach dem Garen locker aus und lass sie abkühlen. So bleiben sie knusprig."]'::jsonb,
  updated_at    = now()
WHERE id = '4a98b9ea-cf03-442b-a09b-cedd01e486fd';

-- Kaffee-Chia-Bowl
UPDATE recipes SET
  titel         = 'Kaffee-Chia-Bowl',
  beschreibung  = 'Cremige Chia-Bowl mit Kaffee, Skyr und Whey-Protein',
  schwierigkeit = 'einfach',
  tags          = ARRAY['vegetarisch','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kaffee","menge":80,"einheit":"ml","hinweis":null},{"name":"Chiasamen","menge":2,"einheit":"el","hinweis":null},{"name":"Skyr","menge":150,"einheit":"g","hinweis":null},{"name":"Milch","menge":60,"einheit":"ml","hinweis":null},{"name":"Whey-Protein","menge":1,"einheit":"Scoop","hinweis":null},{"name":"Belieben etwas Kakaopulver zum Bestäuben","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten in einem kleinen Behälter gut vermischen → mindestens  Stunden kühlen, besser über Nacht.","Vor dem Servieren ganz leicht mit Kakao bestäuben.","Credits @balanewithnu"]'::jsonb,
  updated_at    = now()
WHERE id = '4ea14f06-21a0-4027-a02b-dcbb658cb48b';

-- Sommerrollen mit Erdnussdip
UPDATE recipes SET
  titel         = 'Sommerrollen mit Erdnussdip',
  beschreibung  = 'Sommerrollen mit Erdnussdip mit Glasnudeln und Karotte',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Glasnudeln","menge":40,"einheit":"g","hinweis":null},{"name":"Karotte","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Räuchertofu","menge":150,"einheit":"g","hinweis":null},{"name":"(30 ml Saft)","menge":1,"einheit":"Limette","hinweis":null},{"name":"Sojasoße","menge":2,"einheit":"EL","hinweis":null},{"name":"Agavendicksaft","menge":1,"einheit":"TL","hinweis":null},{"name":"Ungesüßtes Erdnussmus","menge":40,"einheit":"g","hinweis":null},{"name":"1/2 Gurke","menge":null,"einheit":null,"hinweis":null},{"name":"3 Blätter Romanasalat","menge":null,"einheit":null,"hinweis":null},{"name":"Frischer Koriander (optional)","menge":null,"einheit":null,"hinweis":null},{"name":"6 Blätter rundes Reispapier* (ca. 8 g pro Blatt)","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Glasnudeln nach Packungsanweisung zubereiten.","Gurke, Karotte, Paprika, Räuchertofu und Romanasalat in Streifen schneiden, optional Koriander hacken.","Einen großen tiefen Teller mit lauwarmem Wasser füllen. Je ein Blatt Reispapier hineinlegen und für 50–60 Sekunden einweichen, dann kurz abtropfen lassen. Mittig mit Glasnudeln, Salat, Gurken, Paprika, Karotten, Räuchertofu und optional Koriander belegen und dann von den Seiten und von unten aus einrollen.","Nach und nach alle Sommerrollen füllen und einrollen.","Für den Dip Limettensaft, Sojasoße, Agavendicksaft und Erdnussmus in einem Schälchen vermengen."]'::jsonb,
  updated_at    = now()
WHERE id = '39f7096e-bdb0-457c-888e-39983e76446a';

-- Azukibohnen-Reis-Salat
UPDATE recipes SET
  titel         = 'Azukibohnen-Reis-Salat',
  beschreibung  = 'Azukibohnen-Reis-Salat mit Zwiebel und Gekochte Azukibohnen (alternativ Kidneybohnen)',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Gekochte Azukibohnen (alternativ Kidneybohnen)","menge":100,"einheit":"g","hinweis":null},{"name":"Gekochter Reis","menge":60,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"1/2 Limette (15 ml Saft)","menge":null,"einheit":null,"hinweis":null},{"name":"Scharfes Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Frühlingszwiebeln klein schneiden.","Bohnen abspülen und mit Reis in eine Schüssel geben.","Frühlingszwiebeln dazugeben und verrühren.","Olivenöl und Limettensaft darüber geben, mit Paprikapulver, Salz und Pfeffer abschmecken.","Chilischote in feine Ringe schneiden (für weniger Schärfe alle Kerne entfernen) und über den Salat geben."]'::jsonb,
  updated_at    = now()
WHERE id = '07ff2fe6-69e5-4fdc-93b4-16fb0a148b41';

-- Scharfer Gurkensalat mit Knoblauch
UPDATE recipes SET
  titel         = 'Scharfer Gurkensalat mit Knoblauch',
  beschreibung  = 'Scharfer Gurkensalat mit Knoblauch mit Gurke und Knoblauchzehe',
  schwierigkeit = 'einfach',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Gurke","menge":1,"einheit":"Stk","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Sojasoße","menge":1,"einheit":"EL","hinweis":null},{"name":"Geröstetes Sesamöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Sesam","menge":1,"einheit":"TL","hinweis":null},{"name":"Frischer Koriander (optional)","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Gurke längs halbieren und mit einem Löffel die Kerne herauslösen. In Scheiben schneiden und in eine Schüssel geben.","Knoblauch fein hacken. Chilischote halbieren, entkernen und fein hacken (für mehr Schärfe ein paar Kerne behalten).","Knoblauch, Chili, Sojasoße und Sesamöl über die Gurken geben. Gut umrühren.","Salat mit Sesam und optional frischem Koriander garnieren."]'::jsonb,
  updated_at    = now()
WHERE id = '74dd7bca-4ad2-4e01-a4b2-7a42cc3aa4aa';

-- Waffeln mit heißen Beeren
UPDATE recipes SET
  titel         = 'Waffeln mit heißen Beeren',
  beschreibung  = 'Waffeln mit heißen Beeren mit Ungesüßter Mandeldrink und Vollkornmehl',
  schwierigkeit = 'einfach',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Ungesüßter Mandeldrink","menge":300,"einheit":"ml","hinweis":null},{"name":"Vollkornmehl","menge":170,"einheit":"g","hinweis":null},{"name":"Sojamehl (15 g)*","menge":15,"einheit":"g","hinweis":null},{"name":"Agavendicksaft","menge":2,"einheit":"EL","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Beeren (frisch o. TK)","menge":200,"einheit":"g","hinweis":null},{"name":"Gemahlene Vanille","menge":null,"einheit":null,"hinweis":null},{"name":"Sojamehl ist dank seiner bindenden Eigenschaft ein guter pflanzlicher Ei-Ersatz. Du bekommst es im Biomarkt oder Reformhaus. Alternativ kannst du Speisestärke verwenden.","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Mandeldrink in eine Rührschüssel geben. Mehl hinzugeben und Sojamehl hinein sieben. Mit einem Schneebesen zu einem klumpenfreien Teig verrühren. 1 EL Agavendicksaft hinzugeben und unterrühren.","Teig kurz stehen lassen.","Währenddessen ein Waffeleisen auf mittlerer Hitze vorheizen und dünn mit Rapsöl bestreichen.","Jeweils 4–5 EL Teig in das Waffeleisen geben; nach und nach 4 Waffeln ausbacken (pro Waffel ca. 5–7 Minuten).","Beeren in einen Topf geben, 1 EL Agavendicksaft hinzufügen, gemahlene Vanille hinzugeben und unter Rühren erwärmen.","Waffeln mit heißen Beeren servieren."]'::jsonb,
  updated_at    = now()
WHERE id = 'f4bbfdeb-53df-40a4-881a-a0c8c3307d95';

-- Pellkartoffeln mit Sauerkraut und Seitan-Würstchen
UPDATE recipes SET
  titel         = 'Pellkartoffeln mit Sauerkraut und Seitan-Würstchen',
  beschreibung  = 'Pellkartoffeln mit Sauerkraut und Seitan-Würstchen mit Kartoffeln und Zwiebel',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rapsöl","menge":2,"einheit":"TL","hinweis":null},{"name":"Frischkost-Sauerkraut","menge":200,"einheit":"g","hinweis":null},{"name":"Seitan-Würstchen (200 g) (alternativ 2 Portionen Seitangeschnetzeltes (S. 116))","menge":4,"einheit":"Kleine","hinweis":null},{"name":"Leinöl","menge":2,"einheit":"TL","hinweis":null},{"name":"2 Lorbeerblätter","menge":null,"einheit":null,"hinweis":null},{"name":"5 Wacholderbeeren","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln für 15–20 Minuten kochen, bis sie weich sind.","In der Zwischenzeit Zwiebel fein würfeln und in einer beschichteten Pfanne in 1 TL Rapsöl anbraten. Lorbeerblätter und Wacholderbeeren hinzugeben und kurz mit anrösten, sodass sich die Aromen entfalten.","Sauerkraut hinzugeben und bei schwacher Hitze für maximal 2–3 Minuten erwärmen. Mit Salz und Pfeffer abschmecken. Lorbeerblätter und Wacholderbeeren herausnehmen.","In einer zweiten beschichteten Pfanne Seitan-Würstchen in 1 TL Rapsöl anbraten.","Kartoffeln pellen (wenn die Schale dünn ist, kannst du sie auch mitessen). Zusammen mit dem Sauerkraut und den Würstchen auf einem Teller anrichten und Leinöl darüber geben."]'::jsonb,
  updated_at    = now()
WHERE id = 'dce36202-2d62-49e1-9382-93d1dc2a8a09';

-- Pflanzliches Gulasch
UPDATE recipes SET
  titel         = 'Pflanzliches Gulasch',
  beschreibung  = 'Pflanzliches Gulasch mit Grobe Sojaschnetzel (Trockengewicht) und Gemüsebrühe',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Grobe Sojaschnetzel (Trockengewicht)","menge":150,"einheit":"g","hinweis":null},{"name":"Gemüsebrühe","menge":1,"einheit":"l","hinweis":null},{"name":"Zwiebeln","menge":2,"einheit":"Stk","hinweis":null},{"name":"Karotte","menge":1,"einheit":"Stk","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Pflanzliche Butter","menge":1,"einheit":"EL","hinweis":null},{"name":"Tomatenmark","menge":2,"einheit":"EL","hinweis":null},{"name":"Rotwein (optional)","menge":40,"einheit":"ml","hinweis":null},{"name":"Tomatenmark","menge":200,"einheit":"g","hinweis":null},{"name":"Zartbitterschokolade (mindestens 80% Kakaoanteil)","menge":10,"einheit":"g","hinweis":null},{"name":"1/4 Sellerieknolle","menge":null,"einheit":null,"hinweis":null},{"name":"Edelsüßes Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"2 Lorbeerblätter","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Sojaschnetzel in 500 ml heißer Gemüsebrühe für 10 Minuten einweichen.","In der Zwischenzeit Zwiebeln, Karotte und Sellerie in Würfel schneiden und den Knoblauch fein hacken.","Sojaschnetzel in einem Sieb ausdrücken, sodass ein Großteil der Flüssigkeit entweicht.","Butter in einem Topf erhitzen und Sojaschnetzel darin anbraten. Zwiebeln dazugeben und dünsten.","Nach und nach Tomatenmark, Paprikapulver, Karotte, Sellerie und Knoblauch dazugeben und ebenfalls kurz anrösten.","Mit den restlichen 500 ml der Gemüsebrühe und optional Rotwein ablöschen. Lorbeerblätter und passierte Tomaten dazugeben und für 30 Minuten auf niedriger Temperatur köcheln lassen.","Schokolade hinzugeben, schmelzen lassen und verrühren. Mit Salz und Pfeffer abschmecken."]'::jsonb,
  updated_at    = now()
WHERE id = '1a3e71b9-3b3d-42c7-8936-d8c55cc09997';

-- Buchweizen-Spinat-Pfanne
UPDATE recipes SET
  titel         = 'Buchweizen-Spinat-Pfanne',
  beschreibung  = 'Buchweizen-Spinat-Pfanne mit Buchweizen und Gemüsebrühe',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Buchweizen","menge":150,"einheit":"g","hinweis":null},{"name":"Gemüsebrühe","menge":450,"einheit":"ml","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Braune Champignons","menge":200,"einheit":"g","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"EL","hinweis":null},{"name":"Frischer Blattspinat","menge":200,"einheit":"g","hinweis":null},{"name":"2 Getrocknete, entsteine Datteln","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Buchweizen mit 400 ml Gemüsebrühe kochen.","Zwiebel in Würfel schneiden und Knoblauch hacken. Champignons klein schneiden.","Rapsöl in einer Pfanne oder einem Topf erhitzen und die Zwiebel darin andünsten. Champignons dazugeben und für 3–4 Minuten anbraten.","Knoblauch, Spinat und die restliche Gemüsebrühe in die Pfanne geben und bei mittlerer Hitze dünsten, bis alles bissfest gar ist.","Datteln hacken und in die Pfanne geben.","Buchweizen in die Pfanne geben und alles gut verrühren."]'::jsonb,
  updated_at    = now()
WHERE id = '124f0007-d2da-484c-bb6a-460169e49a3b';

-- Falafel im Brot
UPDATE recipes SET
  titel         = 'Falafel im Brot',
  beschreibung  = 'Falafel im Brot mit Gekochte Kichererbsen und Knoblauchzehe',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Gekochte Kichererbsen","menge":200,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Vollkorn-Dinkelmehl","menge":10,"einheit":"g","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"EL","hinweis":null},{"name":"Karotte","menge":1,"einheit":"Stk","hinweis":null},{"name":"Barbecuesoße","menge":4,"einheit":"TL","hinweis":null},{"name":"Pflanzliche Remoulade","menge":2,"einheit":"TL","hinweis":null},{"name":"Frische Petersilie","menge":null,"einheit":null,"hinweis":null},{"name":"1/2 Bio-Zitrone (Saft & Abrieb)","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"1/4 Rotkohl","menge":null,"einheit":null,"hinweis":null},{"name":"4 Salatblätter","menge":null,"einheit":null,"hinweis":null},{"name":"2 Vollkorn-Pitas","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Ofen auf 180°C Ober-/Unterhitze vorheizen.","Kichererbsen, Petersilie, Zitronenabrieb, Zitronensaft und Knoblauch mit einem Stabmixer fein pürieren (alternativ einen Standmixer verwenden), mit Salz und Pfeffer abschmecken.","Dinkelmehl mit der Kichererbsenmasse vermengen.","Aus der Masse 8 Bällchen formen. Mit Rapsöl bepinseln und auf ein mit Backpapier ausgelegtes Backblech legen.","Für 15–20 Minuten im Ofen backen, bis sie goldbraun sind.","Währenddessen Karotte grob raspeln, Rotkohl in feine Streifen schneiden und den Salat in grobe Streifen schneiden.","Pita längs einschneiden und zum Befüllen vorsichtig öffnen. Jeweils die untere Hälfte mit 2 TL Barbecuesoße und die obere Hälfte mit 1 TL Remoulade bestreichen.","Mit Salatblättern, Karottenraspeln und Rotkohlstreifen füllen. Je 4 heiße Falafelbällchen hinein legen und warm genießen."]'::jsonb,
  updated_at    = now()
WHERE id = 'b92654ac-2a3e-489f-ae49-a843c7d8ab15';

-- Blumenkohl-Kichererbsen-Curry
UPDATE recipes SET
  titel         = 'Blumenkohl-Kichererbsen-Curry',
  beschreibung  = 'Blumenkohl-Kichererbsen-Curry mit Naturreis und Zwiebel',
  schwierigkeit = 'einfach',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Naturreis","menge":80,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Tomaten","menge":2,"einheit":"Stk","hinweis":null},{"name":"Kokosöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Fettreduzierte Kokosmilch","menge":200,"einheit":"ml","hinweis":null},{"name":"Gemüsebrühe","menge":150,"einheit":"ml","hinweis":null},{"name":"Gekochte Kichererbsen","menge":240,"einheit":"g","hinweis":null},{"name":"Sojasoße","menge":2,"einheit":"EL","hinweis":null},{"name":"1 Daumengroßes Stück Ingwer","menge":null,"einheit":null,"hinweis":null},{"name":"1/2 Blumenkohl","menge":null,"einheit":null,"hinweis":null},{"name":"Currypulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Frische Petersilie oder Koriander (optional)","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Reis nach Packungsanweisung kochen.","Währenddessen Zwiebel, Knoblauch und Ingwer in kleine Stücke schneiden. Blumenkohl in kleine Röschen schneiden. Tomaten würfeln.","Kokosöl in einer großen beschichteten Pfanne oder einem Wok erhitzen. Zwiebeln darin anbraten, dann Knoblauch und Ingwer hinzugeben.","Currypaste, Currypulver und einen Schuss Wasser dazugeben und kurz köcheln lassen, damit sich das Aroma gut entfalten kann.","Kokosmilch und Gemüsebrühe dazugeben und alles gut verrühren, bis sich die Currypaste komplett aufgelöst hat und die Kokosmilch köchelt.","Blumenkohl und Tomaten hinzugeben und für 5–6 Minuten mitköcheln.","Kichererbsen abspülen und ins Curry dazugeben. Für weitere 1–2 Minuten köcheln lassen.","Curry mit Sojasoße, Salz und Pfeffer abschmecken. Optional mit gehackten frischen Kräutern garnieren."]'::jsonb,
  updated_at    = now()
WHERE id = 'cabc2bcb-297e-45e7-b866-7c3eb3d2e808';

-- Blumenkohl-Curry-Suppe
UPDATE recipes SET
  titel         = 'Blumenkohl-Curry-Suppe',
  beschreibung  = 'Blumenkohl-Curry-Suppe mit Zwiebel und Knoblauchzehe',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Apfel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Gemüsebrühe","menge":700,"einheit":"ml","hinweis":null},{"name":"Weißes Mandelmus","menge":30,"einheit":"g","hinweis":null},{"name":"Currypulver","menge":2,"einheit":"TL","hinweis":null},{"name":"Gekochte Kichererbsen","menge":30,"einheit":"g","hinweis":null},{"name":"1/2 Blumenkohl","menge":null,"einheit":null,"hinweis":null},{"name":"1/2 TL Zimtpulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"Frischer Rucola (optional)","menge":null,"einheit":null,"hinweis":null},{"name":"Ungesüßter Sojajoghurt (optional)","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zwiebel und Knoblauch klein schneiden. Rapsöl in einem großen Topf erhitzen. Zwiebel und Knoblauch darin glasig anbraten.","Blumenkohl in Röschen schneiden. Apfel schälen und in Stücke schneiden. Beides in den Topf geben und mit Gemüsebrühe übergießen.","Aufkochen und 15 Minuten köcheln lassen.","Mandelmus, Curry und Zimt in die Suppe geben.","Suppe mit einem Stabmixer fein pürieren. Mit Salz und Pfeffer abschmecken.","Kichererbsen mit etwas Paprikapulver mischen und als Topping auf die Suppe geben. Optional außerdem mit Rucola und Sojajoghurt garnieren."]'::jsonb,
  updated_at    = now()
WHERE id = '61102237-5c89-4280-8e59-e92cee652327';

-- Mediterraner Kichererbsen-Salat
UPDATE recipes SET
  titel         = 'Mediterraner Kichererbsen-Salat',
  beschreibung  = 'Mediterraner Kichererbsen-Salat mit Gekochte Kichererbsen und Tomaten',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Gekochte Kichererbsen","menge":120,"einheit":"g","hinweis":null},{"name":"Tomaten","menge":2,"einheit":"Stk","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Tomatenmark","menge":5,"einheit":"EL","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Zitronensaft","menge":2,"einheit":"TL","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Getrocknete italienische Kräuter","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Frische Petersilie","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kichererbsen abspülen und in eine Schüssel geben.","Tomaten, rote Zwiebel und getrocknete Tomaten klein schneiden und zu den Kichererbsen geben. Knoblauch fein hacken (oder pressen) und hinzugeben.","Zitronensaft, Olivenöl, Kräuter, Salz und Pfeffer über den Salat geben und alles verrühren.","Petersilie hacken und den Salat damit garnieren."]'::jsonb,
  updated_at    = now()
WHERE id = 'a20c70ec-1d6e-40e2-9b4c-b7c4b4780cd8';

-- Seitangeschnetzeltes
UPDATE recipes SET
  titel         = 'Seitangeschnetzeltes',
  beschreibung  = 'Seitangeschnetzeltes mit Seitan-Pulver (Glutenmehl) und Wasser',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Seitan-Pulver (Glutenmehl)","menge":70,"einheit":"g","hinweis":null},{"name":"Wasser","menge":100,"einheit":"ml","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"EL","hinweis":null},{"name":"Sojasoße","menge":2,"einheit":"EL","hinweis":null},{"name":"Sesamöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Rapsöl","menge":3,"einheit":"TL","hinweis":null},{"name":"Getrockneter Majoran","menge":null,"einheit":null,"hinweis":null},{"name":"Geräuchertes Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Seitan-Pulver und Wasser vermengen und ein paar Minuten kräftig kneten. Längeres Kneten sorgt dafür, dass der Seitan später fester wird.","Seitan mit einem scharfen Messer in Streifen schneiden.","Einen Dampfgareinsatz in einen Kochtopf mit etwas Wasser geben. Seitanstreifen hineingeben und für ca. 30 Minuten dämpfen.","Für die Marinade Zwiebeln und Knoblauch fein hacken, mit Tomatenmark, Sojasoße, Sesamöl, Majoran und geräuchertem Paprikapulver vermengen.","Seitan trocken tupfen, gegebenenfalls erneut in Streifen schneiden. Seitanstreifen in die Marinade geben und für mindestens 2 Stunden ziehen lassen.","Rapsöl in einer Pfanne erhitzen und die Seitanstreifen scharf darin anbraten. Mit Salz und Pfeffer abschmecken."]'::jsonb,
  updated_at    = now()
WHERE id = 'ae329456-799a-45ca-bef6-1c707c196885';

-- Indische Linsen-Suppe mit Spinat
UPDATE recipes SET
  titel         = 'Indische Linsen-Suppe mit Spinat',
  beschreibung  = 'Indische Linsen-Suppe mit Spinat mit Zwiebel und Knoblauchzehe',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rapsöl","menge":2,"einheit":"TL","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Gemüsebrühe","menge":700,"einheit":"ml","hinweis":null},{"name":"Tomaten","menge":2,"einheit":"Stk","hinweis":null},{"name":"Frischer Blattspinat","menge":100,"einheit":"g","hinweis":null},{"name":"1 Daumengroßes Stück Ingwer","menge":null,"einheit":null,"hinweis":null},{"name":"Kreuzkümmelpulver","menge":null,"einheit":null,"hinweis":null},{"name":"Chilipulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"1/2 Limette (15 ml Saft)*","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zwiebel würfeln, Knoblauch und Ingwer fein hacken.","Zwiebel in einem Topf in Rapsöl anbraten. Anschließend Knoblauch und Ingwer dazugeben.","Linsen hinzufügen und mit Gemüsebrühe ablöschen. Kurz aufkochen und dann bei geschlossenem Deckel für ca. 10 Minuten köcheln lassen.","Tomaten würfeln und in den Topf dazugeben. Weitere 5 Minuten köcheln lassen.","Mit Kreuzkümmelpulver, Chilipulver, Salz und Pfeffer würzen.","Zum Schluss Blattspinat in die Suppe geben und kurz unterrühren, sodass er leicht zerfällt.","Vor dem Servieren mit frischem Limettensaft beträufeln."]'::jsonb,
  updated_at    = now()
WHERE id = '86262752-72e7-41b8-aa28-4ba9bce4d644';

-- Penne mit Linsen-Bolognese
UPDATE recipes SET
  titel         = 'Penne mit Linsen-Bolognese',
  beschreibung  = 'Penne mit Linsen-Bolognese mit Zwiebel und Karotten',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Karotten","menge":2,"einheit":"Stk","hinweis":null},{"name":"Paprika","menge":1,"einheit":"Rote","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"EL","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Gemüsebrühe","menge":50,"einheit":"ml","hinweis":null},{"name":"Tomatenmark","menge":400,"einheit":"g","hinweis":null},{"name":"Vollkornnudeln (Penne)","menge":100,"einheit":"g","hinweis":null},{"name":"2-3 Lorbeerblätter","menge":null,"einheit":null,"hinweis":null},{"name":"Hefeflocken (optional)","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zwiebel, Karotten und Paprika in kleine Würfel schneiden, Knoblauch fein hacken.","Rapsöl in einem großen Topf erhitzen.","Zwiebel im Öl dünsten. Karotten und Paprika nach und nach dazugeben. Kurz den Knoblauch und die Linsen mit anrösten, dann mit Gemüsebrühe ablöschen.","Passierte Tomaten und Lorbeerblätter dazugeben und unter gelegentlichem Rühren ca. 15 Minuten köcheln lassen, bis die Linsen weich gekocht sind.","Mit Salz und Pfeffer abschmecken.","Nudeln nach Packungsanweisung kochen.","Nudeln mit der Linsen-Bolognese servieren und optional mit Hefeflocken bestreuen."]'::jsonb,
  updated_at    = now()
WHERE id = '7caf4597-cfaa-4b22-85a8-719d7718abd3';

-- Italienischer Nudelsalat mit Tomaten-Tofu
UPDATE recipes SET
  titel         = 'Italienischer Nudelsalat mit Tomaten-Tofu',
  beschreibung  = 'Italienischer Nudelsalat mit Tomaten-Tofu mit Naturtofu* und Tomatenmark',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Naturtofu*","menge":100,"einheit":"g","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"EL","hinweis":null},{"name":"Dunkler Balsamico-Essig (10 ml)*","menge":1,"einheit":"EL","hinweis":null},{"name":"Wasser (20 ml)*","menge":2,"einheit":"EL","hinweis":null},{"name":"Vollkornnudeln (z. B. Fusilli)","menge":150,"einheit":"g","hinweis":null},{"name":"Frischer Blattspinat","menge":50,"einheit":"g","hinweis":null},{"name":"Tomatenmark","menge":10,"einheit":"EL","hinweis":null},{"name":"Tomatenmark","menge":200,"einheit":"g","hinweis":null},{"name":"Pinienkerne","menge":15,"einheit":"g","hinweis":null},{"name":"Karottengrün-Pesto (S. 172) (alternativ veganes grünes Pesto)","menge":2,"einheit":"Portionen","hinweis":null},{"name":"Getrockneter Oregano*","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer*","menge":null,"einheit":null,"hinweis":null},{"name":"Getrocknete italienische Kräuter","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Tofu mit den Händen auspressen (dabei tritt Wasser aus und er kann die Marinade besser aufnehmen). In Würfel schneiden.","In einer Tupperdose Tomatenmark, Balsamico-Essig, Wasser, Oregano, Salz und Pfeffer vermischen. Tofu hineingeben, Deckel schließen und die Dose schütteln, sodass der Tofu komplett mit der Marinade bedeckt ist. Für 2 Stunden ziehen lassen.","Ofen auf 180°C Umluft vorheizen. Ein Backblech mit Backpapier auslegen und den Tofu darauf verteilen. Für 30–35 Minuten backen, dabei ab und zu wenden.","Währenddessen Nudeln nach Packungsanweisung kochen, dann in eine große Schüssel geben.","Spinat grob zerkleinern, getrocknete Tomaten fein schneiden, Kirschtomaten halbieren. Zusammen mit den Pinienkernen zu den Nudeln geben.","Karottengrün-Pesto über dem Nudelsalat verteilen, gut umrühren und mit italienischen Kräutern, Salz und Pfeffer abschmecken.","Gebackenen Tofu zum Nudelsalat geben und unterrühren."]'::jsonb,
  updated_at    = now()
WHERE id = '7f870d43-8998-4d5d-a3bb-def6ff89e718';

-- Kartoffel-Spinat-Auflauf
UPDATE recipes SET
  titel         = 'Kartoffel-Spinat-Auflauf',
  beschreibung  = 'Kartoffel-Spinat-Auflauf mit Blattspinat (TK) und Grüne Erbsen (TK)',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Blattspinat (TK)","menge":500,"einheit":"g","hinweis":null},{"name":"Grüne Erbsen (TK)","menge":100,"einheit":"g","hinweis":null},{"name":"Festkochende Kartoffeln","menge":500,"einheit":"g","hinweis":null},{"name":"Cashewkerne","menge":40,"einheit":"g","hinweis":null},{"name":"Hefeflocken","menge":15,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Semmelbrösel","menge":20,"einheit":"g","hinweis":null},{"name":"1/2 TL Senf","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Ofen auf 180°C Ober-/Unterhitze vorheizen.","Spinat in einem kleinen Topf auftauen, anschließend in einem Sieb ausdrücken und abtropfen lassen. Erbsen aus dem Eisfach nehmen und antauen lassen.","Kartoffeln schälen und in ca. 1 cm dicke Scheiben schneiden. In Salzwasser ca. 10 Minuten bissfest garen (nicht zu weich werden lassen).","Alle Kartoffeln bis auf 3–4 Scheiben aus dem Topf nehmen und in eine Auflaufform geben.","Cashewkerne zu den verbleibenden Kartoffelstücken in den Topf geben und für 5 Minuten kochen lassen.","Cashews, verbleibende Kartoffeln, Hefeflocken, Senf, Knoblauchpulver, Salz, Pfeffer und ca. 50 ml des Kochwassers in einen Standmixer geben (alternativ einen Stabmixer verwenden). Zu einer cremigen Soße pürieren.","Spinat und Erbsen in die Auflaufform geben und mit den Kartoffeln vermengen. Soße über den Auflauf geben und umrühren. Mit Semmelbröseln bestreuen.","Auflauf für ca. 25 Minuten im Ofen backen."]'::jsonb,
  updated_at    = now()
WHERE id = '6625a77f-d143-4f3e-a279-3bef7ec02def';

-- Nudeln mit Grünkohl-Pesto
UPDATE recipes SET
  titel         = 'Nudeln mit Grünkohl-Pesto',
  beschreibung  = 'Nudeln mit Grünkohl-Pesto mit Vollkornnudeln und Frischer Grünkohl',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Vollkornnudeln","menge":200,"einheit":"g","hinweis":null},{"name":"Frischer Grünkohl","menge":50,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Pinienkerne","menge":15,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"EL","hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Frisches Basilikum","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Nudeln nach Packungsanweisung kochen.","Grünkohl abzupfen und in eine Schüssel mit Wasser geben. Für 2–3 Minuten mit den Händen „massieren“, damit er weicher wird. Das Wasser abgießen und den Grünkohl in einen Standmixer geben (alternativ einen Stabmixer verwenden).","Knoblauch, Pinienkerne und Olivenöl zum Grünkohl geben. Eventuell nach Bedarf etwas Wasser hinzugeben.","Gut pürieren, bis ein cremiges Pesto entsteht. Mit Salz und Pfeffer abschmecken.","Pesto zu den Nudeln servieren. Mit frischem Basilikum garnieren."]'::jsonb,
  updated_at    = now()
WHERE id = 'cc3efc47-71be-4899-8ace-a879b1571dc3';

-- Wraps mit Räuchertofu-Pilz-Füllung
UPDATE recipes SET
  titel         = 'Wraps mit Räuchertofu-Pilz-Füllung',
  beschreibung  = 'Einfacher Wraps mit Räuchertofu-Pilz-Füllung als schnelle Mahlzeit',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Braune Champignons","menge":140,"einheit":"g","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Räuchertofu","menge":100,"einheit":"g","hinweis":null},{"name":"Frischer Blattspinat","menge":40,"einheit":"g","hinweis":null},{"name":"Veganer Frischkäse","menge":40,"einheit":"g","hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"2 Große runde Vollkorn-Tortillas (ca. 120 g)","menge":null,"einheit":null,"hinweis":null},{"name":"Frische Petersilie (optional)","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zwiebel würfeln, Champignons klein schneiden. Zusammen in einer beschichteten Pfanne in Rapsöl anbraten. Mit Salz und Pfeffer abschmecken.","Räuchertofu klein würfeln und in die Pfanne dazugeben. Für weitere 3–4 Minuten bei mittlerer Hitze braten.","Blattspinat fein hacken und unter die Pilz-Tofu-Mischung rühren.","Tortillas mittig durchschneiden.","Jede der vier Tortilla-Hälften mit Frischkäse bestreichen. Zur Hälfte mit Pilz-Tofu-Mischung belegen und mittig zusammenklappen.","Wraps in einer beschichteten Pfanne von beiden Seiten für jeweils 3–4 Minuten erwärmen.","Optional mit Petersilie garnieren."]'::jsonb,
  updated_at    = now()
WHERE id = '75b8a87a-e7dd-4ae7-a01c-8cb499f6f2d9';

-- Herzhafte Maultaschen
UPDATE recipes SET
  titel         = 'Herzhafte Maultaschen',
  beschreibung  = 'Herzhafte Maultaschen mit Räuchertofu und Knoblauchzehe',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Räuchertofu","menge":100,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rapsöl","menge":4,"einheit":"TL","hinweis":null},{"name":"Sojasoße","menge":2,"einheit":"EL","hinweis":null},{"name":"Sesamöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Dinkelmehl (Typ 630)","menge":150,"einheit":"g","hinweis":null},{"name":"Wasser","menge":60,"einheit":"ml","hinweis":null},{"name":"1/2 Weißkohl","menge":null,"einheit":null,"hinweis":null},{"name":"1 Daumengroßes Stück Ingwer","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Räuchertofu und Weißkohl in kleine Stücke schneiden. Knoblauch und Ingwer fein hacken.","2 TL Rapsöl in einer Pfanne erhitzen. Weißkohl und Räuchertofu darin scharf anbraten. Knoblauch, Ingwer, Sojasoße und Sesamöl dazugeben und kurz ziehen lassen. Anschließend beiseite stellen.","Mehl mit 1/2 TL Salz, Wasser sowie 2 TL Rapsöl vermengen und zu einem festen Teig kneten.","Teig auf einer bemehlten Arbeitsfläche ausrollen. Darauf achten, dass der Teig nicht zu dünn ist und sich gut von der Arbeitsfläche lösen lässt.","Aus dem Teig Rechtecke von ca. 5 x 12 cm Kantenlänge ausschneiden.","Auf je eine Seite eines Teig-Rechtecks 1 TL der Füllung geben und mittig zusammenklappen. Die offenen Seiten fest zusammendrücken (z. B. mit einer Gabel).","In einem großen Topf Salzwasser zum Kochen bringen. Die Maultaschen in das Salzwasser geben und so lange kochen, bis sie an der Oberfläche schwimmen (ca. 3–5 Minuten).","Kurz abtropfen lassen und nach Belieben servieren."]'::jsonb,
  updated_at    = now()
WHERE id = '1f7cd2d0-b141-4a5e-a8a1-58a2ef61651f';

-- Zwiebelkuchen
UPDATE recipes SET
  titel         = 'Zwiebelkuchen',
  beschreibung  = 'Zwiebelkuchen mit Kalte pflanzliche Butter und Vollkorn-Dinkelmehl',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kalte pflanzliche Butter","menge":100,"einheit":"g","hinweis":null},{"name":"Vollkorn-Dinkelmehl","menge":200,"einheit":"g","hinweis":null},{"name":"Kalte pflanzliche Margarine","menge":100,"einheit":"g","hinweis":null},{"name":"Kaltes Wasser","menge":60,"einheit":"ml","hinweis":null},{"name":"Gemüsezwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Seidentofu*","menge":200,"einheit":"g","hinweis":null},{"name":"Ungesüßter Soja-Skyr","menge":100,"einheit":"g","hinweis":null},{"name":"Speisestärke","menge":1,"einheit":"TL","hinweis":null},{"name":"Kümmel (gemahlen oder ganz)","menge":1,"einheit":"TL","hinweis":null},{"name":"1/2 TL Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Mehl und Salz in eine Schüssel geben. Butter in kleinen Stückchen dazugeben. Mit den Händen zu einem Teig kneten. (Dafür ist ein bisschen Geduld gefragt, sobald die Butter weich wird, ist es leichter.) Bei Bedarf nach und nach maximal 60 ml kaltes Wasser dazugeben.","Teig für ca. 20 Minuten in den Kühlschrank legen.","Ofen auf 200°C Ober-/Unterhitze vorheizen.","Währenddessen Zwiebeln in grobe Stücke schneiden. In einer Pfanne in Rapsöl für 4–5 Minuten glasig dünsten.","Seidentofu und Soja-Skyr in eine Schüssel geben, Speisestärke hinein sieben. Mit einer Gabel oder einem Schneebesen gut verrühren, bis eine klumpenfreie Creme entsteht. Zwiebeln vorsichtig unter die Masse rühren. Mit Kümmel, Salz und Pfeffer würzen.","Teig gleichmäßig auf dem Boden und am Rand einer Springform verteilen. Zwiebel-Füllung hineingeben und glatt streichen.","Zwiebelkuchen für ca. 40 Minuten im Ofen backen. Nach der Hälfte der Backzeit die Temperatur auf 180°C reduzieren."]'::jsonb,
  updated_at    = now()
WHERE id = 'feacd86e-79e9-483a-a3b2-38aa91041602';

-- Nudeln mit Mangold in Sahnesoße
UPDATE recipes SET
  titel         = 'Nudeln mit Mangold in Sahnesoße',
  beschreibung  = 'Nudeln mit Mangold in Sahnesoße mit Vollkornnudeln (z. B. Penne) und Mangold',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Vollkornnudeln (z. B. Penne)","menge":180,"einheit":"g","hinweis":null},{"name":"Mangold","menge":1,"einheit":"Bund","hinweis":null},{"name":"Gemüsezwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Gemüsebrühe","menge":150,"einheit":"ml","hinweis":null},{"name":"Sojasahne","menge":200,"einheit":"ml","hinweis":null},{"name":"Muskatnusspulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Nudeln nach Packungsanweisung kochen.","Den Strunk des Mangolds abschneiden und die einzelnen Blätter trennen. Jeweils am Übergang vom weißen Stil zu den grünen Blättern durchschneiden. Die weißen Teile des Mangold in daumengroße Stücke schneiden.","Zwiebel grob würfeln und in einer großen Pfanne in Rapsöl anbraten.","Die weißen Mangold-Stücke hinzugeben und kurz mit anbraten.","Mit Gemüsebrühe ablöschen und bei geschlossenem Deckel ca. 5 Minuten bei mittlerer Hitze garen.","Die grünen Blätter des Mangolds grob in Streifen schneiden. In die Pfanne dazugeben.","Sojasahne hinzugeben und alles für weitere 5 Minuten köcheln lassen, bis die weißen Mangold-Stücke weich sind. Mit Muskatnusspulver, Salz und Pfeffer abschmecken.","Mangold-Sahnesoße zu den Nudeln servieren."]'::jsonb,
  updated_at    = now()
WHERE id = 'dd80fa36-b5f5-4362-ad5a-5d6bd98a479b';

-- Pikante Reispfanne
UPDATE recipes SET
  titel         = 'Pikante Reispfanne',
  beschreibung  = 'Pikante Reispfanne mit Naturreis und Zwiebel',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Naturreis","menge":120,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stk","hinweis":null},{"name":"Paprika","menge":1,"einheit":"Rote","hinweis":null},{"name":"Paprika","menge":1,"einheit":"Gelbe","hinweis":null},{"name":"Karotten","menge":2,"einheit":"Stk","hinweis":null},{"name":"Frische grüne Bohnen (alternativ TK)","menge":150,"einheit":"g","hinweis":null},{"name":"Rapsöl","menge":2,"einheit":"TL","hinweis":null},{"name":"Gemüsebrühe","menge":100,"einheit":"ml","hinweis":null},{"name":"Sojasoße","menge":2,"einheit":"EL","hinweis":null},{"name":"Scharfes Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"Geräuchertes Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Frische Petersilie (optional)","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Reis nach Packungsanweisung kochen.","Zwiebel würfeln. Chilischoten halbieren, entkernen und fein hacken (für mehr Schärfe ein paar Kerne behalten).","Paprika und Karotten in Streifen schneiden. Grüne Bohnen halbieren.","In einer großen beschichteten Pfanne Zwiebeln und Chili bei mittlerer Hitze in Rapsöl anbraten.","Karotte, Paprika und Bohnen in die Pfanne geben und kurz mit anbraten. Dann etwas Gemüsebrühe hinzugeben, um das Gemüse für 4–5 Minuten darin zu dünsten.","Gekochten Reis dazugeben und alles gut verrühren.","Mit Sojasoße, scharfem und geräuchertem Paprikapulver sowie Salz und Pfeffer abschmecken. Optional mit gehackter Petersilie bestreuen."]'::jsonb,
  updated_at    = now()
WHERE id = 'dec5c8b0-db03-4f72-96d7-11f6a9955f2e';

-- Kartoffelwürfel mit Pinienkernen und Avocado-Dip
UPDATE recipes SET
  titel         = 'Kartoffelwürfel mit Pinienkernen und Avocado-Dip',
  beschreibung  = 'Kartoffelwürfel mit Pinienkernen und Avocado-Dip mit Festkochende Kartoffeln und Rapsöl',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Festkochende Kartoffeln","menge":500,"einheit":"g","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"EL","hinweis":null},{"name":"Frischer Rosmarin","menge":20,"einheit":"g","hinweis":null},{"name":"Avocado","menge":1,"einheit":"Stk","hinweis":null},{"name":"Zitronensaft","menge":1,"einheit":"EL","hinweis":null},{"name":"Pinienkerne","menge":20,"einheit":"g","hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Ofen auf 170°C Ober-/Unterhitze vorheizen.","Kartoffeln schälen und in gleichgroße Würfel schneiden.","Eine Backform mit Rapsöl auspinseln und mit Rosmarinnadeln, Salz und Pfeffer bestreuen.","Kartoffelwürfel in die Backform geben und leicht salzen.","Für 40 Minuten im Ofen backen.","In der Zwischenzeit das Fruchtfleisch aus der Avocado lösen und zusammen mit dem Zitronensaft fein pürieren. Mit Salz und Pfeffer abschmecken.","Wenn die Kartoffeln goldbraun sind, aus dem Ofen nehmen und mit Pinienkernen bestreuen. Mit Avocadocreme servieren."]'::jsonb,
  updated_at    = now()
WHERE id = '01d70c7a-4dfa-46d2-862b-c62f692f9773';

-- Bunte Superfoods-Bowl
UPDATE recipes SET
  titel         = 'Bunte Superfoods-Bowl',
  beschreibung  = 'Nährstoffreiche Bunte Superfoods-Bowl',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Quinoa (Trockengewicht)","menge":70,"einheit":"g","hinweis":null},{"name":"Karotten","menge":2,"einheit":"Stk","hinweis":null},{"name":"Radieschen","menge":2,"einheit":"Stk","hinweis":null},{"name":"Frischer Blattspinat","menge":60,"einheit":"g","hinweis":null},{"name":"Edamame-Bohnen (geschält)","menge":100,"einheit":"g","hinweis":null},{"name":"Gekochte Kichererbsen","menge":50,"einheit":"g","hinweis":null},{"name":"Ungesüßter Kokos-Mandel-Drink","menge":70,"einheit":"ml","hinweis":null},{"name":"Sojasoße","menge":2,"einheit":"EL","hinweis":null},{"name":"Ungesüßtes Erdnussmus","menge":30,"einheit":"g","hinweis":null},{"name":"Limettensaft","menge":2,"einheit":"TL","hinweis":null},{"name":"Sesam","menge":2,"einheit":"TL","hinweis":null},{"name":"1/2 Gurke","menge":null,"einheit":null,"hinweis":null},{"name":"1/2 Avocado","menge":null,"einheit":null,"hinweis":null},{"name":"Frische Chilischote (optional)","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Quinoa nach Packungsanweisung kochen.","Karotten, Gurke und Radieschen in Scheiben schneiden. Avocado aus der Schale lösen und in Scheiben schneiden.","Quinoa, Karotten, Gurke, Radieschen, Spinat, Edamame, Kichererbsen und Avocado kreisförmig in 2 tiefen Tellern anrichten.","Für das Dressing Kokos-Mandel-Drink, Sojasoße und Erdnussmus in einem Topf leicht erwärmen und verrühren. Anschließend Limettensaft einrühren.","Das Dressing sowie den Sesam über die Bowl geben. Optional Chili darüber geben."]'::jsonb,
  updated_at    = now()
WHERE id = '8975bd8a-b045-414f-9695-1b92f2fe9dd8';

-- Burger Buns
UPDATE recipes SET
  titel         = 'Burger Buns',
  beschreibung  = 'Proteinreiche Burger Buns mit Soja-Hack-Füllung',
  schwierigkeit = 'mittel',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Magerquark","menge":200,"einheit":"g","hinweis":null},{"name":"Dinkelmehl","menge":160,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"Pck.","hinweis":null},{"name":"Like Hack (Soja Hack)","menge":180,"einheit":"g","hinweis":null},{"name":"Reibekäse light","menge":100,"einheit":"g","hinweis":null},{"name":"Tomaten","menge":100,"einheit":"g","hinweis":null},{"name":"Gewürzgurken","menge":100,"einheit":"g","hinweis":null},{"name":"Rote Zwiebel","menge":30,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Die Zutaten für den Teig ordentlich verkneten.","Hack anbraten, Tomaten, Gewürzgurken und Zwiebeln kleinschneiden.","Den Teig in 6 Kugeln aufteilen.","Arbeitsfläche und Nudelholz mit Mehl bestäuben und die Kugeln ordentlich ausrollen.","Den ausgerollten Teig in eine kleine Schüssel legen und mit den restlichen Zutaten füllen.","Die Teigenden zusammendrürcken, sodass alles gut verschlossen ist.","Auf ein Backblech mit Backpapier legen (mit der zusammengedrürckten Seite nach unten).","Optional mit etwas Milch bepinseln und Sesam drürber geben.","Backen bei 180°C für 15 Minuten."]'::jsonb,
  updated_at    = now()
WHERE id = '4c1f1f2a-116c-4858-af98-494bfdc21eb2';

-- Beef Nudeln
UPDATE recipes SET
  titel         = 'Beef Nudeln',
  beschreibung  = 'Schnelles Abendessen mit Tatar und Mi Nudeln',
  schwierigkeit = 'einfach',
  tags          = ARRAY['schnell','asiatisch','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Tatar","menge":150,"einheit":"g","hinweis":null},{"name":"Frühlingszwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Teriyaki Sauce","menge":2,"einheit":"EL","hinweis":null},{"name":"Mi Nudeln","menge":100,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Sesam","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Nudeln in heißes Wasser geben.","Hackfleisch mit den Lauchzwiebeln kurz anbraten.","Mit Teriyaki Sauce ablöschen.","Die Nudeln dazugeben, Lauchzwiebeln und etwas Sesam."]'::jsonb,
  updated_at    = now()
WHERE id = '892df66a-90c2-41a3-81b4-88a25211543d';

-- Sommersalat mit Thunfisch und Dill
UPDATE recipes SET
  titel         = 'Sommersalat mit Thunfisch und Dill',
  beschreibung  = 'Erfrischender Salat mit Thunfisch, Gurken und Dill',
  schwierigkeit = 'einfach',
  tags          = ARRAY['salat','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Gurken","menge":3,"einheit":"Stück","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Mais","menge":0.5,"einheit":"Dose","hinweis":null},{"name":"Thunfisch","menge":2,"einheit":"Dose","hinweis":null},{"name":"Frischer Dill","menge":0.5,"einheit":"Bund","hinweis":null},{"name":"Paprikapulver","menge":1,"einheit":"TL","hinweis":null},{"name":"Joghurt","menge":250,"einheit":"ml","hinweis":null},{"name":"Mayonnaise","menge":3,"einheit":"EL","hinweis":null},{"name":"Senf","menge":2,"einheit":"TL","hinweis":null},{"name":"Zitronensaft","menge":0.5,"einheit":"Zitrone","hinweis":null},{"name":"Honig","menge":1,"einheit":"EL","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten klein schneiden.","Das Dressing zubereiten, indem Joghurt, Mayonnaise, Senf, Zitronensaft und Honig vermengt werden.","Das Dressing mit den geschnittenen Zutaten vermischen."]'::jsonb,
  updated_at    = now()
WHERE id = '0fae6bea-964d-48db-b11d-1f65d70405e8';

-- AirFryer Knuspriger Gold Chicken Nuggets
UPDATE recipes SET
  titel         = 'AirFryer Knuspriger Gold Chicken Nuggets',
  beschreibung  = 'Knusprige Hähnchen-Nuggets aus dem AirFryer',
  schwierigkeit = 'mittel',
  tags          = ARRAY['snack','airfryer','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust","menge":500,"einheit":"g","hinweis":null},{"name":"Salz","menge":1,"einheit":"TL","hinweis":null},{"name":"Ei","menge":2,"einheit":"Stück","hinweis":null},{"name":"Cheddar","menge":100,"einheit":"g","hinweis":null},{"name":"Cornflakes","menge":100,"einheit":"g","hinweis":null},{"name":"Skyr oder Joghurt","menge":250,"einheit":"g","hinweis":null},{"name":"Dill","menge":2,"einheit":"TL","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stück","hinweis":null},{"name":"Zitrone","menge":0.5,"einheit":"Stück","hinweis":null},{"name":"Honig","menge":1,"einheit":"TL","hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchenbrust in kleine Stücke schneiden.","In einer Schüssel Salz, Ei und Cheddar vermischen.","Hähnchenstücke in die Mischung geben und umhüllen.","Cornflakes in einer separaten Schüssel zerbröseln.","Hähnchenstücke in den Cornflakes wälzen, um sie zu panieren.","In dem AirFryer backen, bis knusprig.","Für die Sauce Skyr oder Joghurt, Dill, Knoblauchzehe, Zitrone und Honig vermischen.","Die Sauce zu den Nuggets servieren."]'::jsonb,
  updated_at    = now()
WHERE id = '5f717c9f-279d-4f92-9bd8-a157a6ecbc24';

-- Scharfer Honey Halloumi Carbonara
UPDATE recipes SET
  titel         = 'Scharfer Honey Halloumi Carbonara',
  beschreibung  = 'Klassische Carbonara mit Halloumi und Honig',
  schwierigkeit = 'mittel',
  tags          = ARRAY['italienisch','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Spaghetti","menge":200,"einheit":"g","hinweis":null},{"name":"Eier","menge":4,"einheit":"Stück","hinweis":null},{"name":"Parmesan","menge":50,"einheit":"g","hinweis":null},{"name":"Halloumi","menge":1,"einheit":"Stück","hinweis":null},{"name":"Honig","menge":1,"einheit":"TL","hinweis":null},{"name":"Crispy Chili Öl","menge":2,"einheit":"TL","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Pasta kochen: Spaghetti in Salzwasser al dente garen und etwas Nudelwasser aufheben.","Halloumi braten: Halloumi in kleine Würfel schneiden und in einer Pfanne goldbraun anbraten, dann mit Honig und Crispy Chili Öl glasieren.","Eimischung rühren: Eier mit Parmesan, Salz und viel Pfeffer verrühren und etwas Nudelwasser unterrühren.","Vermengen: Spaghetti abgießen, kurz abkühlen lassen, dann mit der Ei-Mischung verrühren, bis eine cremige Sauce entsteht.","Fertigstellen: Hot Honey Halloumi unterheben und alles nochmal gut vermengen.","Servieren: Mit extra Parmesan, Pfeffer und etwas Chili Öl toppen und direkt genießen."]'::jsonb,
  updated_at    = now()
WHERE id = 'b1358739-a0cc-4440-86fb-0a0925cb1671';

-- Cheeseburger Kartoffelpfanne
UPDATE recipes SET
  titel         = 'Cheeseburger Kartoffelpfanne',
  beschreibung  = 'Proteinreiche Kartoffelpfanne mit Hähnchen und Käse, ideal für Meal Prep und Fitness',
  schwierigkeit = 'mittel',
  tags          = ARRAY['highprotein','mealprep','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrust oder Hähnchenhack","menge":250,"einheit":"g","hinweis":null},{"name":"Kartoffeln","menge":500,"einheit":"g","hinweis":null},{"name":"körniger Frischkäse","menge":200,"einheit":"g","hinweis":null},{"name":"Reibekäse light","menge":40,"einheit":"g","hinweis":null},{"name":"Gewürzgurken","menge":2,"einheit":"Stück","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Ketchup light","menge":15,"einheit":"g","hinweis":null},{"name":"Senf","menge":10,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Paprika","menge":null,"einheit":null,"hinweis":null},{"name":"Knoblauchpulver","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln klein würfeln und in eine große Auflaufform oder Pfanne geben.","Hähnchen, körnigen Frischkäse, Käse, Gewürzgurken, Zwiebeln sowie alle Gewürze dazugeben.","Ketchup, Senf und Olivenöl hinzufügen und alles gut vermischen.","Bei 200 Grad Umluft ca. 50 Minuten backen.","Zwischendurch einmal umrühren und anschließend heiß servieren."]'::jsonb,
  updated_at    = now()
WHERE id = '59c3e89c-1c70-41dd-b9db-bb7272e68510';

-- Highprotein Dessert mit Schokodrops und Crunch
UPDATE recipes SET
  titel         = 'Highprotein Dessert mit Schokodrops und Crunch',
  beschreibung  = 'Ein gesundes Dessert mit viel Protein und wenig Kalorien, perfekt für abends',
  schwierigkeit = 'mittel',
  tags          = ARRAY['dessert','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Haferflocken","menge":25,"einheit":"g","hinweis":null},{"name":"Chia Samen","menge":10,"einheit":"g","hinweis":null},{"name":"Whey","menge":30,"einheit":"g","hinweis":null},{"name":"ungesüßte Mandelmilch","menge":100,"einheit":"ml","hinweis":null},{"name":"Skyr","menge":100,"einheit":"g","hinweis":null},{"name":"gepuffter Vollkornreis","menge":10,"einheit":"g","hinweis":null},{"name":"Schokodrops","menge":20,"einheit":"g","hinweis":null}]'::jsonb,
  zubereitung   = '["Haferflocken, Chia Samen, Whey und Mandelmilch zusammenrühren und für ca. 1 Minute in die Mikrowelle geben.","Abkühlen lassen und eine Schicht Skyr oben drauf geben.","Das Ganze kurz in den Kühlschrank stellen.","Währenddessen den gepufften Reis mit geschmolzener Schokolade vermengen und als crunchy Schicht oben drauf geben.","Alles für ca. 1 Stunde ins Gefrierfach geben und dann servieren."]'::jsonb,
  updated_at    = now()
WHERE id = '387f724f-ec1a-4f91-a0fe-7ff276980b1d';

-- Antientzündlicher Kichererbsen-Nudelsalat
UPDATE recipes SET
  titel         = 'Antientzündlicher Kichererbsen-Nudelsalat',
  beschreibung  = 'Nudelsalat mit Kichererbsen, Gemüse und antientzündlichem Dressing',
  schwierigkeit = 'einfach',
  tags          = ARRAY['salat','vegan','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kichererbsen Fusilli","menge":250,"einheit":"g","hinweis":null},{"name":"Gurke","menge":0.5,"einheit":"Stück","hinweis":null},{"name":"Cherrytomaten","menge":150,"einheit":"g","hinweis":null},{"name":"Paprika","menge":0.5,"einheit":"Stück","hinweis":null},{"name":"Mais","menge":150,"einheit":"g","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Vegane Crème fraîche oder Frischkäse","menge":2,"einheit":"EL","hinweis":null},{"name":"Pflanzlicher Joghurt","menge":250,"einheit":"g","hinweis":null},{"name":"Currypulver","menge":2,"einheit":"EL","hinweis":null},{"name":"Ahornsirup","menge":1,"einheit":"TL","hinweis":null},{"name":"Limette","menge":1,"einheit":"Stück","hinweis":null},{"name":"Eingelegte Gürkchen","menge":2,"einheit":"Stück","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stück","hinweis":null},{"name":"Chiliöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Petersilie","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Nudeln kochen und abkühlen lassen.","Gemüse klein schneiden.","Alles in eine große Schüssel geben.","Dressing anrühren und unterheben."]'::jsonb,
  updated_at    = now()
WHERE id = '1aca26da-6aba-416f-8719-9e6dafb8c0ab';

-- Reispapier-Pide
UPDATE recipes SET
  titel         = 'Reispapier-Pide',
  beschreibung  = 'Türkisches Essen leicht und gesund gemacht',
  schwierigkeit = 'einfach',
  tags          = ARRAY['glutenfrei','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Reispapier","menge":10,"einheit":"Blatt","hinweis":null},{"name":"Eier","menge":2,"einheit":"Stück","hinweis":null},{"name":"Hackfleisch","menge":500,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stück","hinweis":null},{"name":"Tomatenmark","menge":3,"einheit":"EL","hinweis":null},{"name":"Paprikamark","menge":1,"einheit":"TL","hinweis":null},{"name":"Rote Paprika","menge":0.5,"einheit":"Stück","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Petersilie","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Paprika edelsüß","menge":null,"einheit":null,"hinweis":null},{"name":"Sesam","menge":null,"einheit":null,"hinweis":null},{"name":"Schwarzkümmel","menge":null,"einheit":null,"hinweis":null},{"name":"Cherrytomaten","menge":null,"einheit":null,"hinweis":null},{"name":"Käse","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Eier verquirlen und Reispapier kurz eintunken.","Reispapier doppellagig übereinanderlegen.","Hackfleisch-Mischung darauf verteilen und Ränder leicht einschlagen.","Mit Sesam und Schwarzkümmel dekorieren und nach Wunsch toppen.","Bei 200 °C backen, bis alles goldbraun und knusprig ist."]'::jsonb,
  updated_at    = now()
WHERE id = '6b71ac1c-1de2-4ec3-a178-0a0a836faa7c';

-- Brokkoli-Nuggets
UPDATE recipes SET
  titel         = 'Brokkoli-Nuggets',
  beschreibung  = 'Gesunde Brokkoli-Nuggets für Abnehmer und Fitness-Begeisterte',
  schwierigkeit = 'einfach',
  tags          = ARRAY['snack','highprotein','lowcarb','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Brokkoli","menge":500,"einheit":"g","hinweis":null},{"name":"Light Mozzarella","menge":200,"einheit":"g","hinweis":null},{"name":"Eier","menge":1,"einheit":"Stück","hinweis":null},{"name":"Gewürze","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten vermischen.","Nuggets formen.","Bei 200°C ca. 20-25 Minuten backen."]'::jsonb,
  updated_at    = now()
WHERE id = 'a994f3c8-657c-4b96-8c68-7b1fc001ca01';

-- Knuspriger Chocolate Rice Cakes
UPDATE recipes SET
  titel         = 'Knuspriger Chocolate Rice Cakes',
  beschreibung  = 'Einfache, gesunde Reiswaffeln mit Erdnussbutter, Honig und dunkler Schokolade',
  schwierigkeit = 'einfach',
  tags          = ARRAY['snack','schnell','zuckerfrei','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Reiswaffeln (Meersalz)","menge":6,"einheit":"Stück","hinweis":null},{"name":"Erdnussbutter (zuckerfrei)","menge":100,"einheit":"g","hinweis":null},{"name":"Honig","menge":37.5,"einheit":"g","hinweis":null},{"name":"Erdnüsse","menge":45,"einheit":"g","hinweis":null},{"name":"Zuckerfreie dunkle Schokolade","menge":70,"einheit":"g","hinweis":null},{"name":"Flaky Salt","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Erdnussbutter und Honig vermischen.","Die Mischung auf die Reiswaffeln streichen.","Erdnüsse daraufgeben.","Schokolade schmelzen und darüberträufeln.","10 Minuten im Kühlschrank kühlen."]'::jsonb,
  updated_at    = now()
WHERE id = 'c98c5e84-a1f4-47cd-b607-9ed1236cf8c7';

-- Zucchini-Joghurt mit Hackfleisch
UPDATE recipes SET
  titel         = 'Zucchini-Joghurt mit Hackfleisch',
  beschreibung  = 'Schnell, eiweißreich und lecker - perfekt für die Zucchini-Saison',
  schwierigkeit = 'einfach',
  tags          = ARRAY['hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":150,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":5,"einheit":"ml","hinweis":null},{"name":"Skyr Cremig","menge":75,"einheit":"g","hinweis":null},{"name":"Rinderhackfleisch","menge":100,"einheit":"g","hinweis":null},{"name":"Zucchini","menge":300,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Paprika","menge":null,"einheit":null,"hinweis":null},{"name":"Knoblauch","menge":null,"einheit":null,"hinweis":null},{"name":"Petersilie","menge":null,"einheit":null,"hinweis":null},{"name":"Chili","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln würfeln und mit Olivenöl und Paprika marinieren.","Kartoffeln in der Heißluftfritteuse backen (12 Minuten, 175 Grad).","Zucchini raspeln und würzen.","Zucchini anbraten.","Hackfleisch scharf anbraten und abschmecken.","Skyr zur Zucchini geben (nachdem diese etwas abgekühlt ist).","Alles in einer Bowl anrichten und mit Petersilie und Chili toppen."]'::jsonb,
  updated_at    = now()
WHERE id = 'e6a0caa1-d8f5-4db2-80d1-83d880bb4d8d';

-- XXL Protein-Lasagne
UPDATE recipes SET
  titel         = 'XXL Protein-Lasagne',
  beschreibung  = 'Proteinreiche Lasagne für Mealprep',
  schwierigkeit = 'aufwendig',
  tags          = ARRAY['mealprep','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"mageres Rinderhack","menge":300,"einheit":"g","hinweis":null},{"name":"Champignons","menge":400,"einheit":"g","hinweis":null},{"name":"Zwiebeln","menge":200,"einheit":"g","hinweis":null},{"name":"passierte Tomaten","menge":500,"einheit":"g","hinweis":null},{"name":"Gemüsebrühe","menge":200,"einheit":"ml","hinweis":null},{"name":"Lasagneplatten","menge":75,"einheit":"g","hinweis":null},{"name":"körniger Frischkäse","menge":250,"einheit":"g","hinweis":null},{"name":"Skyr","menge":150,"einheit":"g","hinweis":null},{"name":"Käse-Topping","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"Knoblauch","menge":null,"einheit":null,"hinweis":null},{"name":"Oregano","menge":null,"einheit":null,"hinweis":null},{"name":"Basilikum","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hackfleisch scharf anbraten.","Zwiebeln und Champignons dazugeben und mit anrösten.","Passierte Tomaten, Brühe und Gewürze einrühren.","Alles 10–15 Minuten köcheln lassen.","Körnigen Frischkäse mit Skyr und etwas Muskat verrühren.","Abwechselnd Sauce, Protein-Béchamel und Lasagneplatten schichten.","Mit Käse bestreuen.","Bei 180 °C Ober-/Unterhitze ca. 25–30 Minuten backen."]'::jsonb,
  updated_at    = now()
WHERE id = '47e6c16b-5cf2-466d-adaf-89b555045a53';

-- Dürüm Döner mit Hähnchenbrustaufschnitt und Skyr-Soße
UPDATE recipes SET
  titel         = 'Dürüm Döner mit Hähnchenbrustaufschnitt und Skyr-Soße',
  beschreibung  = 'Proteinreicher Dürüm Döner mit gesunder Soße',
  schwierigkeit = 'einfach',
  tags          = ARRAY['highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Dürüm","menge":1,"einheit":"Stück","hinweis":null},{"name":"Hähnchenbrustaufschnitt","menge":150,"einheit":"g","hinweis":null},{"name":"Gurke","menge":100,"einheit":"g","hinweis":null},{"name":"Eisbergsalat","menge":50,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":42,"einheit":"g","hinweis":null},{"name":"Tomate","menge":120,"einheit":"g","hinweis":null},{"name":"Skyr","menge":60,"einheit":"g","hinweis":null},{"name":"Griechischer Joghurt (2%)","menge":40,"einheit":"g","hinweis":null},{"name":"Zaziki Gewürz","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten vorbereiten.","Hähnchenbrustaufschnitt, Gurke, Eisbergsalat, Zwiebel und Tomate in den Dürüm geben.","Soße aus Skyr, griechischem Joghurt und Zaziki Gewürz zubereiten.","Soße über den Dürüm-Inhalt geben und servieren."]'::jsonb,
  updated_at    = now()
WHERE id = '1403e6a3-61e8-478c-aa10-c9219a6ab0fc';

-- Proteinreicher Sattmacher mit Hähnchen und Joghurt
UPDATE recipes SET
  titel         = 'Proteinreicher Sattmacher mit Hähnchen und Joghurt',
  beschreibung  = 'Ein gesundes und proteinreiches Rezept für den Sattmacher mit Hähnchen, Gurke und Joghurt',
  schwierigkeit = 'mittel',
  tags          = ARRAY['lowcarb','highprotein','schnell','mealprep','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchen, Brustfilet, ohne Haut","menge":300,"einheit":"g","hinweis":null},{"name":"Gurke, frisch","menge":400,"einheit":"g","hinweis":null},{"name":"Zwiebel, rot","menge":1,"einheit":"Stück","hinweis":null},{"name":"Essiggurken","menge":50,"einheit":"g","hinweis":null},{"name":"Joghurt 1,5%, natur","menge":400,"einheit":"g","hinweis":null},{"name":"Dill","menge":10,"einheit":"g","hinweis":null},{"name":"Chilipulver","menge":1,"einheit":"g","hinweis":null},{"name":"Salz","menge":2,"einheit":"g","hinweis":null},{"name":"Paprikapulver, rosenscharf","menge":2,"einheit":"g","hinweis":null},{"name":"Zitronensaft","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchen im Airfryer für ca. 12 Minuten bei 180 Grad garen.","Gurke waschen und hobeln.","Zwiebel schälen und in feine Streifen schneiden.","Alles in eine große Schüssel geben.","Jogurtdressing in einer extra Schale anrühren: den Joghurt in die Schale geben.","Essiggurken zerkleinern und mit den Gewürzen dazu geben.","Alles mischen und abschmecken.","Das Dressing darf etwas „zu salzig“ schmecken.","Ebenfalls in die große Schale geben.","Das Hähnchen nach dem Garen zerkleinern, zerschneiden oder zerzupfen und ebenfalls mit dazu geben.","Mit Zitronensaft verfeinern.","Alles vermischen und genießen."]'::jsonb,
  updated_at    = now()
WHERE id = 'f84651cf-33b3-49d9-b483-9ff43e8bccc3';

-- Tex-Mex-Salat
UPDATE recipes SET
  titel         = 'Tex-Mex-Salat',
  beschreibung  = 'Ein kalorienarmer, proteinreicher Salat mit Hackfleisch und mexikanischen Gewürzen',
  schwierigkeit = 'mittel',
  tags          = ARRAY['salat','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hackfleisch","menge":null,"einheit":null,"hinweis":null},{"name":"0,1 %-Joghurt","menge":null,"einheit":null,"hinweis":null},{"name":"Kreuzkümmel","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Paprika edelsüß","menge":null,"einheit":null,"hinweis":null},{"name":"Paprika rosenscharf","menge":null,"einheit":null,"hinweis":null},{"name":"Zitrone","menge":null,"einheit":null,"hinweis":null},{"name":"Salat","menge":null,"einheit":null,"hinweis":null},{"name":"Gurke","menge":null,"einheit":null,"hinweis":null},{"name":"Paprika","menge":null,"einheit":null,"hinweis":null},{"name":"Tomate","menge":null,"einheit":null,"hinweis":null},{"name":"Mais","menge":null,"einheit":null,"hinweis":null},{"name":"Tortilla-Chips","menge":null,"einheit":null,"hinweis":null},{"name":"Kidneybohnen","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hackfleisch mit mexikanischer Gewürzmischung würzen und in der Heißluftfritteuse zubereiten.","Parallel dazu aus 0,1 %-Joghurt, Kreuzkümmel, Salz, Pfeffer, Paprika edelsüb, Paprika rosenscharf und etwas Zitrone ein schnelles Tex-Mex-Dressing anrühren.","Salat, Gurke, Paprika, Tomate und Mais vorbereiten.","Das Hackfleisch dazugeben und einen Teil der Tortilla-Chips unterheben.","Den Rest der Tortilla-Chips als crunchy Topping verwenden."]'::jsonb,
  updated_at    = now()
WHERE id = 'e4fe726b-7a1f-4e34-a27f-92e916fd897b';

-- Cremige Paprika-Karotten-Pasta
UPDATE recipes SET
  titel         = 'Cremige Paprika-Karotten-Pasta',
  beschreibung  = 'Gesunde Pasta mit Karotten, Paprika und Cashew-Creme',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','glutenfrei','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Karotten","menge":250,"einheit":"g","hinweis":null},{"name":"Rote Paprika","menge":200,"einheit":"g","hinweis":null},{"name":"Kirschtomaten","menge":120,"einheit":"g","hinweis":null},{"name":"Weiße Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Knoblauchzehen","menge":3,"einheit":"Stück","hinweis":null},{"name":"Extra Olivenöl","menge":2,"einheit":"EL","hinweis":null},{"name":"Cashews","menge":80,"einheit":"g","hinweis":null},{"name":"Mandelmilch","menge":60,"einheit":"ml","hinweis":null},{"name":"Zitronensaft","menge":2,"einheit":"EL","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"EL","hinweis":null},{"name":"Glutenfreie Pasta","menge":250,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Rosmarin","menge":null,"einheit":null,"hinweis":null},{"name":"Petersilie/Schnittlauch","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Ofen auf 200 Grad Ober/Unterhitze vorheizen.","Karotten, Paprika, Tomaten, Zwiebel und Knoblauch mit Olivenöl, Tomatenmark, Rosmarin, Pfeffer und Salz vermischen.","40 Minuten rösten bis alles weich und leicht karamellisiert ist.","Danach alles zusammen mit Cashews, Mandelmilch und Zitronensaft cremig mixen.","Pasta al dente kochen und ca. 150ml Pastawasser aufbewahren.","Pasta mit der Soße vermischen und Pastawasser hinzufügen, bis die gewünschte Konsistenz erreicht ist.","Am Ende mit etwas Petersilie oder Schnittlauch toppen."]'::jsonb,
  updated_at    = now()
WHERE id = '31aef352-6bea-4853-b97a-0a9c5cd1e0ff';

-- Protein-Kartoffelsalat
UPDATE recipes SET
  titel         = 'Protein-Kartoffelsalat',
  beschreibung  = 'Schneller, sättigender Kartoffelsalat mit viel Eiweiß, perfekt für unterwegs',
  schwierigkeit = 'mittel',
  tags          = ARRAY['snack','mealprep','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Kartoffeln","menge":400,"einheit":"g","hinweis":null},{"name":"Geflügel-Würstchen","menge":4,"einheit":"Stück","hinweis":null},{"name":"Eier","menge":5,"einheit":"Stück","hinweis":null},{"name":"Skyr","menge":100,"einheit":"g","hinweis":null},{"name":"körniger Frischkäse","menge":200,"einheit":"g","hinweis":null},{"name":"Gurkenwasser","menge":50,"einheit":"ml","hinweis":null},{"name":"Sauergurken/Essiggurken","menge":100,"einheit":"g","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Senf","menge":1,"einheit":"EL","hinweis":null},{"name":"Schnittlauch & Kräuter","menge":null,"einheit":null,"hinweis":null},{"name":"Salz & Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Kartoffeln schälen, in kleine Würfel schneiden und in Salzwasser bissfest kochen.","Parallel die Eier hart kochen.","Drei Eier schälen und zusammen mit Skyr, körnigem Frischkäse, Senf, Gurkenwasser, Salz & Pfeffer cremig pürieren.","Kartoffeln abkühlen lassen.","Gurke, Zwiebel und die restlichen Eier klein schneiden.","Alles in eine Schüssel geben: Kartoffeln + Gemüse + Eier + Dressing.","Mit Schnittlauch, Kräutern, Salz & Pfeffer abschmecken."]'::jsonb,
  updated_at    = now()
WHERE id = 'a93814c5-dc37-4f19-99bd-2dcd1aabdd08';

-- Kichererbsen-Curry
UPDATE recipes SET
  titel         = 'Kichererbsen-Curry',
  beschreibung  = 'Schnelles und gesundes Kichererbsen-Curry mit vielen Gewürzen',
  schwierigkeit = 'mittel',
  tags          = ARRAY['vegetarisch','schnell','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Ingwer","menge":50,"einheit":"g","hinweis":null},{"name":"Koriander","menge":7,"einheit":"Stängel","hinweis":null},{"name":"Knoblauchzehen","menge":3,"einheit":"Stück","hinweis":null},{"name":"Olivenöl","menge":20,"einheit":"g","hinweis":null},{"name":"Curry","menge":2,"einheit":"TL","hinweis":null},{"name":"Kreuzkümmel","menge":1,"einheit":"TL","hinweis":null},{"name":"getrockneter Koriander","menge":1,"einheit":"TL","hinweis":null},{"name":"brauner Zucker","menge":20,"einheit":"g","hinweis":null},{"name":"passierte Tomaten","menge":1,"einheit":"Packung","hinweis":null},{"name":"Kokosmilch","menge":400,"einheit":"g","hinweis":null},{"name":"Kichererbsen","menge":1,"einheit":"Glas","hinweis":null},{"name":"Cherrytomaten","menge":200,"einheit":"g","hinweis":null},{"name":"Tomatenmark","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Chili oder Cayennepfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Zwiebel, Ingwer, Koriander und Knoblauchzehen fein hacken oder kurz mixen.","Olivenöl in die Pfanne geben und die Masse 2 Minuten scharf anbraten.","Gewürze dazugeben: Curry, Kreuzkümmel und getrockneter Koriander.","Braunen Zucker, Tomatenmark, passierte Tomaten und Kokosmilch hinzufügen.","Alles 20–25 Minuten köcheln lassen und immer wieder umrühren.","Mit Pfeffer würzen.","Kichererbsen und Cherrytomaten hinzufügen.","Noch mal 7–10 Minuten köcheln lassen."]'::jsonb,
  updated_at    = now()
WHERE id = '143e5164-6897-4b2d-9400-c08f929f8143';

-- Highprotein Thunfisch-Frikadellen
UPDATE recipes SET
  titel         = 'Highprotein Thunfisch-Frikadellen',
  beschreibung  = 'Leckere und proteinreiche Frikadellen aus Thunfisch',
  schwierigkeit = 'einfach',
  tags          = ARRAY['snack','highprotein','mealprep','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Thunfisch im eigenen Saft","menge":160,"einheit":"g","hinweis":null},{"name":"Eier","menge":2,"einheit":"Stück","hinweis":null},{"name":"zarte Haferflocken","menge":60,"einheit":"g","hinweis":null},{"name":"Senf","menge":1,"einheit":"TL","hinweis":null},{"name":"Paprika geräuchert","menge":0.5,"einheit":"TL","hinweis":null},{"name":"gehackte Zwiebel","menge":1,"einheit":"Esslöffel","hinweis":null},{"name":"Paprikastückchen","menge":1,"einheit":"Esslöffel","hinweis":null},{"name":"Mais","menge":1,"einheit":"Esslöffel","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Knoblauchpulver","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten in einer Schüssel gut vermengen, bis eine formbare Masse entsteht.","Mit den Händen kleine Taler oder Frikadellen formen.","Pfanne leicht einfetten und bei mittlerer Hitze von beiden Seiten goldbraun braten."]'::jsonb,
  updated_at    = now()
WHERE id = 'f349d3b4-144f-4be0-ba6a-d733fdf60c5f';

-- Protein Pizza
UPDATE recipes SET
  titel         = 'Protein Pizza',
  beschreibung  = 'Schnelle und gesunde Pizza mit Thunfisch und Gouda',
  schwierigkeit = 'einfach',
  tags          = ARRAY['schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Magerquark","menge":150,"einheit":"g","hinweis":null},{"name":"Mehl","menge":100,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"TL","hinweis":null},{"name":"Pesto","menge":1,"einheit":"TL","hinweis":null},{"name":"passierte Tomaten","menge":50,"einheit":"ml","hinweis":null},{"name":"Thunfisch","menge":60,"einheit":"g","hinweis":null},{"name":"Gouda","menge":50,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Oregano","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten vermischen und bei 200 Grad Umluft für 12 Minuten backen."]'::jsonb,
  updated_at    = now()
WHERE id = '064e7174-6d5f-4388-a1e9-e5826e9f5cab';

-- Hüttenkäse-Crisps
UPDATE recipes SET
  titel         = 'Hüttenkäse-Crisps',
  beschreibung  = 'Proteinreiche Knabberei mit Hüttenkäse und Reibekäse',
  schwierigkeit = 'einfach',
  tags          = ARRAY['snack','schnell','highprotein','lowcarb','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hüttenkäse light","menge":200,"einheit":"g","hinweis":null},{"name":"Reibekäse light","menge":200,"einheit":"g","hinweis":null},{"name":"Haferflocken","menge":30,"einheit":"g","hinweis":null},{"name":"Ei","menge":1,"einheit":"Stück","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Knoblauch","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Alle Zutaten vermischen und im Ofen backen, bis knusprig."]'::jsonb,
  updated_at    = now()
WHERE id = 'c1d85f8c-63ef-4359-9ce3-de1a3546f506';

-- Caesar Salad mit Halloumi und Nudeln
UPDATE recipes SET
  titel         = 'Caesar Salad mit Halloumi und Nudeln',
  beschreibung  = 'Einzigartige Caesar-Salad-Variante mit Halloumi, Nudeln und cremigem Dressing',
  schwierigkeit = 'mittel',
  tags          = ARRAY['salat','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Joghurt","menge":200,"einheit":"g","hinweis":null},{"name":"Worcestershire-Sauce","menge":1,"einheit":"TL","hinweis":null},{"name":"Senf","menge":1,"einheit":"TL","hinweis":null},{"name":"Sardellen","menge":3,"einheit":"Stück","hinweis":null},{"name":"Nudeln","menge":150,"einheit":"g","hinweis":null},{"name":"Romanasalat","menge":3,"einheit":"Köpfe","hinweis":null},{"name":"Halloumi","menge":200,"einheit":"g","hinweis":null},{"name":"Honig","menge":1,"einheit":"TL","hinweis":null},{"name":"Zitronensaft","menge":null,"einheit":null,"hinweis":null},{"name":"Chiliöl","menge":null,"einheit":null,"hinweis":null},{"name":"Olivenöl","menge":null,"einheit":null,"hinweis":null},{"name":"Chili","menge":null,"einheit":null,"hinweis":null},{"name":"Parmesan","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Für das Dressing: Joghurt, Worcestershire-Sauce, Senf, Sardellen, Zitronensaft und Chiliöl glatt verrühren.","Halloumi in Olivenöl goldbraun anbraten, Chili dazugeben und zum Schluss mit Honig glasieren.","Nudeln, Romanasalat, Parmesan und den gebratenen Halloumi auf einen Teller oder in eine große Schüssel geben.","Das Dressing darüber verteilen und alles gründlich vermengen."]'::jsonb,
  updated_at    = now()
WHERE id = 'f2c498fb-e25a-413e-97b5-b576674a71aa';

-- Hähnchen Reis One Pot
UPDATE recipes SET
  titel         = 'Hähnchen Reis One Pot',
  beschreibung  = 'Einfaches One-Pot-Rezept mit Hähnchen, Reis und Gemüse',
  schwierigkeit = 'mittel',
  tags          = ARRAY['onepot','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hähnchenbrustfilet","menge":500,"einheit":"g","hinweis":null},{"name":"Jasminreis","menge":200,"einheit":"g","hinweis":null},{"name":"passierte Tomaten","menge":400,"einheit":"ml","hinweis":null},{"name":"Gemüsebrühe","menge":150,"einheit":"ml","hinweis":null},{"name":"Paprika","menge":300,"einheit":"g","hinweis":null},{"name":"Rote Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stück","hinweis":null},{"name":"Hirtenkäse Light","menge":150,"einheit":"g","hinweis":null},{"name":"Gouda Light gerieben","menge":100,"einheit":"g","hinweis":null},{"name":"Schmand","menge":50,"einheit":"g","hinweis":null},{"name":"Oregano","menge":null,"einheit":null,"hinweis":null},{"name":"Paprikapulver","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hähnchenbrustfilet, Jasminreis, passierte Tomaten, Gemüsebrühe, Paprika, rote Zwiebel, Knoblauchzehe, Hirtenkäse Light, Gouda Light gerieben und Schmand in einen großen Topf geben.","Mit Oregano, Paprikapulver, Salz und Pfeffer würzen.","Alles zusammen köcheln lassen, bis das Hähnchen gar ist und der Reis weich ist."]'::jsonb,
  updated_at    = now()
WHERE id = 'ed6b2ef0-6a2e-4cd9-9227-c02754fa582b';

-- Highprotein Chili Con Carne
UPDATE recipes SET
  titel         = 'Highprotein Chili Con Carne',
  beschreibung  = 'Proteinreiches Chili Con Carne für Diät und Mealprep',
  schwierigkeit = 'mittel',
  tags          = ARRAY['highprotein','lowcal','mealprep','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Rinderhack 5%","menge":400,"einheit":"g","hinweis":null},{"name":"Passierte Tomaten","menge":400,"einheit":"g","hinweis":null},{"name":"Kidneybohnen","menge":125,"einheit":"g","hinweis":null},{"name":"Mais","menge":125,"einheit":"g","hinweis":null},{"name":"Rote Paprika","menge":120,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":65,"einheit":"g","hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"Paprika edelsüß","menge":null,"einheit":null,"hinweis":null},{"name":"Knoblauchpulver","menge":null,"einheit":null,"hinweis":null},{"name":"Chili","menge":null,"einheit":null,"hinweis":null},{"name":"Kreuzkümmel","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hackfleisch scharf anbraten.","Zwiebeln und Paprika dazugeben.","Passierte Tomaten, Bohnen und Mais hinzufügen.","Mit den Gewürzen abschmecken und kurz einkochen lassen."]'::jsonb,
  updated_at    = now()
WHERE id = '6ff06fe3-d8aa-4dea-afb0-25dc49410401';

-- 30-minute Knuspriger Taco Salad
UPDATE recipes SET
  titel         = '30-minute Knuspriger Taco Salad',
  beschreibung  = 'Schnelles und gesundes Taco-Salat-Rezept mit Hühnchen und Gemüse',
  schwierigkeit = 'einfach',
  tags          = ARRAY['salat','schnell','highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Hühnchenbrust","menge":680,"einheit":"g","hinweis":null},{"name":"Gurke","menge":1,"einheit":"Stück","hinweis":null},{"name":"Rote Zwiebel","menge":0.5,"einheit":"Stück","hinweis":null},{"name":"Paprika","menge":2,"einheit":"Stück","hinweis":null},{"name":"Kichererbsen","menge":1,"einheit":"Dose","hinweis":null},{"name":"Mais","menge":1,"einheit":"Tasse","hinweis":null},{"name":"Fettarmer griechischer Joghurt","menge":1.5,"einheit":"Tassen","hinweis":null},{"name":"Taco-Gewürz","menge":1,"einheit":"EL","hinweis":null},{"name":"Limonensaft","menge":1,"einheit":"Stück","hinweis":null},{"name":"Olivenöl","menge":2,"einheit":"TL","hinweis":null},{"name":"Honig","menge":2,"einheit":"TL","hinweis":null},{"name":"Kirschtomaten","menge":null,"einheit":null,"hinweis":null},{"name":"Petersilie","menge":null,"einheit":null,"hinweis":null},{"name":"Salz","menge":null,"einheit":null,"hinweis":null},{"name":"Wasser","menge":null,"einheit":null,"hinweis":null}]'::jsonb,
  zubereitung   = '["Hühnchenbrust in einer Luftfritteuse zubereiten und in kleine Stücke schneiden.","Gurke, Zwiebel, Paprika und Kirschtomaten in kleine Stücke schneiden.","Petersilie hacken.","Kichererbsen und Mais in einer Schüssel vermischen.","Fettarmer griechischer Joghurt, Taco-Gewürz, Limonensaft, Olivenöl und Honig in einer separaten Schüssel vermischen.","Das Dressing über den Salat geben und vermischen.","Mit Salz und Wasser nach Geschmack abschmecken."]'::jsonb,
  updated_at    = now()
WHERE id = 'e9d5e8b5-4462-441e-8328-f4ad2fdcdb57';

-- Highprotein Hackfleisch Pide
UPDATE recipes SET
  titel         = 'Highprotein Hackfleisch Pide',
  beschreibung  = 'Proteinreiche Pide mit Hackfleisch und Dinkelmehl',
  schwierigkeit = 'mittel',
  tags          = ARRAY['highprotein','hauptgericht'],
  kategorie     = ARRAY[]::text[],
  zutaten       = '[{"name":"Dinkelmehl","menge":280,"einheit":"g","hinweis":null},{"name":"Quark","menge":340,"einheit":"g","hinweis":null},{"name":"Backpulver","menge":1,"einheit":"Päckchen","hinweis":null},{"name":"Salz","menge":1,"einheit":"TL","hinweis":null},{"name":"Fettarmes Rinderhackfleisch","menge":400,"einheit":"g","hinweis":null},{"name":"Chiliflocken","menge":0.5,"einheit":"TL","hinweis":null},{"name":"Pfeffer","menge":0.5,"einheit":"TL","hinweis":null},{"name":"Kreuzkümmel","menge":1,"einheit":"TL","hinweis":null},{"name":"Paprika","menge":2,"einheit":"Stück","hinweis":null},{"name":"Zwiebel","menge":1,"einheit":"Stück","hinweis":null},{"name":"Petersilie","menge":1,"einheit":"Handvoll","hinweis":null},{"name":"Tomatenmark","menge":1,"einheit":"EL","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stück","hinweis":null},{"name":"Eigelb","menge":1,"einheit":"Stück","hinweis":null}]'::jsonb,
  zubereitung   = '["Dinkelmehl, Quark, Backpulver und Salz zu einem glatten Teig verkneten und kurz ruhen lassen.","Paprika entkernen, Zwiebel grob schneiden und mit Petersilie, Tomatenmark und Knoblauchzehe in einen Mixer geben und fein mixen.","Die Mischung mit Rinderhackfleisch und Gewürzen vermengen.","Den Teig in 6 gleich große Stücke teilen und länglich ausrollen.","Die Hackfleischmasse mittig darauf verteilen und die Seiten einklappen, sodass die typische Pideform entsteht.","Den Rand mit verquirltem Eigelb bestreichen.","Die Pide bei 200 Grad Umluft ungefähr 15-20 Minuten backen, bis der Rand goldbraun und die Hackfleischfüllung durchgegart ist."]'::jsonb,
  updated_at    = now()
WHERE id = '0d5ae887-cd06-402c-b55b-67e4516f3065';



SELECT COUNT(*) AS aktualisiert FROM recipes WHERE updated_at > now() - interval '1 minute';