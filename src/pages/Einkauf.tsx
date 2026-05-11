import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Minus, Plus, Users } from 'lucide-react';
import './Einkauf.css';
import { useAuth } from '../lib/auth';
import {
  isoWeekStart, isoWeekRangeLabel, dayLabelShort, dayDateLong, shiftWeek,
  getOrCreateWeekplan, setPortionenOverride, setZutatenOverride,
  type WeekplanWithSlots, type Slot,
} from '../lib/weekplan';
import { getRecipe } from '../lib/recipes';
import type { Recipe } from '../lib/types/recipe';

export function Einkauf() {
  const auth = useAuth();
  const [weekStart, setWeekStart] = useState(() => isoWeekStart(new Date()));
  const [weekplan, setWeekplan] = useState<WeekplanWithSlots | null>(null);
  const [recipesById, setRecipesById] = useState<Record<string, Recipe>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWeekend, setShowWeekend] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!auth.profile) return;
      setLoading(true);
      try {
        const wp = await getOrCreateWeekplan(weekStart);
        const ids = Array.from(new Set(wp.slots.map(s => s.recipe_id).filter(Boolean) as string[]));
        const recipes = await Promise.all(ids.map(id => getRecipe(id)));
        const map: Record<string, Recipe> = {};
        for (const r of recipes) if (r) map[r.id] = r;
        if (!cancelled) {
          setWeekplan(wp);
          setRecipesById(map);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler beim Laden');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [weekStart, auth.profile?.id]);

  const visibleDays = showWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];

  const slotsForDay = (day: number): Slot[] =>
    weekplan?.slots.filter(s => s.day_of_week === day) ?? [];

  const totalSlots = weekplan?.slots.length ?? 0;

  const handlePortionen = async (slot: Slot, portionen: number) => {
    if (!weekplan) return;
    const next = Math.max(1, portionen);
    setWeekplan({
      ...weekplan,
      slots: weekplan.slots.map(s => s.id === slot.id ? { ...s, portionen_override: next } : s),
    });
    try {
      await setPortionenOverride(slot.id, next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht speichern.');
    }
  };

  const handleZutatChange = async (slot: Slot, zutatName: string, menge: number) => {
    if (!weekplan) return;
    const key = zutatName.toLowerCase();
    const currentOverride = (slot.zutaten_override ?? {}) as Record<string, number>;
    const nextOverride = { ...currentOverride, [key]: menge };
    setWeekplan({
      ...weekplan,
      slots: weekplan.slots.map(s => s.id === slot.id ? { ...s, zutaten_override: nextOverride } : s),
    });
    try {
      await setZutatenOverride(slot.id, nextOverride);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht speichern.');
    }
  };

  return (
    <div className="ekf">
      <header className="ekf__header">
        <div>
          <span className="ekf__eyebrow">Mahlzeit · Wochenübersicht</span>
          <div className="ekf__title-row">
            <button className="ekf__nav-btn" onClick={() => setWeekStart(shiftWeek(weekStart, -1))}>
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <h1>{isoWeekRangeLabel(weekStart)}</h1>
            <button className="ekf__nav-btn" onClick={() => setWeekStart(shiftWeek(weekStart, 1))}>
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="ekf__header-actions">
          <button
            className={`ekf__weekend ${showWeekend ? 'is-active' : ''}`}
            onClick={() => setShowWeekend(!showWeekend)}
          >
            {showWeekend ? '— Wochenende' : '+ Wochenende'}
          </button>
          <Link to="/liste" className="ekf__cta">
            <ShoppingBag size={14} strokeWidth={2} /> Einkaufsliste
          </Link>
        </div>
      </header>

      {error && <div className="ekf__error">{error}</div>}

      {loading && <p className="ekf__loading">Lade Übersicht…</p>}

      {!loading && totalSlots === 0 && (
        <div className="ekf__empty">
          <p>Noch nichts geplant für diese Woche.</p>
          <Link to="/plan" className="ekf__cta">→ Zur Wochenplanung</Link>
        </div>
      )}

      <main className={`ekf__grid ${showWeekend ? 'is-7' : 'is-5'}`}>
        {!loading && visibleDays.map(i => {
          const slots = slotsForDay(i);
          return (
            <section key={i} className="ekf__column">
              <header className="ekf__col-header">
                <span className="ekf__col-day">{dayLabelShort(weekStart, i)}</span>
                <span className="ekf__col-date">{dayDateLong(weekStart, i)}</span>
              </header>
              <div className="ekf__col-content">
                {slots.length === 0 ? (
                  <Link to="/plan" className="ekf__col-empty">+ Rezept</Link>
                ) : (
                  slots.map(slot => {
                    const recipe = slot.recipe_id ? recipesById[slot.recipe_id] : null;
                    if (!recipe) return null;
                    const portionen = slot.portionen_override ?? recipe.portionen;
                    return (
                      <article key={slot.id} className="ekf__rec">
                        <header className="ekf__rec-header">
                          <Link to={`/rezepte/${recipe.id}`} className="ekf__rec-title">
                            {recipe.titel}
                          </Link>
                          <div className="ekf__portionen" aria-label="Portionen">
                            <Users size={11} strokeWidth={1.75} />
                            <button
                              className="ekf__portionen-btn"
                              onClick={() => handlePortionen(slot, portionen - 1)}
                            >
                              <Minus size={10} strokeWidth={2.5} />
                            </button>
                            <span className="ekf__portionen-val">{portionen}</span>
                            <button
                              className="ekf__portionen-btn"
                              onClick={() => handlePortionen(slot, portionen + 1)}
                            >
                              <Plus size={10} strokeWidth={2.5} />
                            </button>
                          </div>
                        </header>
                        <ul className="ekf__zutaten">
                          {recipe.zutaten.map((z, idx) => {
                            if (z.menge == null) {
                              return (
                                <li key={idx} className="ekf__zutat">
                                  <span className="ekf__zutat-name">{z.name}</span>
                                  <span className="ekf__zutat-menge-text">nach Geschmack</span>
                                </li>
                              );
                            }
                            const factor = recipe.portionen > 0 ? portionen / recipe.portionen : 1;
                            const skaliert = Math.round(z.menge * factor * 10) / 10;
                            const overrideKey = z.name.toLowerCase();
                            const overrides = (slot.zutaten_override ?? {}) as Record<string, number>;
                            const value = overrides[overrideKey] ?? skaliert;
                            const isOverridden = overrides[overrideKey] !== undefined;
                            return (
                              <li key={idx} className={`ekf__zutat ${isOverridden ? 'is-overridden' : ''}`}>
                                <span className="ekf__zutat-name">{z.name}</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={value}
                                  onChange={e => handleZutatChange(slot, z.name, parseFloat(e.target.value) || 0)}
                                  className="ekf__zutat-input"
                                />
                                <span className="ekf__zutat-einheit">{z.einheit}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="ekf__footer">
        <span className="ekf__footer-info">
          {totalSlots} {totalSlots === 1 ? 'Rezept' : 'Rezepte'} verplant
        </span>
        <Link to="/liste" className="ekf__cta-large">
          <ShoppingBag size={18} strokeWidth={2} />
          In die Einkaufstüte →
        </Link>
      </footer>
    </div>
  );
}
