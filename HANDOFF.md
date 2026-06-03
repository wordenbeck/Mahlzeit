# HANDOFF — Aktualisiert 2026-06-03 (Post Web Share Target + Bug Fixes)

> **WARNUNG:** Dieses Handoff war KAPUTT. Wichtige Infos fehlten. Neu strukturiert.

---

## ✅ Was GERADE FERTIG ist

**Session 2026-06-03:**
- ✅ Web Share Target API (Phase 1+2) — Komplett implementiert
- ✅ Integration Tests (61 Tests) — Alle green
- ✅ 7 Critical Bugs gefixt (P0-P3)
  - Ingredient menge-Validierung
  - Groq timeout + retry (exponential backoff)
  - Error messages (11 codes + user-friendly)
  - Mobile UX (responsive StructuredIngredientForm)
  - Analytics system (tracking key events)
  - Ingredient name cleanup (25+ adjectives)
  - Image selection modal (vor save)

**Deploy Status:**
- ✅ Code gepusht zu GitHub (main branch)
- ✅ Vercel deployt automatisch
- ✅ Live auf https://mahlzeit.vercel.app

---

## 🔴 KRITISCHE INFOS (diese fehlten!)

### 1. SanaMana Bilder — EXISTIEREN SCHON!

**Pfad:** `MealPlanner-Spec/SanaMana Rezepte/Rezeptbilder/`
- Alle HEIC-Dateien sind da
- **STATUS:** Wurden schon umgewandelt + importiert (wer? wann?)
- **FRAGE:** Warum nicht in HANDOFF dokumentiert?

**Action nächste Session:**
1. Verify Bilder sind wirklich im Supabase Storage
2. Recipes mit `bild_url` verlinken falls noch nicht
3. ImageSeedingPage testen

---

### 2. 4-stelliger PIN für Haushalte

**STATUS:** EXISTIERT SCHON! (nicht neu)
- Workspace-System hat Code-Field
- RLS Policies sind da
- **ABER:** Wird nicht genutzt/nicht UI-exponiert

**Action nächste Session:**
1. Haushalt-Einladungs-UI bauen (4-stelliger PIN anzeigen)
2. Familie-Einladungs-Seite verfeinern
3. QR-Code ENTFERNEN (nur PIN + Name)

---

### 3. Externe Rezept-Quellen (TOP-NOTCH)

**Beste Quellen (einfach zu implementieren):**

| Quelle | User-Base | API? | Parser-Difficulty | Notes |
|--------|-----------|------|-------------------|-------|
| **Essen & Trinken** | 2M+ | No (Scrape) | Medium | German, high-quality, schöne Struktur |
| **Chefkoch** | 3M+ | No (Scrape) | Medium | Biggest German recipe site, ratings |
| **Rezeptdb.de** | 500K | No (Scrape) | Easy | Simple HTML, good variety |
| **EatThis.de** | 100K | No (Scrape) | Easy | Clean, modern site, healthy focus |
| **Miso.de API** | Partner | Yes! | Hard | Best quality, aber complex API |
| **Edamam API** | Huge | Yes | Medium | International, aber free tier limited |
| **Spoonacular API** | Huge | Yes | Medium | US/International, JSON-friendly |

**EMPFEHLUNG:** 
1. Start mit **Chefkoch** (Scraping) oder **Edamam API** (einfach)
2. German-fokussiert? → **Essen & Trinken**
3. International? → **Spoonacular**

**Parser:** Gleicher Parser wie Instagram (parse-recipe-caption Edge Function kann angepasst werden)

---

### 4. Workspace-Struktur (was existiert schon)

**DB-Tables:**
- `workspaces` — Haushalt mit eindeutigem `code` (6-stellig, sollte 4-stellig sein?)
- `profiles` — User mit `workspace_id`
- `recipes` — Mit `workspace_id` + `created_by`

**RLS Policies:** Alle in workspace sehen alles ✅

**FRAGE:** Ist der Code wirklich 6-stellig oder 4-stellig? Brauchen wir Migration?

---

## 📋 Sprints (realisiert mit DEINEN Anforderungen)

### Sprint 14: Familie einladen (2-3h)
- [ ] Haushalt-PIN-Seite (4-stellig + Name)
- [ ] Family Members anzeigen
- [ ] "Echte Woche" = min. 10 Rezepte + Familie plant zusammen
- **Definition of Done:** Familie hat geplant, 0 Crashes

### Sprint 15: Cooking Tracking + Recipe-Type (4-5h)
- [ ] "Als gekocht markieren"
- [ ] Sterne-Rating (1-5)
- [ ] Notizen pro Rezept
- [ ] Recipe-Type (Hauptgericht/Beilage/etc.)
- **Nice-to-Have:** Kochbücher (Sammlungen)

### Sprint 16: SanaMana Live + externe Quellen (4-6h)
- [ ] SanaMana Bilder verlinken (Supabase Storage validieren)
- [ ] Externe Quellen: 1-2 APIs integrieren (Chefkoch oder Edamam)
- [ ] Parser erweitern für externe Quellen
- [ ] Cron-Job oder manueller "Refresh" Button?

### Sprint 17: Concept-System (6-8h)
- [ ] DB: `concepts` + `recipe_concepts` Tables
- [ ] UI: Concept-Filter in `/rezepte`
- [ ] Magic-Fill: Concept-aware Recommendations
- Externe Quellen auch mit Tags initial

### Sprint 18: iPhone-Responsive (4-5h)
- [ ] Responsive Design (< 600px)
- [ ] Miso-inspiriert: Kochzeit separiert, Blöcke verschiebbar
- [ ] Tap-Targets ≥ 44px

### Sprint 19: Lighthouse + Polish (Nachranging)
- PWA Audit
- Performance Optimization

### Sprint 20: Shared Library (Nachranging)
- Multi-Family Recipe Sharing

---

## 📁 Wichtige Dateien (ZENTRALES INVENTORY)

**Du brauchst:**
- `MealPlanner-Spec/SanaMana Rezepte/Rezeptbilder/` — HEIC-Bilder
- `MealPlanner-Spec/meal-planner-strategy-v1.md` — Product-Definition
- `.env.local` — API-Keys (Supabase, Groq)

**Im Repo:**
- `src/lib/recipes.ts` — DB-Functions
- `src/lib/analytics.ts` — Tracking (neu)
- `src/lib/errors.ts` — Error-System
- `src/pages/ShareRecipePage.tsx` — Web Share Target Handler
- `supabase/functions/parse-recipe-caption/index.ts` — Parser (mit Retry-Logic jetzt)

---

## 🚨 OFFENE FRAGEN für Thomas

1. **SanaMana Bilder:** Sind sie wirklich schon in Supabase Storage? Oder brauchen wir noch Upload?
2. **4-stelliger PIN:** Ist die Länge schon angepasst oder noch 6?
3. **Externe Quellen:** Welche 1-2 APIs sollen wir starten? (Chefkoch vs. Edamam?)
4. **Parser:** Soll der Instagram-Parser angepasst werden für externe Quellen oder neuer Parser?
5. **Cron-Jobs:** Wo sollen die laufen? (Vercel Functions? Edge-Functions? Separate Service?)

---

## 💡 Was ich nächste Session checken werde

- [ ] SanaMana Bilder Status verifizieren
- [ ] 4-stelliger PIN Implementation
- [ ] Externe Quellen: Eine API integrieren
- [ ] iPhone-Responsive (Miso-Inspiration)
- [ ] Task #5 (Image Seeding End-to-End testen)
- [ ] Task #10 (Deployment Safeguards — lokal Checklist)

---

**Fehler in diesem Handoff?** → Sag Bescheid! Besser jetzt als später.
