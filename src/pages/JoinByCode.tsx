import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

// /join/:code → leitet auf /onboarding?code=… weiter, damit der Standard-Flow greift
export function JoinByCode() {
  const { code } = useParams<{ code: string }>();
  useEffect(() => {
    document.title = `Mahlzeit · Beitreten ${code ?? ''}`;
  }, [code]);
  return <Navigate to={`/onboarding?code=${encodeURIComponent(code ?? '')}`} replace />;
}
