// Supabase Realtime — leichter Wrapper für Workspace-scoped Channels.
// Pages subscriben via useRealtimeReload(table, deps).

import { useEffect } from 'react';
import { supabase } from './supabase';

type Table = 'weekplan_slots' | 'recipes' | 'weekplans' | 'profiles';

/**
 * Subscribed auf INSERT/UPDATE/DELETE auf einer Tabelle und ruft onChange auf.
 * RLS sorgt dafür dass nur eigene-Workspace-Changes durchkommen.
 *
 * Hinweis: Supabase Realtime muss in der Tabelle aktiviert sein.
 * Dashboard → Database → Replication → Tabelle aktivieren.
 */
export function useRealtimeReload(table: Table, onChange: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const channel = supabase
      .channel(`rt-${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => { onChange(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, enabled]);
}
