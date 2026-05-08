import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppMenu } from './components/AppMenu';
import { useAuth } from './lib/auth';

// Schützt App-Routes: ohne Profile → /onboarding
export function AppShell() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.configured) {
    // Kein Supabase eingerichtet → Onboarding zeigt Setup-Hinweis
    return <Navigate to="/onboarding" replace state={{ from: location }} />;
  }

  if (auth.loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-3)' }}>Lade…</p>
      </div>
    );
  }

  if (!auth.profile) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <>
      <AppMenu />
      <Outlet />
    </>
  );
}
