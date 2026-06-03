-- SanaMana Recipes Import (2026-05-29T11:34:10.537Z)
-- Total recipes: 24

BEGIN;

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Blumenkohl-Kichererbsen-Curry',
  '["80 g Naturreis","1 Zwiebel (80 g)","1 Knoblauchzehe","1 Daumengroßes Stück Ingwer (10 g)","1/2 Blumenkohl (300 g)","2 Tomaten (200 g)","1 TL Kokosöl (5 g)","1 TL Rote Currypaste (5 g)","Currypulver","200 ml Fettreduzierte Kokosmilch","150 ml Gemüsebrühe","240 g Gekochte Kichererbsen","2 EL Sojasoße (20 ml)","Salz & Pfeffer","Frische Petersilie oder Koriander (optional)","*Tipp: Als zusätzliche Eiweißquelle kannst du zu diesem Curry hervorragend den knusprigen Ofen-Tofu von S. 182 servieren.*"]'::jsonb,
  '1. Reis nach Packungsanweisung kochen.
2. Währenddessen Zwiebel, Knoblauch und Ingwer in kleine Stücke schneiden. Blumenkohl in kleine Röschen schneiden. Tomaten würfeln.
3. Kokosöl in einer großen beschichteten Pfanne oder einem Wok erhitzen. Zwiebeln darin anbraten, dann Knoblauch und Ingwer hinzugeben.
4. Currypaste, Currypulver und einen Schuss Wasser dazugeben und kurz köcheln lassen, damit sich das Aroma gut entfalten kann.
5. Kokosmilch und Gemüsebrühe dazugeben und alles gut verrühren, bis sich die Currypaste komplett aufgelöst hat und die Kokosmilch köchelt.
6. Blumenkohl und Tomaten hinzugeben und für 5–6 Minuten mitköcheln.
7. Kichererbsen abspülen und ins Curry dazugeben. Für weitere 1–2 Minuten köcheln lassen.
8. Curry mit Sojasoße, Salz und Pfeffer abschmecken. Optional mit gehackten frischen Kräutern garnieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Falafel im Brot',
  '["200 g Gekochte Kichererbsen","Frische Petersilie","1/2 Bio-Zitrone (Saft & Abrieb)","1 Knoblauchzehe","Salz & Pfeffer","10 g Vollkorn-Dinkelmehl","1 EL Rapsöl (15 g)","1 Karotte (60 g)","1/4 Rotkohl (100 g)","4 Salatblätter (20 g)","2 Vollkorn-Pitas (140 g)","4 TL Barbecuesoße (20 g)","2 TL Pflanzliche Remoulade (10 g)"]'::jsonb,
  '1. Ofen auf 180°C Ober-/Unterhitze vorheizen.
2. Kichererbsen, Petersilie, Zitronenabrieb, Zitronensaft und Knoblauch mit einem Stabmixer fein pürieren (alternativ einen Standmixer verwenden), mit Salz und Pfeffer abschmecken.
3. Dinkelmehl mit der Kichererbsenmasse vermengen.
4. Aus der Masse 8 Bällchen formen. Mit Rapsöl bepinseln und auf ein mit Backpapier ausgelegtes Backblech legen.
5. Für 15–20 Minuten im Ofen backen, bis sie goldbraun sind.
6. Währenddessen Karotte grob raspeln, Rotkohl in feine Streifen schneiden und den Salat in grobe Streifen schneiden.
7. Pita längs einschneiden und zum Befüllen vorsichtig öffnen. Jeweils die untere Hälfte mit 2 TL Barbecuesoße und die obere Hälfte mit 1 TL Remoulade bestreichen.
8. Mit Salatblättern, Karottenraspeln und Rotkohlstreifen füllen. Je 4 heiße Falafelbällchen hinein legen und warm genießen.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Buchweizen-Spinat-Pfanne',
  '["150 g Buchweizen","450 ml Gemüsebrühe","1 Zwiebel (50 g)","1-2 Knoblauchzehen","200 g Braune Champignons","1 EL Rapsöl (15 g)","200 g Frischer Blattspinat","2 Getrocknete, entsteine Datteln (14 g)","*Tipp: Gesunde Vitalstoffe - Buchweizen ist reich an vielen gesunden Mineralstoffen wie Kalium, Magnesium, Kalzium und Eisen. Auch der Spinat in diesem Rezept liefert dir die zuvor aufgezählten Mineralstoffe und zusätzlich Vitamine der B-Gruppe sowie Vitamin C.*"]'::jsonb,
  '1. Buchweizen mit 400 ml Gemüsebrühe kochen.
2. Zwiebel in Würfel schneiden und Knoblauch hacken. Champignons klein schneiden.
3. Rapsöl in einer Pfanne oder einem Topf erhitzen und die Zwiebel darin andünsten. Champignons dazugeben und für 3–4 Minuten anbraten.
4. Knoblauch, Spinat und die restliche Gemüsebrühe in die Pfanne geben und bei mittlerer Hitze dünsten, bis alles bissfest gar ist.
5. Datteln hacken und in die Pfanne geben.
6. Buchweizen in die Pfanne geben und alles gut verrühren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Seitangeschnetzeltes',
  '["70 g Seitan-Pulver (Glutenmehl)","100 ml Wasser","1 Rote Zwiebel (50 g)","2 Knoblauchzehen","1 EL Tomatenmark (15 g)","2 EL Sojasoße (20 ml)","1 TL Sesamöl (5 g)","Getrockneter Majoran","Geräuchertes Paprikapulver","3 TL Rapsöl (15 g)","Salz & Pfeffer","*Tipp: Als Beilage eignen sich Vollkornreis, Kartoffeln oder Nudeln sehr gut. Probiere das Seitangeschnetzelte auch gerne mal mit Pellkartoffeln und Sauerkraut (S. 132).*"]'::jsonb,
  '1. Seitan-Pulver und Wasser vermengen und ein paar Minuten kräftig kneten. Längeres Kneten sorgt dafür, dass der Seitan später fester wird.
2. Seitan mit einem scharfen Messer in Streifen schneiden.
3. Einen Dampfgareinsatz in einen Kochtopf mit etwas Wasser geben. Seitanstreifen hineingeben und für ca. 30 Minuten dämpfen.
4. Für die Marinade Zwiebeln und Knoblauch fein hacken, mit Tomatenmark, Sojasoße, Sesamöl, Majoran und geräuchertem Paprikapulver vermengen.
5. Seitan trocken tupfen, gegebenenfalls erneut in Streifen schneiden. Seitanstreifen in die Marinade geben und für mindestens 2 Stunden ziehen lassen.
6. Rapsöl in einer Pfanne erhitzen und die Seitanstreifen scharf darin anbraten. Mit Salz und Pfeffer abschmecken.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Pflanzliches Gulasch',
  '["150 g Grobe Sojaschnetzel (Trockengewicht)","1 l Gemüsebrühe","2 Zwiebeln (160 g)","1 Karotte (60 g)","1/4 Sellerieknolle (100 g)","2 Knoblauchzehen","1 EL Pflanzliche Butter (15 g)","2 EL Tomatenmark (30 g)","Edelsüßes Paprikapulver","40 ml Rotwein (optional)","2 Lorbeerblätter","200 g Passierte Tomaten","10 g Zartbitterschokolade (mindestens 80% Kakaoanteil)","Salz & Pfeffer","*Tipp: Zu dem pflanzlichen Gulasch passen alle Beilagen. Neben den klassischen Beilagen wie Nudeln, Reis oder Kartoffeln, kannst du auch Buchweizen, Hirse oder Quinoa als Beilage verwenden.*"]'::jsonb,
  '1. Sojaschnetzel in 500 ml heißer Gemüsebrühe für 10 Minuten einweichen.
2. In der Zwischenzeit Zwiebeln, Karotte und Sellerie in Würfel schneiden und den Knoblauch fein hacken.
3. Sojaschnetzel in einem Sieb ausdrücken, sodass ein Großteil der Flüssigkeit entweicht.
4. Butter in einem Topf erhitzen und Sojaschnetzel darin anbraten. Zwiebeln dazugeben und dünsten.
5. Nach und nach Tomatenmark, Paprikapulver, Karotte, Sellerie und Knoblauch dazugeben und ebenfalls kurz anrösten.
6. Mit den restlichen 500 ml der Gemüsebrühe und optional Rotwein ablöschen. Lorbeerblätter und passierte Tomaten dazugeben und für 30 Minuten auf niedriger Temperatur köcheln lassen.
7. Schokolade hinzugeben, schmelzen lassen und verrühren. Mit Salz und Pfeffer abschmecken.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Italienischer Nudelsalat mit Tomaten-Tofu',
  '["100 g Naturtofu*","1 EL Tomatenmark (15 g)*","1 EL Dunkler Balsamico-Essig (10 ml)*","2 EL Wasser (20 ml)*","Getrockneter Oregano*","Salz & Pfeffer*","150 g Vollkornnudeln (z. B. Fusilli)","50 g Frischer Blattspinat","10 Getrocknete Tomaten (ohne Öl) (20 g)","200 g Kirschtomaten","15 g Pinienkerne","2 Portionen Karottengrün-Pesto (S. 172) (alternativ veganes grünes Pesto)","Getrocknete italienische Kräuter","*Tipp: * Um Zeit zu sparen, kannst du auch bereits marinierten Tofu kaufen und diesen in einer Pfanne anbraten. Zu diesem Nudelsalat passt besonders gut mit Tomaten oder Basilikum marinierter Tofu.*"]'::jsonb,
  '1. Tofu mit den Händen auspressen (dabei tritt Wasser aus und er kann die Marinade besser aufnehmen). In Würfel schneiden.
2. In einer Tupperdose Tomatenmark, Balsamico-Essig, Wasser, Oregano, Salz und Pfeffer vermischen. Tofu hineingeben, Deckel schließen und die Dose schütteln, sodass der Tofu komplett mit der Marinade bedeckt ist. Für 2 Stunden ziehen lassen.
3. Ofen auf 180°C Umluft vorheizen. Ein Backblech mit Backpapier auslegen und den Tofu darauf verteilen. Für 30–35 Minuten backen, dabei ab und zu wenden.
4. Währenddessen Nudeln nach Packungsanweisung kochen, dann in eine große Schüssel geben.
5. Spinat grob zerkleinern, getrocknete Tomaten fein schneiden, Kirschtomaten halbieren. Zusammen mit den Pinienkernen zu den Nudeln geben.
6. Karottengrün-Pesto über dem Nudelsalat verteilen, gut umrühren und mit italienischen Kräutern, Salz und Pfeffer abschmecken.
7. Gebackenen Tofu zum Nudelsalat geben und unterrühren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Kartoffel-Spinat-Auflauf',
  '["500 g Blattspinat (TK)","100 g Grüne Erbsen (TK)","500 g Festkochende Kartoffeln","40 g Cashewkerne","15 g Hefeflocken","1/2 TL Senf (3 g)","Knoblauchpulver","Salz & Pfeffer","20 g Semmelbrösel"]'::jsonb,
  '1. Ofen auf 180°C Ober-/Unterhitze vorheizen.
2. Spinat in einem kleinen Topf auftauen, anschließend in einem Sieb ausdrücken und abtropfen lassen. Erbsen aus dem Eisfach nehmen und antauen lassen.
3. Kartoffeln schälen und in ca. 1 cm dicke Scheiben schneiden. In Salzwasser ca. 10 Minuten bissfest garen (nicht zu weich werden lassen).
4. Alle Kartoffeln bis auf 3–4 Scheiben aus dem Topf nehmen und in eine Auflaufform geben.
5. Cashewkerne zu den verbleibenden Kartoffelstücken in den Topf geben und für 5 Minuten kochen lassen.
6. Cashews, verbleibende Kartoffeln, Hefeflocken, Senf, Knoblauchpulver, Salz, Pfeffer und ca. 50 ml des Kochwassers in einen Standmixer geben (alternativ einen Stabmixer verwenden). Zu einer cremigen Soße pürieren.
7. Spinat und Erbsen in die Auflaufform geben und mit den Kartoffeln vermengen. Soße über den Auflauf geben und umrühren. Mit Semmelbröseln bestreuen.
8. Auflauf für ca. 25 Minuten im Ofen backen.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Wraps mit Räuchertofu-Pilz-Füllung',
  '["1 Rote Zwiebel (80 g)","140 g Braune Champignons","1 TL Rapsöl (5 g)","Salz & Pfeffer","100 g Räuchertofu","40 g Frischer Blattspinat","2 Große runde Vollkorn-Tortillas (ca. 120 g)","40 g Veganer Frischkäse","Frische Petersilie (optional)"]'::jsonb,
  '1. Zwiebel würfeln, Champignons klein schneiden. Zusammen in einer beschichteten Pfanne in Rapsöl anbraten. Mit Salz und Pfeffer abschmecken.
2. Räuchertofu klein würfeln und in die Pfanne dazugeben. Für weitere 3–4 Minuten bei mittlerer Hitze braten.
3. Blattspinat fein hacken und unter die Pilz-Tofu-Mischung rühren.
4. Tortillas mittig durchschneiden.
5. Jede der vier Tortilla-Hälften mit Frischkäse bestreichen. Zur Hälfte mit Pilz-Tofu-Mischung belegen und mittig zusammenklappen.
6. Wraps in einer beschichteten Pfanne von beiden Seiten für jeweils 3–4 Minuten erwärmen.
7. Optional mit Petersilie garnieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Pellkartoffeln mit Sauerkraut und Seitan-Würstchen',
  '["400 g Kartoffeln","1 Zwiebel (80 g)","2 TL Rapsöl (10 g)","2 Lorbeerblätter","5 Wacholderbeeren","200 g Frischkost-Sauerkraut","Salz & Pfeffer","4 Kleine Seitan-Würstchen (200 g) (alternativ 2 Portionen Seitangeschnetzeltes (S. 116))","2 TL Leinöl (10 g)"]'::jsonb,
  '1. Kartoffeln für 15–20 Minuten kochen, bis sie weich sind.
2. In der Zwischenzeit Zwiebel fein würfeln und in einer beschichteten Pfanne in 1 TL Rapsöl anbraten. Lorbeerblätter und Wacholderbeeren hinzugeben und kurz mit anrösten, sodass sich die Aromen entfalten.
3. Sauerkraut hinzugeben und bei schwacher Hitze für maximal 2–3 Minuten erwärmen. Mit Salz und Pfeffer abschmecken. Lorbeerblätter und Wacholderbeeren herausnehmen.
4. In einer zweiten beschichteten Pfanne Seitan-Würstchen in 1 TL Rapsöl anbraten.
5. Kartoffeln pellen (wenn die Schale dünn ist, kannst du sie auch mitessen). Zusammen mit dem Sauerkraut und den Würstchen auf einem Teller anrichten und Leinöl darüber geben.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Herzhafte Maultaschen',
  '["100 g Räuchertofu","1/2 Weißkohl (400 g)","2 Knoblauchzehen","1 Daumengroßes Stück Ingwer (10 g)","4 TL Rapsöl (20 g)","2 EL Sojasoße (20 ml)","1 TL Sesamöl (5 g)","150 g Dinkelmehl (Typ 630)","Salz","60 ml Wasser"]'::jsonb,
  '1. Räuchertofu und Weißkohl in kleine Stücke schneiden. Knoblauch und Ingwer fein hacken.
2. 2 TL Rapsöl in einer Pfanne erhitzen. Weißkohl und Räuchertofu darin scharf anbraten. Knoblauch, Ingwer, Sojasoße und Sesamöl dazugeben und kurz ziehen lassen. Anschließend beiseite stellen.
3. Mehl mit 1/2 TL Salz, Wasser sowie 2 TL Rapsöl vermengen und zu einem festen Teig kneten.
4. Teig auf einer bemehlten Arbeitsfläche ausrollen. Darauf achten, dass der Teig nicht zu dünn ist und sich gut von der Arbeitsfläche lösen lässt.
5. Aus dem Teig Rechtecke von ca. 5 x 12 cm Kantenlänge ausschneiden.
6. Auf je eine Seite eines Teig-Rechtecks 1 TL der Füllung geben und mittig zusammenklappen. Die offenen Seiten fest zusammendrücken (z. B. mit einer Gabel).
7. In einem großen Topf Salzwasser zum Kochen bringen. Die Maultaschen in das Salzwasser geben und so lange kochen, bis sie an der Oberfläche schwimmen (ca. 3–5 Minuten).
8. Kurz abtropfen lassen und nach Belieben servieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Nudeln mit Mangold in Sahnesoße',
  '["180 g Vollkornnudeln (z. B. Penne)","1 Bund Mangold (600 g)","1 Gemüsezwiebel (150 g)","1 TL Rapsöl (5 g)","150 ml Gemüsebrühe","200 ml Sojasahne","Muskatnusspulver","Salz & Pfeffer"]'::jsonb,
  '1. Nudeln nach Packungsanweisung kochen.
2. Den Strunk des Mangolds abschneiden und die einzelnen Blätter trennen. Jeweils am Übergang vom weißen Stil zu den grünen Blättern durchschneiden. Die weißen Teile des Mangold in daumengroße Stücke schneiden.
3. Zwiebel grob würfeln und in einer großen Pfanne in Rapsöl anbraten.
4. Die weißen Mangold-Stücke hinzugeben und kurz mit anbraten.
5. Mit Gemüsebrühe ablöschen und bei geschlossenem Deckel ca. 5 Minuten bei mittlerer Hitze garen.
6. Die grünen Blätter des Mangolds grob in Streifen schneiden. In die Pfanne dazugeben.
7. Sojasahne hinzugeben und alles für weitere 5 Minuten köcheln lassen, bis die weißen Mangold-Stücke weich sind. Mit Muskatnusspulver, Salz und Pfeffer abschmecken.
8. Mangold-Sahnesoße zu den Nudeln servieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Nudeln mit Grünkohl-Pesto',
  '["200 g Vollkornnudeln","50 g Frischer Grünkohl","1 Knoblauchzehe","15 g Pinienkerne","1 EL Olivenöl (15 g)","Salz & Pfeffer","Frisches Basilikum"]'::jsonb,
  '1. Nudeln nach Packungsanweisung kochen.
2. Grünkohl abzupfen und in eine Schüssel mit Wasser geben. Für 2–3 Minuten mit den Händen „massieren“, damit er weicher wird. Das Wasser abgießen und den Grünkohl in einen Standmixer geben (alternativ einen Stabmixer verwenden).
3. Knoblauch, Pinienkerne und Olivenöl zum Grünkohl geben. Eventuell nach Bedarf etwas Wasser hinzugeben.
4. Gut pürieren, bis ein cremiges Pesto entsteht. Mit Salz und Pfeffer abschmecken.
5. Pesto zu den Nudeln servieren. Mit frischem Basilikum garnieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Penne mit Linsen-Bolognese',
  '["1 Zwiebel (80 g)","2 Karotten (120 g)","1 Rote Paprika (150 g)","2 Knoblauchzehen","1 EL Rapsöl (15 g)","100 g Rote Linsen (Trockengewicht)","50 ml Gemüsebrühe","400 g Passierte Tomaten","2-3 Lorbeerblätter","100 g Vollkornnudeln (Penne)","Hefeflocken (optional)"]'::jsonb,
  '1. Zwiebel, Karotten und Paprika in kleine Würfel schneiden, Knoblauch fein hacken.
2. Rapsöl in einem großen Topf erhitzen.
3. Zwiebel im Öl dünsten. Karotten und Paprika nach und nach dazugeben. Kurz den Knoblauch und die Linsen mit anrösten, dann mit Gemüsebrühe ablöschen.
4. Passierte Tomaten und Lorbeerblätter dazugeben und unter gelegentlichem Rühren ca. 15 Minuten köcheln lassen, bis die Linsen weich gekocht sind.
5. Mit Salz und Pfeffer abschmecken.
6. Nudeln nach Packungsanweisung kochen.
7. Nudeln mit der Linsen-Bolognese servieren und optional mit Hefeflocken bestreuen.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Sommerrollen mit Erdnussdip',
  '["40 g Glasnudeln","1/2 Gurke (175 g)","1 Karotte (80 g)","1/2 Rote Paprika (75 g)","150 g Räuchertofu","3 Blätter Romanasalat (30 g)","Frischer Koriander (optional)","6 Blätter rundes Reispapier* (ca. 8 g pro Blatt)","1 Limette (30 ml Saft)","2 EL Sojasoße (20 ml)","1 TL Agavendicksaft (5 g)","40 g Ungesüßtes Erdnussmus"]'::jsonb,
  '1. Glasnudeln nach Packungsanweisung zubereiten.
2. Gurke, Karotte, Paprika, Räuchertofu und Romanasalat in Streifen schneiden, optional Koriander hacken.
3. Einen großen tiefen Teller mit lauwarmem Wasser füllen. Je ein Blatt Reispapier hineinlegen und für 50–60 Sekunden einweichen, dann kurz abtropfen lassen. Mittig mit Glasnudeln, Salat, Gurken, Paprika, Karotten, Räuchertofu und optional Koriander belegen und dann von den Seiten und von unten aus einrollen.
4. Nach und nach alle Sommerrollen füllen und einrollen.
5. Für den Dip Limettensaft, Sojasoße, Agavendicksaft und Erdnussmus in einem Schälchen vermengen.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Pikante Reispfanne',
  '["120 g Naturreis","1 Rote Zwiebel (80 g)","2 Frische rote Chilischoten","1 Rote Paprika (150 g)","1 Gelbe Paprika (150 g)","2 Karotten (120 g)","150 g Frische grüne Bohnen (alternativ TK)","2 TL Rapsöl (10 g)","100 ml Gemüsebrühe","2 EL Sojasoße (20 ml)","Scharfes Paprikapulver","Geräuchertes Paprikapulver","Salz & Pfeffer","Frische Petersilie (optional)"]'::jsonb,
  '1. Reis nach Packungsanweisung kochen.
2. Zwiebel würfeln. Chilischoten halbieren, entkernen und fein hacken (für mehr Schärfe ein paar Kerne behalten).
3. Paprika und Karotten in Streifen schneiden. Grüne Bohnen halbieren.
4. In einer großen beschichteten Pfanne Zwiebeln und Chili bei mittlerer Hitze in Rapsöl anbraten.
5. Karotte, Paprika und Bohnen in die Pfanne geben und kurz mit anbraten. Dann etwas Gemüsebrühe hinzugeben, um das Gemüse für 4–5 Minuten darin zu dünsten.
6. Gekochten Reis dazugeben und alles gut verrühren.
7. Mit Sojasoße, scharfem und geräuchertem Paprikapulver sowie Salz und Pfeffer abschmecken. Optional mit gehackter Petersilie bestreuen.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Kartoffelwürfel mit Pinienkernen und Avocado-Dip',
  '["500 g Festkochende Kartoffeln","1 EL Rapsöl (15 g)","20 g Frischer Rosmarin","Salz & Pfeffer","1 Avocado (160 g)","1 EL Zitronensaft (10 ml)","20 g Pinienkerne"]'::jsonb,
  '1. Ofen auf 170°C Ober-/Unterhitze vorheizen.
2. Kartoffeln schälen und in gleichgroße Würfel schneiden.
3. Eine Backform mit Rapsöl auspinseln und mit Rosmarinnadeln, Salz und Pfeffer bestreuen.
4. Kartoffelwürfel in die Backform geben und leicht salzen.
5. Für 40 Minuten im Ofen backen.
6. In der Zwischenzeit das Fruchtfleisch aus der Avocado lösen und zusammen mit dem Zitronensaft fein pürieren. Mit Salz und Pfeffer abschmecken.
7. Wenn die Kartoffeln goldbraun sind, aus dem Ofen nehmen und mit Pinienkernen bestreuen. Mit Avocadocreme servieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Bunte Superfoods-Bowl',
  '["70 g Quinoa (Trockengewicht)","2 Karotten (120 g)","1/2 Gurke (175 g)","2 Radieschen (30 g)","1/2 Avocado (80 g)","60 g Frischer Blattspinat","100 g Edamame-Bohnen (geschält)","50 g Gekochte Kichererbsen","70 ml Ungesüßter Kokos-Mandel-Drink","2 EL Sojasoße (20 ml)","30 g Ungesüßtes Erdnussmus","2 TL Limettensaft (10 ml)","2 TL Sesam (6 g)","Frische Chilischote (optional)"]'::jsonb,
  '1. Quinoa nach Packungsanweisung kochen.
2. Karotten, Gurke und Radieschen in Scheiben schneiden. Avocado aus der Schale lösen und in Scheiben schneiden.
3. Quinoa, Karotten, Gurke, Radieschen, Spinat, Edamame, Kichererbsen und Avocado kreisförmig in 2 tiefen Tellern anrichten.
4. Für das Dressing Kokos-Mandel-Drink, Sojasoße und Erdnussmus in einem Topf leicht erwärmen und verrühren. Anschließend Limettensaft einrühren.
5. Das Dressing sowie den Sesam über die Bowl geben. Optional Chili darüber geben.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Zwiebelkuchen',
  '["100 g Kalte pflanzliche Butter","200 g Vollkorn-Dinkelmehl","1/2 TL Salz","100 g Kalte pflanzliche Margarine","60 ml Kaltes Wasser","2 Gemüsezwiebeln (350 g)","1 TL Rapsöl (5 g)","200 g Seidentofu*","100 g Ungesüßter Soja-Skyr","1 TL Speisestärke (5 g)","1 TL Kümmel (gemahlen oder ganz)","Salz & Pfeffer"]'::jsonb,
  '1. Mehl und Salz in eine Schüssel geben. Butter in kleinen Stückchen dazugeben. Mit den Händen zu einem Teig kneten. (Dafür ist ein bisschen Geduld gefragt, sobald die Butter weich wird, ist es leichter.) Bei Bedarf nach und nach maximal 60 ml kaltes Wasser dazugeben.
2. Teig für ca. 20 Minuten in den Kühlschrank legen.
3. Ofen auf 200°C Ober-/Unterhitze vorheizen.
4. Währenddessen Zwiebeln in grobe Stücke schneiden. In einer Pfanne in Rapsöl für 4–5 Minuten glasig dünsten.
5. Seidentofu und Soja-Skyr in eine Schüssel geben, Speisestärke hinein sieben. Mit einer Gabel oder einem Schneebesen gut verrühren, bis eine klumpenfreie Creme entsteht. Zwiebeln vorsichtig unter die Masse rühren. Mit Kümmel, Salz und Pfeffer würzen.
6. Teig gleichmäßig auf dem Boden und am Rand einer Springform verteilen. Zwiebel-Füllung hineingeben und glatt streichen.
7. Zwiebelkuchen für ca. 40 Minuten im Ofen backen. Nach der Hälfte der Backzeit die Temperatur auf 180°C reduzieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Mediterraner Kichererbsen-Salat',
  '["120 g Gekochte Kichererbsen","2 Tomaten (120 g)","1 Rote Zwiebel (80 g)","5 Getrocknete Tomaten (ohne Öl) (10 g)","1 Knoblauchzehe (alternativ Knoblauchpulver)","2 TL Zitronensaft (10 ml)","1 TL Olivenöl (5 g)","Getrocknete italienische Kräuter","Salz & Pfeffer","Frische Petersilie","**Tipp: Voller Ballaststoffe**","Kichererbsen sind gute Eiweiß- und Ballaststofflieferanten. Obwohl der Name „Ballaststoffe“ anderes vermuten lässt, sind diese nicht unwichtig, sondern sehr bedeutsam für deinen Körper. Als Richtwert für die Zufuhr von Ballaststoffen empfiehlt die DGE..."]'::jsonb,
  '1. Kichererbsen abspülen und in eine Schüssel geben.
2. Tomaten, rote Zwiebel und getrocknete Tomaten klein schneiden und zu den Kichererbsen geben. Knoblauch fein hacken (oder pressen) und hinzugeben.
3. Zitronensaft, Olivenöl, Kräuter, Salz und Pfeffer über den Salat geben und alles verrühren.
4. Petersilie hacken und den Salat damit garnieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Azukibohnen-Reis-Salat',
  '["2 Frühlingszwiebeln (30 g)","100 g Gekochte Azukibohnen (alternativ Kidneybohnen)","60 g Gekochter Reis","1 TL Olivenöl (5 g)","1/2 Limette (15 ml Saft)","Scharfes Paprikapulver","Salz & Pfeffer","1 Frische rote Chilischote (Nach Geschmack)","*Hinweis: Du kannst diesen Salat beliebig erweitern. Für mehr Frische passt rote Paprika dazu und für eine zusätzliche salzige Komponente grüne oder schwarze Oliven.*"]'::jsonb,
  '1. Frühlingszwiebeln klein schneiden.
2. Bohnen abspülen und mit Reis in eine Schüssel geben.
3. Frühlingszwiebeln dazugeben und verrühren.
4. Olivenöl und Limettensaft darüber geben, mit Paprikapulver, Salz und Pfeffer abschmecken.
5. Chilischote in feine Ringe schneiden (für weniger Schärfe alle Kerne entfernen) und über den Salat geben.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Scharfer Gurkensalat mit Knoblauch',
  '["1 Gurke (350 g)","2 Knoblauchzehen","1 Frische rote Chilischote (Menge nach Belieben)","1 EL Sojasoße (10 ml)","1 TL Geröstetes Sesamöl (5 g)","1 TL Sesam (3 g)","Frischer Koriander (optional)","**Tipp: Hot, Hot, Hot**","Dieser Salat ist im Handumdrehen zubereitet und enthält gleich zwei leckere und bekannte Superfoods: Chili und Knoblauch. Während Chili sehr reich an Vitaminen und Mineralstoffen wie Vitamin C, Kalium und Magnesium ist, enthält Knoblauch viele sekundäre Pflanzenstoffe..."]'::jsonb,
  '1. Gurke längs halbieren und mit einem Löffel die Kerne herauslösen. In Scheiben schneiden und in eine Schüssel geben.
2. Knoblauch fein hacken. Chilischote halbieren, entkernen und fein hacken (für mehr Schärfe ein paar Kerne behalten).
3. Knoblauch, Chili, Sojasoße und Sesamöl über die Gurken geben. Gut umrühren.
4. Salat mit Sesam und optional frischem Koriander garnieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Blumenkohl-Curry-Suppe',
  '["1 Zwiebel (80 g)","2 Knoblauchzehen","1 TL Rapsöl (5 g)","1/2 Blumenkohl (400 g)","1 Apfel (150 g)","700 ml Gemüsebrühe","30 g Weißes Mandelmus","2 TL Currypulver","1/2 TL Zimtpulver","Salz & Pfeffer","30 g Gekochte Kichererbsen","Paprikapulver","Frischer Rucola (optional)","Ungesüßter Sojajoghurt (optional)"]'::jsonb,
  '1. Zwiebel und Knoblauch klein schneiden. Rapsöl in einem großen Topf erhitzen. Zwiebel und Knoblauch darin glasig anbraten.
2. Blumenkohl in Röschen schneiden. Apfel schälen und in Stücke schneiden. Beides in den Topf geben und mit Gemüsebrühe übergießen.
3. Aufkochen und 15 Minuten köcheln lassen.
4. Mandelmus, Curry und Zimt in die Suppe geben.
5. Suppe mit einem Stabmixer fein pürieren. Mit Salz und Pfeffer abschmecken.
6. Kichererbsen mit etwas Paprikapulver mischen und als Topping auf die Suppe geben. Optional außerdem mit Rucola und Sojajoghurt garnieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Indische Linsen-Suppe mit Spinat',
  '["1 Rote Zwiebel (80 g)","2 Knoblauchzehen","1 Daumengroßes Stück Ingwer (10 g)","2 TL Rapsöl (10 g)","120 g Rote Linsen (Trockengewicht)","700 ml Gemüsebrühe","2 Tomaten (200 g)","Kreuzkümmelpulver","Chilipulver","Salz & Pfeffer","100 g Frischer Blattspinat","1/2 Limette (15 ml Saft)*","**Geheimtipp:** Die Limette bringt dir nicht nur geschmacklich einen Mehrwert, das darin enthaltene Vitamin C erhöht auch die Eisenaufnahme aus dem Spinat und den Linsen."]'::jsonb,
  '1. Zwiebel würfeln, Knoblauch und Ingwer fein hacken.
2. Zwiebel in einem Topf in Rapsöl anbraten. Anschließend Knoblauch und Ingwer dazugeben.
3. Linsen hinzufügen und mit Gemüsebrühe ablöschen. Kurz aufkochen und dann bei geschlossenem Deckel für ca. 10 Minuten köcheln lassen.
4. Tomaten würfeln und in den Topf dazugeben. Weitere 5 Minuten köcheln lassen.
5. Mit Kreuzkümmelpulver, Chilipulver, Salz und Pfeffer würzen.
6. Zum Schluss Blattspinat in die Suppe geben und kurz unterrühren, sodass er leicht zerfällt.
7. Vor dem Servieren mit frischem Limettensaft beträufeln.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

INSERT INTO recipes (
  titel,
  zutaten,
  zubereitung,
  zubereitungszeit_min,
  schwierigkeit,
  is_shared,
  created_at,
  updated_at
) VALUES (
  'Waffeln mit heißen Beeren',
  '["300 ml Ungesüßter Mandeldrink","170 g Vollkornmehl","15 g Sojamehl (15 g)*","2 EL Agavendicksaft (30 g)","1 TL Rapsöl (5 g)","200 g Beeren (frisch o. TK)","Gemahlene Vanille","Sojamehl ist dank seiner bindenden Eigenschaft ein guter pflanzlicher Ei-Ersatz. Du bekommst es im Biomarkt oder Reformhaus. Alternativ kannst du Speisestärke verwenden.","**Tipp: Bunte Beerenvielfalt**","Beeren sind heimische Superfoods. Dunkle Beeren wie Heidelbeeren oder Brombeeren haben ca. 10-mal so viele Antioxidantien wie andere Obst- und Gemüsesorten!"]'::jsonb,
  '1. Mandeldrink in eine Rührschüssel geben. Mehl hinzugeben und Sojamehl hinein sieben. Mit einem Schneebesen zu einem klumpenfreien Teig verrühren. 1 EL Agavendicksaft hinzugeben und unterrühren.
2. Teig kurz stehen lassen.
3. Währenddessen ein Waffeleisen auf mittlerer Hitze vorheizen und dünn mit Rapsöl bestreichen.
4. Jeweils 4–5 EL Teig in das Waffeleisen geben; nach und nach 4 Waffeln ausbacken (pro Waffel ca. 5–7 Minuten).
5. Beeren in einen Topf geben, 1 EL Agavendicksaft hinzufügen, gemahlene Vanille hinzugeben und unter Rühren erwärmen.
6. Waffeln mit heißen Beeren servieren.',
  NULL,
  'medium',
  true,
  NOW(),
  NOW()
);

COMMIT;

