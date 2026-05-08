import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChefHat } from 'lucide-react';
import './Rezepte.css';
import { RealRecipeCard } from '../components/RealRecipeCard';
import { listRecipes, type RecipeListItem } from '../lib/recipes';

export function Rezepte() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    listRecipes()
      .then(data => { if (!cancelled) setRecipes(data); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler beim Laden'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return recipes;
    const q = query.toLowerCase();
    return recipes.filter(r =>
      r.titel.toLowerCase().includes(q)
      || r.tags.some(t => t.toLowerCase().includes(q))
      || r.kategorie.some(k => k.toLowerCase().includes(q))
    );
  }, [recipes, query]);

  return (
    <div className="rezepte">
      <header className="rezepte__header">
        <div>
          <span className="rezepte__eyebrow">Mahlzeit · Sammlung</span>
          <h1>Rezepte</h1>
        </div>
        <Link to="/rezepte/import" className="rezepte__cta">
          <Plus size={16} strokeWidth={2.5} /> Neu
        </Link>
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
      </div>

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

        {filtered.length > 0 && (
          <div className="rezepte__grid">
            {filtered.map(r => <RealRecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </main>
    </div>
  );
}
