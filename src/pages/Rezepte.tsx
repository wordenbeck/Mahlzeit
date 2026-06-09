import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChefHat, Clock, LayoutGrid, List } from 'lucide-react';
import './Rezepte.css';
import { RealRecipeCard } from '../components/RealRecipeCard';
import { listRecipes, type RecipeListItem } from '../lib/recipes';
import { useRealtimeReload } from '../lib/realtime';
import { RECIPE_TYPE_LABELS, type RecipeType } from '../lib/types/recipe';

type View = 'grid' | 'list';

export function Rezepte() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RecipeType | 'alle'>('alle');
  const [view, setView] = useState<View>(() => (localStorage.getItem('rezepte-view') as View) || 'grid');

  const setViewPersist = (v: View) => { setView(v); localStorage.setItem('rezepte-view', v); };

  const reload = () => {
    listRecipes()
      .then(setRecipes)
      .catch(e => setError(e instanceof Error ? e.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  useRealtimeReload('recipes', reload);

  const filtered = useMemo(() => {
    let list = recipes;
    if (typeFilter !== 'alle') {
      list = list.filter(r => r.recipe_type === typeFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r =>
        r.titel.toLowerCase().includes(q)
        || r.tags.some(t => t.toLowerCase().includes(q))
        || r.kategorie.some(k => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [recipes, query, typeFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { alle: recipes.length };
    for (const r of recipes) {
      counts[r.recipe_type] = (counts[r.recipe_type] ?? 0) + 1;
    }
    return counts;
  }, [recipes]);

  return (
    <div className="rezepte">
      <header className="rezepte__header">
        <span className="rezepte__eyebrow">Mahlzeit · Sammlung</span>
        <div className="rezepte__headline-row">
          <h1>Rezepte</h1>
          <Link to="/rezepte/import" className="rezepte__cta">
            <Plus size={16} strokeWidth={2.5} /> Neu
          </Link>
        </div>
      </header>

      <div className="rezepte__toolbar">
        <div className="rezepte__search-wrap">
          <Search size={16} strokeWidth={1.75} className="rezepte__search-icon" />
          <input
            className="rezepte__search"
            placeholder="Suchen — Titel, Tag, Kategorie…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="rezepte__view" role="group" aria-label="Ansicht">
          <button className={`rezepte__view-btn ${view === 'grid' ? 'is-active' : ''}`} onClick={() => setViewPersist('grid')} aria-label="Raster" title="Raster">
            <LayoutGrid size={16} strokeWidth={2} />
          </button>
          <button className={`rezepte__view-btn ${view === 'list' ? 'is-active' : ''}`} onClick={() => setViewPersist('list')} aria-label="Liste" title="Liste">
            <List size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <nav className="rezepte__type-filter" aria-label="Filter nach Kategorie">
        <button
          className={`rezepte__type-pill ${typeFilter === 'alle' ? 'is-active' : ''}`}
          onClick={() => setTypeFilter('alle')}
        >
          Alle <span className="rezepte__type-count">{typeCounts.alle ?? 0}</span>
        </button>
        {(Object.keys(RECIPE_TYPE_LABELS) as RecipeType[]).map(t => (
          <button
            key={t}
            className={`rezepte__type-pill ${typeFilter === t ? 'is-active' : ''}`}
            onClick={() => setTypeFilter(t)}
          >
            {RECIPE_TYPE_LABELS[t]} <span className="rezepte__type-count">{typeCounts[t] ?? 0}</span>
          </button>
        ))}
      </nav>

      <main className="rezepte__main">
        {loading && <p className="rezepte__placeholder">Lade Rezepte…</p>}

        {error && <div className="rezepte__error">{error}</div>}

        {!loading && !error && filtered.length === 0 && recipes.length === 0 && (
          <div className="rezepte__empty">
            <ChefHat size={48} strokeWidth={1.25} />
            <h2>Noch keine Rezepte</h2>
            <p>Importiere dein erstes Rezept aus Instagram, einer URL oder leg's manuell an.</p>
            <Link to="/rezepte/import" className="rezepte__cta">
              <Plus size={16} strokeWidth={2.5} /> Erstes Rezept hinzufügen
            </Link>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && recipes.length > 0 && (
          <p className="rezepte__placeholder">Keine Treffer für „{query}".</p>
        )}

        {filtered.length > 0 && view === 'grid' && (
          <div className="rezepte__grid">
            {filtered.map(r => (
              <RealRecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}

        {filtered.length > 0 && view === 'list' && (
          <div className="rezepte__list">
            {filtered.map(r => (
              <Link key={r.id} to={`/rezepte/${r.id}`} className="rezepte__row">
                <div
                  className="rezepte__row-img"
                  style={r.bild_url ? { backgroundImage: `url(${r.bild_url})` } : undefined}
                >
                  {!r.bild_url && <span>🍽</span>}
                </div>
                <div className="rezepte__row-body">
                  <span className="rezepte__row-title">{r.titel}</span>
                  <span className="rezepte__row-meta">
                    {r.zubereitungszeit_min != null && (
                      <span className="rezepte__row-metaitem"><Clock size={12} strokeWidth={2} /> {r.zubereitungszeit_min} Min</span>
                    )}
                    {r.schwierigkeit && <span>· {r.schwierigkeit}</span>}
                  </span>
                  {r.tags.length > 0 && (
                    <span className="rezepte__row-tags">
                      {r.tags.slice(0, 3).map(t => <span key={t} className="rezepte__row-tag">{t}</span>)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
