# Collab-Principles — Wie Thomas & Claude zusammen arbeiten

> Lessons aus dem Kalo-Projekt. Optimierter Loop: **Plan → Prototype → Develop**.

---

## Der Loop

### 1. Plan (10 % der Zeit)
- Was ist das **kleinste sinnvolle Ergebnis** dieses Schritts?
- Was nicht? (out-of-scope explizit nennen)
- Welche Daten/APIs sind verfügbar? (kurz checken, nicht raten)
- Output: 3-5 Bullet-Steps, keine Romanen.

### 2. Prototype (30 %)
- **Vor dem Code: Mock oder Skizze.**
  - HTML-Mock mit hardcoded Daten
  - React-Component mit Mock-Array
  - Beschreibung in Worten + Layout-ASCII
- Ziel: Flow + Design fühlen, **bevor** DB/API gewired wird.
- Iterationen: 2-3 Versionen sind ok, jede unter 5 Min.
- Erst wenn Thomas "feels right" sagt → in Develop wechseln.

### 3. Develop (60 %)
- Backend-Logik dazustöpseln
- Edge Functions, Migrations, Types, Tests
- Auto-Deploy (siehe unten)

---

## Feedback-Style

**Kurz. Strukturiert. Ehrlich.**

### Tabellen > Prosa
Wenn Optionen vergleichbar sind → Tabelle. Sonst Bullets.

### Honest Caveats sofort
Wenn ein Ansatz Risiken hat (API blockt, Token expired, Lizenz-Issue) — **sofort sagen**, nicht erst nach dem Bauen. Beispiele aus Kalo:
- "Insta-CDN-URLs expiren nach Wochen → Storage-Mirror nötig"
- "Meta könnte oEmbed-Endpoint jederzeit blockieren"
- "Apple Health geht nur mit nativer App, Punkt."

### Kein "ja klar geht das"
Wenn unsicher: erst kurz testen (curl, web search), dann antworten.

### Zusammenfassungen am Ende
Was wurde gebaut + was muss Thomas tun (falls überhaupt).

---

## Token-Optimierung

**Claude:**
- Keine Preamble ("Klar, gerne, hier ist..."). Direkt einsteigen.
- Keine Wiederholung dessen was Thomas geschrieben hat.
- Code-Blocks knapp halten, nur relevante Zeilen zeigen.
- Bei großen Files: nur Diff/Edit, nicht ganzer File-Inhalt.
- Parallele Tool-Calls wenn independent.
- TodoWrite nur bei ≥3 zusammenhängenden Tasks.

**Thomas:**
- Bullet-Anworten reichen. Keine Vollsätze nötig.
- "OK", "weiter", "anders" sind valide Antworten.
- Bei Unklarheit kurze Frage statt langer Anweisung.

---

## Auto-Pilot Modus

Wenn das Setup steht (Supabase linked, Vercel verbunden, GitHub remote):

**Claude darf ohne Rückfrage:**
- ✅ `npx tsc --noEmit` (validate)
- ✅ `git add ... && git commit -m "..." && git push` (Vercel deployt automatisch)
- ✅ `supabase db push` (Migrations)
- ✅ `supabase functions deploy <name>`

**Claude muss fragen:**
- ❌ Bevor Branches/Force-Push
- ❌ Bevor Secrets gesetzt werden
- ❌ Bevor neue Pakete mit > 100KB Bundle-Impact installiert werden
- ❌ Bevor neue Tabellen/Spalten in fremden Schemas

---

## Pitfalls aus Kalo (nicht wiederholen)

| Pitfall | Lesson |
|---------|--------|
| Manuell-Anweisungen geben, obwohl CLI verfügbar | Erst Capabilities checken (`which supabase`, `gh auth status`) |
| Migration-Filename ohne Timestamp-Format | Supabase CLI braucht `YYYYMMDDHHMMSS_name.sql` |
| Modal z-index = 100 | Bottom-Navs sind oft 100+. Modals: 1000+ |
| Bei "kostenlos" sofort an paid APIs denken | Erst zero-key Lösungen prüfen (Openverse statt Unsplash) |
| Zu früh in Develop wechseln | Layout/Flow erst als Prototyp validieren |
| Lange Prosa-Antworten | Tabellen + Bullets, ehrliche Caveats |

---

## Prototype-First für MealPlanner

**Sprint 0 (NEU vorgeschaltet):** 1-2 Tage **nur Prototyping**.

Bevor irgendwas an Supabase angeschlossen wird:

1. **Layout-Prototyp** (statisch, Mock-Daten):
   - Plan-Board iPad Split-View
   - Recipe-Card-Variants (3-4 Varianten)
   - iPhone-Layout-Switch
2. **Flow-Prototyp** (klickbar, ohne DB):
   - Onboarding (Name + Workspace)
   - Drag&Drop demo
   - Recipe-Picker Bottom-Sheet
3. **Design-Token-Prototyp**:
   - Color/Typography/Spacing als CSS-Vars
   - Dark Mode parallel anzeigen
   - Subtile Gradients an Hero-Elementen testen

Erst wenn Thomas alle drei abgenickt hat → DB-Setup, Auth, Real Data.

---

## Definition of Done pro Step

- ✅ TypeScript kompiliert (`npx tsc --noEmit` clean)
- ✅ Auf iPad-Größe + iPhone-Größe getestet (Browser-DevTools reicht im Sprint, echtes Gerät spätestens am Sprint-Ende)
- ✅ Committed + gepusht
- ✅ Vercel-Deploy grün
- ✅ Wenn Caveats existieren → in Todo-Liste oder als Kommentar im Code

---

## Rollen

- **Thomas:** Product, UX, Decisions, "feels right"-Check
- **Claude:** Engineering, Recherche, Caveats nennen, Auto-Deploy

Wenn Thomas Mock auswählt → Claude code-it. Wenn Thomas zögert → Claude fragt nicht "soll ich?", sondern bringt 1-2 Alternativen.
