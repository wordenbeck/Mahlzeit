# MealPlanner — Project Spec

> Wochenplan-zentrierte Rezept-App. iPad-first, ohne Login, Familie/Haushalt-tauglich. Hobby-Projekt, alles kostenlos.

---

## 1. Vision

**Ein Sonntag mit dem iPad auf der Couch.** Du planst die Woche: links die Wochentage, rechts deine Rezeptsammlung als visuelles Raster. Drag eines Rezepts auf einen Tag. Fertig. Familie kann von ihren iPhones mitplanen. Was rein kommt, kann aus Insta importiert oder mit KI generiert werden.

**Differenzierer zu Standard-Apps:** kein Login-Onboarding, iPad-Erlebnis steht im Mittelpunkt, Drag&Drop, AI-Rezepterstellung integriert.

---

## 2. Scope

### MVP (Phase 1 — Core)

- ✅ Wochenplan-Board (iPad: Split-Layout, iPhone: Tab-Switch)
- ✅ Rezeptsammlung (Grid mit Thumbnails, Filter, Suche)
- ✅ Drag & Drop Rezept → Tag (auf iPad), Long-Press → Sheet (iPhone)
- ✅ Rezept-Import: Instagram, URL (chefkoch etc), manuell
- ✅ KI-Rezeptsuche / -Generation
- ✅ Identity ohne Login (Anonymous Auth + Display Name + Workspace Code)
- ✅ PWA (iOS Home-Screen-fähig)

### Phase 2

- 🔜 SanaMana-Blog-Import (10 Rezepte einmalig)
- 🔜 Einkaufsliste (auto-generiert aus dem Wochenplan)
- 🔜 Rezept-Edit (Mengen, Zubereitung anpassen)

### Out-of-Scope (vorerst)

- ❌ Klassischer Login mit Passwort
- ❌ Apple Health Integration
- ❌ Native iOS App
- ❌ Kalorientracking (das macht Kalo)

---

## 3. Tech Stack

| Layer | Tech | Begründung |
|-------|------|------------|
| Frontend | **React + TypeScript + Vite** | Bekannt aus Kalo, schnell, modern |
| PWA | **vite-plugin-pwa** | Service Worker, iOS-Add-to-Homescreen |
| Styling | **CSS Modules / Vanilla CSS** | Keine Tailwind-Abhängigkeit, eigene Design-Sprache |
| Drag & Drop | **@dnd-kit/core** | Mobile-tauglich, accessible, modern |
| Routing | **react-router-dom** v7 | Standard |
| Backend | **Supabase** (free tier) | DB + Storage + Anonymous Auth |
| LLM | **Groq** (free, llama-3.3-70b) | Rezept-Parsing + Generation |
| Image Search | **Openverse** (free, kein Key) | Fallback-Bilder |
| Hosting | **Vercel** (free) | Auto-Deploy on Push |
| Date Handling | **date-fns** | Wochen-Logik, ISO-Wochen |

**Geschätzte Kosten:** 0 €/Monat für Familie/persönliche Nutzung.

---

## 4. Identity & Workspace (Login-Skip)

**Statt Login:** Workspace-Code-Konzept.

### Flow erste App-Nutzung

1. Splash Screen → "Willkommen"
2. **Display Name eingeben** (z.B. "Thomas")
3. Wahl:
   - **Neuen Haushalt anlegen** → User vergibt **Workspace-Name** (z.B. "Familie Wordenbeck"), App generiert 6-stelligen Code (z.B. `KOCH-42`)
   - **Bestehendem Haushalt beitreten** → Code eingeben → Workspace-Name wird angezeigt zum Bestätigen
4. Im Hintergrund: Supabase **Anonymous Auth** läuft → User bekommt UUID
5. Profile wird angelegt: `{ user_id, workspace_id, display_name, color }`
6. Ready.

### Sharing

- Workspace-Code als shareable Link: `https://meal.app/join/KOCH-42`
- Familie öffnet Link auf ihrem Gerät → muss nur Display Name eingeben → Workspace ist gesetzt

### Identifizierung

- Jeder DB-Eintrag hat `created_by` und `updated_by` (User-UUID)
- UI zeigt Profile-Color-Dot + Initiale am Eintrag
- Filter "Nur meine Rezepte" / "Nur Lisa's Plan-Einträge" möglich

### Nachteile (ehrlich)

- Wenn jemand seinen Browser-Storage löscht → ist er "weg" und muss neu joinen (verliert User-ID)
- Ein versehentlich geleakter Code = jeder kann reinjoinen. Für Familie kein Problem, für Sensibles ja.

---

## 5. Datenmodell (Supabase Schema)

```sql
-- Workspaces (= Haushalte)
create table workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null, -- z.B. "Familie Wordenbeck", User-defined beim Anlegen
  code text not null unique, -- 6-stellig, z.B. "KOCH-42", auto-generiert
  created_at timestamp with time zone default now()
);

-- Profiles (User in Workspace)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  display_name text not null,
  color text not null, -- Hex, für UI-Identifikation
  created_at timestamp with time zone default now()
);

-- Recipes (Workspace-shared)
create table recipes (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  created_by uuid references profiles not null,

  -- Quelle
  source text not null, -- 'instagram' | 'tiktok' | 'url' | 'sanamana' | 'manual' | 'ai'
  source_url text,
  source_author text,
  source_caption_raw text,

  -- Inhalt
  titel text not null,
  beschreibung text,
  portionen integer default 2,
  zubereitungszeit_min integer,
  schwierigkeit text, -- 'einfach' | 'mittel' | 'aufwendig'
  kategorie text[],

  zutaten jsonb default '[]'::jsonb,
  zubereitung jsonb default '[]'::jsonb,

  tags text[] default '{}',

  bild_url text,
  is_favorite boolean default false,

  ai_confidence text,
  ai_warnings text[] default '{}',

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Wochenpläne
create table weekplans (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  week_start date not null, -- Montag der Woche (ISO-Woche)
  unique(workspace_id, week_start)
);

-- Plan-Slots (= einzelne Mahlzeit-Einträge im Plan)
create table weekplan_slots (
  id uuid default gen_random_uuid() primary key,
  weekplan_id uuid references weekplans on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Montag
  meal_type text not null, -- 'fruehstueck' | 'mittag' | 'abendessen' | 'snack'
  recipe_id uuid references recipes on delete set null,
  custom_text text, -- für freie Einträge ohne Rezept
  position integer default 0,
  added_by uuid references profiles not null,
  notes text, -- z.B. "doppelte Portion, Reste für Donnerstag"
  created_at timestamp with time zone default now()
);

-- RLS: alle in workspace sehen alles
alter table workspaces enable row level security;
alter table profiles enable row level security;
alter table recipes enable row level security;
alter table weekplans enable row level security;
alter table weekplan_slots enable row level security;

create policy "workspace members read" on recipes for select using (
  workspace_id in (select workspace_id from profiles where id = auth.uid())
);
-- ähnliche Policies für insert/update/delete
```

---

## 6. UX & Layout

### iPad (Hauptzielgerät, Landscape primär)

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Woche 19 (5.-11. Mai)  ◀ ▶   👤 Thomas (KOCH-42)  │
├──────────────────┬──────────────────────────────────────────┤
│                  │  🔍 [Suchen...]   [Filter ▾]  [+ Neu]  │
│  MO  5.5         ├──────────────────────────────────────────┤
│  ┌────────────┐  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │Lasagne   T │  │  │    │ │    │ │    │ │    │ │    │    │
│  └────────────┘  │  │    │ │    │ │    │ │    │ │    │    │
│  + Hinzufügen    │  └────┘ └────┘ └────┘ └────┘ └────┘    │
│                  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  DI  6.5         │  │    │ │    │ │    │ │    │ │    │    │
│  + Hinzufügen    │  │    │ │    │ │    │ │    │ │    │    │
│                  │  └────┘ └────┘ └────┘ └────┘ └────┘    │
│  ...             │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│                  │  │    │ │    │ │    │ │    │ │    │    │
│  SO  11.5        │  │    │ │    │ │    │ │    │ │    │    │
│  + Hinzufügen    │  └────┘ └────┘ └────┘ └────┘ └────┘    │
│                  │            ↓ Scrollen für mehr ↓        │
└──────────────────┴──────────────────────────────────────────┘
```

- **Links:** 7 Wochentage als vertikale, scrollable Liste mit Drop-Zonen
- **Rechts:** Rezept-Grid 5 breit × n Reihen, scrollbar
- **Drag:** Rezept-Card greifen, auf einen Tag droppen
- **Card-Inhalt:** Bild (Hauptfläche), Titel, ⏱ Zeit, 📊 Aufwand, Profile-Dot

### iPhone (Portrait)

- **Tabs unten:** Plan / Rezepte / Profil
- **Plan-Tab:** Wochentage als horizontale Pill-Auswahl oben, Slots des Tages darunter, "+ Hinzufügen"-Button öffnet Action Sheet mit Rezept-Picker
- **Rezepte-Tab:** Grid 2 breit, gleiche Card-Komponente
- **Long-Press auf Rezept:** Sheet "Zu Tag hinzufügen" mit Day-Picker

### Pages

| Route | Page | Beschreibung |
|-------|------|--------------|
| `/onboarding` | Onboarding | Name + Workspace-Wahl |
| `/join/:code` | JoinWorkspace | Direkt in Workspace via Link |
| `/` oder `/plan` | Wochenplan | Hauptansicht (iPad-Split / iPhone-Tab) |
| `/recipes` | RecipeList | Volle Rezept-Übersicht |
| `/recipes/:id` | RecipeDetail | Einzelansicht + Edit |
| `/import` | RecipeImport | URL/Insta/AI-Generation |
| `/profile` | Profile | Display Name, Workspace-Code teilen, Geräte verwalten |

---

## 7. Components

```
src/
├── components/
│   ├── PlanBoard.tsx           # iPad-Split-Layout
│   ├── DayColumn.tsx           # ein Wochentag als Drop-Target
│   ├── PlanSlot.tsx            # ein einzelner Mahlzeit-Eintrag im Tag
│   ├── RecipeGrid.tsx          # Raster-Layout mit Filter/Suche
│   ├── RecipeCard.tsx          # einzelne Karte (draggable)
│   ├── RecipeFilters.tsx       # Suche + Tag/Kategorie-Filter
│   ├── ImportDialog.tsx        # URL-Eingabe für Insta/Web
│   ├── AICreateDialog.tsx      # KI-Generation mit Prompts
│   ├── ImageEditor.tsx         # Foto / Suche / URL Tabs (wie Kalo)
│   ├── ProfileBadge.tsx        # Profile-Dot mit Initiale
│   ├── BottomTabBar.tsx        # iPhone-Navigation
│   └── ResponsiveLayout.tsx    # iPad/iPhone-Switch
├── pages/
│   └── ...
├── lib/
│   ├── supabase.ts
│   ├── workspace.ts            # Code-Generierung, Join-Logik
│   ├── prompts/
│   │   ├── recipeParserPrompt.ts   # 1:1 von Kalo (sachlich)
│   │   └── recipeGeneratorPrompt.ts  # NEU: AI-Rezept-Generation
│   ├── types/recipe.ts
│   └── dragdrop.ts             # dnd-kit Setup
└── App.tsx
```

---

## 8. Recipe Import (aus Kalo extrahieren)

### Was übernehmen

**Aus dem Kalo-Projekt (lokal: `~/Claude Code/CodingDojo/Kalo`):**

| Datei | Was rüber |
|-------|-----------|
| `src/lib/types/recipe.ts` | Recipe Schema, MealItem etc. |
| `src/lib/prompts/recipeParserPrompt.ts` | System Prompt + 5 Few-Shots (sachlich) |
| `supabase/functions/import-recipe-from-url/` | Komplette Edge Function (oEmbed-Logik!) |
| `supabase/functions/search-recipe-image/` | Openverse-Bildsuche |
| `supabase/migrations/...recipe_images_bucket.sql` | Storage-Bucket Setup |

**Anpassen:** Felder `workspace_id` und `created_by` in alle Inserts ergänzen, RLS-Policies anpassen.

### Was neu

- `recipeGeneratorPrompt.ts` — KI generiert Rezept aus User-Wunsch ("schnelles veganes Mittag mit Linsen")
- `weekplanPrompt.ts` — KI schlägt komplette Woche vor basierend auf Präferenzen

---

## 9. KI-Features

### A) Rezept-Generation

**Eingabe:** User schreibt freien Wunsch ("schnelles asiatisches Abendessen für 4")  
**Output:** Vollständiges Rezept im selben Schema wie Import.  
**Modell:** Groq llama-3.3-70b. Sachlicher Ton.

### B) Wochenplan-Vorschlag

**Eingabe:** Workspace + Vorlieben + bereits geplante Tage  
**Output:** Vorschläge für die offenen Slots, basierend auf vorhandenen Rezepten + neuen Ideen  
**UX:** "Magic Fill"-Button im Plan-Header

### C) Rezept-Suche in eigener Sammlung (semantisch)

**Eingabe:** Freitext ("was schnelles mit Hack")  
**Output:** Top 3-5 passende Rezepte aus Workspace  
**Implementation:** Embeddings später, MVP mit LLM + Tags-Filter

---

## 10. Design-Richtung (Briefing für Design-Pass)

→ Detail in `DESIGN-BRIEF.md`. Kurz:

- **iPad-feeling**, nicht Mobile-zentriert
- Recipe Cards als visuelle Helden (große Bilder, klare Typo)
- Plan-Board feels like a **Kitchen-Pinboard**: warm, einladend, nicht klinisch
- iOS-native-Feel: SF Pro System-Font, iOS-Border-Radius (12-16px), subtile Schatten
- Dark Mode optional aber sauber

---

## 11. Roadmap (grob)

| Sprint | Ziel | Tage |
|--------|------|------|
| **0** | **Prototyping (NEU vorgeschaltet, siehe COLLAB-PRINCIPLES.md)** | **1-2** |
| 1 | Setup, Supabase-Schema, Anonymous Auth, Onboarding | 1-2 |
| 2 | Recipe Schema + Import (Insta + URL) übernehmen | 1-2 |
| 3 | Recipe Grid + Filter | 1 |
| 4 | Wochenplan-Board (iPad Split, dnd-kit) | 2-3 |
| 5 | iPhone-Layout (Tabs, Action Sheets) | 1-2 |
| 6 | KI-Generation + KI-Wochenvorschlag | 1-2 |
| 7 | Design-Pass mit Claude Design | 1-2 |
| 8 | PWA-Polish, iOS-Add-to-Homescreen-Test | 0.5 |
| **Σ** | **MVP** | **~12-16 Tage** |

**Sprint 0 ist neu** — wir bauen erst statische Prototypen für Layout, Flow und Design-Tokens, **bevor** Backend angeschlossen wird. Spart später Refactoring.

---

## 12. Definition of Done (MVP)

- [ ] Familie kann auf 3 Geräten (iPad + 2 iPhones) gleichzeitig planen
- [ ] Insta-Rezept ist in <30 Sekunden importiert + auf einem Tag gelandet
- [ ] Drag & Drop fühlt sich auf iPad **flüssig** an (60fps)
- [ ] iPhone-Erlebnis fühlt sich nicht wie "iPad-Reste" an
- [ ] Lighthouse PWA-Score ≥ 90
- [ ] Komplettes Onboarding in <60 Sekunden
- [ ] 0 € laufende Kosten für Familie
