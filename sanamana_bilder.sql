-- SanaMana Bild-URLs verknüpfen + temp Upload-Policy entfernen
BEGIN;

UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/01.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Zwiebelkuchen';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/02.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Bunte Superfoods-Bowl';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/03.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Kartoffelwürfel mit Pinienkernen und Avocado-Dip';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/04.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Pikante Reispfanne';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/05.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Sommerrollen mit Erdnussdip';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/06.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Penne mit Linsen-Bolognese';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/07.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Nudeln mit Grünkohl-Pesto';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/08.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Nudeln mit Mangold in Sahnesoße';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/09.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Herzhafte Maultaschen';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/10.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Pellkartoffeln mit Sauerkraut und Seitan-Würstchen';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/11.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Wraps mit Räuchertofu-Pilz-Füllung';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/12.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Kartoffel-Spinat-Auflauf';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/13.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Italienischer Nudelsalat mit Tomaten-Tofu';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/14.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Pflanzliches Gulasch';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/15.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Seitangeschnetzeltes';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/16.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Buchweizen-Spinat-Pfanne';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/17.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Falafel im Brot';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/18.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Blumenkohl-Kichererbsen-Curry';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/19.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Mediterraner Kichererbsen-Salat';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/20.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Azukibohnen-Reis-Salat';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/21.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Scharfer Gurkensalat mit Knoblauch';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/22.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Blumenkohl-Curry-Suppe';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/23.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Indische Linsen-Suppe mit Spinat';
UPDATE recipes SET bild_url = 'https://oaaxmpbnpntimzbieifv.supabase.co/storage/v1/object/public/recipe-images/e7f25de4-4fce-4aba-b1ce-70f9fe20f47d/sanamana/24.jpg', updated_at = NOW() WHERE source = 'sanamana' AND titel = 'Waffeln mit heißen Beeren';

-- Sicherheit: temporäre Upload-Policy wieder entfernen
drop policy if exists "temp_anon_upload" on storage.objects;

COMMIT;
