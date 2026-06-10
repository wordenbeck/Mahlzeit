-- Duplikate löschen — generiert am 2026-06-10
-- 6 Rezepte, jeweils das neuere/schlechtere Exemplar

-- 1. Schokoladen-Brownies (gleiche Instagram-URL)
DELETE FROM recipes WHERE id = '910018fd-fba1-4204-b95a-e5136f3a1fd2';

-- 2. Caesar Salad mit Halloumi (gleiche Instagram-URL)
DELETE FROM recipes WHERE id = '05842474-881e-4e14-8dc1-1d5cb85c6c28';

-- 3. Hähnchen Reis One Pot (gleiche Instagram-URL)
DELETE FROM recipes WHERE id = '9a27a9dc-3167-42fe-af56-eecf287d2432';

-- 4. "Einfach, gesund und so SAFTIG. Schokoladen Brownies..." (identische Zutaten wie 0fc3fd1f)
DELETE FROM recipes WHERE id = 'fa11bc43-4645-43f8-9a1d-801ddf658682';

-- 5. "Wer würde? POM Döner..." (identische Zutaten + Zubereitung wie 7d74f307)
DELETE FROM recipes WHERE id = '967103d3-04de-433c-870e-32a58cfcade6';

-- 6. "Rezept 20/100 - Big Mac Kartoffelsalat" (gleiche Zutaten wie d81b7eff)
DELETE FROM recipes WHERE id = '036b24a0-2eaa-4ab8-a571-29dbc80fb4aa';

-- Kontrolle: sollten jetzt 122 Rezepte übrig sein
SELECT COUNT(*) AS verbleibende_rezepte FROM recipes;

-- Kein-Rezept-Einträge löschen (reine Instagram-Captions, keine Zutaten/Schritte)
DELETE FROM recipes WHERE id = '18bde451-8307-4838-9491-2d8fc4cd88af';
DELETE FROM recipes WHERE id = '21f52971-5102-46a1-906e-13bb87c1ff8d';
