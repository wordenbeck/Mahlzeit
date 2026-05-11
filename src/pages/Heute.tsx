import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ChefHat, Clock, Plus, Sparkles } from 'lucide-react';
import './Heute.css';
import { useAuth } from '../lib/auth';
import {
  isoWeekStart, dayLabelLong,
  getOrCreateWeekplan, type Slot,
} from '../lib/weekplan';
import { listRecipes, type RecipeListItem } from '../lib/recipes';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

function todayIndexInWeek(): number {
  // 0 = Mo .. 6 = So
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
  const [tomorrowSlots, setTomorrowSlots] = useState<Slot[]>([]);
  const [recipesById, setRecipesById] = useState<Record<string, RecipeListItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todayIdx = todayIndexInWeek();
  const isSunday = todayIdx === 6;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!auth.profile) return;
      try {
        const weekStart = isoWeekStart(new Date());
        const [wp, recipes] = await Promise.all([
          getOrCreateWeekplan(weekStart),
          listRecipes(),
        ]);
        if (cancelled) return;

        const today = wp.slots.filter(s => s.day_of_week === todayIdx);
        const tomorrow = isSunday ? [] : wp.slots.filter(s => s.day_of_week === todayIdx + 1);

        const map: Record<string, RecipeListItem> = {};
        for (const r of recipes) map[r.id] = r;

        setTodaySlots(today);
        setTomorrowSlots(tomorrow);
        setRecipesById(map);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler beim Laden');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [auth.profile?.id, todayIdx, isSunday]);

  const todayLong = useMemo(() => format(new Date(), 'EEEE, d. MMMM', { locale: de }), []);
  const greet = greeting(auth.profile?.display_name ?? '');

  return (
    <div className="heute">
      <header className="heute__hero">
        <span className="heute__eyebrow">{greet}</span>
        <h1>{todayLong}</h1>
      </header>

      {error && <div className="heute__error">{error}</div>}
      {loading && <p className="heute__loading">Lade…</p>}

      {!loading && (
        <main className="heute__main">
          <section className="heute__card heute__card--today">
            <header className="heute__card-header">
              <span className="heute__card-eyebrow">
                <ChefHat size={14} strokeWidth={1.75} /> Heute
              </span>
              <h2>Was kochen wir?</h2>
            </header>

            {todaySlots.length === 0 ? (
              <div className="heute__empty">
                <p>Für heute ist nichts geplant.</p>
                <div className="heute__empty-actions">
                  <Link to="/plan" className="heute__cta">
                    <Calendar size={14} strokeWidth={2} /> Spontan zum Plan
                  </Link>
                  <Link to="/rezepte" className="heute__secondary">
                    <Sparkles size={14} strokeWidth={2} /> Rezepte stöbern
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="heute__slots">
                {todaySlots.map(slot => {
                  const recipe = slot.recipe_id ? recipesById[slot.recipe_id] : null;
                  if (!recipe) return null;
                  return (
                    <li key={slot.id} className="heute__slot">
                      <Link to={`/rezepte/${recipe.id}`} className="heute__slot-link">
                        <div
                          className="heute__slot-thumb"
                          style={recipe.bild_url ? { background: `url(${recipe.bild_url}) center/cover` } : undefined}
                        >
                          {!recipe.bild_url && <span>🍽</span>}
                        </div>
                        <div className="heute__slot-body">
                          <span className="heute__slot-title">{recipe.titel}</span>
                          {recipe.zubereitungszeit_min != null && (
                            <span className="heute__slot-meta">
                              <Clock size={11} strokeWidth={1.75} /> {recipe.zubereitungszeit_min} Min
                            </span>
                          )}
                        </div>
                        <ArrowRight size={16} strokeWidth={2} className="heute__slot-arrow" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {tomorrowSlots.length > 0 && (
            <section className="heute__card">
              <header className="heute__card-header">
                <span className="heute__card-eyebrow">Morgen schon mal vorbereitet</span>
                <h3>{dayLabelLong(isoWeekStart(new Date()), Math.min(6, todayIdx + 1))}</h3>
              </header>
              <ul className="heute__slots heute__slots--mini">
                {tomorrowSlots.map(slot => {
                  const recipe = slot.recipe_id ? recipesById[slot.recipe_id] : null;
                  if (!recipe) return null;
                  return (
                    <li key={slot.id}>
                      <Link to={`/rezepte/${recipe.id}`} className="heute__mini-slot">
                        <span className="heute__mini-title">{recipe.titel}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section className="heute__quick">
            <Link to="/plan" className="heute__quick-tile">
              <Calendar size={20} strokeWidth={2} />
              <strong>Woche planen</strong>
              <span>Sonntag-Couch — Rezepte für die Woche legen</span>
            </Link>
            <Link to="/einkauf" className="heute__quick-tile">
              <Sparkles size={20} strokeWidth={2} />
              <strong>Einkauf prüfen</strong>
              <span>Mengen anpassen vor dem Einkaufen</span>
            </Link>
            <Link to="/rezepte/import" className="heute__quick-tile">
              <Plus size={20} strokeWidth={2} />
              <strong>Neues Rezept</strong>
              <span>Aus Insta, URL oder manuell</span>
            </Link>
          </section>
        </main>
      )}
    </div>
  );
}
