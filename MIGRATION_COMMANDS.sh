#!/bin/bash
# Supabase Migrations für Sprint 14 + 15
# Führe dies lokal aus oder paste in Supabase SQL Editor

echo "🚀 MealPlanner Migrations — Sprint 14 + 15"
echo ""
echo "Option 1: Lokal mit Supabase CLI (empfohlen):"
echo "  supabase db push"
echo ""
echo "Option 2: Supabase SQL Editor (https://app.supabase.com)"
echo "  Kopiere die SQL-Migration unten und paste in SQL Editor"
echo ""
echo "========================================"
echo "SQL MIGRATIONS:"
echo "========================================"
echo ""

cat << 'SQL'
-- =====================================================================
-- SPRINT 14: Make Recipes Global (visible to all workspaces)
-- =====================================================================

-- Step 1: Make workspace_id nullable
ALTER TABLE recipes ALTER COLUMN workspace_id DROP NOT NULL;

-- Step 2: Make ALL existing recipes GLOBAL
UPDATE recipes SET workspace_id = NULL;

-- Step 3: Update RLS Policy
DROP POLICY IF EXISTS "workspace members read" ON recipes;
CREATE POLICY "workspace members read global and own" ON recipes FOR SELECT
  USING (
    workspace_id IS NULL
    OR workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
  );

-- =====================================================================
-- SPRINT 15: Cooking Tracking + Recipe Features
-- =====================================================================

-- Recipe Ratings (1-5 Sterne + Notizen)
CREATE TABLE IF NOT EXISTS recipe_ratings (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  recipe_id uuid references recipes on delete cascade not null,
  user_id uuid references profiles on delete cascade not null,
  stars integer check (stars between 1 and 5) not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(workspace_id, recipe_id, user_id)
);

-- Recipe History (wann wurde gekocht?)
CREATE TABLE IF NOT EXISTS recipe_history (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  recipe_id uuid references recipes on delete cascade not null,
  user_id uuid references profiles on delete cascade not null,
  cooked_at timestamptz default now(),
  notes text,
  created_at timestamptz default now()
);

-- Recipe Notes (Haushalt-Notizen)
CREATE TABLE IF NOT EXISTS recipe_notes (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  recipe_id uuid references recipes on delete cascade not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(workspace_id, recipe_id)
);

-- Add recipe_type column
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS recipe_type text DEFAULT 'hauptgericht';

-- =====================================================================
-- RLS POLICIES
-- =====================================================================

-- Ratings
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user can view all ratings in workspace" ON recipe_ratings FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can insert own rating" ON recipe_ratings FOR INSERT
  WITH CHECK (user_id = auth.uid() AND workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can update own rating" ON recipe_ratings FOR UPDATE
  USING (user_id = auth.uid());

-- History
ALTER TABLE recipe_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user can view workspace history" ON recipe_history FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can insert own history" ON recipe_history FOR INSERT
  WITH CHECK (user_id = auth.uid() AND workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Notes
ALTER TABLE recipe_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user can view workspace notes" ON recipe_notes FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can manage workspace notes" ON recipe_notes FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can update workspace notes" ON recipe_notes FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- =====================================================================
-- INDEXES
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_ratings_recipe ON recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ratings_workspace ON recipe_ratings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_history_recipe ON recipe_history(recipe_id);
CREATE INDEX IF NOT EXISTS idx_history_workspace ON recipe_history(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notes_recipe ON recipe_notes(recipe_id);
SQL

echo ""
echo "========================================"
echo ""
echo "✅ Fertig! Führe eine der obigen Optionen aus."
