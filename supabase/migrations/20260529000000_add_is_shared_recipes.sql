-- Add is_shared column to recipes table
-- Allows recipes to be shared across all workspaces when is_shared = true
-- Defaults to true for MVP (all recipes shared)
-- Idempotent: checks if column exists before adding

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'is_shared'
  ) THEN
    ALTER TABLE recipes ADD COLUMN is_shared boolean DEFAULT true NOT NULL;
  END IF;
END
$$;

-- Update all existing recipes to is_shared = true (safe to run multiple times)
UPDATE recipes SET is_shared = true WHERE is_shared IS NULL;
