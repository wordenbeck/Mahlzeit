import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Sprint-1-Setup: .env.local muss VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY haben.
  // Solange leer → Auth/DB-Calls werfen. Sehen wir in der UI mit klarer Meldung.
  console.warn(
    '[supabase] Fehlende Env-Vars. Trag VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in .env.local ein. Siehe SETUP.md.'
  );
}

export const supabase = createClient<Database>(
  url ?? 'https://missing.supabase.co',
  anonKey ?? 'missing'
);

export const isSupabaseConfigured = Boolean(url && anonKey);
