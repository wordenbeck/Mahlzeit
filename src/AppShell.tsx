import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppMenu } from './components/AppMenu';
import { useAuth } from './lib/auth';

// Smart Entry Point: Mo-Fr → Heute | Sa-So → Plan
function getSmartEntryPoint(): string {
  const today = new Date();
  const day = today.getDay(); // 0 = So, 1 = Mo, ..., 6 = Sa
  const isWeekday = day >= 1 && day <= 5; // Mo-Fr
  return isWeekday ? '/' : '/plan';
}

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

  // Smart redirect: wenn User auf / kommt, leite basierend auf Wochentag weiter
  if (location.pathname === '/') {
    const target = getSmartEntryPoint();
    if (target !== '/') {
      return <Navigate to={target} replace />;
    }
  }

  return (
    <>
      <AppMenu />
      <Outlet />
    </>
  );
}
