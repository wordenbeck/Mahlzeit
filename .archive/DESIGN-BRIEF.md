# Design Brief — MealPlanner

> Briefing für den Design-Pass mit Claude Design (oder einer separaten Design-Session). Wird angewendet **nachdem** die Funktionalität steht.

---

## Vision in einem Satz

**Die digitale Pinwand am Kühlschrank — aber als iPad-App.**

Warm, einladend, kein klinisches Tracking-Tool. Es soll Spaß machen, sich am Sonntagabend hinzusetzen und die Woche zu planen.

---

## Mood

- **Wärme:** Off-White Backgrounds, weiche Schatten, kein Pure-White-Kontrast
- **Freude:** Rezept-Bilder als visuelle Helden, nicht klein versteckt
- **Klarheit:** keine Überladung, viel Whitespace, klare Hierarchie
- **iOS-feeling:** SF Pro System Font, Standard iOS Border-Radius, Haptic Feedback wo möglich

**Akzent:** **Emerald** als Primärfarbe (Stitch-Vibe — frisch, healthy, küchen-passend) auf warmem Cream-Background. Dezente **Farbverläufe** an Hero-Elementen (Heute-Tag, Onboarding-Splash, primäre CTAs). Keine harten Gradients — sanfte Übergänge, max 2 Farbstufen, niedriger Kontrast. Emerald + Cream = warm-aber-frisch, statt clinical-tech oder reine Pinwand-Wärme.

**Nicht:**
- ❌ Modern-Tech-Startup-Aesthetic (zu kalt, zu generisch)
- ❌ Material Design (zu Google, zu Cards-with-Hard-Shadows)
- ❌ Brutalist (passt nicht zu Familie/Kochen)
- ❌ Plakative Gradients (kein Stripe/Linear-Style)

**Inspiration:**
- Apple Notes & Reminders (für die Ruhe der UI)
- Things 3 (für Layout-Hierarchie)
- Paprika Recipe Manager (für Recipe-Cards)
- Things 3's iPad Layout (Split-View Inspiration)

---

## Color Palette (Vorschlag)

| Token | Light Mode | Dark Mode | Verwendung |
|-------|-----------|-----------|------------|
| `--bg` | `#FAF7F2` (warm cream) | `#1A1814` | App Background |
| `--surface-1` | `#FFFFFF` | `#26221C` | Cards |
| `--surface-2` | `#F2EDE5` | `#332E26` | Sekundär |
| `--text-1` | `#2A2620` | `#F2EDE5` | Primary Text |
| `--text-2` | `#5C544A` | `#BDB5A8` | Secondary |
| `--text-3` | `#9A9080` | `#7A7165` | Tertiary |
| `--accent` | `#006C49` (emerald) | `#4EDEA3` | Buttons, Highlights, Heute-Hint |
| `--accent-soft` | `#D1FADF` (mint container) | `#1A4D3A` | gefüllte States, Filter-Chips active |
| `--success` | `#15803D` | `#4ADE80` | "Geplant"-State, Check-Toggles |
| `--danger` | `#DC2626` | `#EF4444` | Delete |

**Profile-Colors** (für Identifikation der Familienmitglieder):  
6 Pastell-Töne aus einer harmonischen Palette: amber, rose, sage, sky, lavender, ochre.

### Day-of-Week Colors

Pro Wochentag eine eigene Farbe zur Wiedererkennung. Pastell-Background + dunkler Text. Mo–Fr warme Reihe, Sa/So leicht kühler. Verwendet in `<DayPill>` (Wochenübersicht-Spaltenheader, Einkaufsliste-Zuordnung).

| Tag | Light BG | Light FG |
|-----|----------|----------|
| Mo  | `#FFD7B5` peach     | `#8C4A1A` |
| Di  | `#FCE4A6` butter    | `#7A5A12` |
| Mi  | `#DDEBC6` sage      | `#4F6A2E` |
| Do  | `#C9E1E8` mint-sky  | `#2E5A66` |
| Fr  | `#D6D3F0` lavender  | `#4D4480` |
| Sa  | `#F5C9D4` rose      | `#8A3B52` |
| So  | `#F0B8B0` coral     | `#843326` |

Dark Mode = gleicher Hue, abgedunkelt. Tokens: `--day-{mo,di,mi,do,fr,sa,so}-{bg,fg}`.

### Gradient-Tokens (subtil!)

```css
/* Heute-Tag Hint, Wochenübersicht-Akzente */
--gradient-today: linear-gradient(135deg, #F0FDF4 0%, #D1FADF 100%);  /* mint-soft */

/* Primary CTA — "vitality" */
--gradient-cta: linear-gradient(135deg, #10B981 0%, #006C49 100%);    /* mint→emerald */

/* Onboarding Splash, Index-Page Hero */
--gradient-splash: linear-gradient(180deg, #FAF7F2 0%, #ECFDF5 100%); /* cream→light-mint */
```

Regel: max 8% Helligkeitsdifferenz zwischen Start- und End-Stop. Soll wirken wie weiches Licht, nicht wie Designer-Effekt.

### Shadow-Tokens (organic, leicht emerald-getintet)

```css
--shadow-card:        0 1px 2px rgba(6,78,59,0.05), 0 4px 12px rgba(6,78,59,0.06);
--shadow-card-hover:  0 2px 4px rgba(6,78,59,0.08), 0 8px 24px rgba(6,78,59,0.10);
--shadow-sheet:       0 -4px 24px rgba(6,78,59,0.10);
```

Shadows sind grünstichig statt neutral-schwarz — gibt der App im Cream-BG den „organic"-Vibe ohne dass man's bewusst sieht.

---

## Typography

- **Font:** `-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif`
- **Headings:** SF Pro Display falls verfügbar, sonst System
- **Sizes:**
  - H1 (Page Title): 28pt iPad / 22pt iPhone
  - H2 (Section): 20pt iPad / 17pt iPhone
  - Body: 15pt iPad / 14pt iPhone
  - Caption: 12pt
- **Weights:** 400 (regular), 500 (medium), 600 (semibold). Kein Bold (700+) außer für sehr punktuelle Hervorhebungen.

---

## Layouts

### iPad — Plan-Board (Planungsmodus, Hero-View)

```
┌─────────────────────────────────────────────────────────────┐
│ KW 19                                                       │
│ ◀  4. – 10. Mai 2026  ▶            ✨ Magic Fill    👤     │
├────────┬────────────────────────────────────────────────────┤
│ Mo 4.5 │ 🔍 Rezepte suchen…    [Filter] [≡|⊞] [＋ Neu]    │
│ [slot] │                                                    │
│ [slot] │ ┌──── List-Card ────────────────────┐  (Default)   │
│        │ │ 🥗  Linsenbowl    ⏱ 25  ChefHat   │              │
│ Di 5.5 │ │     [vegetarisch] [bowl]      ●L │              │
│ [slot] │ └────────────────────────────────────┘              │
│        │ ┌────────────────────────────────────┐              │
│ Mi 6.5 │ │ 🍝  Lasagne ...                    │              │
│ [drop] │ └────────────────────────────────────┘              │
│        │  ...                                                │
│ Do 7.5 │                                                    │
│ [drop] │                                                    │
│        │                                                    │
│ Fr 8.5 │                                                    │
│ [slot] │                                                    │
│ + Sa/So│                                                    │
└────────┴────────────────────────────────────────────────────┘
```

- **Header:** KW-Eyebrow oben, darunter `◀ Datum ▶`-Zeile (Pfeile direkt neben dem Datum, nicht rechts ausgelagert). Rechts: Magic-Fill-CTA + Profile-Dot.
- **Linker Bereich (25% Breite):** Wochentage als gestackte Cards. **Mo–Fr immer ohne Scroll sichtbar** — Tage teilen die Höhe per `flex: 1 1 0`. Wenn ein einzelner Tag mehr Slots hat, scrollt nur dieser Tag intern. Kein "+ Hinzufügen"-Button — leere Tage zeigen einen subtilen Drop-Hint (gestrichelter Rahmen). Slots werden später per **Drag & Drop** vom Recipe-Grid in die Tage gezogen. Sa/So per Toggle am Spaltenende dazu.
- **Rechter Bereich (75% Breite):** Sticky Toolbar (Suche, Filter, **Variant-Toggle List/Classic**, ＋ Neu). Default: List-Card (~96px Thumbnail, Titel + Meta + Tags). Toggle wechselt zu Classic-Grid (Bild oben, Titel/Meta unten, dichteres Grid).
- **Slot in Tag:** kleines Thumb (44px) + Mahlzeit-Eyebrow + Titel + Zeit/Schwierigkeit + Profile-Dot.
- **Heute-Markierung:** Linker Border-Inset 3px Akzentfarbe + warmer Background-Gradient-Token (`--gradient-today`).

### iPad — Wochenübersicht (Variante Z, gewählt)

Sonntagabend-Couch hat geplant; Mittwochabend will man **prüfen, anpassen, einkaufen**. Diese View ist dafür optimiert: 5 Tage auf einen Blick, jedes Rezept mit Zutaten + Mengen direkt darunter, Mengen pro Rezept und pro Zutat editierbar.

```
┌──────────────────────────────────────────────────────────────┐
│ KW 19  ◀ 4.–10. Mai ▶          + Sa/So     🛒 In die Tüte (32)│
├──────────┬──────────┬──────────┬──────────┬──────────────────┤
│ [Mo] 4.5 │ [Di] 5.5 │ [Mi] 6.5 │ [Do] 7.5 │ [Fr] 8.5         │
├──────────┼──────────┼──────────┼──────────┼──────────────────┤
│ 🍝 Lasag.│ 🍝 Aglio │ 🍛 Curry │          │ 🍕 Pizza         │
│ 👥 4 ＋− │ 👥 2 ＋− │ 👥 2 ＋− │  (drop)  │ 👥 2 ＋−         │
│ • Hack…  │ • Spagh. │ • Kicher.│          │ • Pizzateig      │
│ • Mozz…  │ • Knobl. │ • Kokos. │          │ • Mozzarella     │
│ • ...    │ • ...    │ • ...    │          │ • ...            │
│          │ 🥬 Caesar│          │          │                  │
│          │ 👥 2 ＋− │          │          │                  │
│          │ • Salat  │          │          │                  │
└──────────┴──────────┴──────────┴──────────┴──────────────────┘
                          [Passt — in die Einkaufstüte →]
```

- **Tagesspalten (5 default, Mo–Fr):** Jede Spalte hat einen kompakten Header mit `<DayPill>` (Tag-Farbe!) + ausgeschriebenem Tag + Datum. **Kein Heute-Highlight** auf Spalten — die Day-Pills sind Wiedererkennungs-Anker, nicht "wo ist heute".
- **Pro Rezept:** Mini-Card mit Thumb + Titel + Zeit/ChefHat. Portionen-Stepper (`👥 [-] N [+]`) skaliert alle Zutaten anteilig. Zutaten als Liste darunter, jeweils Name + Number-Input + Einheit. Manuell überschriebene Zutaten bekommen subtilen Akzent-Background.
- **Wochenende-Toggle** im Header (Pill, `+ Sa/So` / `— Sa/So`), default aus.
- **Sticky-Footer:** Zähler links ("4 Rezepte · 32 Zutaten konsolidiert"), CTA rechts → navigiert zu Einkaufsliste.

### iPad — Einkaufsliste

```
┌──────────────────────────────────────────────────────────────┐
│ 🛒 EINKAUFSLISTE                              [Bring senden] │
│ 24 Zutaten · diese Woche                                     │
├──────────────────────────────────────────────────────────────┤
│ [+ Eigene Zutat hinzufügen…                          ]  [＋] │
├──────────────────────────────────────────────────────────────┤
│ Aus Rezepten                                                 │
│ ○  Avocado          [1] Stk          [Sa]    Buddha Bowl    │
│ ○  Hackfleisch      [1000] g         [Mo][Fr] 2 Rezepte     │
│ ○  Knoblauch        [9] Stk          [Di][Fr][So] 3 Rez.    │
│ ○  ...                                                       │
│ Extras                                                       │
│ ○  Olivenöl         [500] ml         —      manuell         │
└──────────────────────────────────────────────────────────────┘
                   ⎯⎯⎯⎯⎯  Sidebar (Rezepte-Übersicht)  ⎯⎯⎯⎯⎯⎯
                   [Mo] 🍝 Lasagne classico        4 Port.
                   [Di] 🍝 Aglio e Olio            2 Port.
                   [Di] 🥬 Caesar Salad            2 Port.
                   ...
```

- **Spaltenraster (6 Spalten):** Check (24px) · Name (200px) · **Menge editierbar** (110px, Number-Input + Einheit) · Spacer (1fr) · `<DayPill>`s (110px) · Rezept-Origin (140px) · Remove (24px). **Mengen sitzen links** nahe am Namen; Tag-Pills + Origin rechts mit Luft dazwischen — ruhig zu lesen, alles aligned über Zeilen.
- **Day-Pills pro Item:** zeigen aus welchen Tagen die Zutat kommt. Wiedererkennungs-Anker — selbe Farbe wie in Wochenübersicht-Spalten.
- **Rezept-Origin:** Bei 1 Quelle der Rezepttitel. Bei mehreren `"N Rezepte"` mit Tooltip auf alle Titel.
- **Konsolidierung:** Selber Name + selbe Einheit → Mengen summiert. Verschiedene Einheiten = separate Einträge.
- **Extras-Sektion:** User-eingetragene Zutaten, dezent abgesetzt mit Label "manuell".
- **Sidebar "Aus diesen Rezepten":** Liste mit Day-Pill + Emoji + Titel + Portionen, sortiert nach Wochentag.
- **Bring-Export:** Sprint-6-Feature, jetzt als Mock-Button. Echter Export: alle Zutaten als Bring!-Items via `bring://import/import` Deep-Link oder API.

### iPad — Recipe Card Detail

- 70% Breite zentriert
- Hero-Image oben (16:9, mit subtle Vignette)
- Titel groß, darunter Quelle als Link-Pill
- 2-Spalten-Layout: links Zutaten, rechts Zubereitung
- Sticky Action-Bar unten: "Auf Tag setzen ▾" / "Bearbeiten" / "Favorit ⭐"

### iPhone — deprioriziert

iPhone-Layout kommt **nach iPad-MVP** (Phase 2). Begründung: Hauptzielgerät ist iPad-Sonntags-Couch. iPhone ist sekundärer Familien-Use-Case ("schnell mal nachsehen / Einkaufen unterwegs"). Wenn iPad-Flow steht (Planen / Prüfen / Einkaufen) wird iPhone als responsive Variante derselben drei Views gebaut, ggf. mit angepasstem Tab-Flow `Plan · Kaufen · Kochen` statt der ursprünglich geplanten `Plan · Rezepte · Profil`.

Alter iPhone-Sketch ist im Repo unter `/proto/phone` archiviert.

---

## Component-Details

### Recipe Card — 2 Varianten, List = Default

**Default: List-Variant** (im Plan-Board rechts und in Suchergebnissen)

```
┌──────────────────────────────────────────────────┐
│ ┌──────┐  Linsenbowl mit Feta                    │
│ │ 🥗   │  ⏱ 25 Min  ·  ChefHat einfach           │
│ │ 96px │  [vegetarisch] [bowl]                ●L │
│ └──────┘                                          │
└──────────────────────────────────────────────────┘
```

- 96×96 Thumbnail (Gradient + Emoji), 1.5× größer als ursprünglich
- Titel 17pt Semibold (1 Zeile, ellipsis)
- Meta: Zeit + ChefHat-Schwierigkeit
- Kategorien als 2 kleine Pills
- Profile-Dot rechts

**Alternative: Classic-Variant** (per Toggle, dichteres Grid)

- Bild 4:3 oben, Titel + Meta unten, Profile-Dot bottom-right
- Border-Radius: 16px
- Subtile Schatten: `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)`

**Beide Varianten:**
- Hover/Tap: `translateY(-2px)` + stärkerer Schatten
- Drag (später): leichte Rotation (1–2deg) für Pinwand-Feeling, Schatten dramatischer

Andere Varianten (`minimal`, `image-heavy`) liegen archiviert in `/proto/cards`.

### Day Column (Plan-Board)

- Border-Left: 3px Akzentfarbe für "Heute"
- Heute-Tag bekommt zusätzlich `--gradient-today` als Background
- Tag teilt verfügbare Höhe gleichmäßig (`flex: 1 1 0`), interner Scroll bei vielen Slots
- **Kein "+ Hinzufügen"-Button** — leere Tage sind Drop-Targets, dargestellt als gestrichelter Rahmen
- **Wochenende-Toggle** am Spaltenende (Ghost-Button, dezent)

### Drop-Zone Feedback (D&D, kommt mit dnd-kit)

- Beim Drag-Over: Day-Column bekommt Akzentfarbe als 2px Border-Inset + leichter Background-Tint
- Animation: Spring-easing, kein abruptes Snap

### Profile-Dot

- 16px Circle mit Initial darin (8pt SemiBold)
- Hintergrundfarbe = User-Profile-Color
- Bei Hover: Tooltip mit Display Name

### Day-Pill

Kleines farbiges Pill mit Tag-Kürzel ("Mo"…"So"), benutzt zur Wiedererkennung in Wochenübersicht (Spaltenheader) und Einkaufsliste (Item-Herkunft, Sidebar).

- Sizes: `sm` 26×18px / `md` 32×22px
- Background = `--day-{xx}-bg`, Color = `--day-{xx}-fg` (siehe Color Palette)
- Font 10–11px Semibold, uppercase

### Schwierigkeit-Badge

**Genau 1 Lucide `<ChefHat />` + Text-Label** — kein Multi-Hut-Count, kein bunter Ball, einfach ruhig und scanbar.

```
👨‍🍳 einfach     👨‍🍳 mittel     👨‍🍳 aufwendig
```

- Icon size: 12–14px je nach Kontext (Card, Slot, Mini-Card)
- Stroke-width: 1.75
- Text optional ausschaltbar (in dichten Layouts wie Classic-Card)
- Farbe: `--text-2` (sekundär, nicht prominent)

### Mengen-Editor (Recipe-with-Ingredients & Einkaufsliste)

- Number-Input, 64px breit, tabular-nums, rechtsbündig
- Step `0.5`, min `0`
- Einheit als Suffix-Span (24px min-width)
- Manuell überschriebene Werte → Item-Background subtil mit `--accent-soft` getintet (zeigt "wurde editiert")
- Im Recipe-Kontext: zusätzlicher Portionen-Stepper im Header skaliert alle Zutaten anteilig

---

## Interaktion / Motion

- **Easing:** iOS-style spring (use `cubic-bezier(0.4, 0, 0.2, 1)` für simple Transitions, oder `framer-motion` für komplexere)
- **Durations:** 150ms für State-Changes, 250ms für Page-Transitions, 400ms für Sheet-Animations
- **Drag:** dnd-kit defaults sind ok, aber Custom-Sensor-Settings für Mobile (250ms long-press delay)
- **Haptics:** Web Vibration API auf iPhone bei erfolgreichem Drop (`navigator.vibrate(10)`)

---

## PWA-Spezifika

- **Splash Screen:** generieren für iPad Pro, iPhone 14/15 Pro, iPhone SE (mind. 3 Größen)
- **Status Bar:** `apple-mobile-web-app-status-bar-style=black-translucent`
- **App Icon:** muss elegant aussehen, nicht generisch. Stilisierte Pinwand mit Notiz drauf? Gabel + Kalender? Iterieren mit Claude Design.
- **Theme Color:** matched zu `--bg`

---

## Accessibility

- Alle Buttons: `aria-label` wenn kein Text
- Drag&Drop: Tastatur-Alternative via dnd-kit Keyboard-Sensor
- Focus-States: 2px Akzentfarbe Outline mit 2px Offset
- Color Contrast: alles ≥ WCAG AA (Text-1 zu Bg ≥ 7:1)
- Reduced Motion: respektieren via `@media (prefers-reduced-motion)`

---

## Don't List für den Design-Pass

- ❌ Keine Animations-Overload (max 1-2 Effekte pro View)
- ❌ Keine 3D-Tilts oder Parallax
- ❌ Keine Sound-Effekte
- ❌ Keine Onboarding-Coachmarks (Self-Explanatory UI bauen)
- ❌ Keine Skeumorphismus (Holzbretter, Papier-Texturen) — bleib bei modernem Soft-iOS-Stil

---

## Phase-2-Backlog (nach MVP)

Nicht für Sprint 1, aber dokumentiert damit's nicht verloren geht:

- **Zutaten-Icons / -Bilder** — analog zu Bring!, Wiedererkennung pro Zutat. Muss nicht Hochglanz sein. Quelle TBD (eigenes Set / Bring-CDN / Openverse).
- **Onboarding-Polish** — funktional steht der Flow seit Sprint 1. Polish-Wishlist:
  - Step-Indicator oben (1 Name → 2 Haushalt → 3 Losgeht's) mit Checkmarks für done-Steps
  - Animated Background-Blobs (große weiche Mint/Cream-Shapes mit `filter: blur`)
  - Success-Moment nach Submit (PartyPopper-Icon + „Willkommen, {Name}!" + 1.6s Delay vor Redirect)
  - Card-Slide-Animation zwischen Steps
  - Größerer Brand-Hero mit Logo-Animation
- **iPhone-Layouts** — responsive Variante der drei iPad-Views, Tab-Bar `Plan · Kaufen · Kochen`. Hero-Landing mit Pill-Filter (Saisonal / Lange nicht / Zufällig).
- **App-Icon + Splash** — Stilisierte Pinwand mit Notiz / Gabel + Kalender. Mehrere Größen für iOS-Add-to-Homescreen.
- **Bring-Echtintegration** — Deep-Link `bring://import/import?…` oder offizielle API.
- **Rezept-Modal** — Klick auf Recipe-Card vergrößert zum Modal mit Backdrop-Blur, Drag-to-Plan vom Modal aus.
- **Echte Bilder** statt Emojis — kommt mit Insta-Import in Sprint 2.
- **„Heute"-View + „Woche umsetzen"-View** — Sprint 5+, eigener Tagesfokus mit aktuellem Rezept.
- **Bulk-Import zum Start** — Excel/CSV-Upload mit Liste von Insta- und URL-Links für initiales Befüllen. Beim ersten Login: „Hast du schon Rezepte? Lade eine Liste hoch — wir importieren sie für dich im Hintergrund." Pro Zeile ein Link → Edge-Function arbeitet sich durch → Progress-Anzeige. Wichtig wegen Groq-Free-Quota: max ~14k Rezepte/Tag, also Throttling einbauen. Wahrscheinlich Sprint 2.5 — direkt nach dem Single-Import stabil läuft.
- **Refereo-Verknüpfung im Redesign-Pass** *(TBD)* — Thomas hat das genannt im Kontext „nächster Redesign". Klärung nötig: meint er Refereo als Mood-/Design-Reference-Tool? Oder ein Referral-System für Familie-Einladungen aus der App heraus? Oder Refeero/Refero (TBD welches Tool genau)? **→ Beim nächsten Sync mit Thomas klären, dann konkret planen.**
- **Slot-Move per D&D** — bestehender Slot zwischen Tagen verschiebbar (aktuell nur Recipe → Tag, kein Tag ↔ Tag).
- **Real-time-Sync** — andere Family-Members sehen Slot-Adds live (Supabase Realtime Channels).
- **Profile-Page** — Display-Name ändern, Workspace-Code teilen via QR + Link, andere Mitglieder anzeigen.

## Iterativer Workflow für Design-Tuning (nach Sprint 0)

Sprint-0-Prototypen haben Layout & Flow geklärt. Tokens sind in `src/styles/tokens.css` zentralisiert. Iterationen passieren **direkt im Code**, nicht in einem externen Tool:

1. **Token-Tuning:** Werte in `tokens.css` adjustieren — wirkt durch alle Components, kein Component-Code anfassen
2. **Layout-Refinement:** Component-CSS gezielt nachschärfen wenn Token-Tuning nicht reicht
3. **Cross-Device-Test:** iPad + iPhone-Browser-DevTools, später echtes Gerät
4. **Screenshot-Loop bei Bedarf:** Claude-in-Chrome MCP für Visual-Feedback (optional)

Externe Design-Tools (Stitch / UI-Kit-Generators) wurden bewusst ausgeschlossen — `DESIGN-BRIEF.md` + `tokens.css` sind die Source of Truth.
