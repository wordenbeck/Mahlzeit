---
name: mahlzeit-ux-audit
description: >
  Führt einen fokussierten UX/UI-Review der MealPlanner-PWA durch — entweder
  einer einzelnen Komponente/View ODER der gesamten App inkl. Informations-
  architektur. Nutze diesen Skill IMMER, wenn der User einen "UX-Audit",
  "UI-Review", "Design-Review", "Usability-Check" wünscht, eine View/Komponente
  "reviewen", "auditieren" oder "kritisieren" lassen will, oder fragt warum sich
  Screens "doppelt", "überfrachtet", "unrund" oder "nicht iPhone-tauglich"
  anfühlen — auch wenn das Wort "Audit" nicht fällt. Liest die echten Components
  unter src/pages und src/components (.tsx UND .css zusammen), prüft konkrete
  Heuristiken und liefert deutschsprachige, nach Severity sortierte Findings mit
  Datei:Zeile-Referenz und umsetzbarem Fix.
argument-hint: "[Komponenten-Name, View, oder 'ganze App']"
---

# Mahlzeit UX/UI-Review

## Wozu dieser Skill

MealPlanner ist eine Familien-Kochplanungs-PWA (React + Vite, Vanilla CSS, kein
Tailwind/MUI). Ursprünglich iPad-first gebaut, real **am iPhone** benutzt. Daraus
entstehen systematische Probleme: Desktop-Layouts die am Handy überlaufen, Flows
für große Screens, und **redundante Wege zum selben Ziel** (z.B. Plan-Seite vs.
Wochenübersicht).

Deine Aufgabe ist es, **echte Probleme zu finden — keine Checkliste abzuhaken.**
Sei konkret, knapp, nützlich. Wenn etwas solide ist, sag das kurz und erfinde
keine Probleme.

## Grundhaltung

- **Ehrlich, nicht nett.** Ein Audit der alles gut findet ist wertlos. Aber:
  keine erfundenen Probleme um die Liste zu füllen.
- **Struktur vor Pixeln.** Ein überlaufender Rahmen ist ein Symptom. Frag *warum*
  — oft ist es ein Layout-Pattern das am ganzen Screen falsch ist.
- **Vom Nutzer-Flow her.** Kern-Workflow: *Sonntag hinsetzen → Rezepte stöbern →
  einem Tag zuordnen*. Bewerte daran, nicht an abstrakter Schönheit.
- **Begründen.** Jedes Finding bekommt ein *Warum* (welche Heuristik / welcher
  Nutzer-Schmerz), nicht nur ein *Was*.

## Scope bestimmen (erster Schritt)

- **Argument = Komponente/View** (z.B. "RezeptDetail", "current view"): Nur diese
  reviewen. Wenn mehrere Dateien relevant sind und unklar ist welche zuerst,
  **kurz nachfragen**.
- **Argument = "ganze App" / kein Argument bei Audit-Wunsch:** Voller Durchlauf
  inkl. Screen-Landkarte und IA-Pass (siehe unten).

Immer `.tsx` **und** das zugehörige `.css` zusammen lesen — der Bug steckt oft im
Zusammenspiel (z.B. `position: sticky`/`touch-action: none` im CSS + langer
Scroll-Content im TSX). Lies bei Bedarf `CLAUDE.md` im Root für Tech-Grenzen.

## Review-Dimensionen

Geh diese der Reihe nach durch. Überspring was klar nicht zutrifft. Nutze sie als
Linse, nicht als Abhak-Liste — was *nicht* auf der Liste steht ist oft das
Wertvollste.

### 1. Visuelle Hierarchie
- Ist die Primär-Aktion auf einen Blick klar? (z.B. „Rezept einplanen", „Neu")
- Lenken Schriftgrößen/-gewichte das Auge richtig?
- Gibt es visuelles Rauschen das mit dem Kern-Content konkurriert?

### 2. Layout & Abstände
- Sind Abstände konsistent? (hier: CSS-Custom-Props `--space-*`, nicht beliebige
  px-Werte — **kein Tailwind**, das ist im Projekt verboten)
- Atmet das Layout oder ist es gequetscht?
- Sind Karten/Listen-Items korrekt visuell gruppiert?

### 3. Mobile (375px, iPhone — PRIMÄR)
- Hält das Layout bei 375px Breite?
- **Tap-Targets ≥ 44×44px** (Buttons, Icons, Lösch-Knöpfe)? Such nach festen
  `width`/`height` < 44px auf interaktiven Elementen.
- **Unbeabsichtigtes horizontales Scrollen?** Feste px-`width`, `100vw`, breite
  `minmax()`, fehlendes `box-sizing: border-box` / `overflow-x: hidden`.
- **Scroll-Jank?** `touch-action: none` auf Listen-Items (killt Scrollen am
  Touch!), verschachtelte Scroll-Container, schwere `backdrop-filter`/`blur`,
  `box-shadow` auf vielen Items.
- **Sticky-Fallen:** `position: sticky`/`fixed` das am Handy Content verdeckt —
  am Desktop ok, unter Breakpoint deaktivieren.
- **Drag&Drop am Touch:** elegant am Desktop, fummelig am Handy. Gibt es eine
  Tap-Alternative?

### 4. Interaktions-Zustände
- **Loading** behandelt (Skeleton/Spinner/Placeholder)?
- **Error** behandelt (API-Fehler, leere Suche)?
- **Empty** behandelt (keine Mahlzeiten geplant, keine Treffer)?
- Bekommt der Nutzer **Feedback nach einer Aktion** (eingeplant, gespeichert)?
- Sind native `confirm()`/`alert()` im Einsatz? Funktioniert, fühlt sich aber
  un-app-ig an → später durch eigene Sheets ersetzen.

### 5. Accessibility (a11y)
- Haben Bilder beschreibendes `alt`?
- Sind interaktive Elemente per Tastatur erreichbar (`Tab`/`Enter`)? Echte
  `<button>`/`<a>` statt `onClick` auf `<div>`?
- Reicht der Kontrast (WCAG AA: ≥ 4.5:1 für Text)? Achte auf helle Grün-Töne auf
  hellem Hintergrund.
- Sind Formular-Labels mit ihren Inputs verknüpft (`htmlFor`/`id`)?

### 6. Meal-Planner-spezifisch
- Ist die Wochen-/Tagesstruktur scanbar?
- Kann der Nutzer Fehler leicht rückgängig machen (Slot löschen, Undo)?
- Wird Portions-/Mengen-Info gezeigt ohne zu überfordern?
- Sind Zubereitungsschritte beim Kochen lesbar (große Schrift, Schritt für
  Schritt)?

## IA-/Redundanz-Pass (nur im App-weiten Modus)

Tritt einen Schritt zurück:
- **Zwei Wege, ein Ziel?** Bieten zwei Screens dieselbe Kern-Aktion → Zusammen-
  führungs-Kandidat. (Teuer: doppelte Pflege, doppelte Bugs, Entscheidungslast.)
- **Navigations-Last:** Wie viele Tabs? Überlappen einige?
- **Mentales Modell:** Kann der Nutzer in einem Satz sagen was jeder Screen tut?
- **Flow-Reibung:** Zähle die Taps für den Kern-Workflow. Jeder Screen-Wechsel
  ist Reibung.

## Finding-Format

Jedes Finding in **einer** knappen Zeile, gruppiert nach Severity:

```
[severity] `datei.tsx:Zeile` → Problem (kurz, mit Warum) → Empfehlung (konkret)
```

**Severity-Stufen:**
- 🔴 **kritisch** — blockt den Nutzer / riskiert Datenverlust. Sei streng: wenn
  alles kritisch ist, ist nichts kritisch.
- 🟠 **wichtig** — verschlechtert die Erfahrung spürbar, Workflow geht aber noch.
- 🟡 **politur** — Konsistenz / Feinschliff.

## Report-Struktur

**Komponenten-Modus** (eine View): direkt die Findings nach Severity gruppiert,
dann Top-3.

**App-weiter Modus:** zusätzlich vorne die Screen-Landkarte und hinten der
IA-Abschnitt:

```
# 🔍 UX/UI-Review — <Scope>
**Datum:** JJJJ-MM-TT

## 📐 Screen-Landkarte   (nur app-weit)
<Tabelle: Route | Aufgabe in 1 Satz | Überschneidung>

## 🔴 Kritisch
[🔴] `datei:Zeile` → Problem → Empfehlung

## 🟠 Wichtig
[🟠] ...

## 🟡 Politur
[🟡] ...

## 🧭 Informationsarchitektur   (nur app-weit)
<Redundanzen, Zusammenführungs-Vorschläge, Ziel-Navigation>

## ⭐ Top-3-Prioritäten
<Die 3 Fixes mit dem besten Impact-zu-Aufwand-Verhältnis, nummeriert.>
```

Wenn die Komponente solide ist: sag das kurz und hör auf.

## Worauf NICHT reinfallen

- **Nicht alles "kritisch" nennen.** Kritisch = blockt Workflow oder riskiert
  Datenverlust.
- **Keine generischen Plattitüden.** "Mehr Whitespace" ohne Datei-Bezug ist
  wertlos. Jedes Finding hängt an echtem Code.
- **Nicht über-engineeren.** Free-Tier (Supabase/Vercel), Coding-Anfänger,
  Familien-tauglich. **Keine** Design-Systeme, **keine** externen UI-Libs
  (Tailwind/MUI laut CLAUDE.md verboten), keine Rewrites wo ein CSS-Fix reicht.
- **Probleme nicht erfinden.** Eine ehrliche „sieht gut aus"-Zeile ist mehr wert
  als drei konstruierte Findings.
