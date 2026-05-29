-- Add is_shared column to recipes table
-- Allows recipes to be shared across all workspaces when is_shared = true
-- Defaults to true for MVP (all recipes shared)

ALTER TABLE recipes ADD COLUMN is_shared boolean DEFAULT true NOT NULL;

-- Update all existing recipes to is_shared = true
UPDATE recipes SET is_shared = true WHERE is_shared IS NULL;
