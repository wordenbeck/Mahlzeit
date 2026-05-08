import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import './WocheY.css';
import { ProtoChrome } from './ProtoChrome';
import { RecipeWithIngredients } from '../../components/RecipeWithIngredients';
import { EinkaufslisteView } from '../../components/EinkaufslisteView';
import {
  DAY_LABELS,
  DAY_LABELS_LONG,
  WEEK_NUMBER,
  WEEK_RANGE_LABEL,
  TODAY_INDEX,
  WEEKPLAN_SLOTS,
  slotsForDay,
} from '../../mocks/recipes';
import { consolidateShoppingList } from '../../lib/shoppingList';

const dates = ['4.5', '5.5', '6.5', '7.5', '8.5', '9.5', '10.5'];

// Hauptview: Tag für Tag durchblättern
export function WocheY() {
  const [day, setDay] = useState(0);
  const slots = slotsForDay(day);

  const totalSlots = WEEKPLAN_SLOTS.length;
  const totalIngredients = consolidateShoppingList(WEEKPLAN_SLOTS).length;

  return (
    <>
      <ProtoChrome current="/proto/woche-y" />
      <div className="woche-y">
        <header className="woche-y__header">
          <div>
            <span className="woche-y__eyebrow">KW {WEEK_NUMBER} · Tag-für-Tag prüfen</span>
            <h1>{WEEK_RANGE_LABEL}</h1>
          </div>
        </header>

        {/* Step indicator */}
        <div className="woche-y__steps">
          <div className="woche-y__step is-active">
            <span className="woche-y__step-num">1</span>
            <span>Tage prüfen</span>
          </div>
          <span className="woche-y__step-line" />
          <div className="woche-y__step">
            <span className="woche-y__step-num">2</span>
            <span>Einkaufsliste</span>
          </div>
        </div>

        {/* Day navigation */}
        <div className="woche-y__day-nav">
          <button
            className="woche-y__nav-arrow"
            onClick={() => setDay(Math.max(0, day - 1))}
            disabled={day === 0}
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <div className="woche-y__day-info">
            <span className="woche-y__day-mini">{DAY_LABELS[day]}</span>
            <h2>{DAY_LABELS_LONG[day]}</h2>
            <span className="woche-y__day-date">{dates[day]}</span>
            {day === TODAY_INDEX && <span className="woche-y__today-tag">Heute</span>}
          </div>
          <button
            className="woche-y__nav-arrow"
            onClick={() => setDay(Math.min(6, day + 1))}
            disabled={day === 6}
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Mini day-strip indicator */}
        <div className="woche-y__day-dots">
          {DAY_LABELS.map((label, i) => (
            <button
              key={label}
              className={`woche-y__day-dot ${i === day ? 'is-active' : ''} ${slotsForDay(i).length > 0 ? 'has-content' : ''}`}
              onClick={() => setDay(i)}
              aria-label={DAY_LABELS_LONG[i]}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Day content */}
        <main className="woche-y__content">
          {slots.length === 0 ? (
            <div className="woche-y__empty">Keine Rezepte für diesen Tag.</div>
          ) : (
            <div className="woche-y__slots">
              {slots.map(slot => (
                <RecipeWithIngredients
                  key={slot.id}
                  slot={slot}
                  portionen={2}
                  onPortionenChange={() => {}}
                  onZutatChange={() => {}}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer / next step */}
        <footer className="woche-y__footer">
          <span className="woche-y__footer-summary">
            {totalSlots} Rezepte · {totalIngredients} Zutaten konsolidiert
          </span>
          <Link to="/proto/woche-y/liste" className="woche-y__next-cta">
            <ShoppingBag size={16} strokeWidth={2} />
            Weiter zur Einkaufsliste →
          </Link>
        </footer>
      </div>
    </>
  );
}

// 2. Route: Einkaufsliste
export function WocheYListe() {
  const items = consolidateShoppingList(WEEKPLAN_SLOTS);

  return (
    <>
      <ProtoChrome current="/proto/woche-y/liste" />
      <div className="woche-y woche-y--liste">
        <header className="woche-y__header">
          <div>
            <span className="woche-y__eyebrow">KW {WEEK_NUMBER} · Schritt 2 von 2</span>
            <h1>Einkaufsliste</h1>
          </div>
          <Link to="/proto/woche-y" className="woche-y__back">
            <ArrowLeft size={14} strokeWidth={2} /> Zurück zur Wochen-Prüfung
          </Link>
        </header>

        <div className="woche-y__steps">
          <div className="woche-y__step is-done">
            <span className="woche-y__step-num">✓</span>
            <span>Tage geprüft</span>
          </div>
          <span className="woche-y__step-line is-done" />
          <div className="woche-y__step is-active">
            <span className="woche-y__step-num">2</span>
            <span>Einkaufsliste</span>
          </div>
        </div>

        <main className="woche-y__list-area">
          <EinkaufslisteView items={items} />
        </main>
      </div>
    </>
  );
}
