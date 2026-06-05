-- Re-Fetch volle IG-Captions → Zutaten + Zubereitung
BEGIN;

UPDATE recipes SET zutaten = '[{"name":"2 Avocados","menge":null,"einheit":null,"hinweis":null},{"name":"2 Zehen Knoblauch","menge":null,"einheit":null,"hinweis":null},{"name":"100g Babyspinat","menge":null,"einheit":null,"hinweis":null},{"name":"1 EL Frischkäse Light","menge":null,"einheit":null,"hinweis":null},{"name":"1 EL Olivenöl","menge":null,"einheit":null,"hinweis":null},{"name":"200g Edamame Spaghetti","menge":null,"einheit":null,"hinweis":null},{"name":"Salz, Pfeffer","menge":null,"einheit":null,"hinweis":null},{"name":"30g Parmesan","menge":null,"einheit":null,"hinweis":null}]'::jsonb, source_caption_raw = '"TESTO SPAGHETTI sind ein Bi⚡️tzrezept für den schnellen Feierabend! Würdest du sie testen? 🤔 so gehts ⤵️

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

👉🏼Du würdest mir einen riesen Gefallen tun, wenn dir das Video gefällt es mit deinen Freunden zu teilen, zu kommentieren oder einen 👍🏼 da zu lassen! Danke ❤️
#highprotein #nudeln #muskelaufbau #fitnessrezepte". ', updated_at = NOW() WHERE id = '77a2dfb4-074c-467b-9b13-97edfd2cc4ea';

COMMIT;
