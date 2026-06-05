-- =====================================================================
-- MealPlanner — Initial Schema
-- Tables: workspaces, profiles, recipes, weekplans, weekplan_slots
-- Identity-Modell: Anonymous Auth + Workspace-Code (kein klassischer Login)
-- =====================================================================

-- =====================================================================
-- Tables
-- =====================================================================

create table if not exists workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,                    -- z.B. "Familie Wordenbeck"
  code text not null unique,             -- 6-stellig, z.B. "KOCH42"
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  display_name text not null,
  color text not null,                   -- Hex, für UI
  created_at timestamptz default now()
);

create table if not exists recipes (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  created_by uuid references profiles not null,

  source text not null,                  -- 'instagram' | 'tiktok' | 'url' | 'sanamana' | 'manual' | 'ai'
  source_url text,
  source_author text,
  source_caption_raw text,

  titel text not null,
  beschreibung text,
  portionen integer default 2,
  zubereitungszeit_min integer,
  schwierigkeit text,                    -- 'einfach' | 'mittel' | 'aufwendig'
  kategorie text[] default '{}',

  zutaten jsonb default '[]'::jsonb,     -- [{ name, menge, einheit }]
  zubereitung jsonb default '[]'::jsonb, -- ["Schritt 1...", ...]

  tags text[] default '{}',
  bild_url text,
  is_favorite boolean default false,

  ai_confidence text,
  ai_warnings text[] default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists weekplans (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  week_start date not null,              -- Montag der Woche (ISO)
  unique(workspace_id, week_start)
);

create table if not exists weekplan_slots (
  id uuid default gen_random_uuid() primary key,
  weekplan_id uuid references weekplans on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  meal_type text not null,               -- 'fruehstueck' | 'mittag' | 'abendessen' | 'snack'
  recipe_id uuid references recipes on delete set null,
  custom_text text,                      -- für freie Einträge ohne Rezept
  position integer default 0,
  added_by uuid references profiles not null,
  notes text,
  -- Mengen-Override pro Slot: { "zutat_name_lower": menge_in_basis_einheit }
  zutaten_override jsonb default '{}'::jsonb,
  portionen_override integer,            -- wenn != recipe.portionen
  created_at timestamptz default now()
);

-- =====================================================================
-- Indexes
-- =====================================================================

create index if not exists idx_recipes_workspace on recipes(workspace_id);
create index if not exists idx_weekplans_workspace_week on weekplans(workspace_id, week_start);
create index if not exists idx_slots_weekplan on weekplan_slots(weekplan_id);

-- =====================================================================
-- Updated-at Trigger
-- =====================================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_recipes_updated on recipes;
create trigger trg_recipes_updated
  before update on recipes
  for each row execute function set_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================

alter table workspaces       enable row level security;
alter table profiles         enable row level security;
alter table recipes          enable row level security;
alter table weekplans        enable row level security;
alter table weekplan_slots   enable row level security;

-- Helper: workspace_id der User-UUID
create or replace function current_workspace_id()
returns uuid language sql stable security definer as $$
  select workspace_id from profiles where id = auth.uid()
$$;

-- --- workspaces ---
-- Lesen: nur eigener Workspace
drop policy if exists "ws_read_own" on workspaces;
create policy "ws_read_own" on workspaces for select
  using (id = current_workspace_id());

-- Erstellen: jeder authentifizierte User darf einen Workspace anlegen (Onboarding)
drop policy if exists "ws_insert_authed" on workspaces;
create policy "ws_insert_authed" on workspaces for insert
  with check (auth.uid() is not null);

-- Update: nur Mitglieder
drop policy if exists "ws_update_own" on workspaces;
create policy "ws_update_own" on workspaces for update
  using (id = current_workspace_id());

-- --- profiles ---
-- Lesen: alle Profile im eigenen Workspace
drop policy if exists "profiles_read_workspace" on profiles;
create policy "profiles_read_workspace" on profiles for select
  using (workspace_id = current_workspace_id());

-- Erstellen: nur eigenes Profil
drop policy if exists "profiles_insert_self" on profiles;
create policy "profiles_insert_self" on profiles for insert
  with check (id = auth.uid());

-- Update: nur eigenes Profil
drop policy if exists "profiles_update_self" on profiles;
create policy "profiles_update_self" on profiles for update
  using (id = auth.uid());

-- --- recipes ---
drop policy if exists "recipes_read_workspace" on recipes;
create policy "recipes_read_workspace" on recipes for select
  using (workspace_id = current_workspace_id());

drop policy if exists "recipes_insert_workspace" on recipes;
create policy "recipes_insert_workspace" on recipes for insert
  with check (workspace_id = current_workspace_id());

drop policy if exists "recipes_update_workspace" on recipes;
create policy "recipes_update_workspace" on recipes for update
  using (workspace_id = current_workspace_id());

drop policy if exists "recipes_delete_workspace" on recipes;
create policy "recipes_delete_workspace" on recipes for delete
  using (workspace_id = current_workspace_id());

-- --- weekplans ---
drop policy if exists "weekplans_read_workspace" on weekplans;
create policy "weekplans_read_workspace" on weekplans for select
  using (workspace_id = current_workspace_id());

drop policy if exists "weekplans_insert_workspace" on weekplans;
create policy "weekplans_insert_workspace" on weekplans for insert
  with check (workspace_id = current_workspace_id());

drop policy if exists "weekplans_update_workspace" on weekplans;
create policy "weekplans_update_workspace" on weekplans for update
  using (workspace_id = current_workspace_id());

drop policy if exists "weekplans_delete_workspace" on weekplans;
create policy "weekplans_delete_workspace" on weekplans for delete
  using (workspace_id = current_workspace_id());

-- --- weekplan_slots ---
drop policy if exists "slots_read_workspace" on weekplan_slots;
create policy "slots_read_workspace" on weekplan_slots for select
  using (weekplan_id in (select id from weekplans where workspace_id = current_workspace_id()));

drop policy if exists "slots_insert_workspace" on weekplan_slots;
create policy "slots_insert_workspace" on weekplan_slots for insert
  with check (weekplan_id in (select id from weekplans where workspace_id = current_workspace_id()));

drop policy if exists "slots_update_workspace" on weekplan_slots;
create policy "slots_update_workspace" on weekplan_slots for update
  using (weekplan_id in (select id from weekplans where workspace_id = current_workspace_id()));

drop policy if exists "slots_delete_workspace" on weekplan_slots;
create policy "slots_delete_workspace" on weekplan_slots for delete
  using (weekplan_id in (select id from weekplans where workspace_id = current_workspace_id()));
