import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

export type Profile = {
  id: string;
  workspace_id: string;
  display_name: string;
  color: string;
};

export type Workspace = {
  id: string;
  name: string;
  code: string;
};

export type AuthState = {
  loading: boolean;
  configured: boolean;
  userId: string | null;
  profile: Profile | null;
  workspace: Workspace | null;
  error: string | null;
};

const initial: AuthState = {
  loading: true,
  configured: isSupabaseConfigured,
  userId: null,
  profile: null,
  workspace: null,
  error: null,
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(initial);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    let cancelled = false;

    const ensureUser = async () => {
      // Anonymous-Auth: wenn kein User, signen wir anonym ein
      let { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          if (!cancelled) setState(s => ({ ...s, loading: false, error: error.message }));
          return;
        }
        user = data.user;
      }
      if (!user) return;

      // Profile + Workspace laden
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, workspace_id, display_name, color')
        .eq('id', user.id)
        .maybeSingle();

      let workspace: Workspace | null = null;
      if (profile) {
        const { data: ws } = await supabase
          .from('workspaces')
          .select('id, name, code')
          .eq('id', profile.workspace_id)
          .maybeSingle();
        workspace = ws ?? null;
      }

      if (!cancelled) {
        setState({
          loading: false,
          configured: true,
          userId: user.id,
          profile: profile ?? null,
          workspace,
          error: null,
        });
      }
    };

    ensureUser();
    return () => { cancelled = true; };
  }, []);

  return state;
}

// Helper: nach Onboarding (createWorkspace / joinWorkspaceByCode) den Auth-Hook
// triggern damit Profile/Workspace neu gelesen werden.
export async function refreshAuth() {
  // Trick: Page-Reload reicht für Sprint 1, später eleganter via shared store.
  window.location.reload();
}
