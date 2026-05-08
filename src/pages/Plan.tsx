import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Sparkles, Plus, Search, Trash2, X,
} from 'lucide-react';
import {
  DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable,
  useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core';
import './Plan.css';
import { useAuth } from '../lib/auth';
import { listRecipes, type RecipeListItem } from '../lib/recipes';
import {
  isoWeekStart, isoWeekNumber, isoWeekRangeLabel, dayLabelShort, dayDateLong, shiftWeek,
  getOrCreateWeekplan, addSlot, deleteSlot, type WeekplanWithSlots, type Slot,
} from '../lib/weekplan';
import type { MealType } from '../lib/types/recipe';

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'mittag',     label: 'Mittag' },
  { id: 'abendessen', label: 'Abend' },
  { id: 'fruehstueck',label: 'Frühstück' },
  { id: 'snack',      label: 'Snack' },
];

export function Plan() {
  const auth = useAuth();
  const [weekStart, setWeekStart] = useState(() => isoWeekStart(new Date()));
  const [weekplan, setWeekplan] = useState<WeekplanWithSlots | null>(null);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWeekend, setShowWeekend] = useState(false);
  const [query, setQuery] = useState('');

  // Add-to-day modal state
  const [addTarget, setAddTarget] = useState<RecipeListItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // D&D state
  const [activeRecipe, setActiveRecipe] = useState<RecipeListItem | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);
    if (id.startsWith('recipe:')) {
      const recipeId = id.slice('recipe:'.length);
      const recipe = recipes.find(r => r.id === recipeId);
      setActiveRecipe(recipe ?? null);
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveRecipe(null);
    const overId = e.over?.id;
    const activeId = String(e.active.id);
    if (!overId || !weekplan) return;
    if (!activeId.startsWith('recipe:')) return;
    if (!String(overId).startsWith('day:')) return;

    const recipeId = activeId.slice('recipe:'.length);
    const day = parseInt(String(overId).slice('day:'.length), 10);
    if (isNaN(day)) return;

    try {
      const slot = await addSlot({
        weekplan_id: weekplan.id,
        day_of_week: day,
        meal_type: 'abendessen',  // Default — über Modal/Detail später anpassbar
        recipe_id: recipeId,
      });
      setWeekplan({ ...weekplan, slots: [...weekplan.slots, slot] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Konnte nicht hinzufügen.');
    }
  };

  const reload = async () => {
    if (!auth.profile) return;
    setLoading(true);
    setError(null);
    try {
      const [wp, rs] = await Promise.all([
        getOrCreateWeekplan(weekStart),
        listRecipes(),
      ]);
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

  const visibleDays = showWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];

  const filtered = useMemo(() => {
    if (!query.trim()) return recipes;
    const q = query.toLowerCase();
    return recipes.filter(r =>
      r.titel.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [recipes, query]);

  const slotsForDay = (day: number): Slot[] =>
    weekplan?.slots.filter(s => s.day_of_week === day) ?? [];

  const recipeForSlot = (slot: Slot) =>
    recipes.find(r => r.id === slot.recipe_id);

  const handleAddSlot = async (day: number, meal: MealType) => {
    if (!addTarget || !weekplan) return;
    setSubmitting(true);
    try {
      const slot = await addSlot({
        weekplan_id: weekplan.id,
        day_of_week: day,
        meal_type: meal,
        recipe_id: addTarget.id,
      });
      setWeekplan({ ...weekplan, slots: [...weekplan.slots, slot] });
      setAddTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht hinzufügen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slot: Slot) => {
    if (!weekplan) return;
    if (!confirm('Eintrag entfernen?')) return;
    try {
      await deleteSlot(slot.id);
      setWeekplan({ ...weekplan, slots: weekplan.slots.filter(s => s.id !== slot.id) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte nicht löschen.');
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="plan">
      <header className="plan__header">
        <div className="plan__header-main">
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
        </div>
        <div className="plan__header-actions">
          <button className="plan__magic" disabled title="Kommt in Sprint 6">
            <Sparkles size={14} strokeWidth={2} /> Magic Fill
          </button>
        </div>
      </header>

      {error && <div className="plan__error">{error}</div>}

      <div className="plan__split">
        {/* Days */}
        <aside className="plan__days">
          {loading && <p className="plan__loading">Lade Plan…</p>}
          {!loading && visibleDays.map(i => {
            const slots = slotsForDay(i);
            return (
              <DayDroppable key={i} day={i}>
                <header className="plan__day-header">
                  <span className="plan__day-short">{dayLabelShort(weekStart, i)}</span>
                  <span className="plan__day-date">{dayDateLong(weekStart, i)}</span>
                </header>
                <div className="plan__day-slots">
                  {slots.length === 0 ? (
                    <div className="plan__day-empty">Hier ablegen</div>
                  ) : (
                    slots.map(s => {
                      const r = recipeForSlot(s);
                      return (
                        <div key={s.id} className="plan__slot">
                          <Link to={r ? `/rezepte/${r.id}` : '#'} className="plan__slot-link">
                            <span className="plan__slot-meal">{MEAL_TYPES.find(m => m.id === s.meal_type)?.label ?? s.meal_type}</span>
                            <span className="plan__slot-title">{r?.titel ?? '—'}</span>
                          </Link>
                          <button
                            className="plan__slot-del"
                            onClick={() => handleDeleteSlot(s)}
                            aria-label="Entfernen"
                          >
                            <Trash2 size={12} strokeWidth={1.75} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </DayDroppable>
            );
          })}
          <button
            className="plan__weekend-toggle"
            onClick={() => setShowWeekend(!showWeekend)}
          >
            {showWeekend ? '— Wochenende ausblenden' : '+ Wochenende anzeigen'}
          </button>
        </aside>

        {/* Recipe grid */}
        <main className="plan__grid-area">
          <div className="plan__toolbar">
            <div className="plan__search-wrap">
              <Search size={16} strokeWidth={1.75} className="plan__search-icon" />
              <input
                className="plan__search"
                placeholder="Rezepte suchen…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <Link to="/rezepte/import" className="plan__new">
              <Plus size={14} strokeWidth={2.5} /> Neu
            </Link>
          </div>

          {recipes.length === 0 && !loading && (
            <div className="plan__empty">
              <p>Noch keine Rezepte.</p>
              <Link to="/rezepte/import" className="plan__cta">
                <Plus size={14} strokeWidth={2.5} /> Erstes Rezept hinzufügen
              </Link>
            </div>
          )}

          <div className="plan__grid">
            {filtered.map(r => (
              <RecipeDraggable
                key={r.id}
                recipe={r}
                onClick={() => setAddTarget(r)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Drag-Overlay — zeigt das gezogene Rezept */}
      <DragOverlay dropAnimation={null}>
        {activeRecipe && (
          <div className="plan__recipe plan__recipe--dragging">
            <div
              className="plan__recipe-thumb"
              style={activeRecipe.bild_url ? { background: `url(${activeRecipe.bild_url}) center/cover` } : undefined}
            >
              {!activeRecipe.bild_url && <span>🍽</span>}
            </div>
            <div className="plan__recipe-body">
              <span className="plan__recipe-title">{activeRecipe.titel}</span>
            </div>
          </div>
        )}
      </DragOverlay>

      {/* Add-to-day Modal */}
      {addTarget && (
        <>
          <div className="plan__backdrop" onClick={() => setAddTarget(null)} />
          <div className="plan__modal" role="dialog" aria-label="Zu Tag hinzufügen">
            <header className="plan__modal-header">
              <div>
                <span className="plan__modal-eyebrow">Zu Tag hinzufügen</span>
                <h2>{addTarget.titel}</h2>
              </div>
              <button className="plan__modal-close" onClick={() => setAddTarget(null)} aria-label="Schließen">
                <X size={18} strokeWidth={2} />
              </button>
            </header>
            <p className="plan__modal-lead">Auf welchen Tag und zu welcher Mahlzeit?</p>
            <div className="plan__day-picker">
              {visibleDays.map(i => (
                <div key={i} className="plan__day-pick-row">
                  <span className="plan__day-pick-label">
                    <strong>{dayLabelShort(weekStart, i)}</strong>
                    <small>{dayDateLong(weekStart, i)}</small>
                  </span>
                  <div className="plan__day-pick-meals">
                    {MEAL_TYPES.map(m => (
                      <button
                        key={m.id}
                        className="plan__day-pick-btn"
                        disabled={submitting}
                        onClick={() => handleAddSlot(i, m.id)}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
    </DndContext>
  );
}

// =====================================================================
// D&D Helper Components
// =====================================================================

function RecipeDraggable({
  recipe,
  onClick,
}: {
  recipe: RecipeListItem;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `recipe:${recipe.id}`,
  });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`plan__recipe ${isDragging ? 'is-dragging' : ''}`}
      onClick={onClick}
    >
      <div
        className="plan__recipe-thumb"
        style={recipe.bild_url ? { background: `url(${recipe.bild_url}) center/cover` } : undefined}
      >
        {!recipe.bild_url && <span>🍽</span>}
      </div>
      <div className="plan__recipe-body">
        <span className="plan__recipe-title">{recipe.titel}</span>
        {recipe.zubereitungszeit_min != null && (
          <span className="plan__recipe-meta">⏱ {recipe.zubereitungszeit_min} Min</span>
        )}
      </div>
    </button>
  );
}

function DayDroppable({ day, children }: { day: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `day:${day}` });
  return (
    <section ref={setNodeRef} className={`plan__day ${isOver ? 'is-drop-over' : ''}`}>
      {children}
    </section>
  );
}
