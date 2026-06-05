/**
 * ShareSuccessPage — Feedback nach erfolgreicher Instagram-Rezept-Speicherung
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ShareSuccessPage.css';

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
    <div className="shs">
      <div className="shs__icon">✅</div>
      <h1 className="shs__title">Rezept gespeichert!</h1>
      <p className="shs__sub"><strong>„{recipeName}"</strong> wurde erfolgreich hinzugefügt</p>
      <div className="shs__card">
        <p>📱 Wird weitergeleitet zu deinem Rezept…</p>
      </div>
      <button
        className="shs__cta"
        onClick={() => navigate(recipeId ? `/rezepte/${recipeId}` : '/rezepte')}
      >
        Jetzt anschauen →
      </button>
    </div>
  );
}
