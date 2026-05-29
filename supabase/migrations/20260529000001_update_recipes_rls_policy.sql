-- Update RLS policy for recipes to include shared recipes
-- Recipes are visible if:
-- 1. is_shared = true (available to all workspaces)
-- 2. workspace_id matches current user's workspace

-- Drop old policy
DROP POLICY IF EXISTS "recipes_select_policy" ON recipes;
DROP POLICY IF EXISTS "recipes_insert_policy" ON recipes;
DROP POLICY IF EXISTS "recipes_update_policy" ON recipes;
DROP POLICY IF EXISTS "recipes_delete_policy" ON recipes;

-- New SELECT: own workspace OR is_shared = true
CREATE POLICY "recipes_select_policy" ON recipes
  FOR SELECT
  USING (
    workspace_id = (
      SELECT workspace_id FROM profiles
      WHERE id = auth.uid()
    )
    OR is_shared = true
  );

-- INSERT: only own workspace
CREATE POLICY "recipes_insert_policy" ON recipes
  FOR INSERT
  WITH CHECK (
    workspace_id = (
      SELECT workspace_id FROM profiles
      WHERE id = auth.uid()
    )
  );

-- UPDATE: only own workspace recipes
CREATE POLICY "recipes_update_policy" ON recipes
  FOR UPDATE
  USING (
    workspace_id = (
      SELECT workspace_id FROM profiles
      WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id = (
      SELECT workspace_id FROM profiles
      WHERE id = auth.uid()
    )
  );

-- DELETE: only own workspace recipes
CREATE POLICY "recipes_delete_policy" ON recipes
  FOR DELETE
  USING (
    workspace_id = (
      SELECT workspace_id FROM profiles
      WHERE id = auth.uid()
    )
  );
