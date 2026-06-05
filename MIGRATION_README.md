# Supabase Migrations — Sprint 14 + 15

## Quick Start

### Option 1: Supabase CLI (lokal)

```bash
# Stelle sicher dass du im MealPlanner-Verzeichnis bist
cd MealPlanner

# Starte Supabase local (optional, für lokal testen)
supabase start

# Push migrations zu deinem Supabase-Projekt
supabase db push
```

### Option 2: Supabase Web UI (schneller)

1. Geh zu: https://app.supabase.com
2. Wähle dein MealPlanner-Projekt
3. Geh zu: **SQL Editor**
4. Kopiere den gesamten SQL-Code aus `MIGRATION_COMMANDS.sh`
5. Paste in den Editor
6. Klick **"Run"**

## Was wird gemacht?

### Sprint 14: Recipes GLOBAL machen
```sql
-- Alle existierenden Rezepte bekommen workspace_id = NULL
-- Das bedeutet: Alle Haushalte sehen die 90 Rezepte
-- RLS Policy updated: SELECT IF workspace_id IS NULL OR workspace_id = eigener_workspace
```

### Sprint 15: Neue Tables
```sql
CREATE recipe_ratings    -- Sterne 1-5 + Notizen pro User
CREATE recipe_history    -- Tracking: wann wurde gekocht?
CREATE recipe_notes      -- Haushalt-Notizen (persistent)
ADD recipe_type COLUMN   -- Hauptgericht/Beilage/etc.
```

### RLS Policies + Indexes
- Alles mit korrekten RLS-Policies (User sieht nur sein Workspace)
- Indexes für Performance

## Verifikation

Nach dem Run:

```bash
# In Supabase Web UI → Tables:
✅ recipe_ratings      (neu)
✅ recipe_history      (neu)
✅ recipe_notes        (neu)
✅ recipes.recipe_type (neue Column)
```

In der App:
```
✅ /rezepte zeigt alle 90 Rezepte (global)
✅ /rezepte/{id} zeigt Rating/Cooked/Notes
✅ /workspace zeigt Familie-PIN
```

## Troubleshooting

**Fehler: "policy already exists"**
→ Das ist OK! Polices sind schon da, doppelt war nicht schlimm.

**Fehler: "column already exists"**
→ Das ist OK! recipe_type ist schon da.

**Fehler: "role does not have SELECT permission"**
→ Nutze die Supabase Web UI (SQL Editor), nicht die CLI.
→ Der Web UI nutzt deine Admin-Credentials.

## Nächste Schritte

1. ✅ Migration deployen (oben)
2. ✅ App testen lokal (`npm run dev`)
3. ✅ Vercel wird auto-deployen nach nächstem Push
4. 🚀 Sprint 16: iPhone-Responsive
