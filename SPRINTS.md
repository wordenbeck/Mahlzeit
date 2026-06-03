# SPRINTS — Anständig Aufgeteilt

**Stand:** 2026-06-03 (nach Web Share Target + Bug Fixes)

---

## 🔴 SPRINT 14 — Familie einladen (3-4h) — THIS WEEK

**Goal:** Family kann sich einladen + zusammen planen

### Tasks (in Reihenfolge)

**14.1 PIN-Generator (0.5h)**
- [ ] `generatePIN()` — 4-stellig (0000-9999)
- [ ] `isValidPIN(pin)` — Validierung
- File: Inline in Workspace-Creation Component

**14.2 Workspace-UI (1h)**
- [ ] `/workspace` oder `/settings` Seite
- [ ] "Mein Haushalt-PIN: 1234"
- [ ] Button: "PIN kopieren"
- [ ] Button: "Familie einladen" → erklärt wie

**14.3 Join-Page (1h)**
- [ ] Validieren: Join-Page existiert schon (Onboarding)
- [ ] UI: PIN-Input (4 Ziffern, nur Numbers)
- [ ] Validation: PIN checken ob gültig
- [ ] Join-Flow testen

**14.4 Alle Rezepte sichtbar machen (1-2h)** ⚠️ WICHTIG
- [ ] **PROBLEM:** Recipes haben aktuell `workspace_id`
- [ ] **SOLUTION:** Recipes sollten GLOBAL sein (alle Haushalte sehen sie)
- [ ] Ansatz A: `recipes.workspace_id = NULL` für öffentliche Rezepte
- [ ] Ansatz B: Neue Tabelle `shared_recipes` 
- [ ] Ansatz C: Ändern RLS-Policy (statt workspace_id prüfen)
- [ ] **ACTION:** Kurz mit Thomas klären (5 min Call)

### Definition of Done
- ✅ Family kann einander via PIN einladen
- ✅ Alle 90 Rezepte sind für alle sichtbar
- ✅ Familie plant zusammen eine echte Woche
- ✅ 0 Crashes

---

## 🟡 SPRINT 15 — Cooking Tracking (4-5h) — NEXT WEEK

**Goal:** User kann Rezepte als gekocht markieren + bewerten

### Tasks (in Reihenfolge)

**15.1 Rating System (1.5h)**
- [ ] DB: `recipe_ratings` Table (recipe_id, workspace_id, user_id, stars, notes)
- [ ] RLS: User sieht nur eigene Ratings
- [ ] Components: Star-Input (1-5 Sterne, optional Text)
- [ ] API: `rateRecipe(recipeId, stars, notes)`
- [ ] UI: Sterne anzeigen bei `/rezepte/{id}`

**15.2 "Gekocht markieren" (1.5h)**
- [ ] DB: `recipe_history` Table (recipe_id, workspace_id, user_id, cooked_at)
- [ ] Components: Button "✓ Gekocht markieren"
- [ ] Tracking: Wann wurde gekocht? (für Recommendations später)
- [ ] UI: Show "Zuletzt gekocht: vor 3 Tagen"

**15.3 Notizen pro Rezept (1h)**
- [ ] Components: Notiz-Input in `/rezepte/{id}`
- [ ] API: `updateRecipeNotes(recipeId, notes)`
- [ ] Anzeige: Notizen unten bei Rezept
- [ ] Sharing: Alle im Haushalt sehen die Notizen

**15.4 Recipe-Type Feature (1h)**
- [ ] DB: `recipe_type` Column (Hauptgericht, Beilage, Dessert, Snack, Frühstück)
- [ ] Components: Dropdown in Edit-Mode
- [ ] Parser: Setzt Type automatisch (Instagram Captions)
- [ ] Magic-Fill: Nutzt Type für Vielfalt (nicht nur Hauptgänge)

### Definition of Done
- ✅ User kann Rezepte bewerten (Sterne)
- ✅ Notizen pro Rezept speicherbar + sichtbar
- ✅ "Gekocht"-History wird getracked
- ✅ Magic-Fill bevorzugt höher-bewertete Rezepte
- ✅ Recipe-Type funktioniert

---

## 🟢 SPRINT 16 — Polish + iPhone (4-5h) — WEEK AFTER

**Goal:** App sieht auf iPhone gut aus + lädt schneller

### Tasks (in Reihenfolge)

**16.1 iPhone-Responsive (2-3h)**
- [ ] Breakpoints: < 600px = Mobile
- [ ] Plan-View: Tage vertikal statt Wochengrid
- [ ] Recipe-List: 1-spaltig
- [ ] Tap-Targets: ≥ 44px
- [ ] Bottom-Navigation: Prüfen ob passt

**16.2 Miso-Inspired Visuals (1h)**
- [ ] Kochzeit-Separation: "Vorbereitung | Kochzeit | Gesamt"
- [ ] Blöcke verschiebbar (Zutaten, Anleitung, etc.)
- [ ] Sauberes Layout (ähnlich Miso)

**16.3 Performance (1h)**
- [ ] Image-Lazy-Loading
- [ ] Code-Splitting (React.lazy für Routes)
- [ ] Bundle-Size checken

### Definition of Done
- ✅ Lighthouse Mobile-Score ≥ 80
- ✅ iPhone + iPad beide nutzbar
- ✅ Alle Interaktionen flüssig

---

## 🔵 SPRINT 17 — Concept-System (6-8h) — LATER

**Goal:** User kann Rezepte in Konzepten gruppieren (Vegan, Abnehmen, etc.)

### Tasks
- [ ] DB: `concepts` + `recipe_concepts` Tables
- [ ] RLS: User sieht nur eigene Concepts
- [ ] UI: Filter by Concept in `/rezepte`
- [ ] Magic-Fill: Concept-aware (wenn "Vegan" gewählt → nur vegan)

---

## 🔵 SPRINT 18+ — Backlog (SPÄTER)

- Externe Rezept-APIs (Edamam, Spoonacular)
- Shared Library (Multi-Family)
- Bring-Export
- PDF-Upload
- Lighthouse Full-Audit
- etc.

---

## 📊 Effort Summary (REALISTIC)

| Sprint | Feature | Effort | Status |
|--------|---------|--------|--------|
| 14 | Familie einladen | 3-4h | 🔴 THIS WEEK |
| 15 | Cooking Tracking | 4-5h | 🟡 NEXT WEEK |
| 16 | iPhone + Polish | 4-5h | 🟢 WEEK AFTER |
| 17 | Concept-System | 6-8h | 🔵 LATER |
| 18+ | Backlog | TBD | 🔵 MUCH LATER |

**Total bis Sprint 16: ~11-14h**

---

## ⚠️ BLOCKERS

**Sprint 14.4 - CLARIFY WITH THOMAS:**
- Recipes aktuell `workspace_id` — aber sollen GLOBAL sein für alle Haushalte
- Wie handhaben? (NULL, neue Table, RLS-Policy?)
- 5 min Call würde helfen

---

## NEXT ACTION

1. ✅ PIN-Code für Sprint 14.1
2. ✅ Workspace-PIN UI für Sprint 14.2
3. ❓ Sprint 14.4 klären (Recipes Global?)
4. Start coding
