import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Search, Trash2, Check } from 'lucide-react';
import './Plan.css';
import { useAuth } from '../lib/auth';
import { listRecipes, type RecipeListItem } from '../lib/recipes';
import {
  isoWeekNumber, isoWeekRangeLabel, isoWeekStart, dayLabelLong, dayLabelShort,
  shiftWeek, isToday,
  getOrCreateWeekplan, addSlot, deleteSlot,
  type WeekplanWithSlots, type Slot,
} from '../lib/weekplan';
import type { MealType } from '../lib/types/recipe';
import { RealRecipeCard } from '../components/RealRecipeCard';
import { useRealtimeReload } from '../lib/realtime';

const DAYS = [0, 1, 2, 3, 4, 5, 6];
const MEAL_ORDER: MealType[] = ['mittag', 'abendessen'];

export function Plan() {
  const auth = useAuth();
  const [weekStart, setWeekStart] = useState(() => isoWeekStart(new Date()));
  const [weekplan, setWeekplan] = useState<WeekplanWithSlots | null>(null);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  // Gewählter Tag: oben Übersicht, darunter die Inhalte dieses Tages
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const d = (new Date().getDay() + 6) % 7; // Mo=0
    return d;
  });
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const reload = async () => {
    if (!auth.profile) return;
    setLoading(true);
    setError(null);
    try {
      const [wp, rs] = await Promise.all([getOrCreateWeekplan(weekStart), listRecipes()]);
      setWeekplan(wp);
      setRecipes(rs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, auth.profile?.id]);

  useRealtimeReload('weekplan_slots', reload, !!auth.profile);
  useRealtimeReload('recipes', reload, !!auth.profile);

  const filtered = useMemo(() => {
    if (!query.trim()) return recipes;
    const q = query.toLowerCase();
    return recipes.filter(r =>
      r.titel.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [recipes, query]);

  const slotsForDay = (day: number): Slot[] =>
    (weekplan?.slots.filter(s => s.day_of_week === day) ?? [])
      .sort((a, b) => MEAL_ORDER.indexOf(a.meal_type as MealType) - MEAL_ORDER.indexOf(b.meal_type as MealType));

  const recipeFor = (slot: Slot) => recipes.find(r => r.id === slot.recipe_id);

  const dayNum = (d: number) =>
    new Date(new Date(weekStart).getTime() + d * 86400000).getDate();

  // Rezept zum gewählten Tag hinzufügen (freie Mahlzeit wählen: mittag, dann abend)
  const addToSelectedDay = async (recipe: RecipeListItem) => {
    if (!weekplan) return;
    const taken = new Set(slotsForDay(selectedDay).map(s => s.meal_type));
    const meal = MEAL_ORDER.find(m => !taken.has(m)) ?? 'mittag';
    try {
      const slot = await addSlot({
        weekplan_id: weekplan.id,
        day_of_week: selectedDay,
        meal_type: meal,
        recipe_id: recipe.id,
      });
      setWeekplan({ ...weekplan, slots: [...weekplan.slots, slot] });
      setJustAdded(recipe.id);
      setTimeout(() => setJustAdded(curr => (curr === recipe.id ? null : curr)), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konnte nicht hinzufügen.');
    }
  };

  const handleDeleteSlot = async (slot: Slot) => {
    if (!weekplan) return;
    try {
      await deleteSlot(slot.id);
      setWeekplan({ ...weekplan, slots: weekplan.slots.filter(s => s.id !== slot.id) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht löschen.');
    }
  };

  const daySlots = slotsForDay(selectedDay);

  return (
    <div className="plan">
      {/* Header */}
      <header className="plan__header">
        <span className="plan__week-eyebrow">Kalenderwoche {isoWeekNumber(new Date(weekStart))}</span>
        <div className="plan__date-nav">
          <button className="plan__nav-btn" onClick={() => setWeekStart(shiftWeek(weekStart, -1))} aria-label="Vorherige Woche">
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <h1>{isoWeekRangeLabel(weekStart)}</h1>
          <button className="plan__nav-btn" onClick={() => setWeekStart(shiftWeek(weekStart, 1))} aria-label="Nächste Woche">
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {error && <div className="plan__error" onClick={() => setError(null)}>{error}</div>}

      {/* Wochenübersicht: Tag wählen */}
      <div className="plan__week" role="tablist">
        {DAYS.map(d => {
          const count = slotsForDay(d).length;
          return (
            <button
              key={d}
              role="tab"
              aria-selected={selectedDay === d}
              className={`plan__day ${selectedDay === d ? 'is-selected' : ''} ${isToday(weekStart, d) ? 'is-today' : ''}`}
              onClick={() => setSelectedDay(d)}
            >
              <span className="plan__day-name">{dayLabelShort(weekStart, d)}</span>
              <span className="plan__day-date">{dayNum(d)}.</span>
              <span className={`plan__day-dot ${count > 0 ? 'is-filled' : ''}`}>
                {count > 0 ? count : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inhalte des gewählten Tages */}
      <section className="plan__selected">
        <h2 className="plan__selected-title">{dayLabelLong(weekStart, selectedDay)}, {dayNum(selectedDay)}.</h2>
        {daySlots.length === 0 ? (
          <p className="plan__selected-empty">Noch nichts geplant — tippe unten bei einem Rezept auf <Plus size={12} strokeWidth={3} />.</p>
        ) : (
          <div className="plan__selected-list">
            {daySlots.map(s => {
              const r = recipeFor(s);
              return (
                <div key={s.id} className="plan__planned">
                  <Link to={r ? `/rezepte/${r.id}` : '#'} className="plan__planned-link">{r?.titel ?? '—'}</Link>
                  <button className="plan__planned-del" onClick={() => handleDeleteSlot(s)} aria-label="Entfernen">
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bibliothek — Klick = Details, + = zum gewählten Tag hinzufügen */}
      <div className="plan__libhead">
        <span className="plan__lib-eyebrow">🍳 Rezepte · {recipes.length}</span>
        <div className="plan__search-wrap">
          <Search size={16} strokeWidth={1.75} className="plan__search-icon" />
          <input
            className="plan__search"
            placeholder="Suchen — Titel, Tag…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="plan__loading">Lade…</p>}

      {recipes.length === 0 && !loading && (
        <div className="plan__empty">
          <p>Noch keine Rezepte.</p>
          <Link to="/rezepte/import" className="plan__cta"><Plus size={14} strokeWidth={2.5} /> Erstes Rezept</Link>
        </div>
      )}

      <div className="plan__lib">
        {filtered.map(r => (
          <div key={r.id} className="plan__lib-item">
            <RealRecipeCard recipe={r} />
            <button
              className={`plan__lib-add ${justAdded === r.id ? 'is-done' : ''}`}
              onClick={() => addToSelectedDay(r)}
              aria-label={`${r.titel} für ${dayLabelShort(weekStart, selectedDay)} einplanen`}
            >
              {justAdded === r.id
                ? <><Check size={15} strokeWidth={3} /> {dayLabelShort(weekStart, selectedDay)}</>
                : <><Plus size={15} strokeWidth={2.5} /> {dayLabelShort(weekStart, selectedDay)}</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
