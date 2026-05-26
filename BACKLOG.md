# MealPlanner Backlog — Sprints 14+

**Letzte Aktualisierung:** 2026-05-21 (nach Sprint 13.5)  
**Status:** Consolidated aus HANDOFF, DESIGN-BRIEF, PROJECT-SPEC, Plan-File

---

## 🔴 Sprint 14 — Bulk-Seed + Magic-Fill Validation

**Status:** IN PROGRESS  
**Ziel:** Start-Rezeptsammlung + erste echte Family-Planung

- [ ] Bulk-Import mit 20-30 URLs testen (in progress)
- [ ] Spotcheck 3-5 Rezepte auf Parser-Korrektheit
- [ ] Magic-Fill mit ≥10 Rezepten testen (leere Woche → Fill → prüfen ob sinnvoll)
- [ ] Familie einladen via QR-Code
- [ ] Eine echte Woche planen (real-world Test)
- [ ] Feedback sammeln: Was funktioniert? Was fehlt?

**Definition of Done:** Familie hat 20+ Rezepte, plant eine echte Woche damit, 0 Crashes

---

## 🟡 Sprint 15 — Recipe-Type Feature Completion

**Priorty:** HIGH  
**Dependencies:** Kein Code-blocker, nur UX-Finish

- [ ] Recipe-Edit-Mode: `recipe_type` Select (Dropdown mit: Hauptgericht, Beilage, Dessert, Snack, Frühstück, Getränk)
- [ ] Parser-Prompt: AI setzt `recipe_type` automatisch beim Import (Client-seitiger Prompt, kein Edge-Deploy nötig)
- [ ] Magic-Fill: type-aware suggestions (wenn Woche leer, empfehle Frühstück+Hauptgericht+Snack)
- [ ] Recipe-List Filter: Type-Pills sind schon da (`/rezepte`), nur funktional testen

**Effort:** ~3h Code, easy win  
**Definition of Done:** `/rezepte` Filter nach Type funktioniert, Parser setzt Type, Magic-Fill bevorzugt Vielfalt

---

## 🟡 Sprint 16 — SanaMana Initial Seed + Bilder

**Priority:** MEDIUM-HIGH  
**Dependencies:** mealplanner-spec/ durchlesen + validieren mit Thomas

- [ ] `mealplanner-spec/meal-planner-strategy-v1.md` lesen + mit Thomas validieren
- [ ] SanaMana Rezepte (digitalisiert) von mealplanner-spec/ in App importieren
- [ ] Bilder zu Supabase Storage hochladen (`recipe-images/{workspace_id}/{recipe_id}.{ext}`)
- [ ] Recipes mit Tags für SanaMana-Konzept (vegan, proteinreich, abnehmen)
- [ ] Magic-Fill SanaMana-fokussiert testen

**Effort:** ~2h Admin + Upload, 1h Testing  
**Definition of Done:** 15-20 SanaMana-Rezepte sichtbar, alle mit Bildern, Magic-Fill bevorzugt sie

---

## 🟢 Sprint 17 — Concept-System (Foundation)

**Priority:** MEDIUM  
**Dependencies:** Nach Thomas + Familie real-world Feedback (Sprint 14-16)

**Theme:** Strukturierter Weg um Rezepte in „Konzepte" zu gruppieren (Abnehmen, Vegan, SanaMana, High-Protein, etc.)

- [ ] DB-Schema: `concepts` Table (id, workspace_id, name, description, color)
- [ ] DB-Schema: `recipe_concepts` Junction-Table (recipe_id, concept_id)
- [ ] RLS Policies für beides
- [ ] Backend-APIs (supabase-js): Create, Update, Delete Concept; Assign Recipe to Concept
- [ ] UI: `/rezepte` → neuer Filter "Konzepte" (Multi-Select Pills)
- [ ] UI: `/rezepte/{id}` Edit-Mode → Concepts-Selector (Tags-ähnlich)
- [ ] Magic-Fill: Concept-aware (wenn User "Abnehmen" gewählt, empfehle nur die Rezepte)
- [ ] Profile: Concept-Preferences speichern (Default-Konzepte für diese Woche?)

**Effort:** ~6-8h (DB + API + UI)  
**Definition of Done:** User kann Concepts erstellen, Rezepte zuordnen, `/plan` nutzt das für Magic-Fill

---

## 🟢 Sprint 18 — iPhone-Responsive + Layout-Polish

**Priority:** MEDIUM  
**Reason:** iPad MVP läuft. iPhone ist sekundärer Use-Case, aber Familie nutzt auch iPhones zum "schnell nachsehen".

**Theme:** Responsive Redesign für kleinere Screens

- [ ] Breakpoints anpassen (`@media (max-width: 600px)`)
- [ ] Plan-View: Stack vertikal statt Grid (Mon-Sun nebeneinander wird Accordion)
- [ ] Recipe-List: 1-spaltig statt Grid
- [ ] Tap-Targets vergrößern (min 44px)
- [ ] Bottom-Tab-Navigation prüfen (momentan horizontal, passt iPhone nicht)
- [ ] Drawer / Side-Menu für `/rezepte`, `/plan`, etc. (nicht Top-Nav)

**Effort:** ~4-5h CSS-Anpassungen + Testing  
**Definition of Done:** Lighthouse Mobile-Score ≥90, iPad + iPhone beide >80 Performance

---

## 🔵 Sprint 19 — Lighthouse Audit + PWA Polish

**Priority:** MEDIUM  
**Dependencies:** iPhone-Responsive fertig (Sprint 18)

- [ ] Lighthouse Full-Audit (Performance, Accessibility, Best Practices, PWA)
- [ ] Performance: Image Optimization (Instagram-Mirror-URLs cachen?)
- [ ] Performance: Code Splitting prüfen (lazy Routes?)
- [ ] Accessibility: ARIA-Labels überprüfen, Color-Contrast validieren
- [ ] PWA: Splash-Screens für iOS finalisieren
- [ ] PWA: Install-Prompt für Android testen

**Effort:** ~3-4h Auditing + Fixes  
**Definition of Done:** Lighthouse PWA-Score ≥90 auf Mobile + Desktop

---

## 🔵 Sprint 20 — Shared Library / Multi-Household

**Priority:** MEDIUM  
**Dependencies:** Architecture-Decision mit Thomas klären

**Theme:** „Shared Recipe Library" — Möglichkeit dass eine Familie (workspace) zentrale Rezepte mit anderen Familien teilt (ohne dass jede kopieren muss)

**Offene Fragen:**
- Nur Read-Only teilen, oder auch Änderungen sync?
- Über QR-Code + Code (wie Profile-Invite) oder Link-based?
- Welche Rezepte sind shareable? Alle oder nur Public?

**Skizze:**
- [ ] `shared_libraries` Table (id, owner_workspace, shared_with_workspace, recipe_ids, access_level)
- [ ] UI: `/rezepte` → "Teilen" Button → QR/Link → andere Familie kann Sammlung "folgen"
- [ ] Magic-Fill: Auch aus Shared Library samplen?

**Effort:** ~6h (abhängig von Scope-Klärung)  
**Definition of Done:** Thomas + Familie können eine Mini-Sammlung teilen + importieren

---

## 💜 Backlog — Später (keine feste Priorität)

### Onboarding-Polish (Low Impact, aber schön)
- Funktional seit Sprint 1, aber UX-Polish:
  - [ ] Empty State: "Hier kommt dein erstes Rezept hin" → visuelle Beispiel-Card
  - [ ] First-Time-User: Tooltip bei Magic-Fill ("Das macht die KI für dich")
  - [ ] Welcome-Screen mit Workflow-Erklärung (optional)

### Bring-Export
- **Status:** Mock-Button seit Sprint 6, keine echte API
- **Technisch:** `bring://import/import` Deep-Link oder HTTP-POST an Bring-API
- **Effort:** ~1.5h wenn API-Doku klar ist
- **Prio:** Depends ob Familie Bring! benutzt

### Refereo TBD
- **Status:** Unklar was das ist / was damit gemeint ist
- **Action:** Thomas klären in nächster Sync
- **Placeholder:** Irgendein Feature / Integration die Thomas wollte?

### Insta-Feed-Integration (nicht geplant, Brainstorm-Phase)
- Rezept-Vorschläge aus Fav-Influencern?
- Auto-Scroll durch Insta, Reel speichern → In Backlog laden?
- **Effort:** Hoch, komplex, Privacy-Risk
- **Prio:** Sehr niedrig, nur wenn Familie direkt fragt

---

## 🚀 Future Vision (Unklar, kein Sprint zugeordnet)

Diese Punkte sind noch sehr vage und brauchen Klärung:

- **Einkaufs-Automatisierung:** Könnte die App direkt bei Rewe/Aldi bestellen? Wahrscheinlich nicht praktikabel.
- **Nährstoff-Tracking:** Kalorien, Makros pro Rezept? Kalorien nur für Abnehm-Konzept relevant. Große Feature, eigenes System.
- **Meal-Prep Planner:** Vorab kochen für die Woche? Komplexe Koordination mit Recipes.
- **Family-Sync Mode:** Live-Voting wenn Familie gemeinsam plant ("Wer hat Lust auf X?")? Nice-to-Have.

---

## 📊 Zusammenfassung: Nächste 6 Sprints

| Sprint | Theme | Effort | Status |
|--------|-------|--------|--------|
| 14 | Bulk-Seed + Magic-Fill Test | 1h | 🔴 IN PROGRESS |
| 15 | Recipe-Type Feature Finish | 3h | 🟡 QUEUED |
| 16 | SanaMana Seed + Images | 3h | 🟡 QUEUED |
| 17 | Concept-System | 8h | 🟢 QUEUED |
| 18 | iPhone Responsive | 5h | 🟢 QUEUED |
| 19 | Lighthouse + PWA | 4h | 🔵 QUEUED |
| 20 | Shared Library | 6h | 🔵 QUEUED (Architecture-Klärung) |

**Total:** ~30h für MVP-Completion + iPhone + Concepts + PWA  
**Zeitrahmen:** Ca. 8-10 Wochen wenn 2-3h pro Woche (je Sprint)

---

## Notes für nächste Session

1. **Sprint 14 abschließen:** Bulk-Import Test + Magic-Fill + Familie einladen
2. **Optimization Feedback** in HANDOFF.md eintragen (was lief gut, was nicht?)
3. **Sprint 15 Kickoff:** Recipe-Type Feature in neuem Chat
4. **Refereo-TBD klären** mit Thomas (was ist das?)
5. **Shared Library Scope** vor Sprint 20 klären
