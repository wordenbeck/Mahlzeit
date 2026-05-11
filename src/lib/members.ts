// CRUD für Workspace-Mitglieder + eigenes Profile

import { supabase } from './supabase';

export type Member = {
  id: string;
  display_name: string;
  color: string;
  created_at: string;
};

export async function listMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, color, created_at')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Member[];
}

export async function updateDisplayName(name: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht eingeloggt.');
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: name } as never)
    .eq('id', user.id);
  if (error) throw error;
}

export async function updateProfileColor(color: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht eingeloggt.');
  const { error } = await supabase
    .from('profiles')
    .update({ color } as never)
    .eq('id', user.id);
  if (error) throw error;
}
