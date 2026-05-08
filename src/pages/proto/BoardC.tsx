import { useState } from 'react';
import './BoardC.css';
import { ProtoChrome } from './ProtoChrome';
import { RecipeCard } from '../../components/RecipeCard';
import { DaySlot, AddSlotButton } from '../../components/DaySlot';
import {
  RECIPES,
  DAY_LABELS,
  DAY_LABELS_LONG,
  WEEK_NUMBER,
  WEEK_RANGE_LABEL,
  TODAY_INDEX,
  slotsForDay,
} from '../../mocks/recipes';
import { ProfileDot } from '../../components/ProfileDot';

const dates = ['4.5', '5.5', '6.5', '7.5', '8.5', '9.5', '10.5'];

export function BoardC() {
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX);
  const slots = slotsForDay(selectedDay);

  return (
    <>
      <ProtoChrome current="/proto/board-c" />
      <div className="board-c">
        <header className="board-c__header">
          <div>
            <span className="board-c__eyebrow">Woche {WEEK_NUMBER}</span>
            <h1 className="board-c__title">{WEEK_RANGE_LABEL}</h1>
          </div>
          <div className="board-c__header-actions">
            <button className="board-c__icon-btn">◀</button>
            <button className="board-c__icon-btn">▶</button>
            <button className="board-c__magic">✨ Magic Fill</button>
            <ProfileDot profileId="p_thomas" size={28} />
          </div>
        </header>

        <nav className="board-c__day-strip" aria-label="Wochentage">
          {DAY_LABELS.map((label, i) => {
            const isToday = i === TODAY_INDEX;
            const isSelected = i === selectedDay;
            const daySlots = slotsForDay(i);
            return (
              <button
                key={label}
                onClick={() => setSelectedDay(i)}
                className={`board-c__day-pill ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
              >
                <span className="board-c__day-pill-name">{label}</span>
                <span className="board-c__day-pill-date">{dates[i]}</span>
                <span className="board-c__day-pill-count">
                  {daySlots.length > 0 ? `${daySlots.length} ${daySlots.length === 1 ? 'Eintrag' : 'Einträge'}` : 'leer'}
                </span>
              </button>
            );
          })}
        </nav>

        <section className="board-c__day-detail">
          <header className="board-c__day-detail-header">
            <h2>{DAY_LABELS_LONG[selectedDay]}</h2>
            {selectedDay === TODAY_INDEX && <span className="board-c__today-tag">Heute</span>}
          </header>
          <div className="board-c__day-slots">
            {slots.map(s => <DaySlot key={s.id} slot={s} />)}
            <AddSlotButton />
          </div>
        </section>

        <main className="board-c__grid-area">
          <div className="board-c__toolbar">
            <input className="board-c__search" placeholder="🔍 Rezepte suchen…" />
            <button className="board-c__filter">Filter ▾</button>
            <button className="board-c__new">＋ Neu</button>
          </div>
          <div className="board-c__grid">
            {RECIPES.map(r => (
              <RecipeCard key={r.id} recipe={r} variant="classic" />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
