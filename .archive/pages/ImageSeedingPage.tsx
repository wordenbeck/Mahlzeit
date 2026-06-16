import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { listRecipes, type RecipeListItem } from '../lib/recipes';
import { ImageSelectorModal } from '../components/ImageSelectorModal';
import { SchwierigkeitBadge } from '../components/SchwierigkeitBadge';
import type { Schwierigkeit } from '../lib/types/recipe';
import './ImageSeedingPage.css';

export function ImageSeedingPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeListItem | null>(null);
  const [seedCount, setSeedCount] = useState(0);

  // Lade Rezepte beim Mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        setError(null);
        const rs = await listRecipes();
        if (!cancelled) {
          setRecipes(rs || []);
          setSeedCount((rs || []).filter(r => r.bild_url).length);
        }
      } catch (e) {
        console.error('Fehler beim Laden:', e);
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Fehler beim Laden der Rezepte');
          setRecipes([]);
          setSeedCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter: Nur Rezepte ohne Bilder
  const unseededRecipes = recipes.filter(r => !r.bild_url);
  const total = recipes.length;

  const handleImageSelected = () => {
    // Modal schließen und Recipe-List updaten via Realtime
    setSelectedRecipe(null);
  };

  if (loading) {
    return (
      <div className="seeding-page">
        <div className="seeding-page__loading">Lade Rezepte…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seeding-page">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>
          <h2>Fehler beim Laden</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seeding-page">
      <header className="seeding-page__header">
        <button
          className="seeding-page__back"
          onClick={() => navigate('/rezepte')}
          aria-label="Zurück"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="seeding-page__title-section">
          <h1 className="seeding-page__title">Bilder hinzufügen</h1>
          <p className="seeding-page__subtitle">
            {seedCount}/{total} Rezepte mit Bildern
          </p>
        </div>
      </header>

      {unseededRecipes.length === 0 ? (
        <div className="seeding-page__empty">
          <div className="seeding-page__empty-icon">✅</div>
          <h2>Alle Rezepte haben Bilder!</h2>
          <p>Großartig! Deine Rezeptsammlung ist jetzt komplett.</p>
          <button
            className="seeding-page__empty-btn"
            onClick={() => navigate('/rezepte')}
          >
            Zurück zur Übersicht
          </button>
        </div>
      ) : (
        <div className="seeding-page__grid">
          {unseededRecipes.map((recipe) => (
            <div key={recipe.id} className="seeding-page__card">
              <div className="seeding-page__card-image">
                <span className="seeding-page__card-placeholder">🍽</span>
              </div>
              <div className="seeding-page__card-content">
                <h3 className="seeding-page__card-title">{recipe.titel}</h3>
                <div className="seeding-page__card-meta">
                  {recipe.schwierigkeit && (
                    <SchwierigkeitBadge
                      schwierigkeit={recipe.schwierigkeit as Schwierigkeit}
                      size={12}
                    />
                  )}
                  {recipe.zubereitungszeit_min && (
                    <span className="seeding-page__card-time">
                      ⏱ {recipe.zubereitungszeit_min} Min
                    </span>
                  )}
                </div>
              </div>
              <button
                className="seeding-page__search-btn"
                onClick={() => setSelectedRecipe(recipe)}
              >
                Bilder suchen
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <ImageSelectorModal
          recipeId={selectedRecipe.id}
          recipeName={selectedRecipe.titel}
          onClose={() => setSelectedRecipe(null)}
          onSelect={handleImageSelected}
        />
      )}
    </div>
  );
}
