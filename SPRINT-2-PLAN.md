# Sprint 2 — Recipe Schema + Import (Insta + URL)

> Ziel: User können Rezepte aus Instagram-Reels, URLs (chefkoch & co) und manuell anlegen. Echte Recipe-Daten in DB statt Mocks.

Geschätzt: **1–2 Tage**.

---

## Was aus Kalo übernommen wird

Kalo-Pfad: `~/Claude Code/CodingDojo/Kalo`

| Datei | Übernehmen | Anpassungen |
|---|---|---|
| `src/lib/types/recipe.ts` | ✅ schon kopiert nach `src/lib/types/recipe.ts` | `user_id` → `workspace_id` + `created_by`. Nährwerte + Konzept-Match raus. |
| `src/lib/prompts/recipeParserPrompt.ts` | ✅ 1:1 (430 Zeilen, Few-Shots gut getestet) | Wenig — Output-Schema ist kompatibel |
| `supabase/functions/import-recipe-from-url/index.ts` | ✅ ~95 % | Storage-Bucket-Name anpassen, `userId` → `workspace_id` für Storage-Pfad |
| `supabase/functions/search-recipe-image/` | ✅ 1:1 | Openverse-Bildsuche, völlig generisch |
| `supabase/functions/fetch-recipe-image/` | ✅ 1:1 | Image-Mirror zu Storage |
| Storage-Bucket-Migration | ✅ adaptieren | Bucket-Name `recipe-images`, Policies auf `workspace_id` |

**Nicht übernehmen** (Kalo-spezifisch):
- `analyze-meal`, `analyze-week`, `generate-shopping-list`, `generate-weekplan`, `suggest-recipes` — kommen in Sprint 6 als Mahlzeit-spezifische Versionen
- `mealParserPrompt.ts` (Kalorientracking-Parser)
- `macros.ts`, `sportKcal.ts`, `activities.ts`

---

## Phasen

### 2.1 — Storage + 2. Migration (~30 min)
- Storage-Bucket `recipe-images` anlegen (Public, 5MB Limit, Image-MIMEs)
- Migration `20260509000000_storage_recipe_images.sql` mit Bucket-Policies
- Apply via SQL-Editor oder `supabase db push`

### 2.2 — Edge Functions deployen (~1h)
- `supabase/functions/import-recipe-from-url/` aus Kalo kopieren
- Pfade anpassen (`workspace_id`/`created_by` aus JWT-Profile-Lookup)
- Storage-Mirror-Path: `recipe-images/{workspace_id}/{recipe_id}.jpg`
- Secrets setzen: `GROQ_API_KEY` (du machst), `SUPABASE_SERVICE_ROLE_KEY` (auto)
- `supabase functions deploy import-recipe-from-url`
- Analog: `search-recipe-image`, `fetch-recipe-image`

### 2.3 — Frontend Recipe-Library (~2h)
- `src/lib/recipes.ts` — CRUD: `listRecipes()`, `getRecipe()`, `saveRecipe()`, `deleteRecipe()`, `toggleFavorite()`
- Mock-Daten in `src/mocks/recipes.ts` markieren als „Sprint-0-Fallback nur für `/proto/*`"
- App-Routen `/rezepte` zeigt echte Daten (statt Stub)

### 2.4 — Import-UI (~2h)
- Neue Page `/rezepte/import`
- 3 Tabs: **URL-Import** · **Manuell** · **KI** (KI deaktiviert bis Sprint 6)
- URL-Import: Input → calls `import-recipe-from-url` Edge-Function → zeigt Result → User speichert / verwirft
- Fallback: wenn Caption-Extraction fehlschlägt → manueller Caption-Paste
- Recipe-Detail-View `/rezepte/:id` mit Edit-Button

### 2.5 — Recipe-Card im echten Grid (~1h)
- `src/pages/Rezepte.tsx` rendert das Grid mit `<RecipeCard>` (List-Default, Classic-Toggle)
- Filter + Suche mit echten Tags
- „+ Neu"-Button → `/rezepte/import`
- Favoriten-Toggle live in DB

---

## Critical Files (für Implementation)

| Pfad | Zweck |
|---|---|
| `src/lib/types/recipe.ts` | Source of Truth Recipe-Schema (schon da) |
| `src/lib/prompts/recipeParserPrompt.ts` | aus Kalo kopieren |
| `src/lib/recipes.ts` | NEU — CRUD-Layer |
| `supabase/functions/import-recipe-from-url/index.ts` | aus Kalo kopieren + anpassen |
| `supabase/migrations/20260509000000_storage_recipe_images.sql` | NEU |
| `src/pages/Rezepte.tsx` | Stub → echte Grid-Page |
| `src/pages/RezeptImport.tsx` | NEU |
| `src/pages/RezeptDetail.tsx` | NEU |

---

## Verification (Definition of Done Sprint 2)

1. ✅ User kann einen Insta-Reel-URL einfügen → in <30s ist das Rezept als strukturierte Daten + Bild in der App
2. ✅ Manuelle Rezept-Anlage funktioniert
3. ✅ Recipe-Grid (`/rezepte`) zeigt alle Workspace-Rezepte
4. ✅ Filter + Suche funktionieren
5. ✅ Favoriten-Toggle synct mit DB
6. ✅ RLS prüft: anderer Workspace sieht nichts
7. ✅ Bilder bleiben sichtbar auch nach Insta-CDN-Expire (Storage-Mirror funktioniert)
8. ✅ TypeScript clean
9. ✅ Lighthouse PWA-Score noch ≥ 90

---

## Out-of-Scope für Sprint 2

- Drag & Drop von Rezept ins Plan-Board (Sprint 4)
- KI-Rezept-Generation aus Freitext (Sprint 6)
- KI-Wochenvorschlag (Sprint 6)
- Bring-Export-Echtintegration (Sprint 6)
- iPhone-Layout (Sprint 5)

---

## Was du (Thomas) brauchst vor Start

- **Groq-API-Key** (kostenlos): https://console.groq.com → Create API Key
  - Wert in Supabase: Project Settings → Edge Functions → Secrets → `GROQ_API_KEY`
- **Supabase CLI** (für `functions deploy`):
  ```bash
  brew install supabase/tap/supabase
  supabase login
  supabase link --project-ref oaaxmpbnpntimzbieifv
  ```

Sag „Sprint 2 los" und ich fange mit Phase 2.1 an.
