-- =====================================================================
-- Make existing recipes GLOBAL (visible to all workspaces)
-- =====================================================================

-- Step 1: Make workspace_id nullable (for shared/global recipes)
ALTER TABLE recipes ALTER COLUMN workspace_id DROP NOT NULL;

-- Step 2: Make ALL existing recipes global (NULL = everyone sees it)
UPDATE recipes SET workspace_id = NULL;

-- Step 3: Update RLS Policy — Users see:
--   - All global recipes (workspace_id IS NULL)
--   - Recipes from their own workspace (workspace_id matches)
DROP POLICY IF EXISTS "workspace members read" ON recipes;
CREATE POLICY "workspace members read global and own" ON recipes FOR SELECT
  USING (
    workspace_id IS NULL  -- Global recipes
    OR workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())  -- Own workspace recipes
  );

-- Step 4: New recipes from users are workspace-specific (NOT NULL)
-- (INSERT policy unchanged, but new recipes will have workspace_id set)
