import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Sparkles, Plus, Search, Trash2, X, Check,
} from 'lucide-react';
import './Plan.css';
import { useAuth } from '../lib/auth';
import { listRecipes, type RecipeListItem } from '../lib/recipes';
import {
  isoWeekNumber, isoWeekRangeLabel, isoWeekStart, dayLabelShort,
  shiftWeek, isToday,
  getOrCreateWeekplan, addSlot, deleteSlot, magicFillWeek,
  type WeekplanWithSlots, type Slot,
} from '../lib/weekplan';
import type { MealType } from '../lib/types/recipe';
import { CookingSpinner } from '../components/CookingSpinner';
import { RealRecipeCard } from '../components/RealRecipeCard';
import { useRealtimeReload } from '../lib/realtime';

// Mahlzeit-Typen die wir im Plan anbieten (Familien-Alltag: Mittag + Abend)
const MEALS: { key: MealType; label: string; icon: string }[] = [
  { key: 'mittag', label: 'Mittag', icon: '☀️' },
  { key: 'abendessen', label: 'Abend', icon: '🌙' },
];
const mealIcon = (m: string) => MEALS.find(x => x.key === m)?.icon ?? '🍽';

const DAYS = [0, 1, 2, 3, 4, 5, 6];

export function Plan() {
  const auth = useAuth();
  const [weekStart, setWeekStart] = useState(() => isoWeekStart(new Date()));
  const [weekplan, setWeekplan] = useState<WeekplanWithSlots | null>(null);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [magicRunning, setMagicRunning] = useState(false);

  // Assign-Sheet: welches Rezept wird gerade eingeplant + vorgewählter Tag
  const [assign, setAssign] = useState<{ recipe: RecipeListItem; day: number; meal: MealType } | null>(null);
  // "Rezept für Tag X wählen"-Modus (gestartet über das + an einem Tag)
  const [pendingDay, setPendingDay] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);
  // Tages-Detail-Sheet (Mahlzeiten ansehen/entfernen, v.a. am Handy)
  const [dayView, setDayView] = useState<number | null>(null);

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
      .sort((a, b) => (a.meal_type > b.meal_type ? 1 : -1));

  const recipeFor = (slot: Slot) => recipes.find(r => r.id === slot.recipe_id);

  // Erstes leeres Mahlzeit-Feld eines Tages finden (für Vorauswahl im Sheet)
  const firstFreeMeal = (day: number): MealType => {
    const taken = new Set(slotsForDay(day).map(s => s.meal_type));
    return (MEALS.find(m => !taken.has(m.key))?.key) ?? 'mittag';
  };

  const openAssign = (recipe: RecipeListItem, day?: number) => {
    const d = day ?? pendingDay ?? DAYS.find(x => slotsForDay(x).length === 0) ?? 0;
    setAssign({ recipe, day: d, meal: firstFreeMeal(d) });
    setPendingDay(null);
  };

  // + an einem Tag: Tag merken und zur Bibliothek scrollen
  const startFromDay = (day: number) => {
    setPendingDay(day);
    document.querySelector('.plan__libhead')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const dayNum = (d: number) =>
    new Date(new Date(weekStart).getTime() + d * 86400000).getDate();

  const confirmAssign = async () => {
    if (!assign || !weekplan || assigning) return;
    setAssigning(true);
    try {
      const slot = await addSlot({
        weekplan_id: weekplan.id,
        day_of_week: assign.day,
        meal_type: assign.meal,
        recipe_id: assign.recipe.id,
      });
      setWeekplan({ ...weekplan, slots: [...weekplan.slots, slot] });
      setAssign(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konnte nicht hinzufügen.');
    } finally {
      setAssigning(false);
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

  const handleMagicFill = async () => {
    if (!weekplan || magicRunning) return;
    const filledDays = new Set(weekplan.slots.map(s => s.day_of_week));
    const targets = DAYS.filter(d => !filledDays.has(d));
    if (targets.length === 0) { setError('Alle Tage sind schon befüllt.'); return; }
    if (recipes.length === 0) { setError('Du hast noch keine Rezepte.'); return; }
    setMagicRunning(true);
    setError(null);
    try {
      const suggestions = await magicFillWeek(weekplan.id, targets);
      const newSlots: Slot[] = [];
      for (const s of suggestions) {
        try {
          const slot = await addSlot({
            weekplan_id: weekplan.id, day_of_week: s.day_of_week,
            meal_type: 'mittag', recipe_id: s.recipe_id,
          });
          newSlots.push(slot);
        } catch { /* einzelner Slot-Fehler ignorieren */ }
      }
      setWeekplan({ ...weekplan, slots: [...weekplan.slots, ...newSlots] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Magic Fill fehlgeschlagen.');
    } finally {
      setMagicRunning(false);
    }
  };

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

      {/* Wochenstreifen — DEINE Woche (wischbar) */}
      <div className="plan__week" role="list">
        {DAYS.map(d => {
          const slots = slotsForDay(d);
          return (
            <section
              key={d}
              className={`plan__daycard ${isToday(weekStart, d) ? 'is-today' : ''} ${slots.length > 0 ? 'is-planned' : ''}`}
              role="listitem"
              onClick={() => setDayView(d)}
            >
              <header className="plan__daycard-head">
                <span className="plan__daycard-name">{dayLabelShort(weekStart, d)}</span>
                <span className="plan__daycard-date">{dayNum(d)}.</span>
                {/* Mobil: nur ein Punkt = verplant ja/nein */}
                <span className="plan__daycard-dot" aria-hidden="true" />
              </header>
              <div className="plan__daycard-meals">
                {slots.map(s => {
                  const r = recipeFor(s);
                  return (
                    <div key={s.id} className="plan__meal">
                      <Link
                        to={r ? `/rezepte/${r.id}` : '#'}
                        className="plan__meal-link"
                        onClick={e => e.stopPropagation()}
                      >
                        <span className="plan__meal-icon">{mealIcon(s.meal_type)}</span>
                        <span className="plan__meal-title">{r?.titel ?? '—'}</span>
                      </Link>
                      <button
                        className="plan__meal-del"
                        onClick={e => { e.stopPropagation(); handleDeleteSlot(s); }}
                        aria-label="Entfernen"
                      >
                        <Trash2 size={13} strokeWidth={1.75} />
                      </button>
                    </div>
                  );
                })}
                <button
                  className="plan__daycard-add"
                  onClick={e => { e.stopPropagation(); startFromDay(d); }}
                  disabled={recipes.length === 0}
                >
                  <Plus size={14} strokeWidth={2.5} /> Rezept
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <div className="plan__magicrow">
        <button className="plan__magic" onClick={handleMagicFill} disabled={magicRunning}>
          <Sparkles size={14} strokeWidth={2} />
          {magicRunning ? 'Denkt nach…' : 'Magic Fill — leere Tage'}
        </button>
      </div>

      {/* Bibliothek — stöbern + einplanen */}
      <div className="plan__libhead">
        {pendingDay !== null ? (
          <span className="plan__lib-eyebrow plan__lib-eyebrow--pending">
            👉 Rezept für {dayLabelShort(weekStart, pendingDay)}, {dayNum(pendingDay)}. wählen
            <button className="plan__lib-cancel" onClick={() => setPendingDay(null)}>abbrechen</button>
          </span>
        ) : (
          <span className="plan__lib-eyebrow">🍳 Rezepte stöbern · {recipes.length}</span>
        )}
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
            <RealRecipeCard recipe={r} onClick={() => openAssign(r)} />
          </div>
        ))}
      </div>

      {/* Assign-Sheet */}
      {assign && (
        <>
          <div className="plan__sheet-backdrop" onClick={() => setAssign(null)} />
          <div className="plan__sheet" role="dialog" aria-label="Rezept einplanen">
            <button className="plan__sheet-close" onClick={() => setAssign(null)} aria-label="Schließen"><X size={18} /></button>
            <div className="plan__sheet-grab" />
            <div className="plan__sheet-recipe">
              <span className="plan__sheet-eyebrow">Einplanen</span>
              <h2>{assign.recipe?.titel ?? 'Rezept'}</h2>
            </div>

            <span className="plan__sheet-label">An welchem Tag?</span>
            <div className="plan__sheet-days">
              {DAYS.map(d => {
                const has = slotsForDay(d).length > 0;
                return (
                  <button
                    key={d}
                    className={`plan__sheet-day ${assign.day === d ? 'is-active' : ''} ${has ? 'has' : ''}`}
                    onClick={() => setAssign({ ...assign, day: d, meal: firstFreeMeal(d) })}
                  >
                    <span className="n">{dayLabelShort(weekStart, d)}</span>
                    <span className="d">{dayNum(d)}.</span>
                  </button>
                );
              })}
            </div>

            <button className="plan__sheet-confirm" onClick={confirmAssign} disabled={!assign.recipe || assigning}>
              <Check size={18} strokeWidth={2.5} />
              {assigning ? 'Wird eingeplant…' : `Für ${dayLabelShort(weekStart, assign.day)}, ${dayNum(assign.day)}. einplanen`}
            </button>
          </div>
        </>
      )}

      {/* Tag-Detail-Sheet: Mahlzeiten des Tages ansehen + entfernen + ergänzen */}
      {dayView !== null && (
        <>
          <div className="plan__sheet-backdrop" onClick={() => setDayView(null)} />
          <div className="plan__sheet" role="dialog" aria-label="Tag bearbeiten">
            <button className="plan__sheet-close" onClick={() => setDayView(null)} aria-label="Schließen"><X size={18} /></button>
            <div className="plan__sheet-grab" />
            <div className="plan__sheet-recipe">
              <span className="plan__sheet-eyebrow">{dayLabelShort(weekStart, dayView)}, {dayNum(dayView)}.</span>
              <h2>Geplant</h2>
            </div>
            <div className="plan__dayview-list">
              {slotsForDay(dayView).length === 0 && (
                <p className="plan__dayview-empty">Noch nichts geplant.</p>
              )}
              {slotsForDay(dayView).map(s => {
                const r = recipeFor(s);
                return (
                  <div key={s.id} className="plan__dayview-item">
                    <Link to={r ? `/rezepte/${r.id}` : '#'} className="plan__dayview-link" onClick={() => setDayView(null)}>
                      <span className="plan__meal-icon">{mealIcon(s.meal_type)}</span>
                      <span>{r?.titel ?? '—'}</span>
                    </Link>
                    <button className="plan__dayview-del" onClick={() => handleDeleteSlot(s)} aria-label="Entfernen">
                      <Trash2 size={16} strokeWidth={1.75} />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              className="plan__sheet-confirm"
              onClick={() => { const d = dayView; setDayView(null); if (recipes.length > 0) startFromDay(d); }}
              disabled={recipes.length === 0}
            >
              <Plus size={18} strokeWidth={2.5} /> Rezept hinzufügen
            </button>
          </div>
        </>
      )}

      {magicRunning && (
        <>
          <div className="plan__magic-backdrop" />
          <div className="plan__magic-overlay">
            <CookingSpinner size={80} label="Magic Fill — wähle Rezepte für leere Tage…" />
          </div>
        </>
      )}
    </div>
  );
}
