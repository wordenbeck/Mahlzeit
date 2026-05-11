import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Sparkles, Plus, Search, Trash2,
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
  getOrCreateWeekplan, addSlot, deleteSlot, moveSlot,
  type WeekplanWithSlots, type Slot,
} from '../lib/weekplan';
import { RealRecipeCard } from '../components/RealRecipeCard';

export function Plan() {
  const auth = useAuth();
  const [weekStart, setWeekStart] = useState(() => isoWeekStart(new Date()));
  const [weekplan, setWeekplan] = useState<WeekplanWithSlots | null>(null);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWeekend, setShowWeekend] = useState(false);
  const [query, setQuery] = useState('');

  // D&D state
  const [activeRecipe, setActiveRecipe] = useState<RecipeListItem | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

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

  const handleDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);
    if (id.startsWith('recipe:')) {
      const recipeId = id.slice('recipe:'.length);
      const recipe = recipes.find(r => r.id === recipeId);
      setActiveRecipe(recipe ?? null);
    } else if (id.startsWith('slot:')) {
      const slotId = id.slice('slot:'.length);
      const slot = weekplan?.slots.find(s => s.id === slotId);
      const recipe = slot ? recipes.find(r => r.id === slot.recipe_id) : null;
      setActiveRecipe(recipe ?? null);
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveRecipe(null);
    const overId = e.over?.id;
    const activeId = String(e.active.id);
    if (!overId || !weekplan) return;
    if (!String(overId).startsWith('day:')) return;

    const day = parseInt(String(overId).slice('day:'.length), 10);
    if (isNaN(day)) return;

    // CASE 1: Neues Recipe → Slot
    if (activeId.startsWith('recipe:')) {
      const recipeId = activeId.slice('recipe:'.length);
      try {
        const slot = await addSlot({
          weekplan_id: weekplan.id,
          day_of_week: day,
          meal_type: 'mittag',
          recipe_id: recipeId,
        });
        setWeekplan({ ...weekplan, slots: [...weekplan.slots, slot] });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Konnte nicht hinzufügen.');
      }
      return;
    }

    // CASE 2: Existierender Slot wird verschoben
    if (activeId.startsWith('slot:')) {
      const slotId = activeId.slice('slot:'.length);
      const slot = weekplan.slots.find(s => s.id === slotId);
      if (!slot || slot.day_of_week === day) return;  // gleicher Tag = nichts zu tun

      // Optimistic UI Update
      setWeekplan({
        ...weekplan,
        slots: weekplan.slots.map(s => s.id === slotId ? { ...s, day_of_week: day } : s),
      });

      try {
        await moveSlot(slotId, day);
      } catch (err) {
        // Rollback bei Fehler
        setWeekplan({
          ...weekplan,
          slots: weekplan.slots.map(s => s.id === slotId ? slot : s),
        });
        setError(err instanceof Error ? err.message : 'Konnte nicht verschieben.');
      }
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
                        <SlotDraggable
                          key={s.id}
                          slot={s}
                          recipeTitle={r?.titel ?? '—'}
                          recipeId={r?.id}
                          onDelete={() => handleDeleteSlot(s)}
                        />
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

        {/* Recipe list — gleiche Card wie in /rezepte, plus D&D-Wrapper */}
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

          <div className="plan__list">
            {filtered.map(r => (
              <RecipeDraggable key={r.id} recipe={r} />
            ))}
          </div>
        </main>
      </div>

      {/* Drag-Overlay — zeigt das gezogene Rezept */}
      <DragOverlay dropAnimation={null}>
        {activeRecipe && (
          <div className="plan__drag-preview">
            <RealRecipeCard recipe={activeRecipe} />
          </div>
        )}
      </DragOverlay>
    </div>
    </DndContext>
  );
}

// =====================================================================
// D&D Helper
// =====================================================================

function RecipeDraggable({ recipe }: { recipe: RecipeListItem }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `recipe:${recipe.id}`,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`plan__recipe-wrap ${isDragging ? 'is-dragging' : ''}`}
    >
      <RealRecipeCard recipe={recipe} />
    </div>
  );
}

function SlotDraggable({
  slot, recipeTitle, recipeId, onDelete,
}: {
  slot: Slot;
  recipeTitle: string;
  recipeId?: string;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `slot:${slot.id}`,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`plan__slot ${isDragging ? 'is-dragging' : ''}`}
    >
      <Link
        to={recipeId ? `/rezepte/${recipeId}` : '#'}
        className="plan__slot-link"
        onClick={e => { if (isDragging) e.preventDefault(); }}
      >
        <span className="plan__slot-title">{recipeTitle}</span>
      </Link>
      <button
        className="plan__slot-del"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Entfernen"
      >
        <Trash2 size={12} strokeWidth={1.75} />
      </button>
    </div>
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
