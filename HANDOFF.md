# Mahlzeit — HANDOFF

> Letzte Aktualisierung: 2026-06-10
> Status: **Produktionsreif für Testnutzung im Haushalt**

## 📄 Aktive Docs (immer aktuell halten)

| Datei | Wann aktualisieren |
|---|---|
| `HANDOFF.md` | Jede Session — Stand, Bugs, Backlog, Pitfalls |
| `CLAUDE.md` | Bei neuen Arbeitsregeln, Conventions, Gotchas |
| `mockups/DESIGN-DECISIONS.md` | Bei verbindlichen Design-Entscheidungen |
| `PROJECT-SPEC.md` | Bei Architektur-Änderungen (seltener) |

Archiviert (nicht mehr pflegen): `.archive/`

---

## 🚀 App & Infra

- **URL:** https://mahlzeit123.vercel.app (NICHT mahlzeit.vercel.app = fremde SvelteKit-App!)
- **Repo:** https://github.com/wordenbeck/Mahlzeit
- **Lokal:** `/Users/thomaswordenbeck/Claude Code/CodingDojo/MealPlanner`
- **Deploy:** Vercel Auto-Deploy bei Push auf `main`
- **Build:** `vite build` (nicht `tsc -b && vite build` — TS-Fehler blockieren sonst Deploy)
- **Typecheck separat:** `npm run typecheck`
- **Supabase:** https://oaaxmpbnpntimzbieifv.supabase.co
- **Edge Functions:** `supabase functions deploy <name>` separat

---

## 📱 Tech Stack

- React + TypeScript + Vite + Supabase (Anonymous Auth + RLS) + Groq (llama-3.3-70b)
- Vanilla CSS (keine Tailwind/UI-Libs) — Design-Tokens in `src/styles/tokens.css`
- vite-plugin-pwa (generateSW + autoUpdate + share-handler.js)
- Vercel Edge Functions in `/api/` (TypeScript, `export const config = { runtime: 'edge' }`)

---

## ✅ Was in dieser Session fertig wurde

### Features
- **Bulk-Import Auto-Retry** — Rate-Limit-Fehlermeldung parsen, Countdown-Anzeige, bis zu 5 Versuche
- **Bring-Export** — `/api/bring.ts` Edge Function mit schema.org JSON-LD; `window.location.href` statt `window.open` (kein leerer Tab auf iOS)
- **Liste: Eingekauft-Sektion** — abgehakte Items in aufklappbarem Bereich, localStorage-Persistenz mit Tages-Key (Auto-Clear nach 1 Tag)
- **Liste: Einkaufswagen leeren** — alle Items auf einmal abhaken
- **Einkauf: Variante B Zutat-Layout** — `[✓] Name · Menge`, Grid `16px / 1fr / 80px`, ✓ blendet sich ein ohne Layout-Shift
- **Einkauf: Gewürze in Liste** — erscheinen jetzt, "nach Geschmack" in qty-Zelle gefiltert
- **Einkauf: Portion einfrieren** — disabled+ausgegraut wenn alle Zutaten abgehakt
- **Einkauf: "Einkauf erledigt"** — `<span>` statt `<Link>`, nicht klickbar, dezentes Hellgrün
- **Plan: Favoriten-Filter** — Stern-Button grün gefüllt
- **Heute: Hero-Glow** — pulsierender grüner Glow wenn Rezept heute geplant
- **Responsive Pass** — alle Seiten: iPhone / Tablet (768px) / Desktop (1100px) sauber getrennt
  - Plan: Wochentage als Sidebar links, Bibliothek rechts
  - Einkauf: 2-Spalten auf Tablet, 5 Tage nebeneinander auf Desktop, Tabs ausgeblendet ab 1100px
  - Heute: Hero + Tiles nebeneinander
  - Rezepte: größere Cards, mehr Padding
- **AppMenu:** `ClipboardPlus` Icon für Import, kein losgelöster `+` Button mehr

---

## 🐛 Bekannte Bugs (nicht kritisch)

- **Plan-Grid asymmetrisch** — „links nicht so breit wie rechts", tritt oft nach Import auf. Vermutlich `auto-fill minmax(200px, 1fr)` und ein breites Card-Element zieht die Spalte. Nicht analysiert, nicht deployed-Fix.

## ✅ Fixes dieser Session (2026-06-10)

- **Volltextsuche** — Zutaten + Beschreibung durchsuchbar
- **Koch-Modus** — `/rezepte/:id/kochen`, Timeline, Dark/Light, Timer, Nav fix
- **Excel-Export + Import-Script** — Profil-Seite, `scripts/import-from-excel.mjs`
- **Datenbereinigung** — 120 Rezepte bereinigt, 8 gelöscht (6 Duplikate + 2 Nicht-Rezepte)
- **Cleaning-Script** — `scripts/clean-recipes-local.mjs` (regelbasiert, kein API-Key nötig)
- **DB-Schema dokumentiert** — `text[]` vs `jsonb` in CLAUDE.md + HANDOFF.md
- **SQL-Pitfall** — SELECT nie in der Mitte von Delete-Scripts

## ⚠️ Pitfalls (neu gelernt)

- **`tags`/`kategorie` = `text[]`** → `ARRAY['vegan','schnell']`, NICHT `'[...]'::jsonb`
- **SELECT nicht in der Mitte von Delete-Scripts** — immer ans Ende, sonst wird der Rest übersehen
- **Filesystem: nur innerhalb CodingDojo schreiben** — nie Desktop/Downloads/Documents

---

## 📋 Priorisierter Backlog (Stand 2026-06-09)

### ✅ Erledigt diese Session
- Volltextsuche (Zutaten + Beschreibung)
- Koch-Modus (Timeline, Dark/Light, Timer, Nav fix)
- Excel-Export + Import-Script
- Gewürze in Einkaufsliste + Sortierung in Detail

### 1 — Bulk-Import Serverside
Bulk-Import läuft aktuell im Browser (iPhone muss wach bleiben). Supabase Edge Function würde das serverside laufen lassen — User startet Import, kann App schließen.

### 2 — KI-Scraping (Serverside)
Serverside Job der periodisch Instagram-Accounts / Chefkoch / andere Quellen crawlt und Rezepte importiert. Aufwand: groß (Edge Function + Cron + Scraping-Proxy).

### 3 — Nährwerte / Makros
Kalorien/Makros pro Rezept aus Zutaten berechnen. Braucht Nährwert-Datenbank (z.B. OpenFoodFacts API). Aufwand: groß.

### 4 — Magic Fill
Woche automatisch füllen per KI aus vorhandenen Rezepten:
- Basis: `recipe_history` (was wann gekocht) + `recipe_ratings` (Sterne)
- Wochentag-Präferenzen (Di = schnell, Sa = aufwendig)
- KI wählt nur aus vorhandenen Rezepten → keine Halluzinationen
- Button „✨ Woche füllen" auf Plan-Seite

### 5 — Rezept-Vorschläge
„Weil dir X gefallen hat", „Diese Woche noch nicht gehabt", saisonal.

### 6 — Bildersuche
Automatische Bildsuche für Rezepte ohne Bild (z.B. Openverse, Unsplash).

### 7 — Kategorien in Einkaufsliste
Zutaten in der Einkaufsliste gruppiert nach Kategorie (Gemüse / Fleisch / Milch / Gewürze…).

---

## 🏗️ Architektur-Entscheidungen (verbindlich)

- **Kein Login-Dialog** — Anonymous Auth + Workspace-Code + PIN
- **Kein Tailwind, keine UI-Libs** — Vanilla CSS mit Design-Tokens
- **Build = `vite build`** — kein `tsc -b` im Build-Schritt
- **Breakpoints:** `< 640px` = iPhone, `768px+` = Tablet, `1100px+` = Desktop
- **Icon-System:** ClipboardPlus=Import, Bookmark=Favorit, UtensilsCrossed=gekocht, Star=Rating, Pencil=Edit
- **Sticky Sub-Header:** `top: 36px` (unter ~36px AppMenu)
- **`overflow-x: hidden`** auf Page-Containern BRICHT sticky — nie setzen

---

## 🗄️ DB-Schema Gotchas

- `zutaten` = `jsonb` Array von `{name, menge, einheit, hinweis}`
- `zubereitung` = `jsonb` Array von Strings (ohne Nummern)
- `schwierigkeit` = `'einfach' | 'mittel' | 'aufwendig'` (NICHT englisch)
- RLS aktiv — Insert via Anon-Key nur mit workspace_id + created_by
- Basis-IDs: `workspace_id = e7f25de4-...`, `created_by = 39b427ea-...`

---

## 📁 Wichtige Dateien

| Datei | Inhalt |
|---|---|
| `src/styles/tokens.css` | Design-Tokens (Farben, Spacing, Radii) |
| `mockups/DESIGN-DECISIONS.md` | Verbindliche Design-Entscheidungen |
| `mockups/design-system.html` | Visuelles Design-System |
| `api/bring.ts` | Vercel Edge Fn: JSON-LD für Bring-Export |
| `src/lib/weekplan.ts` | Wochenplan-Logik + ShoppingItem-Konsolidierung |
| `src/lib/recipes.ts` | CRUD für Rezepte |
| `src/lib/prompts/recipeParserPrompt.ts` | Groq System-Prompt + Few-Shots |
| `supabase/functions/import-recipe-from-url/` | Edge Fn: Insta-oEmbed + LLM-Parser |
| `public/share-handler.js` | Web-Share-Target Handler (importiert in SW) |

---

## 🗃️ Column Types — IMMER prüfen vor SQL-Generierung

| Spalte | Typ | SQL-Syntax |
|---|---|---|
| `tags` | `text[]` | `ARRAY['vegan','schnell']` oder `ARRAY[]::text[]` |
| `kategorie` | `text[]` | `ARRAY['mittag']` oder `ARRAY[]::text[]` |
| `zutaten` | `jsonb` | `'[{"name":"...","menge":1,"einheit":"g","hinweis":null}]'::jsonb` |
| `zubereitung` | `jsonb` | `'["Schritt 1","Schritt 2"]'::jsonb` |
| `schwierigkeit` | `text` | `'einfach'` / `'mittel'` / `'aufwendig'` |
| `recipe_type` | `text` | `'hauptgericht'` etc. |

**Nie raten — immer zuerst:**
```
curl "$URL/rest/v1/recipes?select=*&limit=1" -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
```

---

## 🗃️ DB-State (Stand 2026-06-10)

| Was | Wert |
|---|---|
| Rezepte gesamt | 120 (nach Bereinigung: 6 Duplikate + 2 Nicht-Rezepte gelöscht) |
| Workspace ID | `e7f25de4-4fce-4aba-b1ce-70f9fe20f47d` |
| Created-by ID | `39b427ea-645c-4845-89a6-1c5a591aba17` |
| Bilder | ~80% haben `bild_url` (Supabase Storage + externe URLs) |

**Gelaufene Migrations (alle applied):**
- `20260508120000_initial_schema.sql` — Basis-Schema
- `20260605120000_fix_empty_name_einheit.sql` — Avocado-als-Einheit Bug fix
- `20260605140000_profiles_pin.sql` — `profiles.pin` Spalte hinzugefügt

---

## 🖼️ Mockup-Dateien

| Datei | Was zeigt sie |
|---|---|
| `mockups/design-system.html` | Tokens, Farben, Komponenten-Referenz |
| `mockups/DESIGN-DECISIONS.md` | Verbindliche Entscheidungen (immer lesen vor neuer Seite) |
| `mockups/edit-mock.html` | Rezept-Edit 3 Varianten (A gewählt + umgesetzt) |
| `mockups/einkauf-zutat-mock.html` | Einkauf Zutatenzeile 3 Varianten (B gewählt + umgesetzt) |
| `mockups/detail-banner-mock.html` | Rezept-Detail Banner-Hero |
| `mockups/plan-mock.html` | Plan-Seite |
| `mockups/rezepte-mock.html` | Rezepte-Seite |
| `mockups/einkauf-mock.html` | Einkauf-Seite |
| `mockups/liste-mock.html` | Einkaufsliste |
| `mockups/profil-final.html` | Profil-Seite |

---

## 📅 Letzte 5 Entscheidungen (mit Datum)

| Datum | Entscheidung |
|---|---|
| 2026-06-09 | Einkauf Zutatenzeile: Variante B (`[✓] Name · Menge`), Häkchen als opacity-Transition |
| 2026-06-09 | Responsive Breakpoints verbindlich: 640 / 768 / 1100px |
| 2026-06-09 | Bring-Export: `window.location.href` statt `window.open()` (kein leerer Tab iOS) |
| 2026-06-09 | „Einkauf erledigt" = `<span>` nicht `<Link>`, dezentes Hellgrün |
| 2026-06-09 | Bulk-Import: serverside on hold, user macht das 1-3x im Leben, reicht so |

---

## 💡 Pitfalls (aus langen Debugging-Sessions)

1. **Falscher Vercel-URL** — mahlzeit.vercel.app ≠ unsere App. Immer mahlzeit123.vercel.app testen.
2. **TS-Fehler blocken Deploy** — Build auf `vite build` umgestellt, `tsc -b` separat.
3. **Supabase-Types veraltet** — Viele `never[]` Fehler in TypeCheck, ignorieren für Build.
4. **`overflow-x: hidden`** auf Container bricht `position: sticky` von Kind-Elementen.
5. **iOS PWA + `window.open()`** = leerer Safari-Tab. Stattdessen `window.location.href`.
6. **Bring-Deeplink** braucht `source=web` Parameter + URL-encoded inner URL.
7. **`auto-fill` vs `auto-fit`** in CSS Grid: `auto-fill` erzeugt leere Tracks, `auto-fit` nicht.
