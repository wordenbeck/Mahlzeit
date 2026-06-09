# Mahlzeit — HANDOFF

> Letzte Aktualisierung: 2026-06-09
> Status: **Produktionsreif für Testnutzung im Haushalt**

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

---

## 📋 Priorisierter Backlog

### 1 — Volltextsuche
Suche über Zutaten + Beschreibung (aktuell nur Titel + Tags). Einfach in `listRecipes()` + Supabase `ilike` oder clientseitiger Filter.

### 1.5 — Koch-Modus
Wenn User via Heute → "Jetzt kochen" kommt:
- Zuerst: Zutaten-Checkliste (aus dem geplanten Rezept, mit Portionsanpassung)
- Dann: Schritt-für-Schritt-View (eine Karte pro Zubereitungsschritt, swipeable)
- iPad-first, großer Text, Hände-frei
- Einstieg: von `Heute`-Hero-Karte, Button "Jetzt kochen" → `/rezepte/:id/kochen`

### 2A — KI-Scraping (Serverside)
Statt User gibt URLs ein: Serverside Job der periodisch Instagram-Accounts / Chefkoch / andere Quellen crawlt und Rezepte importiert. Aufwand: groß (Edge Function + Cron + evtl. Scraping-Proxy).

### 2A2 — Bulk-Import Serverside (low prio)
Bulk-Import läuft aktuell im Browser (iPhone muss wach bleiben). Supabase Edge Function oder Queue würde das serverside laufen lassen.

### 2B — Rezept-Entdeckung
Basierend auf gescrapten Quellen: "Neu in deiner Gegend", "Trending", ähnliche Rezepte zu deinen Favoriten.

### 2C — Magic Fill
Woche automatisch füllen basierend auf:
- `recipe_history` (was wann gekocht)
- `recipe_ratings` (Sterne)
- Wochentag-Präferenzen (Di = schnell, Sa = aufwendig)
- KI wählt aus *vorhandenen* Rezepten → keine Halluzinationen
- Button "✨ Woche füllen" auf Plan-Seite

### 2D — Rezept-Vorschläge
"Weil dir X gefallen hat", "Diese Woche noch nicht gehabt", saisonal.

### 3 — Nährwerte
Kalorien/Makros pro Rezept aus Zutaten berechnen. Aufwand: groß (braucht Nährwert-Datenbank).

### Nice-to-have
- Kategorien in Einkaufsliste (Gemüse / Fleisch / Milch…)
- Bildersuche für Rezepte
- Jack-Duplikat aufräumen / Auth (Email-OTP empfohlen, geparkt)

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

## 💡 Pitfalls (aus langen Debugging-Sessions)

1. **Falscher Vercel-URL** — mahlzeit.vercel.app ≠ unsere App. Immer mahlzeit123.vercel.app testen.
2. **TS-Fehler blocken Deploy** — Build auf `vite build` umgestellt, `tsc -b` separat.
3. **Supabase-Types veraltet** — Viele `never[]` Fehler in TypeCheck, ignorieren für Build.
4. **`overflow-x: hidden`** auf Container bricht `position: sticky` von Kind-Elementen.
5. **iOS PWA + `window.open()`** = leerer Safari-Tab. Stattdessen `window.location.href`.
6. **Bring-Deeplink** braucht `source=web` Parameter + URL-encoded inner URL.
7. **`auto-fill` vs `auto-fit`** in CSS Grid: `auto-fill` erzeugt leere Tracks, `auto-fit` nicht.
