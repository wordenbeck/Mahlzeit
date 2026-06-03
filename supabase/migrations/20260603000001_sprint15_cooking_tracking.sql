-- =====================================================================
-- SPRINT 15: Cooking Tracking + Recipe-Type
-- =====================================================================

-- 1. Recipe Ratings (Sterne 1-5 + optional Notizen)
CREATE TABLE IF NOT EXISTS recipe_ratings (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  recipe_id uuid references recipes on delete cascade not null,
  user_id uuid references profiles on delete cascade not null,
  stars integer check (stars between 1 and 5) not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(workspace_id, recipe_id, user_id) -- Ein Rating pro User pro Rezept
);

-- 2. Recipe History (Tracking: wann wurde gekocht?)
CREATE TABLE IF NOT EXISTS recipe_history (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  recipe_id uuid references recipes on delete cascade not null,
  user_id uuid references profiles on delete cascade not null,
  cooked_at timestamptz default now(),
  notes text, -- "War lecker!", "Zu lange gedauert", etc.
  created_at timestamptz default now()
);

-- 3. Recipe Notes (Pro Haushalt, persistent)
CREATE TABLE IF NOT EXISTS recipe_notes (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  recipe_id uuid references recipes on delete cascade not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(workspace_id, recipe_id) -- Eine Notiz pro Rezept pro Haushalt
);

-- 4. Add recipe_type column if not exists (should exist from Sprint 15 migration)
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS recipe_type text DEFAULT 'hauptgericht';

-- =====================================================================
-- RLS Policies
-- =====================================================================

-- Ratings: User sieht nur eigene + alle anderen im Haushalt
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user can view all ratings in workspace" ON recipe_ratings FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can insert own rating" ON recipe_ratings FOR INSERT
  WITH CHECK (user_id = auth.uid() AND workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can update own rating" ON recipe_ratings FOR UPDATE
  USING (user_id = auth.uid());

-- History: User sieht nur sein Haushalt History
ALTER TABLE recipe_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user can view workspace history" ON recipe_history FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can insert own history" ON recipe_history FOR INSERT
  WITH CHECK (user_id = auth.uid() AND workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- Notes: User sieht nur sein Haushalt Notizen
ALTER TABLE recipe_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user can view workspace notes" ON recipe_notes FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can manage workspace notes" ON recipe_notes FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "user can update workspace notes" ON recipe_notes FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid()));

-- =====================================================================
-- Indexes for performance
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_ratings_recipe ON recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ratings_workspace ON recipe_ratings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_history_recipe ON recipe_history(recipe_id);
CREATE INDEX IF NOT EXISTS idx_history_workspace ON recipe_history(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notes_recipe ON recipe_notes(recipe_id);
