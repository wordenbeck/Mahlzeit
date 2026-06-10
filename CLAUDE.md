# CLAUDE.md — MealPlanner

> Arbeitsregeln für Claude Code in diesem Projekt. Wird automatisch geladen.

## 🔒 Filesystem-Zugriff
**Nur innerhalb `/Users/thomaswordenbeck/Claude Code/CodingDojo/` schreiben.**
Niemals Desktop, Downloads, Documents oder andere Ordner außerhalb CodingDojo.
Das Bash-Tool hat technisch keinen Scope — diese Einschränkung ist Selbstdisziplin.

## 📄 Docs-Übersicht — welche Dateien gibt es, welche pflegen wir

| Datei | Zweck | Wann aktualisieren |
|---|---|---|
| `HANDOFF.md` | Sprint-Stand, Backlog, Bugs, Pitfalls, DB-State | **Jede Session** — am Ende oder bei Milestone |
| `CLAUDE.md` | Arbeitsregeln, Conventions, Gotchas | Bei neuen Patterns / gelernten Lektionen |
| `mockups/DESIGN-DECISIONS.md` | Verbindliche Design-Entscheidungen | Bei Design-Änderungen |
| `PROJECT-SPEC.md` | Vollständige Architektur-Referenz | Bei größeren Architektur-Änderungen |

**Archiviert** (nie anfassen): `.archive/` — SETUP.md, PRODUCTION.md, README.md, alte Backlogs

**Regel:** Wenn etwas wichtiges gelernt oder entschieden wurde → sofort in die richtige Datei schreiben, nicht im Chat lassen.

## Project Context

MealPlanner ist eine **iPad-first PWA für Wochenplanung**. Hobby-Projekt von Thomas Wordenbeck (Product-orientiert, Coding-Anfänger). Familie/Haushalt-tauglich. Komplett kostenlos zu betreiben (Supabase Free + Vercel Free + Groq Free).

**Komplette Spec:** siehe `PROJECT-SPEC.md`.

## Tech Stack

- React + TypeScript + Vite
- Supabase (DB, Storage, Anonymous Auth)
- Groq (LLM, kostenlos, llama-3.3-70b-versatile)
- @dnd-kit/core (Drag & Drop)
- vite-plugin-pwa
- date-fns
- Vanilla CSS (keine Tailwind/UI-Library) — eigene Design-Sprache

## Working Style

Thomas hat starkes Produkt-Verständnis aber wenig Coding-Erfahrung.

- **Erkläre** was du tust und warum, nicht nur Befehle ausgeben
- **Strukturierte, prägnante Antworten** mit klarer Hierarchie
- **Auf Deutsch** kommunizieren
- Bei wiederholten Erklärungen: fragen ob übersprungen werden soll
- **Ehrliches Feedback** bei kritischen Punkten (kein "ja klar geht das" wenn's nicht geht)
- Nicht in Kalo-Projekt arbeiten, das ist ein **separates** Projekt

## Thomas-Kommunikations-Muster (aus 40+ h Zusammenarbeit gelernt)

| Thomas sagt | Bedeutung | Reaktion |
|---|---|---|
| „top" | Feature fertig, zufrieden | Nicht weitermachen, nächsten Punkt |
| „unschön aber nicht kritisch" | Backlog, NICHT jetzt fixen | Kurz notieren, weitermachen |
| „lass das erstmal so" / „parken" | Bewusste Entscheidung zu warten | Ins Backlog, nie von selbst aufgreifen |
| „fix it" / „das muss raus" | Sofort erledigen, kein Mockup nötig | Direkt coden |
| „gib mir mal Optionen" / „Varianten" | Mockup mit 3 Varianten bauen | Immer 3, nie nur 1 |
| Feedback-Liste mit mehreren Punkten | Alle auf einmal umsetzen, 1 Commit | Nicht punkt-für-punkt einzeln committen |
| „einfach machen" | Aufhören zu fragen, coden | Keine Rückfragen mehr |

## Arbeitsregeln (Token-Effizienz)

### 🚦 Mockup-Gate — PFLICHT
Wenn Thomas Layout, Aussehen oder UX anspricht → **erst Mockup, dann Code**.
- Immer **3 Varianten** in einer HTML-Datei unter `mockups/`
- Echter Inhalt (echte Rezeptnamen/Zutaten), echte Design-Tokens
- Erst nach expliziter Auswahl ("A gefällt mir") → Code schreiben
- **Ausnahme:** Thomas sagt explizit „fix it" oder „einfach machen" → direkt coden

### 📦 Kein Micro-Patching
- 3+ Änderungen aus einer Nachricht → **alle auf einmal** implementieren und **1 Commit**
- Nicht: Fix A → commit → Fix B → commit → Fix C → commit
- Ja: alle Fixes → build → 1 commit mit vollständiger Message

### 🔕 Explain-Counter — bereits bekannte Konzepte nicht nochmal erklären
Thomas kennt und versteht bereits:
- Wie Supabase RLS funktioniert
- Wie der Vercel Build-Deploy-Zyklus läuft
- Was ein Service Worker ist und tut
- Was Anonymous Auth bedeutet
- Was Supabase Edge Functions sind
- Grundprinzip von React Hooks (useState, useEffect)
- Was PWA bedeutet und wie Manifest/SW zusammenhängen
- Den Unterschied zwischen `vite build` und `tsc`
- Was `localStorage` ist und tut

## Code-Konventionen

- TypeScript strict mode
- Funktionale React-Components mit Hooks
- Async/await statt .then()
- Komponenten klein halten (<200 Zeilen, sonst splitten)
- CSS-Files pro Component (`Component.tsx` + `Component.css`)
- Keine `any` außer in Edge Cases mit Kommentar

## Identity-Modell (wichtig!)

**Kein klassischer Login.** Statt dessen:
- **Anonymous Auth** (Supabase) im Hintergrund
- **Display Name** + **Workspace Code** für Identifikation
- Jeder DB-Eintrag bekommt `workspace_id` und `created_by`
- RLS Policies prüfen Workspace-Zugehörigkeit

Detail siehe `PROJECT-SPEC.md` → "Identity & Workspace".

## Wichtige Constraints

- ❌ Keine Tools/Services mit Kosten ohne explizite Rückfrage
- ❌ Keine native iOS-App, keine HealthKit-Integration
- ❌ Keine externen UI-Libraries (z.B. shadcn, MUI)
- ✅ Free-Tier-fähig bleiben (Supabase 500 MB, Vercel 100 GB Bandwidth, Groq 14k req/Tag)
- ✅ PWA-tauglich → Service Worker, Manifest, iOS-Splash

## DB-Schema Gotchas (`recipes` Tabelle) — WICHTIG bei Imports

> Gelernt aus stundenlangem SQL-Debugging. **Vor jedem Insert ZUERST Schema checken**, nicht raten!

- **`tags`** = `text[]` → `ARRAY['vegan','schnell']` — **NICHT** `'["vegan"]'::jsonb`!
- **`kategorie`** = `text[]` → `ARRAY['mittag']` — **NICHT** jsonb!
- **`zutaten`** = `jsonb` → `'[{"name":"X","menge":1,"einheit":"g","hinweis":null}]'::jsonb`
- **`zubereitung`** = `jsonb` → `'["Schritt 1","Schritt 2"]'::jsonb` — ohne führende Nummern
- **NOT NULL Pflichtfelder:** `workspace_id`, `created_by`, `source` — fehlen sie, schlägt Insert fehl
- **`schwierigkeit`** Werte: `'einfach'` | `'mittel'` | `'aufwendig'` (NICHT englisch!)
- Aktuelle Basis-IDs: `workspace_id = e7f25de4-4fce-4aba-b1ce-70f9fe20f47d`, `created_by = 39b427ea-645c-4845-89a6-1c5a591aba17`
- Schema-Quelle: `supabase/migrations/20260508120000_initial_schema.sql`

### Import-Workflow (so vermeiden wir SQL-Ping-Pong)

1. **Schema lesen** (Migration ODER bestehende Zeile via REST API auslesen):
   `curl "$URL/rest/v1/recipes?select=*&limit=1" -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"`
2. SQL exakt nach echtem Format bauen (Spaltentypen + Pflichtfelder!)
3. **Programmatisch validieren** (JSON.parse aller jsonb-Felder, Pflichtfelder zählen) BEVOR User kopiert
4. SQL-Generator schreibt **direkt in Datei** (`fs.writeFileSync`), nie über stdout (sonst landet `2>&1` Log-Müll in der SQL)
5. Ausführung: Supabase SQL Editor (umgeht RLS). Anon-Key-Insert via REST scheitert an RLS — nur zum **Lesen** nutzen.

## Was aus Kalo übernehmen

Lokales Schwester-Projekt: `~/Claude Code/CodingDojo/Kalo`. Daraus extrahieren:

- **Recipe Parser System Prompt + Few-Shots** (`src/lib/prompts/recipeParserPrompt.ts`)
- **Recipe Schema** (`src/lib/types/recipe.ts`) — anpassen: `user_id` → `workspace_id` + `created_by`
- **Edge Function `import-recipe-from-url`** (Insta oEmbed + Storage Mirror)
- **Edge Function `search-recipe-image`** (Openverse-Bildsuche)
- **Storage-Bucket-Migration** (`recipe-images`)

Nicht übernehmen: Kalorientracking, Meal Parser, Aktivitäts-Tracking, Wassertracking — das ist Kalo-spezifisch.

## Deployment

- GitHub Repo (NEU anlegen, separater Repo von Kalo)
- Vercel verlinkt mit GitHub → auto-deploy on push to main
- Supabase neues Projekt anlegen (separater Workspace)
- `.env.local` für lokal, Vercel-Env-Vars für Prod

## Initial Setup Checklist (für Sprint 1)

- [ ] `npm create vite@latest` mit React+TS Template
- [ ] `npm i @supabase/supabase-js @dnd-kit/core date-fns react-router-dom`
- [ ] `npm i -D vite-plugin-pwa`
- [ ] Supabase-Projekt anlegen, Anonymous Auth aktivieren
- [ ] DB-Schema aus `PROJECT-SPEC.md` Sektion 5 anwenden
- [ ] Storage-Bucket `recipe-images` aus Kalo migrieren
- [ ] Groq API-Key holen, in Supabase Secrets setzen
- [ ] PWA-Manifest mit iOS-Icons (180x180, 1024x1024)
- [ ] `vercel.json` einrichten
- [ ] Vercel mit GitHub verbinden

## Auto-Deploy Workflow

Wenn Code-Änderungen production-ready sind:
1. `npx tsc --noEmit` — TypeScript validieren
2. `git add . && git commit -m "..."` — committen
3. `git push` — Vercel deployed automatisch
4. Bei Edge Functions: `supabase functions deploy <name>` zusätzlich

## Test-Strategie

MVP: manuelles Testen im Browser + auf iPad/iPhone via Vercel-Preview-URL.
Später: Vitest für Logic, Playwright für E2E.

## Sprint-Chat-Modell (optimiert für große Projekte)

**Struktur:** Pro Sprint = neuer Chat + frischer Context. Innerhalb des Sprints: regelmäßige automatisierte Commits + HANDOFF-Updates + Clean-Exit mit `/clear`.

### Sprint-Lifecycle

#### Phase 1: Development (innerhalb eines Chats)
- **Zu Beginn:** HANDOFF.md lesen → Kontext verstehen
- **Während Arbeit:** Jede fertige Feature/Bugfix → `git commit`
- **Milestone-Checks:** Alle ~2-3h oder bei Context >70%:
  - HANDOFF.md aktualisieren (Stand + Pitfalls + Next-Actions)
  - `git push`
  - Ggf. `/clear` für neuen Chat (falls Context-eng) — aber NO breaks: nur bei natürlichen Breakpoints (Commit+Test vergeben)

#### Phase 2: Deployment & Testing
- Feature auf Vercel live
- Manual Testing + Bugs sammeln
- Bei Bugs: Inline-Fixes im gleichen Chat, re-push

#### Phase 3: Sprint-Ende (Acceptance + Optimization)
Sobald: **Developed + Deployed + Tested + Akzeptiert** (oder Bugs fixed)

**DANN (neuer Chat, neue Iteration):**
1. **UX-Audit anbieten** — am Ende jedes größeren Sprints Thomas fragen:
   „Soll ich den `mahlzeit-ux-audit` Skill drüberlaufen lassen?" Nicht
   ungefragt durchführen, aber **aktiv anbieten** (er will das explizit).
2. `memory-consolidation` — MEMORY.md aufräumen (Duplikate, stale facts)
3. `fewer-permission-prompts` — Permission-Allowlist für häufige Calls
4. Docs-Struktur prüfen (zu viel Redundanz? Stale Docs?)
5. Backlog-Refinement (vor dem nächsten Sprint)
6. **NEUER SPRINT-CHAT** mit frischem Context

### HANDOFF.md Template — was IMMER rein
- **Status:** Aktueller Sprint + Phase (dev/testing/done)
- **Sofort-Priorität:** Top 3 Blockers oder Next-Actions
- **Bugs:** Aktuelle Fehler + Reproduzierungsschritte
- **Offene Themen:** Was ist noch unklar?
- **Pitfalls:** Was wir gelernt haben (Gotchas, Constraints)
- **Optimization Feedback** (NEU!):
  - Was lief gut? Was war lahm?
  - Wo hat Claude zu viel nachgefragt?
  - Code-Patterns die sich wiederholen?
  - → Für nächsten Sprint besser machen

### Was IMMER persistiert wird (nie aus dem Context verlieren)
- Architecture Decisions → `PROJECT-SPEC.md`
- Visual/Mood Decisions → `DESIGN-BRIEF.md`
- Setup-Schritte → `SETUP.md`
- Sprint-Backlog + offene Bugs + Optimization-Feedback → `HANDOFF.md`
- Auto-Migration-Files → `supabase/migrations/`
- Edge-Functions → `supabase/functions/`

Damit ist `/clear` schmerzfrei — neue Session findet alles wieder im Repo.

## Dont's

- Nicht ungefragt Premium-Features integrieren (Stripe, etc.)
- Nicht TailwindCSS einführen
- Nicht in Kalo committen
- Nicht spaghetti-code: Components splitten wenn >200 Zeilen
- Nicht halluzinieren bei Quellen — wenn unsicher, web search machen
