import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import './WocheX.css';
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

export function WocheX() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const [portionsByRecipe, setPortionsByRecipe] = useState<Record<string, number>>({});

  const slots = slotsForDay(selectedDay);

  const totalSlots = WEEKPLAN_SLOTS.length;
  const items = useMemo(
    () => consolidateShoppingList(WEEKPLAN_SLOTS, portionsByRecipe),
    [portionsByRecipe]
  );

  const setPortionen = (recipeId: string, n: number) => {
    setPortionsByRecipe(prev => ({ ...prev, [recipeId]: n }));
  };

  const slotsCount = (day: number) => slotsForDay(day).length;

  return (
    <>
      <ProtoChrome current="/proto/woche-x" />
      <div className="woche-x">
        <header className="woche-x__header">
          <div>
            <span className="woche-x__eyebrow">KW {WEEK_NUMBER} · Woche prüfen</span>
            <h1>{WEEK_RANGE_LABEL}</h1>
          </div>
          <button className="woche-x__cta" onClick={() => setListOpen(!listOpen)}>
            <ShoppingBag size={16} strokeWidth={2} />
            Einkaufsliste {items.length > 0 ? `(${items.length})` : ''}
          </button>
        </header>

        <div className={`woche-x__split ${listOpen ? 'is-list-open' : ''}`}>
          {/* Left: vertical day strip */}
          <aside className="woche-x__days">
            {DAY_LABELS.map((label, i) => {
              const isSelected = i === selectedDay;
              const isToday = i === TODAY_INDEX;
              const count = slotsCount(i);
              return (
                <button
                  key={label}
                  onClick={() => setSelectedDay(i)}
                  className={`woche-x__day ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                >
                  <span className="woche-x__day-label">{label}</span>
                  <span className="woche-x__day-date">{dates[i]}</span>
                  <span className="woche-x__day-count">{count > 0 ? `${count} Rez.` : 'leer'}</span>
                </button>
              );
            })}
          </aside>

          {/* Center: day detail */}
          <main className="woche-x__detail">
            <header className="woche-x__detail-header">
              <h2>{DAY_LABELS_LONG[selectedDay]} · {dates[selectedDay]}</h2>
              {selectedDay === TODAY_INDEX && <span className="woche-x__today-tag">Heute</span>}
              <div className="woche-x__detail-nav">
                <button onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))} disabled={selectedDay === 0}>
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>
                <button onClick={() => setSelectedDay(Math.min(6, selectedDay + 1))} disabled={selectedDay === 6}>
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            </header>

            {slots.length === 0 ? (
              <div className="woche-x__empty">
                Keine Rezepte für diesen Tag geplant.
              </div>
            ) : (
              <div className="woche-x__slots">
                {slots.map(slot => {
                  const portionen = portionsByRecipe[slot.recipeId] ?? 2;
                  return (
                    <RecipeWithIngredients
                      key={slot.id}
                      slot={slot}
                      portionen={portionen}
                      onPortionenChange={n => setPortionen(slot.recipeId, n)}
                      onZutatChange={() => {/* mock: nicht persistiert in X */}}
                    />
                  );
                })}
              </div>
            )}

            <footer className="woche-x__footer">
              <span className="woche-x__footer-info">
                {totalSlots} Rezepte über die Woche · {items.length} Zutaten konsolidiert
              </span>
              <button className="woche-x__footer-cta" onClick={() => setListOpen(true)}>
                <ShoppingBag size={16} strokeWidth={2} />
                In die Einkaufstüte →
              </button>
            </footer>
          </main>

          {/* Right: shopping list (slide-out) */}
          {listOpen && (
            <aside className="woche-x__list-panel">
              <EinkaufslisteView
                items={items}
                embedded
                onClose={() => setListOpen(false)}
              />
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
