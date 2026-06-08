# Design-Entscheidungen — Mahlzeit

> Gelernt aus den bisherigen Runden mit Thomas. **Verbindlich für alle Mockups & Code.**
> Quelle der Tokens: `src/styles/tokens.css` · visuelle Referenz: `mockups/design-system.html`

## Grundprinzipien

1. **Inhalt vor Verwaltung.** Das Rezept (Zutaten, Schritte) dominiert. Tracking/Aktionen
   schrumpfen auf das Minimum — am liebsten als Icons aufs Bild, nicht als eigene Kacheln.
2. **Kein Platz verschenken.** Keine großen Buttons/Panels wo ein Icon reicht. Dichte, aber
   ruhige Layouts. „Gedrungen" vermeiden durch Verteilung (space-between), nicht durch Weglassen.
3. **Ein Grün.** Nur Tokens (`--accent`, `--gradient-cta`). Nie Fremdfarben (#4caf50, #2196f3 …).
4. **Klassen statt Inline-Styles.** Jede Komponente hat ihr CSS. Responsive via CSS-Media-Query,
   nicht via JS-Breakpoint-Hooks.
5. **Gleiche Größen.** Karten in einem Grid sind exakt gleich hoch (Karte füllt Zelle, Titel
   reserviert 2 Zeilen). Nie ragged.
6. **Linien-Icons (lucide), keine Emojis** in der UI-Chrome. Emojis nur als Inhalt/Deko erlaubt.
7. **iPhone-first**, Desktop/iPad skaliert hoch. Tap-Targets ≥ 44px.

## Icon-System (verbindlich)

| Bedeutung | Icon | Hinweis |
|---|---|---|
| Favorit | **Lesezeichen** (Bookmark) | NICHT Stern — der ist fürs Rating |
| Gekocht + bewerten | **Kochlöffel** (UtensilsCrossed) | öffnet Sheet: Sterne + optionale Notiz |
| Rating (Anzeige) | **Sterne** ★ | nur Anzeige, dezent, mit voll/halb/leer |
| Bearbeiten | feiner **Linien-Stift** (lucide Pencil) | kein Emoji-Stift |
| Quelle/Link | **ExternalLink** ↗ | |
| Dauer / Aufwand / Portion | Clock / ChefHat / Users | je mit Icon, **space-between** verteilt |

## Karten (Rezept)

- **Hochkant:** Bild oben (aspect 4/3), Infos darunter. 2 pro Reihe am iPhone, auto-fill Desktop.
- Gleiche Höhe (`height:100%`, Body `flex:1`, Titel min. 2 Zeilen).
- Aktions-Buttons (z.B. „+ Tag" im Plan) liegen **aufs Bild** (oben rechts), **nie über Text**.

## Detail-Seite (entschieden: **Banner-Hero**)

- Großes Bild oben (Banner ~230px), Overlays:
  - oben links: zurück · oben rechts: Stift / Kochlöffel / Lesezeichen / Quelle
  - unten links: dezenter Sterne-Badge (nur wenn bewertet)
- Darunter: Titel, Beschreibung, **Meta-Reihe mit Icons & space-between** (Dauer links ·
  Aufwand mittig · Portion rechts), dann **Read-only Typ-Pill**.
- **Zutaten | Zubereitung** auf einen Blick (2-spaltig Desktop, gestapelt iPhone).
- **Notizen** (Haushalt) unten. **Löschen** ganz unten, dezent.
- **Edit-Mode:** Typ-Auswahl als Pills, Felder, Bild ändern. Speichern erst aktiv bei Änderung.
- **Read-only vs. Auswahl:** In der Ansicht nur den gewählten Wert als Pill zeigen
  (sieht nicht nach Auswahl aus). Die Auswahl lebt im Edit.

## Plan-Seite (entschieden)

- **Tag-Tabs oben** (alle 7, gewählter hervorgehoben) → **Inhalte des Tages direkt darunter**.
- Rezept-Bibliothek darunter: **Klick = Detailseite**, **+ aufs Bild = zum gewählten Tag**
  (das + zeigt den Ziel-Tag, z.B. „+ Mi", damit nie unklar ist wohin).
- Kein Drag&Drop (Touch-untauglich). Kein Magic Fill (vorerst raus → Backlog).
- Mahlzeit-Sonne/Mond-Icons raus.
- **Tag-Farben: ENTSCHIEDEN = schlicht grün** (keine Pastell-Tagfarben). Gewählter Tag via
  Akzent-Gradient hervorgehoben, verplante Tage via gefülltem Punkt/Count.

## Text-Umbruch (ENTSCHIEDEN)

- **Lange Titel auf Karten/Listen: kürzen mit … (max 2 Zeilen)**, Karten exakt gleich hoch.
  Voller Name nur auf der Detailseite. Gilt für Rezeptkarten, Plan, Einkauf, Liste.
- Zutaten-Namen in Listen ebenfalls 1 Zeile + Ellipsis; lange Einheiten/Mengen tabellarisch.

## Was vermeiden (gelernt aus Frust)

- Reaktives „Punkt-für-Punkt im Code" ohne Gesamtbild → erzeugt Inkonsistenz. **Erst Mockup,
  dann Code.**
- Stern für zwei Bedeutungen (Favorit + Rating) → verwirrt. Getrennte Icons.
- Auswahl-Pills im Lesemodus → sieht nach Aktion aus. Read-only-Pill nutzen.
- Aktionen die Text überlappen (absolut positioniert über Body).
- Mehrere konkurrierende Komponenten mit eigenem Look (→ gewürfelt). Einheitliche Panels.

## Einkauf prüfen (ENTSCHIEDEN)

- **Tag-Tabs sticky oben.** Darunter EINE durchgehende Liste aller verplanten Rezepte,
  **nach Tagen gruppiert mit dezenten Trennern**.
- **Scroll-Spy:** Beim Scrollen wechselt der aktive Tab automatisch mit. Tab-Klick **springt**
  zum jeweiligen Tag in der Liste. Tabs bleiben stehen.
- Pro Rezept: Portions-Stepper + skalierte Mengen (Name links, Menge rechts, tabellarisch).
- Desktop: Spalten pro Tag (bewährt, beibehalten).

## Einkaufsliste (ENTSCHIEDEN)

- **Layout B (tabellarisch, einzeilig).** Spalten: Haken · Name (kürzt mit …) · Menge · Tag.
- **Tage als Kurz-Pill** (Mi, Do) statt Punkte — muss **einzeilig** bleiben.
- **Kein Löschen/X** — der Haken („gekauft") reicht. (X + Haken war doppelt.)
- **Kategorien als optionaler Umschalter** (B ↔ nach Kategorie gruppiert). Offen ob nötig.
- **Menge editierbar als freies Textfeld** (kein Stepper, keine ±-Icons).
- **Export** als Aktion (oben rechts + große Aktion unten): Teilen/Kopieren/PDF.
- Einkauf prüfen: Tab-Klick scrollt die gewählte Tag-Sektion an den **oberen Rand**.

## Mockup-Regeln

- **~100% echter Inhalt** (echte Rezeptnamen/Zutaten/Schritte), echte Tokens.
- iPhone + (wo relevant) Desktop zeigen.
- **3 Varianten pro Seite**, klar beschriftet, mit kurzer Begründung je Variante.

## Profil (ENTSCHIEDEN: Variante B kombiniert)

- Eine Karte oben: Avatar + Name (✎) + Haushalt + **Mitgliederliste** (mit „du"-Badge).
- Einladen separat: Code + Link-Teilen, **QR versteckt** (auf Tipp).
- Einladen öffnet `/join/<code>` → „<Name> lädt dich ein: <Haushalt> beitreten" **oder**
  „eigenen Haushalt erstellen".
- Neuer Block **„Konto & Geräte"**.

## Auth / Identität (RICHTUNG, eigener Sprint)

- **Anonym starten (frictionless) + optional „Konto sichern"** via E-Mail/Telefon-OTP
  (Supabase linkIdentity / updateUser+OTP). Passwortlos.
- Löst doppelte Accounts + iPad/Handy-Kopplung dauerhaft.
- Name+Code+PIN verworfen (Supabase kann anon-User nicht sauber per PIN re-authen).
- **Eigener Sprint nach dem visuellen Redesign** — backend-lastig, sorgfältig testen.

## Auth — VORERST GEPARKT (2026-06)

- Entscheidung vertagt. Optionen geklärt: **E-Mail-OTP** (bestes Aufwand/Nutzen) vs.
  Code+Name+PIN (mehr Aufwand/Risiko). Kein Build vorerst.
- Realität: ~2 Personen, 3-4 Geräte. Duplikate (mehrere „Jacks") sind der Schmerz,
  aber kein Blocker. Interim: nicht die PWA löschen → localStorage-Session bleibt.
- Wenn aufgegriffen: E-Mail-OTP empfohlen (Supabase nativ, passwordless, 1× pro Gerät).
