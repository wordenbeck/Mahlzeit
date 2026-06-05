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
- **Offen/zu testen:** Wochentags-Farbpalette (peach/butter/sage…) für Wiedererkennung —
  wird in den Plan-Mockups gegenübergestellt.

## Was vermeiden (gelernt aus Frust)

- Reaktives „Punkt-für-Punkt im Code" ohne Gesamtbild → erzeugt Inkonsistenz. **Erst Mockup,
  dann Code.**
- Stern für zwei Bedeutungen (Favorit + Rating) → verwirrt. Getrennte Icons.
- Auswahl-Pills im Lesemodus → sieht nach Aktion aus. Read-only-Pill nutzen.
- Aktionen die Text überlappen (absolut positioniert über Body).
- Mehrere konkurrierende Komponenten mit eigenem Look (→ gewürfelt). Einheitliche Panels.

## Mockup-Regeln

- **~100% echter Inhalt** (echte Rezeptnamen/Zutaten/Schritte), echte Tokens.
- iPhone + (wo relevant) Desktop zeigen.
- **3 Varianten pro Seite**, klar beschriftet, mit kurzer Begründung je Variante.
