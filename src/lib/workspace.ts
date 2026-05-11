import { supabase } from './supabase';

// =====================================================================
// Workspace-Code-Generation
// 6-stellig alphanumerisch ohne verwechslungsfähige Zeichen (0/O, 1/I/L)
// =====================================================================

export function generateWorkspaceCode(): string {
  // 4-stellig numerisch (0000–9999), 10k Kombinationen — für Familie ausreichend
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
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
// Create + Join — über RPCs (lösen RLS-After-Insert-Problem)
// =====================================================================

export async function createWorkspace(workspaceName: string, displayName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Kein Auth-User. Anonymous Sign-In zuerst.');

  // RPC mit max 5 Retries bei Code-Kollision
  let workspaceId: string | null = null;
  let code = '';
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    code = generateWorkspaceCode();
    const { data, error } = await supabase.rpc('create_workspace_and_join', {
      p_name: workspaceName,
      p_code: code,
      p_display_name: displayName,
      p_color: pickProfileColor(),
    } as never) as { data: string | null; error: { code?: string; message: string } | null };

    if (!error && data) {
      workspaceId = data;
      break;
    }
    lastError = error;
    // 23505 = unique_violation auf workspaces.code → retry mit neuem Code
    if (error?.code !== '23505') {
      throw new Error(error?.message ?? 'Konnte Haushalt nicht anlegen.');
    }
  }
  if (!workspaceId) {
    throw new Error(
      `Konnte keinen eindeutigen Code generieren${lastError ? ` (${(lastError as { message?: string }).message})` : ''}.`
    );
  }

  return { workspaceId, code };
}

export async function joinWorkspaceByCode(code: string, displayName: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Kein Auth-User.');

  const normalized = code.trim().toUpperCase();

  // 1. Lookup um den Workspace-Namen zurückzugeben + zu prüfen dass er existiert
  const lookupResult = await supabase.rpc('lookup_workspace_by_code', {
    p_code: normalized,
  } as never) as { data: { workspace_id: string; workspace_name: string }[] | null; error: { message: string } | null };

  if (lookupResult.error) throw new Error(lookupResult.error.message);
  const found = lookupResult.data?.[0];
  if (!found) throw new Error('Workspace nicht gefunden. Stimmt der Code?');

  // 2. Bereits-genommene Profile-Farben holen — geht erst NACH dem Beitritt,
  //    daher zuerst joinen, dann optional Farbe nachher anpassen.
  const { error } = await supabase.rpc('join_workspace_by_code', {
    p_code: normalized,
    p_display_name: displayName,
    p_color: pickProfileColor(),
  } as never) as { data: string | null; error: { message: string } | null };

  if (error) throw new Error(error.message);

  return { workspaceId: found.workspace_id, workspaceName: found.workspace_name };
}

export async function lookupWorkspaceByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  const { data, error } = await supabase.rpc('lookup_workspace_by_code', {
    p_code: normalized,
  } as never) as { data: { workspace_id: string; workspace_name: string }[] | null; error: { message: string } | null };

  if (error) throw new Error(error.message);
  const found = data?.[0];
  if (!found) return null;
  return { id: found.workspace_id, name: found.workspace_name, code: normalized };
}
