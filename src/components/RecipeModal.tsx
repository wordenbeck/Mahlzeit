import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, Clock, Users } from 'lucide-react';
import './RecipeModal.css';
import { SchwierigkeitBadge } from './SchwierigkeitBadge';
import { getRecipe } from '../lib/recipes';
import type { Recipe, Schwierigkeit, Zutat } from '../lib/types/recipe';
import { CookingSpinner } from './CookingSpinner';

type Props = {
  recipeId: string;
  onClose: () => void;
};

export function RecipeModal({ recipeId, onClose }: Props) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRecipe(recipeId)
      .then(r => { if (!cancelled) setRecipe(r); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [recipeId]);

  // ESC schließt
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <>
      <div className="rmodal__backdrop" onClick={onClose} />
      <div
        className="rmodal"
        role="dialog"
        aria-modal="true"
        aria-label={recipe?.titel ?? 'Rezept'}
        onClick={e => e.stopPropagation()}
      >
        <button className="rmodal__close" onClick={onClose} aria-label="Schließen">
          <X size={20} strokeWidth={2} />
        </button>

        {loading && (
          <div className="rmodal__loading">
            <CookingSpinner size={60} label="Lade Rezept…" />
          </div>
        )}

        {error && <div className="rmodal__error">{error}</div>}

        {recipe && (
          <>
            <div
              className="rmodal__hero"
              style={
                recipe.bild_url
                  ? { background: `url(${recipe.bild_url}) center/cover` }
                  : undefined
              }
            >
              {!recipe.bild_url && <span className="rmodal__hero-placeholder">🍽</span>}
            </div>

            <div className="rmodal__body">
              <header className="rmodal__header">
                <h2>{recipe.titel}</h2>
                <div className="rmodal__meta">
                  {recipe.zubereitungszeit_min != null && (
                    <span className="rmodal__meta-item">
                      <Clock size={14} strokeWidth={1.75} /> {recipe.zubereitungszeit_min} Min
                    </span>
                  )}
                  {recipe.portionen && (
                    <span className="rmodal__meta-item">
                      <Users size={14} strokeWidth={1.75} /> {recipe.portionen} Port.
                    </span>
                  )}
                  {recipe.schwierigkeit && (
                    <SchwierigkeitBadge schwierigkeit={recipe.schwierigkeit as Schwierigkeit} size={14} />
                  )}
                </div>
              </header>

              {recipe.beschreibung && (
                <p className="rmodal__desc">{recipe.beschreibung}</p>
              )}

              {recipe.zutaten.length > 0 && (
                <section className="rmodal__section">
                  <h3>Zutaten</h3>
                  <ul className="rmodal__zutaten">
                    {(recipe.zutaten as Zutat[]).map((z, idx) => (
                      <li key={idx}>
                        <span className="rmodal__zutat-name">{z.name}</span>
                        <span className="rmodal__zutat-menge">
                          {z.menge != null
                            ? `${Number.isInteger(z.menge) ? z.menge : z.menge.toFixed(1)} ${z.einheit}`
                            : z.einheit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {recipe.zubereitung.length > 0 && (
                <section className="rmodal__section">
                  <h3>Zubereitung</h3>
                  <ol className="rmodal__steps">
                    {(recipe.zubereitung as string[]).map((step, idx) => (
                      <li key={idx}>
                        <span className="rmodal__step-num">{idx + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              <footer className="rmodal__footer">
                <Link to={`/rezepte/${recipe.id}`} className="rmodal__detail-link" onClick={onClose}>
                  <ExternalLink size={14} strokeWidth={2} />
                  Vollbild öffnen
                </Link>
              </footer>
            </div>
          </>
        )}
      </div>
    </>
  );
}
