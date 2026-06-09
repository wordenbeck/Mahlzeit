# Setup — Sprint 1

Diese Schritte musst du selbst durchklicken (Account-Aktionen). Code-Stand ist fertig vorbereitet — sobald `.env.local` korrekt ist und die Migration applied wurde, läuft der Onboarding-Flow live gegen deine Supabase-Instanz.

Geschätzte Zeit: **~25 Minuten**.

---

## 1. GitHub Repo (3 min)

1. https://github.com/new → Repo `mealplanner` (privat) erstellen
2. Lokal:
   ```bash
   cd "/Users/thomaswordenbeck/Claude Code/CodingDojo/MealPlanner"
   git init
   git add .
   git commit -m "Sprint 0 + Sprint 1 base"
   git branch -M main
   git remote add origin git@github.com:<dein-user>/mealplanner.git
   git push -u origin main
   ```

## 2. Supabase Projekt (5 min)

1. https://supabase.com/dashboard → New Project
   - **Name:** `mealplanner`
   - **Region:** `Frankfurt (eu-central-1)` (niedrigste Latenz für DE)
   - **Password:** sicher (in Bitwarden o.ä.)
2. Warten bis Provisioning durch (~2 min)
3. **API-Keys** kopieren: Project Settings → API
   - `Project URL` → wird `VITE_SUPABASE_URL`
   - `anon public` Key → wird `VITE_SUPABASE_ANON_KEY`
4. **Anonymous Auth aktivieren:** Authentication → Providers → Anonymous Sign-Ins → **enable**

## 3. .env.local (1 min)

```bash
cd "/Users/thomaswordenbeck/Claude Code/CodingDojo/MealPlanner"
cat > .env.local <<EOF
VITE_SUPABASE_URL=https://<dein-projekt>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
EOF
```

`.env.local` ist in `.gitignore` (kommt nie in den Repo).

## 4. DB-Migration applyen (5 min)

**Option A — Einfach (Web-UI):**
1. Supabase Dashboard → SQL Editor → New Query
2. Inhalt von `supabase/migrations/20260508120000_initial_schema.sql` reinkopieren
3. **Run**
4. Sollte ohne Fehler durchlaufen

**Option B — CLI (für später, eleganter):**
```bash
# Einmalig
brew install supabase/tap/supabase
supabase login
supabase link --project-ref <dein-projekt-ref>

# Migration applyen
supabase db push
```

## 5. Vercel verbinden (5 min) — optional jetzt, nötig vor Live-Demo

1. https://vercel.com → New Project → Import GitHub Repo `mealplanner`
2. **Environment Variables** setzen:
   - `VITE_SUPABASE_URL` = (gleicher Wert wie .env.local)
   - `VITE_SUPABASE_ANON_KEY` = (gleicher Wert)
3. Deploy

Dann auto-deployt jeder `git push` zu main.

## 6. Lokal testen (2 min)

```bash
npm run dev
```

→ http://localhost:5173/

**Erwarteter Flow:**
1. Landest auf `/` → wird zu `/onboarding` umgeleitet (kein Profile)
2. Name eingeben → "Neuen Haushalt anlegen" → Workspace-Name → fertig
3. Du landest auf `/` (Heute-Stub) mit deinem App-Menü oben
4. App-Menü zeigt deinen Profile-Dot in der Profile-Color rechts
5. Klick auf alle 5 Items → Stub-Pages mit „kommt in Sprint X"-Hinweis

**Testen ob Auth funktioniert:**
- Browser-DevTools → Application → Local Storage → `sb-*-auth-token` sollte da sein
- Supabase Dashboard → Authentication → Users → ein Anonymous-User mit deiner UUID
- Supabase Dashboard → Table Editor → `workspaces` + `profiles` → Einträge sichtbar

**Beitreten testen** (zweites Browser-Profil oder Inkognito):
1. Code aus deinem Workspace kopieren (z.B. `KOCH-42`)
2. Inkognito → http://localhost:5173/join/KOCH-42 (oder onboarding manuell)
3. Anderen Namen eingeben → Beitreten → landest mit zweitem Profile im selben Workspace

---

## Troubleshooting

| Symptom | Ursache | Fix |
|---|---|---|
| Onboarding zeigt „Setup nicht abgeschlossen" | `.env.local` fehlt oder leer | Werte eintragen, Dev-Server neu starten |
| „Workspace nicht gefunden" beim Beitreten | RLS blockt anonymen Lookup | Anonymous Auth in Supabase aktiv? |
| TypeScript-Fehler in `lib/supabase.ts` | `database.types.ts` veraltet | Später via `supabase gen types typescript` regenerieren |
| Vercel-Build schlägt fehl | ENV-Vars nicht gesetzt | Project Settings → Environment Variables |

## Was als nächstes (Sprint 2)

Wenn der Onboarding-Flow live läuft:
- Recipe-Schema ist da, aber leer → Sprint 2 baut Import-Edge-Functions (Insta + URL) aus Kalo
- Recipe-Detail- und Manuell-Eingabe-Page kommen mit Sprint 2
- Sprint 3 zieht das Plan-Board-UI aus dem Prototyp `/proto/board-a` in die echte `/plan`-Route
