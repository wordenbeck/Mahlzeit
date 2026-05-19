# Hand-Off für nächste Session

> Geschrieben am Ende einer langen Session. Token-Budget war voll → Thomas startet mit `/clear` neu. Damit die nächste Claude-Instanz schnell Anschluss findet, hier der Stand + offene Themen.

---

## Wo wir stehen (App-State)

App ist **live** auf https://mahlzeit123.vercel.app und voll funktional:

- **Sprint 0-11** sind durch — von Mock-Prototypen über Onboarding/Plan/Einkauf/Liste/Heute bis zu Bulk-Import, Magic Fill, Realtime, PWA, Profile-Polish, Recipe-Edit, Lucide-Zutaten-Icons, ErrorBoundary, Service-Worker, Bulk-Resume
- Aktuell auf `main` Branch (alle Commits draußen, Vercel auto-deployt)
- Workspace-Code ist **4-stellig numerisch** (jüngste Änderung)
- Tech-Stack: React + Vite + TS + Supabase + Vercel + Groq für Recipe-Parsing

---

## 🔴 SOFORT-PRIORITÄT für nächste Session

### 1. SQL-Migration applyen — NEU
Thomas hat noch **nicht** angewandt:

```
supabase/migrations/20260513000000_recipe_type.sql
```

Adds `recipe_type` column (`hauptgericht` / `snack` / `dessert` / `fruehstueck` / `beilage` / `getraenk`). Backfill via `kategorie[]`-Heuristik.

→ Erinnern: Supabase Dashboard → SQL Editor → Inhalt rein → Run.

### 2. Bulk-Import-Bug (Thomas' aktuelles Problem)
> "der erste klappt aber dann bin ich nur noch auf fehler gelaufen"

**Was wir vermuten:** Groq Free TPM-Limit. Erstes Rezept geht durch, dann hauen Folge-Requests in die Rate-Limit-Wand.

**Was diese Session noch reingebaut hat:**
- Throttle erhöht 4s → **7s** zwischen Requests
- Rate-Limit-Retry: bei 429/TPM-Fehler erkennen → 20s warten → 1× nochmal versuchen
- Bessere Fehler-Messages (Caption-Wall vs Parser-Fehler)
- Auto-Dedup gegen DB: schon importierte source_urls werden als `skipped` markiert (nicht erneut Groq-belastet)

**Was noch fehlen könnte:**
- Edge-Function-Logs in Supabase prüfen → echte Fehler-Details sehen
- Falls Groq TPM weiterhin zickt: noch konservativer (10-15s Throttle) ODER Switch zu paid Groq-Tier
- Falls Insta-Auth-Wall: source_url muss alle Reels öffentlich machen (Caption-Fallback existiert in /rezepte/import)

→ **First-Action für nächste Session:** mit Thomas einen Bulk-Test machen, Edge-Function-Logs anschauen, dann gezielt fixen.

### 3. Neue Anforderungen aus `mealplanner-spec/`

Thomas hat einen Ordner angelegt:
```
~/Claude Code/CodingDojo/MealPlanner/mealplanner-spec/
  ├── meal-planner-strategy-v1.md  (Gemini-Diskussion zu Anforderungen + strategischer Ausrichtung)
  └── SanaMana-Rezepte + Bilder (digitalisiert)
```

→ **Aufgabe für nächste Session:**
1. `meal-planner-strategy-v1.md` lesen, **validieren** (gegen aktuelle App), **Decisions klären** mit Thomas
2. Was passt? Was muss neu? Was kollidiert?
3. SanaMana-Material **importieren** (Rezepte + Bilder)
   - Vermutung: Rezepte sind nicht als Insta-Reels sondern als strukturierte Daten/PDF/Excel/Word. Falls JSON/CSV: schneller Import-Script. Falls PDF/Word: parsen oder manuell.
   - Bilder → Supabase Storage (`recipe-images`-Bucket, Pfad `{workspace_id}/{recipe_id}.{ext}`)

→ **Erst lesen → klären → dann planen → dann importieren**, nicht blind drauf los.

---

## ⚙️ Recipe-Type-Feature (in dieser Session gebaut, aber noch nicht überall)

Was schon drin ist:
- Migration-File geschrieben (`20260513000000_recipe_type.sql`)
- Types: `RecipeType`, `RECIPE_TYPE_LABELS` in `src/lib/types/recipe.ts`
- `Recipe.recipe_type` required im Type
- `database.types.ts` erweitert
- `RecipeListItem` enthält `recipe_type`
- `saveRecipe` calls überall mit `recipe_type: 'hauptgericht'` default
- `/rezepte` Page: Filter-Pills (Alle / Hauptgericht / Snack / Dessert / Frühstück / Beilage / Getränk) mit Counts

Was noch fehlt (offen):
- **Recipe-Detail Edit-Mode**: `recipe_type` als Select-Feld im Edit-Modus
- **Parser-Prompt**: AI soll automatisch `recipe_type` setzen beim Import. Aktuell setzt sie nichts → Default 'hauptgericht'
- Edge-Function `import-recipe-from-url` muss aktualisierten Parser-Prompt deployen, weil der Prompt clientseitig mitgegeben wird
- **Magic Fill** könnte type-aware werden: User picked "fülle nur mit Hauptgerichten"

---

## 📋 Backlog (in Reihenfolge der Priorität nach Sprint 11)

### Klein, hoher Impact
- [ ] Recipe-Type Edit-Field in RezeptDetail (Select-Box)
- [ ] Parser-Prompt: AI setzt `recipe_type` automatisch beim Import
- [ ] Magic-Fill type-aware (z.B. „nur Hauptgerichte für Mo-Fr abends")

### Mittel
- [ ] Strategy aus `mealplanner-spec/meal-planner-strategy-v1.md` durchgehen + entscheiden
- [ ] SanaMana-Rezepte + Bilder importieren
- [ ] Lighthouse-Audit + Performance-Tuning

### Backlog (offen, niedriger Druck)
- [ ] **Shared Library** (Thomas erwähnte "für alle Haushalte" — TBD ob er das wirklich will)
- [ ] **Refereo-Verknüpfung** — TBD-Klärung was er meinte
- [ ] iPhone-Polish-Iterationen (Layout läuft, könnte schöner)
- [ ] Konzept-System als eigene Entity (statt Tag-System)
- [ ] Bring-Echtintegration via Deep-Link statt Web-Share-Fallback

---

## 🗂️ Wichtige Docs im Repo (in dieser Reihenfolge lesen)

1. **`CLAUDE.md`** — Working-Style, Stack, Identity-Modell, Constraints
2. **`COLLAB-PRINCIPLES.md`** — wie Thomas und Claude zusammenarbeiten (Plan → Prototype → Develop)
3. **`PROJECT-SPEC.md`** — Komplette Spec (Vision, Scope, Datenmodell, Roadmap)
4. **`DESIGN-BRIEF.md`** — Visual-System, Mood, Component-Specs, Phase-2-Backlog
5. **`SETUP.md`** — Account-Setup (GitHub/Supabase/Vercel)
6. **`TESTS-PENDING.md`** — manuelle Smoke-Test-Checkliste

Und **diese Datei** für den aktuellen Stand.

---

## 🚨 Wichtige Pitfalls (nicht reingerennt)

1. **Service-Role-Key NIE in Frontend** — nur in Edge-Functions
2. **Realtime muss pro Tabelle aktiviert sein** in Supabase: Database → Replication. Aktuell aktiv für `weekplan_slots` + `recipes`
3. **Workspace-RLS** — neue Tabellen brauchen RLS-Policies sonst sehen User nichts oder zu viel
4. **Anonymous Auth** — Profile wird via RPC angelegt (`create_workspace_and_join`), nicht direkt Insert (RLS-After-Insert-Bug)
5. **Bulk-Import läuft im Frontend** — User-Tab muss offen bleiben. Bei zu, Resume-Banner beim Wiederkommen
6. **Edge-Function-Deploy** = `supabase functions deploy <name>` muss Thomas tun, nicht Claude (CLI-Auth)

---

## Erste Aktion für nächste Session

```
User wird wahrscheinlich sagen: "lies HANDOFF.md, dann lass uns die mealplanner-spec angucken"
```

Schritte:
1. HANDOFF lesen ✓ (das hier)
2. CLAUDE.md überfliegen
3. Status checken: `git log --oneline -10` + Vercel-Deploy live?
4. `mealplanner-spec/` Verzeichnis anschauen
5. `meal-planner-strategy-v1.md` lesen
6. Mit Thomas: was passt, was nicht, was implementieren wir
7. Recipe-Type-Migration apply checken (ist die SQL durch?)
8. Bulk-Import-Bug live debuggen wenn er nochmal versucht

Don't be afraid to ask clarifying questions. Thomas mag das.

---

Stand: Sprint 12 vorbereitet. Letzte Commit-Reihe enthält recipe_type-Feature + Bulk-Import-Fixes.
