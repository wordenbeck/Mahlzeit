# Supabase — MealPlanner Database

## 📁 Ordnerstruktur

```
supabase/
├── migrations/           ← Production database schema + migrations
├── archive/              ← Old/deprecated SQL scripts
├── functions/            ← Edge Functions (serverless)
└── README.md             ← This file
```

---

## 📋 Migrations (./migrations/)

All database changes are tracked as **numbered migrations**:

```
20260508120000_initial_schema.sql
├─ Initial recipes, profiles, workspaces tables
└─ Workspace RLS policies

20260509000000_recipe_images_bucket.sql
├─ Create recipe-images storage bucket
└─ Setup public/private access policies

20260513000000_recipe_type.sql
├─ Add recipe_type column to recipes
└─ Support: hauptgericht, beilage, dessert, getränk

20260529000000_add_is_shared_recipes.sql
├─ Add is_shared boolean to recipes
└─ For global recipe sharing (v1)

20260529000001_update_recipes_rls_policy.sql
├─ Update RLS to check is_shared status
└─ Allows workspace-scoped access

20260603000000_recipes_shared_global.sql
├─ Make ALL recipes global (workspace_id = NULL)
└─ Updated RLS: SELECT if workspace_id IS NULL OR in own_workspace

20260603000001_sprint15_cooking_tracking.sql
├─ New tables: recipe_ratings, recipe_history, recipe_notes
├─ Track: user ratings (1-5), cook history, household notes
└─ RLS policies for workspace-scoped data

20260605000000_fix_sanamana_ingredients.sql
├─ Standardize SanaMana ingredient data
├─ Rules: Zwiebel (1 Stk), Knoblauch (X Stk), Tomatenmark (EL/g)
└─ Clean up menge/einheit format
```

### How to Deploy Migrations

```bash
# Deploy ALL pending migrations to Supabase
supabase db push

# View migration status
supabase migration list

# Rollback last migration (if needed)
supabase db reset  # ⚠️ WARNING: resets entire DB!
```

---

## 🚀 Edge Functions (./functions/)

Serverless functions that run in Supabase:

```
functions/
├── search-recipe-image/      ← Search Unsplash/Openverse for recipe images
├── import-recipe-from-url/   ← Parse Instagram Reel, fetch image, import recipe
└── [future functions...]
```

Deploy:
```bash
supabase functions deploy <function-name>
```

---

## 🗂️ Archive (./archive/)

Old/test SQL scripts that are no longer used:

```
archive/
├── cleanup_recipes.sql           ← Old cleanup attempts
├── recipes_insert*.sql           ← Multiple recipe import attempts
├── refetch_instagram.sql         ← Old Instagram fetch logic
├── sanamana_*.sql                ← Old SanaMana import attempts
└── [other deprecated scripts]
```

These are kept for reference but should NOT be executed.

---

## 📊 Database Schema Overview

### Core Tables

**profiles** — User profiles (Anonymous Auth)
```
id (uuid)           — User ID from Supabase Auth
workspace_id (uuid) — Current workspace
display_name (text) — User's name (e.g., "Thomas")
color (text)        — CSS color variable for avatar
```

**workspaces** — Household/family groups
```
id (uuid)           — Workspace ID
code (text)         — 4-digit code for joining (e.g., "8991")
name (text)         — Workspace name
created_at          — Creation timestamp
```

**recipes** — All recipe data (now GLOBAL)
```
id (uuid)
workspace_id (uuid) — NULL for global recipes (visible to all)
created_by (uuid)   — Profile ID who created it
titel (text)
zutaten (jsonb)     — Array: {name, menge, einheit, hinweis}
zubereitung (jsonb) — Array of instruction steps (strings)
zubereitungszeit_min (int)
schwierigkeit (text) — einfach/mittel/aufwendig
bild_url (text)     — URL to recipe image
source (text)       — 'instagram' / 'sanamana' / 'manual'
recipe_type (text)  — hauptgericht/beilage/dessert/getränk
created_at
updated_at
```

**recipe_ratings** — User ratings (1-5 stars)
```
id
recipe_id (uuid)
user_id (uuid)
stars (int)         — 1-5
notes (text)        — User notes
created_at
```

**recipe_history** — Track when recipes were cooked
```
id
recipe_id (uuid)
user_id (uuid)
cooked_at (date)
```

**recipe_notes** — Household-level notes on recipes
```
id
recipe_id (uuid)
workspace_id (uuid)
notes (text)
updated_at
```

**weekplan_slots** — Week planning
```
id
workspace_id (uuid)
week_start (date)
day (int)           — 0-6 (Mon-Sun)
meal (text)         — frühstück/mittag/abend
recipe_id (uuid)
added_by (uuid)
```

---

## 🔐 Row-Level Security (RLS)

All tables have RLS enabled. Rules:

- **recipes:** SELECT if `workspace_id IS NULL` (global) OR `workspace_id IN current_workspace_ids`
- **workspace_scoped tables** (ratings, notes, history): SELECT/UPDATE if `workspace_id IN current_workspace_ids`
- **profiles:** Can only read own profile, UPDATE own profile

---

## 🚨 Important Notes

- **All recipes are now global** (`workspace_id = NULL`)
- **Single production workspace:** ID `897fafb5-6b5d-43e2-9556-8d91217bf010` (code: 8991)
- **Ingredient format:** `{name, menge, einheit, hinweis}` (no units in name!)
- **No external data syncing** — all data lives in Supabase

---

## 📞 Questions?

See `PROJECT-SPEC.md` for architecture details or `CLAUDE.md` for development rules.
