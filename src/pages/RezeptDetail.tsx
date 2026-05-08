import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Trash2, ExternalLink, ChefHat } from 'lucide-react';
import './RezeptDetail.css';
import { SchwierigkeitBadge } from '../components/SchwierigkeitBadge';
import { getRecipe, deleteRecipe, toggleFavorite } from '../lib/recipes';
import type { Recipe, Schwierigkeit } from '../lib/types/recipe';

export function RezeptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getRecipe(id)
      .then(r => { if (!cancelled) setRecipe(r); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler beim Laden'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleFav = async () => {
    if (!recipe) return;
    const next = !recipe.is_favorite;
    setRecipe({ ...recipe, is_favorite: next });
    try {
      await toggleFavorite(recipe.id, next);
    } catch (e) {
      setRecipe({ ...recipe, is_favorite: !next });
      setError(e instanceof Error ? e.message : 'Konnte nicht speichern.');
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;
    if (!confirm(`Rezept „${recipe.titel}" wirklich löschen?`)) return;
    try {
      await deleteRecipe(recipe.id);
      navigate('/rezepte');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht löschen.');
    }
  };

  if (loading) return <div className="rdet"><p className="rdet__loading">Lade…</p></div>;
  if (error) return <div className="rdet"><div className="rdet__error">{error}</div></div>;
  if (!recipe) return (
    <div className="rdet">
      <p className="rdet__loading">Rezept nicht gefunden.</p>
      <Link to="/rezepte" className="rdet__back">← zurück zu Rezepten</Link>
    </div>
  );

  return (
    <div className="rdet">
      <header className="rdet__header">
        <Link to="/rezepte" className="rdet__back">
          <ArrowLeft size={14} strokeWidth={2} /> zurück zu Rezepten
        </Link>

        <div className="rdet__hero">
          {recipe.bild_url ? (
            <img src={recipe.bild_url} alt={recipe.titel} className="rdet__image" />
          ) : (
            <div className="rdet__image rdet__image--placeholder"><ChefHat size={48} /></div>
          )}

          <div className="rdet__title-block">
            <h1>{recipe.titel}</h1>
            {recipe.beschreibung && <p className="rdet__desc">{recipe.beschreibung}</p>}
            <div className="rdet__meta">
              {recipe.zubereitungszeit_min != null && (
                <span className="rdet__meta-item">
                  <Clock size={14} strokeWidth={1.75} /> {recipe.zubereitungszeit_min} Min
                </span>
              )}
              {recipe.schwierigkeit && (
                <SchwierigkeitBadge schwierigkeit={recipe.schwierigkeit as Schwierigkeit} size={14} />
              )}
              <span className="rdet__meta-item">{recipe.portionen} Portionen</span>
            </div>
            {recipe.source_url && (
              <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" className="rdet__source">
                <ExternalLink size={12} strokeWidth={1.75} /> {recipe.source_author ?? recipe.source}
              </a>
            )}
          </div>

          <div className="rdet__actions">
            <button
              className={`rdet__fav ${recipe.is_favorite ? 'is-active' : ''}`}
              onClick={handleFav}
              aria-label={recipe.is_favorite ? 'Aus Favoriten entfernen' : 'Als Favorit markieren'}
            >
              <Star size={18} fill={recipe.is_favorite ? 'currentColor' : 'none'} />
            </button>
            <button className="rdet__delete" onClick={handleDelete} aria-label="Löschen">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="rdet__main">
        <section className="rdet__zutaten">
          <h2>Zutaten</h2>
          <ul>
            {recipe.zutaten.map((z, i) => (
              <li key={i}>
                <span className="rdet__menge">
                  {z.menge != null ? `${z.menge}` : ''}
                  {z.einheit && ` ${z.einheit}`}
                </span>
                <span className="rdet__name">{z.name}</span>
                {z.hinweis && <em>{z.hinweis}</em>}
              </li>
            ))}
          </ul>
        </section>

        <section className="rdet__zubereitung">
          <h2>Zubereitung</h2>
          <ol>
            {recipe.zubereitung.map((s, i) => (
              <li key={i}><span className="rdet__step-num">{i + 1}</span><p>{s}</p></li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
