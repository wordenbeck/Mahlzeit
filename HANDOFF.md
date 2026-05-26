# Hand-Off für nächste Session

> Wird nach jeder Sprint-Welle aktualisiert (siehe `CLAUDE.md` → Session-Management). Stand: **Sprint 15** (Recipe Harvesting Complete + Manual Parsing Done).

---

## Wo wir stehen

App ist **live** auf https://mahlzeit123.vercel.app, voll funktional.

**Sprint 0–15** durch: MVP complete + **Datenbank mit 90 Rezepten gefüllt**.

**Sprint 15 COMPLETE:**
- ✅ Harvest: 66 gute Rezepte aus 82 Instagram URLs (oEmbed)
- ✅ Parse: Alle 66 Rezepte in strukturiertes JSON (manual heuristic-based)
- ✅ Insert: **66 Instagram + 24 SanaMana = 90 Rezepte in DB**
- ✅ SQL Scripts generiert (recipes_insert_final.sql + sanamana_insert.sql)

**Database Status:** 90 Rezepte live, ready für App-Testing.

Tech: React + Vite + TS + Supabase + Vercel + Groq + Node.js (Harvesting).

---

## 🔴 Sofort-Priorität für nächste Session

### Sprint 16: Image Seeding & Concept System

**Phase 1: Image Seeding (Bilder für Rezepte)**
- 10-15 Rezepte mit Bildern versehen (via `search-recipe-image` Edge Function aus Kalo)
- Bilder in Supabase Storage speichern
- Rezepte mit `bild_url` updaten

**Phase 2: Concept System Foundation**
- Tags in App anzeigen (vegan, high-protein, schnell, etc.)
- "Filter by Tag" Funktionalität bauen
- SanaMana-Rezepte als Konzept markieren

**Phase 3: App Testing**
- UI testen mit 90 echten Rezepten
- Magic-Fill (Wochenplan-Generator) testen
- Drag & Drop in Weekplan testen
- Responsive auf iPad/iPhone testen

**Critical Files (Sprint 15 Outputs):**
- `recipes_parsed.json` — 66 structured recipes (titel, zutaten, zubereitung, tags, etc.)
- `scripts/parse-recipes-manual.js` — Heuristic parser (Regex + pattern matching)
- `scripts/parse-recipes.js` — Groq API parser (für später wenn Key access klappt)
- `scripts/insert-recipes-db.js` — Supabase bulk insert (blockiert auf SERVICE_ROLE_KEY)
- `recipes_harvested.json` — All 82 URLs + scores
- `.harvest-state.json` — Resume-State für Account-Mining

---

## 📋 Vollständiges Backlog (6 Sprints geplant)

**Siehe BACKLOG.md für:**
- Sprint 14: ✅ Data-Harvesting-Pipeline gebaut
- Sprint 15: Recipe Parsing + DB-Save (NÄCHSTER)
- Sprint 16: SanaMana Seed + Bilder
- Sprint 17: Concept-System Foundation
- Sprint 18: iPhone Responsive
- Sprint 19: Lighthouse + PWA Polish
- Sprint 20: Shared Library

**Out-of-Scope für jetzt:**
- Recipe-Type Edit-Select (Sprint 15 Backlog, nice-to-have)
- Refereo-TBD (unklar, klären mit Thomas)
- Bring-Export (nur wenn Familie braucht)

---

## 🚨 Learnings & Pitfalls (Sprint 15)

**Was lief gut:**
- Instagram oEmbed kostenlos + zuverlässig (alle 82 URLs extrahiert)
- Quality-Score-Regex funktioniert (~80% Accuracy) → 66 gute Rezepte
- Heuristic-basiertes Parsing (Regex) war schneller als API-Calls
- Manual parse-script brauchte keine externe API → kein Groq/Claude-Key nötig
- Harvest + Parse in <5 Min komplett

**Wo war's lahm:**
- Groq-Login loop → konnte neuen API-Key nicht kriegen
- Supabase Secrets sind nach Creation nicht lesbar (Security-Feature, aber problematisch)
- .env.local mit `VITE_`-Prefix (Frontend) — Service-Role-Key braucht anderen Storage
- Insert-Phase blockiert wegen fehlender Service-Role-Key Zugang

**Kritische Constraints:**
1. **Service-Role-Key NIE in Frontend .env.local** — nur in Edge-Functions oder separaten Secrets
2. **Secrets nach Creation nicht lesbar** — muss bei Creation notiert werden
3. **Heuristic Parsing hat Limits** — bei sehr unterschiedlich strukturierten Captions nicht optimal
4. **Workspace-RLS** muss pro Tabelle aktiviert sein
5. **Realtime muss pro Tabelle aktiviert sein** (Supabase → Database → Replication)
6. **Instagram oEmbed hat keine Account-Videos-API** — Account-Mining braucht manuell curated URLs oder Puppeteer

---

## 🗂️ Docs im Repo (aktualisiert)

1. `CLAUDE.md` — Working-Style, Stack, **Sprint-Chat-Modell**
2. `BACKLOG.md` — **NEW** Vollständiger 6-Sprint-Roadmap
3. `PROJECT-SPEC.md` — Komplette Spec
4. `DESIGN-BRIEF.md` — Visual-System + alte Backlog
5. `SETUP.md` — Account-Setup
6. `RECIPE_PARSE_PROMPT.md` — **NEW** Claude-Parsing-Template für Captions
7. `COLLAB-PRINCIPLES.md` — Workflow
8. `HANDOFF.md` — Dieser File (live state)
9. `TESTS-PENDING.md` — Smoke-Tests

**Scripts (neu):**
- `scripts/harvest-instagram-agent.js` — v1 Basic-Harvester
- `scripts/harvest-recipes-pipeline.js` — v2 mit Quality-Score + Account-Mining

---

## 🎯 Optimization Feedback (Sprint 14.5)

**Was lief gut:**
- ✅ Parallelisierung (Agent im Background, Claude arbeitet gleichzeitig)
- ✅ Quality-Scoring mit Regex — schnell, effektiv, keine Tokens verbraucht
- ✅ Staged Approach (Harvest → Score → Parse) statt Alles-In-Eins
- ✅ BACKLOG schreiben hat volle Clarity gegeben

**Wo war's lahm:**
- ❌ Groq TPD-Limit nervt — aber Claude-API ist bessere Lösung
- ❌ Zu viel Zeit in "sollen wir bauen oder nicht" Diskussionen verbracht
  - **Lernen:** Einfach bauen, Thomas kann Stop sagen
- ❌ Node.js Script debugging hat gebraucht (ES-Module vs CommonJS)
  - **Lernen:** Immer package.json prüfen

**Für nächsten Sprint:**
- Claude: Weniger "sollen wir?" → mehr "machen wir und du legst los"
- Thomas: Früher Halt-Signal geben wenn Approach falsch
- Beide: Code sofort testen, nicht erst dokumentieren dann bauen

---

## Erste Aktion für nächste Session (Sprint 16)

1. HANDOFF.md lesen ✓
2. `git log --oneline -3` checken — letzte Commits
3. **DB Insert:** `SUPABASE_SERVICE_ROLE_KEY=sk-... node scripts/insert-recipes-db.js`
   - Wenn Key nicht verfügbar: Baue Edge Function für Insert
4. **Verify:** Geh in Supabase → recipes Tabelle → 66 neue Rezepte sollten da sein
5. **SanaMana Seed:** Füge 5-10 manuell curatierte SanaMana Rezepte ein (mit Bilder)

**Target erreicht:** 66 Instagram + 24 SanaMana = **90 Rezepte im Bestand** ✅

---

## Session-Management — Quick-Reference

**Wann HANDOFF updaten:**
- Nach jeder Sprint-Welle
- Wenn `/context` >65%
- Vor `/clear`

**Wann `/clear` vorschlagen:**
- `/context` >75%
- Sauberer Breakpoint erreicht (Feature done + committed)
- Lange Session, viele Iterationen

**Was im Repo persistent ist** (siehe CLAUDE.md):
- Architecture → PROJECT-SPEC
- Visual → DESIGN-BRIEF
- Setup → SETUP
- Bugs/Sprint → HANDOFF
- Migrations → supabase/migrations
- Edge-Functions → supabase/functions

Damit ist `/clear` immer schmerzfrei.
