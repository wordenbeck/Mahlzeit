import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Search, Star, Trash2, X } from 'lucide-react';
import './Plan.css';
import { useAuth } from '../lib/auth';
import { listRecipes, type RecipeListItem } from '../lib/recipes';
import {
  isoWeekNumber, isoWeekRangeLabel, isoWeekStart, dayLabelShort, dayLabelLong,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [weekStart, setWeekStart] = useState(() => isoWeekStart(new Date()));
  const [weekplan, setWeekplan] = useState<WeekplanWithSlots | null>(null);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [favOnly, setFavOnly] = useState(false);

  // Sheets
  const [assignRecipe, setAssignRecipe] = useState<RecipeListItem | null>(null); // + → Tag wählen
  const [viewDay, setViewDay] = useState<number | null>(null);                   // Tag-Tab → Inhalt
  const [busy, setBusy] = useState(false);

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

  // ?assign=recipeId → Sheet direkt öffnen (kommt von FAB im RezeptDetail)
  useEffect(() => {
    const assignId = searchParams.get('assign');
    if (!assignId || recipes.length === 0) return;
    const recipe = recipes.find(r => r.id === assignId);
    if (recipe) {
      setAssignRecipe(recipe);
      setSearchParams({}, { replace: true }); // param sauber entfernen
    }
  }, [searchParams, recipes]); // eslint-disable-line react-hooks/exhaustive-deps

  useRealtimeReload('weekplan_slots', reload, !!auth.profile);
  useRealtimeReload('recipes', reload, !!auth.profile);

  const filtered = useMemo(() => {
    let list = recipes;
    if (favOnly) list = list.filter(r => r.is_favorite);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r => r.titel.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  }, [recipes, query, favOnly]);

  const slotsForDay = (day: number): Slot[] =>
    (weekplan?.slots.filter(s => s.day_of_week === day) ?? [])
      .sort((a, b) => MEAL_ORDER.indexOf(a.meal_type as MealType) - MEAL_ORDER.indexOf(b.meal_type as MealType));
  const recipeFor = (slot: Slot) => recipes.find(r => r.id === slot.recipe_id);
  const dayNum = (d: number) => new Date(new Date(weekStart).getTime() + d * 86400000).getDate();

  const assignTo = async (day: number) => {
    if (!assignRecipe || !weekplan || busy) return;
    setBusy(true);
    const taken = new Set(slotsForDay(day).map(s => s.meal_type));
    const meal = MEAL_ORDER.find(m => !taken.has(m)) ?? 'mittag';
    try {
      const slot = await addSlot({ weekplan_id: weekplan.id, day_of_week: day, meal_type: meal, recipe_id: assignRecipe.id });
      setWeekplan({ ...weekplan, slots: [...weekplan.slots, slot] });
      setAssignRecipe(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konnte nicht hinzufügen.');
    } finally { setBusy(false); }
  };

  const handleDeleteSlot = async (slot: Slot) => {
    if (!weekplan) return;
    try {
      await deleteSlot(slot.id);
      setWeekplan({ ...weekplan, slots: weekplan.slots.filter(s => s.id !== slot.id) });
    } catch (e) { setError(e instanceof Error ? e.message : 'Konnte nicht löschen.'); }
  };

  return (
    <div className="plan">
      <header className="plan__header">
        <span className="plan__week-eyebrow">Kalenderwoche {isoWeekNumber(new Date(weekStart))}</span>
        <div className="plan__date-nav">
          <button className="plan__nav-btn" onClick={() => setWeekStart(shiftWeek(weekStart, -1))} aria-label="Vorherige Woche"><ChevronLeft size={18} strokeWidth={2} /></button>
          <h1>{isoWeekRangeLabel(weekStart)}</h1>
          <button className="plan__nav-btn" onClick={() => setWeekStart(shiftWeek(weekStart, 1))} aria-label="Nächste Woche"><ChevronRight size={18} strokeWidth={2} /></button>
        </div>
      </header>

      {error && <div className="plan__error" onClick={() => setError(null)}>{error}</div>}

      {/* Wochenübersicht: belegte Tage grün, leere weiß. Tippen → Tagesinhalt. */}
      <div className="plan__week">
        {DAYS.map(d => {
          const count = slotsForDay(d).length;
          const planned = count > 0;
          return (
            <button
              key={d}
              className={`plan__day ${planned ? 'is-planned' : ''} ${isToday(weekStart, d) ? 'is-today' : ''}`}
              onClick={() => planned && setViewDay(d)}
              aria-label={`${dayLabelLong(weekStart, d)}${planned ? `, ${count} geplant` : ', leer'}`}
            >
              <span className="plan__day-name">{dayLabelShort(weekStart, d)}</span>
              <span className="plan__day-date">{dayNum(d)}.</span>
            </button>
          );
        })}
      </div>

      {/* Bibliothek: Klick = Detail · + = Tag wählen */}
      <div className="plan__libhead">
        <div className="plan__search-row">
          <div className="plan__search-wrap">
            <Search size={16} strokeWidth={1.75} className="plan__search-icon" />
            <input
              className="plan__search"
              placeholder={`${recipes.length} Rezepte durchsuchen…`}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button
            className={`plan__fav-filter ${favOnly ? 'is-active' : ''}`}
            onClick={() => setFavOnly(f => !f)}
            aria-label="Nur Favoriten"
            title="Nur Favoriten"
          >
            <Star size={16} strokeWidth={2} fill={favOnly ? 'currentColor' : 'none'} />
          </button>
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
            <RealRecipeCard recipe={r} linkState={{ from: 'plan' }} />
            <button className="plan__lib-add" onClick={() => setAssignRecipe(r)} aria-label={`${r.titel} einplanen`}>
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      {/* Sheet: Rezept einem Tag zuordnen */}
      {assignRecipe && (
        <>
          <div className="plan__sheet-backdrop" onClick={() => !busy && setAssignRecipe(null)} />
          <div className="plan__sheet" role="dialog" aria-label="Tag wählen">
            <button className="plan__sheet-close" onClick={() => setAssignRecipe(null)} aria-label="Schließen"><X size={18} /></button>
            <div className="plan__sheet-grab" />
            <div className="plan__sheet-recipe"><span className="plan__sheet-eyebrow">Einplanen</span><h2>{assignRecipe.titel}</h2></div>
            <span className="plan__sheet-label">An welchem Tag?</span>
            <div className="plan__sheet-days">
              {DAYS.map(d => (
                <button key={d} className={`plan__sheet-day ${slotsForDay(d).length > 0 ? 'has' : ''}`} onClick={() => assignTo(d)} disabled={busy}>
                  <span className="n">{dayLabelShort(weekStart, d)}</span>
                  <span className="d">{dayNum(d)}.</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Sheet: Tagesinhalt ansehen/entfernen */}
      {viewDay !== null && (
        <>
          <div className="plan__sheet-backdrop" onClick={() => setViewDay(null)} />
          <div className="plan__sheet" role="dialog" aria-label="Tag">
            <button className="plan__sheet-close" onClick={() => setViewDay(null)} aria-label="Schließen"><X size={18} /></button>
            <div className="plan__sheet-grab" />
            <div className="plan__sheet-recipe"><span className="plan__sheet-eyebrow">{dayLabelLong(weekStart, viewDay)}, {dayNum(viewDay)}.</span><h2>Geplant</h2></div>
            <div className="plan__dayview">
              {slotsForDay(viewDay).map(s => {
                const r = recipeFor(s);
                return (
                  <div key={s.id} className="plan__dayview-item">
                    <Link to={r ? `/rezepte/${r.id}` : '#'} state={{ from: 'plan' }} className="plan__dayview-link" onClick={() => setViewDay(null)}>{r?.titel ?? '—'}</Link>
                    <button className="plan__dayview-del" onClick={() => handleDeleteSlot(s)} aria-label="Entfernen"><Trash2 size={15} strokeWidth={1.75} /></button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
