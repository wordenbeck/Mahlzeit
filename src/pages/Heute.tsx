import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ChefHat, Clock, Plus, ShoppingBag, BookOpen, UtensilsCrossed } from 'lucide-react';
import './Heute.css';
import { useAuth } from '../lib/auth';
import { isoWeekStart, getOrCreateWeekplan, type Slot } from '../lib/weekplan';
import { listRecipes, type RecipeListItem } from '../lib/recipes';
import { RECIPE_TYPE_LABELS, type RecipeType } from '../lib/types/recipe';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

function todayIndexInWeek(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function greeting(name: string): string {
  const h = new Date().getHours();
  if (h < 5) return `Späte Nacht, ${name}`;
  if (h < 11) return `Guten Morgen, ${name}`;
  if (h < 14) return `Mahlzeit, ${name}`;
  if (h < 18) return `Schönen Nachmittag, ${name}`;
  if (h < 22) return `Guten Abend, ${name}`;
  return `Späte Stunde, ${name}`;
}

export function Heute() {
  const auth = useAuth();
  const [todaySlots, setTodaySlots] = useState<Slot[]>([]);
  const [recipesById, setRecipesById] = useState<Record<string, RecipeListItem>>({});
  const [previewRecipes, setPreviewRecipes] = useState<RecipeListItem[]>([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [heroStars, setHeroStars] = useState(0);
  const [loading, setLoading] = useState(true);

  const todayIdx = todayIndexInWeek();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!auth.profile) return;
      try {
        const weekStart = isoWeekStart(new Date());
        const [wp, recipes] = await Promise.all([getOrCreateWeekplan(weekStart), listRecipes()]);
        if (cancelled) return;
        const today = wp.slots.filter(s => s.day_of_week === todayIdx);
        const map: Record<string, RecipeListItem> = {};
        for (const r of recipes) map[r.id] = r;
        setTodaySlots(today);
        setRecipesById(map);
        setRecipeCount(recipes.length);
        setPreviewRecipes(recipes.slice(0, 3));
      } catch {
        /* still */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [auth.profile?.id, todayIdx]);

  const heroRecipe = todaySlots[0]?.recipe_id ? recipesById[todaySlots[0].recipe_id] : null;

  // Bewertung des heutigen Hero-Rezepts laden (für Sterne-Chip)
  useEffect(() => {
    if (!heroRecipe || !auth.userId || !auth.workspace) { setHeroStars(0); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('recipe_ratings')
        .select('stars')
        .eq('recipe_id', heroRecipe.id)
        .eq('workspace_id', auth.workspace!.id)
        .eq('user_id', auth.userId!)
        .maybeSingle();
      if (!cancelled && data) setHeroStars((data as any).stars ?? 0);
    })();
    return () => { cancelled = true; };
  }, [heroRecipe?.id, auth.userId, auth.workspace?.id]);

  const todayLong = useMemo(() => format(new Date(), 'EEEE, d. MMMM', { locale: de }), []);
  const greet = greeting(auth.profile?.display_name ?? '');
  const restToday = todaySlots.slice(1)
    .map(s => s.recipe_id ? recipesById[s.recipe_id]?.titel : null)
    .filter(Boolean) as string[];

  const tiles = (
    <div className="heute__tiles">
      <Link to="/plan" className="heute__tile">
        <Calendar size={20} strokeWidth={2} />
        <span><strong>Woche planen</strong><small>Rezepte für die Woche legen</small></span>
      </Link>
      <Link to="/einkauf" className="heute__tile">
        <ShoppingBag size={20} strokeWidth={2} />
        <span><strong>Einkauf</strong><small>Mengen prüfen</small></span>
      </Link>
      <Link to="/rezepte/import" className="heute__tile">
        <Plus size={20} strokeWidth={2} />
        <span><strong>Neues Rezept</strong><small>Insta, URL oder manuell</small></span>
      </Link>
      <Link to="/rezepte" className="heute__tile">
        <BookOpen size={20} strokeWidth={2} />
        <span><strong>Rezepte</strong><small>{recipeCount} in Sammlung</small></span>
      </Link>
    </div>
  );

  return (
    <div className="heute">
      <header className="heute__top">
        <span className="heute__eyebrow">{greet}</span>
        <h1 className="heute__date">{todayLong}</h1>
      </header>

      {loading && <p className="heute__loading">Lade…</p>}

      {!loading && (
        <main className="heute__main">
          {heroRecipe ? (
            <div className="heute__hero">
              <Link to={`/rezepte/${heroRecipe.id}`} className="heute__hero-img"
                style={heroRecipe.bild_url ? { backgroundImage: `url(${heroRecipe.bild_url})` } : undefined}
              >
                <div className="heute__hero-tags">
                  <span className="heute__hero-label">Heute</span>
                  {heroRecipe.recipe_type && (
                    <span className="heute__hero-type">
                      {RECIPE_TYPE_LABELS[heroRecipe.recipe_type as RecipeType] ?? heroRecipe.recipe_type}
                    </span>
                  )}
                </div>
                <div className="heute__hero-chips">
                  {heroRecipe.zubereitungszeit_min != null && (
                    <span className="heute__chip"><Clock size={13} strokeWidth={2} /> {heroRecipe.zubereitungszeit_min} Min</span>
                  )}
                  {heroRecipe.schwierigkeit && (
                    <span className="heute__chip"><ChefHat size={13} strokeWidth={2} /> {heroRecipe.schwierigkeit}</span>
                  )}
                  {heroStars > 0 && (
                    <span className="heute__chip heute__chip--stars">{'★'.repeat(heroStars)}{'☆'.repeat(5 - heroStars)}</span>
                  )}
                </div>
              </Link>
              <div className="heute__hero-body">
                <h2>{heroRecipe.titel}</h2>
                {restToday.length > 0 && (
                  <p className="heute__also">Auch heute geplant: {restToday.join(', ')}</p>
                )}
                <Link to={`/rezepte/${heroRecipe.id}/kochen`} className="heute__cook-btn">
                  <UtensilsCrossed size={16} strokeWidth={2} /> Jetzt kochen
                </Link>
              </div>
            </div>
          ) : (
            <div className="heute__empty">
              <span className="heute__empty-badge">Heute · noch nichts geplant</span>
              <h2>Was kochen wir heute?</h2>
              <p>Noch nichts geplant. Stöber durch die Rezepte und leg die Woche.</p>
              <div className="heute__empty-thumbs">
                {previewRecipes.map(r => (
                  <div
                    key={r.id}
                    className="heute__thumb"
                    style={r.bild_url ? { backgroundImage: `url(${r.bild_url})` } : undefined}
                  />
                ))}
                {recipeCount > 3 && <div className="heute__thumb heute__thumb--more">+{recipeCount - 3}</div>}
              </div>
              <div className="heute__empty-btns">
                <Link to="/plan" className="heute__empty-primary"><Calendar size={15} strokeWidth={2} /> Woche planen</Link>
                <Link to="/rezepte" className="heute__empty-secondary"><BookOpen size={15} strokeWidth={2} /> Rezepte stöbern</Link>
              </div>
            </div>
          )}

          {tiles}
        </main>
      )}
    </div>
  );
}
