# CLAUDE.md — MealPlanner

> Arbeitsregeln für Claude Code in diesem Projekt. Wird automatisch geladen.

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

## Session-Management & Token-Feedback-Loop

Lange Sessions verlieren am Ende Kontext (Auto-Compact). Damit Wissen nicht verloren geht und der Workflow effizient bleibt, hält Claude folgende Routine:

### Proaktive Checks
- **Nach jeder größeren Feature-Welle** (Sprint-Ende) `HANDOFF.md` updaten: Stand + offene Themen + Pitfalls
- **Wenn das Gefühl aufkommt** dass Context-Fenster eng wird (Anzeichen: User nutzt `/context` und zeigt >70%, oder die Session läuft seit vielen Iterationen): proaktiv vorschlagen „Zeit für `HANDOFF.md`-Update + `/clear`"
- **Wenn User `/context` schickt mit >65%**: Vor weiterer Arbeit zuerst HANDOFF aktualisieren

### HANDOFF-Update-Disziplin
Beim Update IMMER:
- Kompakter machen (alte erledigte Features kürzen, nur die wichtigsten Pitfalls behalten)
- Neue offene Themen ergänzen (Blocker-erst)
- Status der Sprint-Tabelle synchronisieren
- „Erste Aktion für nächste Session" am Ende konkretisieren
- NIE wichtige Decisions löschen — eher zu `PROJECT-SPEC.md` oder `DESIGN-BRIEF.md` verschieben

### Wenn nahe am Token-Limit
1. Vorschlagen: Aktuelle Aufgabe sauber zu Ende + committen + pushen
2. HANDOFF.md aktualisieren (Sprint-Tabelle + Pitfalls + Sofort-Priorität)
3. `/clear` machen
4. Neue Session liest HANDOFF + CLAUDE + relevante Docs → arbeitet weiter

### Was IMMER persistiert wird (nie aus dem Context verlieren)
- Architecture Decisions → `PROJECT-SPEC.md`
- Visual/Mood Decisions → `DESIGN-BRIEF.md`
- Setup-Schritte → `SETUP.md`
- Sprint-Backlog + offene Bugs → `HANDOFF.md`
- Auto-Migration-Files → `supabase/migrations/`
- Edge-Functions → `supabase/functions/`

Dann ist `/clear` schmerzfrei — neue Session findet alles wieder im Repo.

## Dont's

- Nicht ungefragt Premium-Features integrieren (Stripe, etc.)
- Nicht TailwindCSS einführen
- Nicht in Kalo committen
- Nicht spaghetti-code: Components splitten wenn >200 Zeilen
- Nicht halluzinieren bei Quellen — wenn unsicher, web search machen
