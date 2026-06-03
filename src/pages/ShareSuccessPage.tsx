/**
 * ShareSuccessPage — Feedback nach erfolgreicher Instagram-Rezept-Speicherung
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function ShareSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recipeId = searchParams.get('recipeId');
  const recipeName = searchParams.get('name') || 'Rezept';

  useEffect(() => {
    // Auto-redirect nach 3 Sekunden
    const timer = setTimeout(() => {
      if (recipeId) {
        navigate(`/rezepte/${recipeId}`);
      } else {
        navigate('/rezepte');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, recipeId]);

  return (
    <div
      style={{
        padding: '4rem 2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f0f8f5 0%, #e8f5e9 100%)',
      }}
    >
      <div style={{ fontSize: '72px', marginBottom: '1.5rem', animation: 'bounce 1s ease-in-out' }}>✅</div>

      <h1 style={{ fontSize: '32px', color: '#006c49', marginBottom: '0.5rem', margin: 0 }}>Rezept gespeichert!</h1>

      <p style={{ fontSize: '16px', color: '#555', marginBottom: '2rem', marginTop: '1rem' }}>
        <strong>"{recipeName}"</strong> wurde erfolgreich hinzugefügt
      </p>

      <div
        style={{
          padding: '1.5rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 108, 73, 0.15)',
          marginBottom: '2rem',
          maxWidth: '300px',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>📱 Wird weitergeleitet zu deinem Rezept...</p>
      </div>

      <button
        onClick={() => {
          if (recipeId) {
            navigate(`/rezepte/${recipeId}`);
          } else {
            navigate('/rezepte');
          }
        }}
        style={{
          padding: '12px 24px',
          background: '#006c49',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        Jetzt anschauen →
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
