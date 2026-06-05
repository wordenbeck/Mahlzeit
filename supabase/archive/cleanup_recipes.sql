-- Cleanup: Duplikate + Müll entfernen
BEGIN;

-- Duplikate (vollständigstes je Gruppe behalten):
DELETE FROM recipes WHERE id = '7fdde2c7-12cb-4e9c-9e59-93740a159520'; -- dup von "Schokoladen Brownies ohne Zucker und Meh"
DELETE FROM recipes WHERE id = 'cd567756-3aa7-47d0-8d82-6c33eb29a427'; -- dup von "Low Calorie Chips"
DELETE FROM recipes WHERE id = 'e96a20d8-bb08-45f1-af2e-e90c49d5e925'; -- dup von "Rote Linsen Pizza"
DELETE FROM recipes WHERE id = '388a0de1-bb16-4c66-8dd0-613c2df6cccb'; -- dup von "Veganer High Protein Crunch Wrap"
DELETE FROM recipes WHERE id = '90d11fee-e79d-414e-bf0a-94c876d39ec9'; -- dup von "Veganer High Protein Crunch Wrap"
DELETE FROM recipes WHERE id = 'd0415f78-35ca-47b0-b002-3ea38ac575f4'; -- dup von "Knuspriger Kartoffel Döner Salat🥗🥙"
DELETE FROM recipes WHERE id = '7998d810-3fac-4056-9074-5ee108ccdb04'; -- dup von "Vegane Bohnen-Burger"
DELETE FROM recipes WHERE id = '87007b93-4774-4c58-92f9-3e33fd6b2006'; -- dup von "Vegane Bohnen-Burger"
DELETE FROM recipes WHERE id = 'b337e9cf-0290-4686-b604-9c58f0e9af9a'; -- dup von "Testo Spaghetti"

-- Reiner Müll (kein verwertbares Rezept):
DELETE FROM recipes WHERE id = '05493fe2-fdb4-492e-8570-f96154f80070'; -- "Crunchy Tuna Salat😮‍💨"
DELETE FROM recipes WHERE id = '14fce6ae-2aa8-4958-a58a-24e012f7e078'; -- "anzeige 🌯 Ich liebe LahmacunAber es gib"
DELETE FROM recipes WHERE id = '6d864cb2-1520-40b3-a320-aad382c85ef3'; -- "Bulking Hackfleisch Nudelplanne für den "

COMMIT;
