# Hand-Off für nächste Session

> Wird nach jeder Sprint-Welle aktualisiert (siehe `CLAUDE.md` → Session-Management). Stand: **Sprint 14.5** (Harvesting Pipeline + Backlog Structure + Session Optimization).

---

## Wo wir stehen

App ist **live** auf https://mahlzeit123.vercel.app, voll funktional.

**Sprint 0–14.5** durch: MVP complete. Jetzt **Datenbank-Befüllung Phase**.

**Gerade in dieser Session:**
- ✅ Groq TPM-Throttle Fix (7s → 30s) — deployed
- ✅ Instagram Harvesting Pipeline gebaut (2 Agents: v1 basic, v2 mit Quality-Score)
- ✅ Comprehensive Backlog (Sprint 14-20, 6-Monats-Plan)
- ✅ Sprint-Chat-Modell dokumentiert (CLAUDE.md)
- ✅ 87 Instagram URLs gesammelt + bereit zum Harvesten

Tech: React + Vite + TS + Supabase + Vercel + Groq + Node.js (Harvesting).

---

## 🔴 Sofort-Priorität für nächste Session

### Sprint 15: Recipe Harvesting & Parsing

**Phase 1: Harvesting (autonomous, 5-15min)**
```bash
cd MealPlanner && node scripts/harvest-recipes-pipeline.js
```
- Extrahiert 87 Instagram URLs via oEmbed (kostenlos)
- Quality-Score: >0.7 = hat Zutaten + Zubereitung
- Output: `recipes_ready_to_parse.json`
- Ziel: ~80-100 good Recipes (Phase 1), dann Account-Mining für 300+ total

**Phase 2: Parsing (neuer Sprint-Chat)**
- `RECIPE_PARSE_PROMPT.md` als Template
- Claude-API (unbegrenzt, kein Groq TPD-Limit)
- Alle Captions aus recipes_ready_to_parse.json durchpars en
- Output: JSON ready für DB-Insert

**Phase 3: Save to DB**
- INSERT in `recipes` Table
- Bulk-speichern via Supabase-API
- Target: 250-300 Rezepte im Bestand

**Critical Files:**
- `scripts/harvest-recipes-pipeline.js` — Agent v2 mit Quality-Score
- `scripts/harvest-instagram-agent.js` — Agent v1 (fallback)
- `RECIPE_PARSE_PROMPT.md` — Claude-Parsing-Template
- `urls.txt` — 87 Seed-URLs
- `.harvest-state.json` — Resume-State (auto-created)
- `recipes_ready_to_parse.json` — Output, ready to parse

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

## 🚨 Learnings & Pitfalls

**Was lief gut:**
- Instagram oEmbed-API ist kostenlos + zuverlässig
- Quality-Score-Regex funktioniert gut (~80% Accuracy für "echte" Rezepte)
- Harvesting-Agent mit Resume ist robust
- Sprint-Chat-Modell (per-Sprint isolation) spart viel Context

**Wo war's lahm:**
- Groq TPD-Limit (100k/Tag) ist für Bulk-Operations zu eng
  - Lösung: Claude-API für Parsing (unbegrenzt im Chat)
  - Edge Cases: Wenn >100 URLs in 1 Tag, auf Dev-Tier upgraden
- Instagram-Captions sind dirty (viel Werbung, unklar strukturiert)
  - Lösung: Quality-Threshold filtering
  - Goldmine-Detection: "Rezept X/Y" patterns zu spooky, braucht refinement

**Kritische Constraints:**
1. **Service-Role-Key NIE in Frontend** — nur in Edge-Functions
2. **Realtime muss pro Tabelle aktiviert sein** (Supabase → Database → Replication)
3. **Workspace-RLS** für neue Tabellen
4. **Bulk-Import läuft im Browser** — Tab must stay open (aber Resume klappt)
5. **Edge-Function-Deploy ist Thomas-Sache** — Claude kann nicht autonom CLI-deployen
6. **Edge-Function-Errors** müssen mit 200+JSON-Body returnt werden (nicht 500) damit supabase-js den Body lesen kann
7. **Instagram oEmbed hat keine Account-Videos-API** — Account-Mining braucht manuell curated URLs oder Puppeteer

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

## Erste Aktion für nächste Session (Sprint 15)

1. HANDOFF.md lesen ✓
2. `git log --oneline -5` checken — letzte Commits
3. **Harvesting starten:** `node scripts/harvest-recipes-pipeline.js`
4. **Während das läuft:** Neuer Chat-Tab für Parse-Phase vorbereiten
5. Wenn Harvesting done: `recipes_ready_to_parse.json` prüfen
6. **Parse-Chat:** RECIPE_PARSE_PROMPT + recipes_ready_to_parse.json durchgehen

**Target:** 250+ gute Rezepte im Bestand bis Sprint 15 Ende

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
