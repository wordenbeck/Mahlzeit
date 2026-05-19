/**
 * Recipe Schema — abgeleitet von Kalo, angepasst für Mahlzeit:
 * - user_id → workspace_id + created_by
 * - Nährwerte raus (Kalo-spezifisch)
 * - Mahlzeit-Konzept-Match raus (sanamana etc.)
 * - Rest 1:1 übernehmbar
 *
 * Quellen die unterstützt werden:
 * - Instagram / TikTok / YouTube Reels (Caption-Parsing)
 * - URL (chefkoch.de etc, oEmbed/JSON-LD)
 * - Manuell
 * - SanaMana-Blog (Phase 2)
 * - KI-Generation
 */

export type RecipeSource =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'url'
  | 'sanamana'
  | 'manual'
  | 'ai';

export type Schwierigkeit = 'einfach' | 'mittel' | 'aufwendig';

export type MealType =
  | 'fruehstueck'
  | 'mittag'
  | 'abendessen'
  | 'snack'
  | 'dessert'
  | 'getraenk'
  | 'beilage';

export type RecipeType =
  | 'hauptgericht'
  | 'snack'
  | 'dessert'
  | 'fruehstueck'
  | 'beilage'
  | 'getraenk';

export const RECIPE_TYPE_LABELS: Record<RecipeType, string> = {
  hauptgericht: 'Hauptgericht',
  snack: 'Snack',
  dessert: 'Dessert',
  fruehstueck: 'Frühstück',
  beilage: 'Beilage',
  getraenk: 'Getränk',
};

export interface Zutat {
  name: string;
  menge: number | null;       // null wenn "nach Geschmack" / "etwas"
  einheit: string;            // 'g' | 'ml' | 'Stk' | 'EL' | 'TL' | 'Prise' | 'nach Geschmack' | ...
  hinweis: string | null;     // 'fein gehackt', 'optional', etc.
}

export interface Recipe {
  // Meta
  id: string;
  workspace_id: string;
  created_by: string;          // profile.id
  created_at: string;
  updated_at: string;

  // Quelle
  source: RecipeSource;
  source_url: string | null;
  source_author: string | null;
  source_caption_raw: string | null;

  // Inhalt
  titel: string;
  beschreibung: string | null;
  portionen: number;
  zubereitungszeit_min: number | null;
  schwierigkeit: Schwierigkeit | null;
  kategorie: MealType[];
  recipe_type: RecipeType;

  zutaten: Zutat[];
  zubereitung: string[];       // Schritt-Array

  tags: string[];

  bild_url: string | null;
  is_favorite: boolean;

  ai_confidence: 'low' | 'medium' | 'high' | null;
  ai_warnings: string[];
}

/** LLM-Response, bevor in DB gespeichert wird */
export interface RecipeParserOutput {
  status: 'ok' | 'needs_clarification' | 'not_a_recipe';
  rezept: Omit<Recipe, 'id' | 'workspace_id' | 'created_by' | 'created_at' | 'updated_at'> | null;
  rueckfrage: string | null;
  warnungen: string[];
}

/** Slot im Wochenplan */
export interface WeekplanSlot {
  id: string;
  weekplan_id: string;
  day_of_week: number;          // 0=Mo .. 6=So
  meal_type: MealType;
  recipe_id: string | null;
  custom_text: string | null;   // freier Eintrag ohne Rezept
  position: number;
  added_by: string;             // profile.id
  notes: string | null;
  zutaten_override: Record<string, number>;  // { "zutat_name_lower": menge }
  portionen_override: number | null;
  created_at: string;
}

export interface Weekplan {
  id: string;
  workspace_id: string;
  week_start: string;           // ISO date Mo
}
