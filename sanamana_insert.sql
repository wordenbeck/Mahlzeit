-- SanaMana Recipes Insert
-- Generated: 2026-05-26T08:00:18.382Z

BEGIN;

INSERT INTO recipes (workspace_id, created_by, source, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'sanamana',
  'Blumenkohl-Kichererbsen-Curry',
  'Würziges Curry mit Blumenkohl, Kichererbsen und Kokosmilch auf Reis',
  2,
  30,
  'mittel',
  '{"vegan"}'::text[],
  '[{"name":"Naturreis","menge":80,"einheit":"g","hinweis":null},{"name":"Zwiebel","menge":80,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stück","hinweis":null},{"name":"Ingwer","menge":10,"einheit":"g","hinweis":"daumengroßes Stück"},{"name":"Blumenkohl","menge":300,"einheit":"g","hinweis":"1/2 Kopf"},{"name":"Tomaten","menge":200,"einheit":"g","hinweis":null},{"name":"Kokosöl","menge":1,"einheit":"TL","hinweis":null},{"name":"Rote Currypaste","menge":1,"einheit":"TL","hinweis":null},{"name":"Currypulver","menge":null,"einheit":"nach Geschmack","hinweis":null},{"name":"Kokosmilch","menge":200,"einheit":"ml","hinweis":"fettreduziert"},{"name":"Gemüsebrühe","menge":150,"einheit":"ml","hinweis":null},{"name":"Kichererbsen","menge":240,"einheit":"g","hinweis":"gekocht"},{"name":"Sojasoße","menge":2,"einheit":"EL","hinweis":null}]'::jsonb,
  '["Reis nach Packungsanweisung kochen.","Zwiebel, Knoblauch und Ingwer in kleine Stücke schneiden. Blumenkohl in Röschen schneiden. Tomaten würfeln.","Kokosöl in großer Pfanne erhitzen. Zwiebeln anbraten, dann Knoblauch und Ingwer hinzufügen.","Currypaste, Currypulver und etwas Wasser dazugeben und köcheln lassen.","Kokosmilch und Gemüsebrühe dazugeben und verrühren bis Currypaste gelöst ist.","Blumenkohl und Tomaten hinzugeben und 5-6 Minuten mitköcheln.","Kichererbsen abspülen, hinzugeben und 1-2 Minuten köcheln lassen.","Mit Sojasoße, Salz und Pfeffer abschmecken."]'::jsonb,
  '{"vegan","curry","superfood"}'::text[],
  0.95::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'sanamana',
  'Nudeln mit Grünkohl-Pesto',
  'Vollkornnudeln mit cremigem Grünkohl-Pesto aus Pinienkernen',
  2,
  25,
  'einfach',
  '{"vegan"}'::text[],
  '[{"name":"Vollkornnudeln","menge":200,"einheit":"g","hinweis":null},{"name":"Frischer Grünkahl","menge":50,"einheit":"g","hinweis":null},{"name":"Knoblauchzehe","menge":1,"einheit":"Stück","hinweis":null},{"name":"Pinienkerne","menge":15,"einheit":"g","hinweis":null},{"name":"Olivenöl","menge":1,"einheit":"EL","hinweis":null},{"name":"Salz","menge":null,"einheit":"nach Geschmack","hinweis":null},{"name":"Pfeffer","menge":null,"einheit":"nach Geschmack","hinweis":null},{"name":"Frisches Basilikum","menge":null,"einheit":"nach Bedarf","hinweis":null}]'::jsonb,
  '["Nudeln nach Packungsanweisung kochen.","Grünkahl abzupfen und 2-3 Minuten in Wasser massieren bis weicher. Wasser abgießen.","Grünkahl in Standmixer geben mit Knoblauch, Pinienkernen und Olivenöl.","Gut pürieren bis cremiges Pesto entsteht. Bei Bedarf etwas Wasser hinzufügen.","Mit Salz und Pfeffer abschmecken.","Pesto zu Nudeln servieren und mit Basilikum garnieren."]'::jsonb,
  '{"vegan","high-protein","schnell"}'::text[],
  0.95::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'sanamana',
  'Penne mit Linsen-Bolognese',
  'Vollkorn-Penne mit würziger Linsen-Bolognese aus roten Linsen',
  2,
  30,
  'einfach',
  '{"vegan"}'::text[],
  '[{"name":"Zwiebel","menge":80,"einheit":"g","hinweis":null},{"name":"Karotten","menge":120,"einheit":"g","hinweis":"2 Stück"},{"name":"Rote Paprika","menge":150,"einheit":"g","hinweis":null},{"name":"Knoblauchzehen","menge":2,"einheit":"Stück","hinweis":null},{"name":"Rapsöl","menge":1,"einheit":"EL","hinweis":null},{"name":"Rote Linsen (Trockengewicht)","menge":100,"einheit":"g","hinweis":null},{"name":"Gemüsebrühe","menge":50,"einheit":"ml","hinweis":null},{"name":"Passierte Tomaten","menge":400,"einheit":"g","hinweis":null},{"name":"Lorbeerblätter","menge":2,"einheit":"Stück","hinweis":null},{"name":"Vollkornnudeln (Penne)","menge":100,"einheit":"g","hinweis":null},{"name":"Hefeflocken","menge":null,"einheit":"optional","hinweis":null}]'::jsonb,
  '["Zwiebel, Karotten und Paprika in Würfel schneiden. Knoblauch fein hacken.","Rapsöl in großem Topf erhitzen.","Zwiebel dünsten. Karotten und Paprika nach und nach hinzufügen. Knoblauch und Linsen anrösten.","Mit Gemüsebrühe ablöschen. Passierte Tomaten und Lorbeerblätter hinzufügen.","Ca. 15 Minuten köcheln lassen bis Linsen weich sind. Mit Salz und Pfeffer abschmecken.","Nudeln nach Packungsanweisung kochen.","Nudeln mit Linsen-Bolognese servieren. Optional mit Hefeflocken bestreuen."]'::jsonb,
  '{"vegan","high-protein","ballaststoffreich"}'::text[],
  0.95::float,
  '{}'::text[]
);
INSERT INTO recipes (workspace_id, created_by, source, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, zutaten, zubereitung, tags, ai_confidence, ai_warnings)
VALUES (
  'e7f25de4-4fce-4aba-b1ce-70f9fe20f47d'::uuid,
  '462f7093-97ae-42c9-9529-a33155760ae5'::uuid,
  'sanamana',
  'Sommerrollen mit Erdnussdip',
  'Vietnamesische Sommerrollen mit Glasnudeln, Gemüse und Räuchertofu',
  2,
  25,
  'mittel',
  '{"vegan"}'::text[],
  '[{"name":"Glasnudeln","menge":40,"einheit":"g","hinweis":null},{"name":"Gurke","menge":175,"einheit":"g","hinweis":"1/2 Stück"},{"name":"Karotte","menge":80,"einheit":"g","hinweis":null},{"name":"Rote Paprika","menge":75,"einheit":"g","hinweis":"1/2 Stück"},{"name":"Räuchertofu","menge":150,"einheit":"g","hinweis":null},{"name":"Romanasalat","menge":30,"einheit":"g","hinweis":"3 Blätter"},{"name":"Frischer Koriander","menge":null,"einheit":"optional","hinweis":null},{"name":"Reispapier","menge":6,"einheit":"Blätter","hinweis":"rundKaliber, ~8g pro Blatt"},{"name":"Limette","menge":30,"einheit":"ml","hinweis":"Saft"},{"name":"Sojasoße","menge":2,"einheit":"EL","hinweis":null},{"name":"Agavendicksaft","menge":1,"einheit":"TL","hinweis":null},{"name":"Erdnussmus (ungesüßt)","menge":40,"einheit":"g","hinweis":null}]'::jsonb,
  '["Glasnudeln nach Packungsanweisung zubereiten.","Gurke, Karotte, Paprika, Räuchertofu und Romanasalat in Streifen schneiden. Koriander optional hacken.","Großen Teller mit lauwarmem Wasser füllen. Reispapier 50-60 Sekunden einweichen, abtropfen lassen.","Mittig mit Glasnudeln, Salat, Gemüse, Räuchertofu und optional Koriander belegen. Von Seiten und unten einrollen.","Alle Sommerrollen füllen und einrollen.","Für Dip: Limettensaft, Sojasoße, Agavendicksaft und Erdnussmus vermengen."]'::jsonb,
  '{"vegan","schnell","asiatisch"}'::text[],
  0.92::float,
  '{}'::text[]
);

COMMIT;
