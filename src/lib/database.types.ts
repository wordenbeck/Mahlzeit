// Generierte DB-Types für Sprint 1.
// Später ersetzbar durch `supabase gen types typescript --project-id ... > database.types.ts`.

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['workspaces']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          workspace_id: string;
          display_name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id: string;
          workspace_id: string;
          display_name: string;
          color: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      recipes: {
        Row: {
          id: string;
          workspace_id: string;
          created_by: string;
          source: string;
          source_url: string | null;
          source_author: string | null;
          source_caption_raw: string | null;
          titel: string;
          beschreibung: string | null;
          portionen: number;
          zubereitungszeit_min: number | null;
          schwierigkeit: string | null;
          kategorie: string[];
          zutaten: Json;
          zubereitung: Json;
          tags: string[];
          bild_url: string | null;
          is_favorite: boolean;
          ai_confidence: string | null;
          ai_warnings: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['recipes']['Row'],
          'id' | 'created_at' | 'updated_at' | 'kategorie' | 'tags' | 'ai_warnings' | 'is_favorite' | 'portionen' | 'zutaten' | 'zubereitung'
        > & {
          id?: string;
          kategorie?: string[];
          tags?: string[];
          ai_warnings?: string[];
          is_favorite?: boolean;
          portionen?: number;
          zutaten?: Json;
          zubereitung?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['recipes']['Insert']>;
      };
      weekplans: {
        Row: {
          id: string;
          workspace_id: string;
          week_start: string;
        };
        Insert: { id?: string; workspace_id: string; week_start: string };
        Update: Partial<Database['public']['Tables']['weekplans']['Insert']>;
      };
      weekplan_slots: {
        Row: {
          id: string;
          weekplan_id: string;
          day_of_week: number;
          meal_type: string;
          recipe_id: string | null;
          custom_text: string | null;
          position: number;
          added_by: string;
          notes: string | null;
          zutaten_override: Json;
          portionen_override: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          weekplan_id: string;
          day_of_week: number;
          meal_type: string;
          recipe_id?: string | null;
          custom_text?: string | null;
          position?: number;
          added_by: string;
          notes?: string | null;
          zutaten_override?: Json;
          portionen_override?: number | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['weekplan_slots']['Insert']>;
      };
    };
    Functions: { current_workspace_id: { Args: Record<string, never>; Returns: string } };
    Enums: Record<string, never>;
  };
};
