import { supabase } from './supabase';

// =====================================================================
// Workspace-Code-Generation
// 6-stellig alphanumerisch ohne verwechslungsfähige Zeichen (0/O, 1/I/L)
// =====================================================================

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateWorkspaceCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  // Format: 4-2 mit Bindestrich für Lesbarkeit (z.B. "KOCH-42")
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

const PROFILE_COLORS = [
  '--profile-amber',
  '--profile-rose',
  '--profile-sage',
  '--profile-sky',
  '--profile-lavender',
  '--profile-ochre',
];

export function pickProfileColor(takenColorVars: string[] = []): string {
  const free = PROFILE_COLORS.filter(c => !takenColorVars.includes(c));
  const pool = free.length > 0 ? free : PROFILE_COLORS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// =====================================================================
// Create + Join
// =====================================================================

export async function createWorkspace(workspaceName: string, displayName: string) {
  // 1. Anonymous-User muss schon angelegt sein (auth.uid() vorhanden)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Kein Auth-User. Anonymous Sign-In zuerst.');

  // 2. Workspace anlegen mit eindeutigem Code (max 5 Versuche bei Kollision)
  let workspaceId: string | null = null;
  let code = '';
  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateWorkspaceCode();
    const { data, error } = await supabase
      .from('workspaces')
      .insert({ name: workspaceName, code })
      .select('id')
      .single();
    if (!error) {
      workspaceId = data.id;
      break;
    }
    if (error.code !== '23505') throw error; // 23505 = unique_violation
  }
  if (!workspaceId) throw new Error('Konnte keinen eindeutigen Code generieren.');

  // 3. Profile anlegen
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      workspace_id: workspaceId,
      display_name: displayName,
      color: pickProfileColor(),
    });
  if (profileError) throw profileError;

  return { workspaceId, code };
}

export async function joinWorkspaceByCode(code: string, displayName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Kein Auth-User.');

  const normalized = code.trim().toUpperCase();

  // 1. Workspace per Code finden
  const { data: ws, error: wsError } = await supabase
    .from('workspaces')
    .select('id, name')
    .eq('code', normalized)
    .single();
  if (wsError || !ws) throw new Error('Workspace nicht gefunden. Stimmt der Code?');

  // 2. Bereits-genommene Profile-Farben holen
  const { data: existing } = await supabase
    .from('profiles')
    .select('color')
    .eq('workspace_id', ws.id);
  const taken = (existing ?? []).map(p => p.color);

  // 3. Profile anlegen
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      workspace_id: ws.id,
      display_name: displayName,
      color: pickProfileColor(taken),
    });
  if (profileError) throw profileError;

  return { workspaceId: ws.id, workspaceName: ws.name };
}

export async function lookupWorkspaceByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  const { data, error } = await supabase
    .from('workspaces')
    .select('id, name, code')
    .eq('code', normalized)
    .maybeSingle();
  if (error) throw error;
  return data;
}
