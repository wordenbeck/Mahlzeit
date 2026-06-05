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

/**
 * Persist auth session to localStorage
 * Fallback if Supabase session storage fails (esp. on iOS PWA)
 */
function saveSessionToStorage(userId: string) {
  try {
    localStorage.setItem('mealplanner_user_id', userId);
  } catch (e) {
    console.warn('[Auth] Failed to save session:', e);
  }
}

function getSessionFromStorage(): string | null {
  try {
    return localStorage.getItem('mealplanner_user_id');
  } catch (e) {
    console.warn('[Auth] Failed to read session:', e);
    return null;
  }
}

function clearSessionFromStorage() {
  try {
    localStorage.removeItem('mealplanner_user_id');
  } catch (e) {
    console.warn('[Auth] Failed to clear session:', e);
  }
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(initial);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    let cancelled = false;

    const ensureUser = async () => {
      try {
        // Try to restore from Supabase session first
        let { data: { user } } = await supabase.auth.getUser();

        // If no session in Supabase, check localStorage fallback
        if (!user) {
          const savedUserId = getSessionFromStorage();
          if (savedUserId) {
            // Try to restore session by user ID
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, workspace_id, display_name, color')
              .eq('id', savedUserId)
              .maybeSingle();

            if (profile) {
              // Session valid, load workspace
              const { data: ws } = await supabase
                .from('workspaces')
                .select('id, name, code')
                .eq('id', profile.workspace_id)
                .maybeSingle();

              if (!cancelled) {
                setState({
                  loading: false,
                  configured: true,
                  userId: savedUserId,
                  profile,
                  workspace: ws ?? null,
                  error: null,
                });
              }
              return;
            } else {
              // Saved session invalid, clear it
              clearSessionFromStorage();
            }
          }
        }

        // If still no user, create new anonymous session
        if (!user) {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            if (!cancelled) setState(s => ({ ...s, loading: false, error: error.message }));
            return;
          }
          user = data.user;
        }

        if (!user) return;

        // Save session to localStorage for persistence
        saveSessionToStorage(user.id);

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
      } catch (err) {
        if (!cancelled) {
          setState(s => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : 'Auth error',
          }));
        }
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
