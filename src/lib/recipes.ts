import { supabase } from './supabase';
import type { Recipe, RecipeParserOutput } from './types/recipe';

// =====================================================================
// CRUD-Layer für Rezepte. Alle Calls sind RLS-geschützt — User sieht
// nur Rezepte des eigenen Workspaces.
// =====================================================================

export type RecipeListItem = Pick<
  Recipe,
  | 'id'
  | 'titel'
  | 'beschreibung'
  | 'portionen'
  | 'zubereitungszeit_min'
  | 'schwierigkeit'
  | 'kategorie'
  | 'tags'
  | 'zutaten'
  | 'bild_url'
  | 'is_favorite'
  | 'created_by'
  | 'created_at'
  | 'source'
  | 'recipe_type'
>;

/** source_urls + normalisierte Titel aller Recipes — für Dedup-Check beim Bulk-Import */
export async function listExistingSourceUrls(): Promise<string[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('source_url, titel');
  if (error) throw error;

  const urls = (data ?? [])
    .map(r => (r as { source_url: string | null }).source_url)
    .filter((u): u is string => !!u);

  // Auch normalisierte Titel als Pseudo-URLs zurückgeben (Format: "titel::XYZ")
  // damit BulkImport auch ohne URL auf Titel-Duplikate prüfen kann
  const titles = (data ?? [])
    .map(r => `titel::${(r as { titel: string }).titel?.toLowerCase().trim().replace(/\s+/g, ' ')}`)
    .filter(t => t !== 'titel::');

  return [...urls, ...titles];
}

export async function listRecipes(): Promise<RecipeListItem[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(
      'id, titel, beschreibung, portionen, zubereitungszeit_min, schwierigkeit, kategorie, tags, zutaten, bild_url, is_favorite, created_by, created_at, source, recipe_type'
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as RecipeListItem[];
}

/** Alle Rezepte mit vollem Datensatz (für Export). */
export async function listRecipesFull(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Recipe[];
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Recipe | null;
}

export type SaveRecipeInput = Omit<
  Recipe,
  'id' | 'workspace_id' | 'created_by' | 'created_at' | 'updated_at'
>;

export async function saveRecipe(input: SaveRecipeInput): Promise<Recipe> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht eingeloggt.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('workspace_id')
    .eq('id', user.id)
    .single();
  if (!profile) throw new Error('Kein Profil. Onboarding nicht abgeschlossen?');

  const { data, error } = await supabase
    .from('recipes')
    .insert({
      ...input,
      workspace_id: profile.workspace_id,
      created_by: user.id,
      // jsonb fields müssen sauber serialisiert sein
      zutaten: input.zutaten as unknown as never,
      zubereitung: input.zubereitung as unknown as never,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as unknown as Recipe;
}

export async function updateRecipe(id: string, patch: Partial<SaveRecipeInput>): Promise<Recipe> {
  const updates: Record<string, unknown> = { ...patch };
  if (patch.zutaten) updates.zutaten = patch.zutaten as unknown;
  if (patch.zubereitung) updates.zubereitung = patch.zubereitung as unknown;
  const { data, error } = await supabase
    .from('recipes')
    .update(updates as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as unknown as Recipe;
}

export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from('recipes').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  const { error } = await supabase
    .from('recipes')
    .update({ is_favorite: isFavorite } as never)
    .eq('id', id);
  if (error) throw error;
}

// =====================================================================
// Edge-Function-Call für URL-Import
// =====================================================================

export type ImportRecipeFromUrlResult = {
  status: 'ok' | 'extraction_failed' | 'error';
  extracted_caption?: string | null;
  extracted_author?: string | null;
  extracted_thumbnail?: string | null;
  result?: RecipeParserOutput;
  error?: string;
  fallback_required?: boolean;
};

/**
 * Ruft die Edge-Function `import-recipe-from-url` auf. Der Parser-Prompt
 * wird vom Client mitgeschickt damit man ihn ohne Function-Redeploy ändern kann.
 */
export async function importRecipeFromUrl(
  url: string,
  systemPrompt: string,
  fewShotExamples: string,
  manualCaption?: string
): Promise<ImportRecipeFromUrlResult> {
  const { data, error } = await supabase.functions.invoke('import-recipe-from-url', {
    body: {
      url,
      manual_caption: manualCaption,
      systemPrompt,
      fewShotExamples,
    },
  });
  if (error) {
    return { status: 'error', error: error.message };
  }
  return data as ImportRecipeFromUrlResult;
}
