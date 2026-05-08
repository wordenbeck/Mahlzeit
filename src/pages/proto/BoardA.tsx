import { useState } from 'react';
import { ChevronLeft, ChevronRight, List, LayoutGrid, Sparkles, Plus, Search, SlidersHorizontal } from 'lucide-react';
import './BoardA.css';
import { ProtoChrome } from './ProtoChrome';
import { RecipeCard, type RecipeCardVariant } from '../../components/RecipeCard';
import { DaySlot } from '../../components/DaySlot';
import {
  RECIPES,
  DAY_LABELS,
  WEEK_NUMBER,
  WEEK_RANGE_LABEL,
  slotsForDay,
} from '../../mocks/recipes';
import { ProfileDot } from '../../components/ProfileDot';

const datesLong = ['4. Mai', '5. Mai', '6. Mai', '7. Mai', '8. Mai', '9. Mai', '10. Mai'];

export function BoardA() {
  const [variant, setVariant] = useState<RecipeCardVariant>('list');
  const [showWeekend, setShowWeekend] = useState(false);

  const visibleDays = showWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];

  return (
    <>
      <ProtoChrome current="/proto/board-a" />
      <div className="board-a">
        <header className="board-a__header">
          <div className="board-a__header-main">
            <span className="board-a__week-eyebrow">Kalenderwoche {WEEK_NUMBER}</span>
            <div className="board-a__date-nav">
              <button className="board-a__nav-btn" aria-label="Vorherige Woche">
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <h1>{WEEK_RANGE_LABEL}</h1>
              <button className="board-a__nav-btn" aria-label="Nächste Woche">
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className="board-a__header-actions">
            <button className="board-a__magic">
              <Sparkles size={14} strokeWidth={2} /> Magic Fill
            </button>
            <ProfileDot profileId="p_thomas" size={28} />
          </div>
        </header>

        <div className="board-a__split">
          {/* LEFT: Days — kein Card-Container, nur Trenner + Slots */}
          <aside className="board-a__days">
            {visibleDays.map(i => {
              const isWeekend = i >= 5;
              const slots = slotsForDay(i);
              return (
                <section
                  key={i}
                  className={`board-a__day ${isWeekend ? 'is-weekend' : ''}`}
                >
                  <header className="board-a__day-header">
                    <span className="board-a__day-short">{DAY_LABELS[i]}</span>
                    <span className="board-a__day-date">{datesLong[i]}</span>
                  </header>
                  <div className="board-a__day-slots">
                    {slots.length === 0 ? (
                      <div className="board-a__day-empty" />
                    ) : (
                      slots.map(s => <DaySlot key={s.id} slot={s} showMeta={false} />)
                    )}
                  </div>
                </section>
              );
            })}
            <button
              className="board-a__weekend-toggle"
              onClick={() => setShowWeekend(!showWeekend)}
            >
              {showWeekend ? '— Wochenende ausblenden' : '+ Wochenende anzeigen'}
            </button>
          </aside>

          {/* RIGHT: Recipe grid */}
          <main className="board-a__grid-area">
            <div className="board-a__toolbar">
              <div className="board-a__search-wrap">
                <Search size={16} strokeWidth={1.75} className="board-a__search-icon" />
                <input className="board-a__search" placeholder="Rezepte suchen…" />
              </div>
              <button className="board-a__filter">
                <SlidersHorizontal size={14} strokeWidth={1.75} /> Filter
              </button>
              <div className="board-a__variant-toggle">
                <button
                  className={variant === 'list' ? 'is-active' : ''}
                  onClick={() => setVariant('list')}
                  aria-label="Listen-Ansicht"
                  title="Liste"
                >
                  <List size={16} strokeWidth={1.75} />
                </button>
                <button
                  className={variant === 'classic' ? 'is-active' : ''}
                  onClick={() => setVariant('classic')}
                  aria-label="Karten-Ansicht"
                  title="Karten"
                >
                  <LayoutGrid size={16} strokeWidth={1.75} />
                </button>
              </div>
              <button className="board-a__new">
                <Plus size={14} strokeWidth={2} /> Neu
              </button>
            </div>
            <div className={`board-a__grid board-a__grid--${variant}`}>
              {RECIPES.map(r => (
                <RecipeCard key={r.id} recipe={r} variant={variant} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
