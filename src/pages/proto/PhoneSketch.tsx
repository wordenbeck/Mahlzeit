import { useState } from 'react';
import './PhoneSketch.css';
import { ProtoChrome } from './ProtoChrome';
import { RecipeCard } from '../../components/RecipeCard';
import { DaySlot } from '../../components/DaySlot';
import {
  RECIPES,
  DAY_LABELS,
  DAY_LABELS_LONG,
  WEEK_RANGE_LABEL,
  TODAY_INDEX,
  slotsForDay,
} from '../../mocks/recipes';

const dates = ['4.5', '5.5', '6.5', '7.5', '8.5', '9.5', '10.5'];

export function PhoneSketch() {
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX);
  const [sheetOpen, setSheetOpen] = useState(false);
  const slots = slotsForDay(selectedDay);

  return (
    <>
      <ProtoChrome current="/proto/phone" />
      <div className="phone-stage">
        <p className="phone-stage__caption">
          iPhone 14 Pro · 393×852 · Mock-Frame zum Spüren der Mobile-Hierarchie
        </p>

        <div className="phone-frame">
          <div className="phone-frame__notch" />
          <div className="phone-frame__screen">
            {/* Status bar */}
            <div className="phone-status">
              <span>9:41</span>
              <span>•••</span>
            </div>

            {/* Plan-Tab content */}
            <div className="phone-content">
              <header className="phone-header">
                <h1>Plan</h1>
                <span className="phone-header__week">{WEEK_RANGE_LABEL}</span>
              </header>

              {/* Day pills */}
              <nav className="phone-day-strip">
                {DAY_LABELS.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setSelectedDay(i)}
                    className={`phone-day-pill ${i === selectedDay ? 'is-selected' : ''} ${i === TODAY_INDEX ? 'is-today' : ''}`}
                  >
                    <span>{label}</span>
                    <small>{dates[i]}</small>
                  </button>
                ))}
              </nav>

              <h2 className="phone-day-title">
                {DAY_LABELS_LONG[selectedDay]}
                {selectedDay === TODAY_INDEX && <span className="phone-today-tag">Heute</span>}
              </h2>

              <div className="phone-slots">
                {slots.map(s => <DaySlot key={s.id} slot={s} />)}
                <button className="phone-add" onClick={() => setSheetOpen(true)}>
                  ＋ Hinzufügen
                </button>
              </div>
            </div>

            {/* Tab bar */}
            <nav className="phone-tabs">
              <button className="phone-tab is-active">
                <span className="phone-tab__icon">📅</span>
                <span>Plan</span>
              </button>
              <button className="phone-tab">
                <span className="phone-tab__icon">🍽</span>
                <span>Rezepte</span>
              </button>
              <button className="phone-tab">
                <span className="phone-tab__icon">👤</span>
                <span>Profil</span>
              </button>
            </nav>

            {/* Bottom Sheet */}
            {sheetOpen && (
              <>
                <div className="phone-sheet-backdrop" onClick={() => setSheetOpen(false)} />
                <div className="phone-sheet" role="dialog" aria-label="Rezept auswählen">
                  <div className="phone-sheet__handle" />
                  <header className="phone-sheet__header">
                    <h3>Rezept auswählen</h3>
                    <button onClick={() => setSheetOpen(false)} className="phone-sheet__close">✕</button>
                  </header>
                  <input className="phone-sheet__search" placeholder="🔍 Suchen…" />
                  <div className="phone-sheet__grid">
                    {RECIPES.slice(0, 8).map(r => (
                      <RecipeCard key={r.id} recipe={r} variant="minimal" />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="phone-frame__home" />
        </div>

        <p className="phone-stage__hint">
          Tipp auf <em>＋ Hinzufügen</em> öffnet das Bottom-Sheet (Mock).
        </p>
      </div>
    </>
  );
}
