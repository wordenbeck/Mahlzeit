import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowLeft, Plus } from 'lucide-react';
import './WocheZ.css';
import { ProtoChrome } from './ProtoChrome';
import { RecipeWithIngredients } from '../../components/RecipeWithIngredients';
import { EinkaufslisteView } from '../../components/EinkaufslisteView';
import { DayPill } from '../../components/DayPill';
import {
  DAY_LABELS,
  DAY_LABELS_LONG,
  WEEK_NUMBER,
  WEEK_RANGE_LABEL,
  WEEKPLAN_SLOTS,
  recipeById,
  slotsForDay,
} from '../../mocks/recipes';
import { consolidateShoppingList } from '../../lib/shoppingList';

const datesLong = ['4. Mai', '5. Mai', '6. Mai', '7. Mai', '8. Mai', '9. Mai', '10. Mai'];

type RecipeStyle = 'bring' | 'subtle';

// Hauptview: 5 Tage horizontal, jede Spalte hat Rezepte+Zutaten drunter
export function WocheZ() {
  const [showWeekend, setShowWeekend] = useState(false);
  const [recipeStyle, setRecipeStyle] = useState<RecipeStyle>('subtle');
  const [portionsByRecipe, setPortionsByRecipe] = useState<Record<string, number>>({});

  const visibleDays = showWeekend ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];

  const setPortionen = (recipeId: string, n: number) => {
    setPortionsByRecipe(prev => ({ ...prev, [recipeId]: n }));
  };

  const totalSlots = WEEKPLAN_SLOTS.length;
  const totalIngredients = useMemo(
    () => consolidateShoppingList(WEEKPLAN_SLOTS, portionsByRecipe).length,
    [portionsByRecipe]
  );

  return (
    <>
      <ProtoChrome current="/proto/woche-z" />
      <div className="woche-z">
        <header className="woche-z__header">
          <div>
            <span className="woche-z__eyebrow">KW {WEEK_NUMBER} · Woche auf einen Blick</span>
            <div className="woche-z__title-row">
              <button className="woche-z__nav-btn" aria-label="Vorherige Woche">
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <h1>{WEEK_RANGE_LABEL}</h1>
              <button className="woche-z__nav-btn" aria-label="Nächste Woche">
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className="woche-z__header-actions">
            <div className="woche-z__style-toggle">
              <button
                className={recipeStyle === 'subtle' ? 'is-active' : ''}
                onClick={() => setRecipeStyle('subtle')}
                title="Dezenter Stil (mint-soft)"
              >Dezent</button>
              <button
                className={recipeStyle === 'bring' ? 'is-active' : ''}
                onClick={() => setRecipeStyle('bring')}
                title="Bring-Stil (mint-Verlauf prominenter)"
              >Bring-Stil</button>
            </div>
            <button
              className={`woche-z__weekend-toggle ${showWeekend ? 'is-active' : ''}`}
              onClick={() => setShowWeekend(!showWeekend)}
            >
              {showWeekend ? '— Wochenende' : '+ Wochenende'}
            </button>
            <Link to="/proto/woche-z/einkaufen" className="woche-z__cta">
              <ShoppingBag size={16} strokeWidth={2} />
              In die Einkaufstüte ({totalIngredients})
            </Link>
          </div>
        </header>

        <main className={`woche-z__grid ${showWeekend ? 'is-7' : 'is-5'}`}>
          {visibleDays.map(i => {
            const isWeekend = i >= 5;
            const slots = slotsForDay(i);
            return (
              <section
                key={i}
                className={`woche-z__column ${isWeekend ? 'is-weekend' : ''}`}
              >
                <header className="woche-z__col-header">
                  <span className="woche-z__col-day">{DAY_LABELS[i]}</span>
                  <span className="woche-z__col-date">{datesLong[i]}</span>
                </header>
                <div className="woche-z__col-content">
                  {slots.length === 0 ? (
                    <button className="woche-z__col-empty-cta">
                      <Plus size={14} strokeWidth={2.5} /> Rezept hinzufügen
                    </button>
                  ) : (
                    <>
                      {slots.map(slot => {
                        const portionen = portionsByRecipe[slot.recipeId] ?? 2;
                        return (
                          <RecipeWithIngredients
                            key={slot.id}
                            slot={slot}
                            portionen={portionen}
                            onPortionenChange={n => setPortionen(slot.recipeId, n)}
                            onZutatChange={() => {}}
                            compact
                            cardStyle={recipeStyle}
                          />
                        );
                      })}
                      <button className="woche-z__col-add-circle" aria-label="Weiteres Rezept">
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </>
                  )}
                </div>
              </section>
            );
          })}
        </main>

        <footer className="woche-z__footer">
          <span className="woche-z__footer-info">
            {totalSlots} Rezepte · {totalIngredients} Zutaten konsolidiert · Mengen anpassbar pro Rezept
          </span>
          <Link to="/proto/woche-z/einkaufen" className="woche-z__cta-large">
            <ShoppingBag size={18} strokeWidth={2} />
            In die Einkaufstüte →
          </Link>
        </footer>
      </div>
    </>
  );
}

// 2. Route: Einkaufsliste
export function WocheZEinkaufen() {
  const items = consolidateShoppingList(WEEKPLAN_SLOTS);

  return (
    <>
      <ProtoChrome current="/proto/woche-z/einkaufen" />
      <div className="woche-z woche-z--einkaufen">
        <header className="woche-z__header">
          <div>
            <span className="woche-z__eyebrow">KW {WEEK_NUMBER} · Einkaufstüte gepackt</span>
            <h1>Einkaufsliste</h1>
          </div>
          <Link to="/proto/woche-z" className="woche-z__back">
            <ArrowLeft size={14} strokeWidth={2} /> Zurück zur Wochenübersicht
          </Link>
        </header>

        <main className="woche-z__list-area">
          <EinkaufslisteView items={items} />

          <div className="woche-z__sidebar">
            <aside className="woche-z__bring-card">
              <h3>Export an Bring!</h3>
              <p>Ein Tipp und alle Zutaten landen in deiner Bring!-Liste — inkl. Extras die du gerade ergänzt hast.</p>
              <button className="woche-z__bring-btn">
                <ShoppingBag size={16} strokeWidth={2} />
                An Bring senden
              </button>
              <small>Mock — Bring-Integration kommt in Sprint 6.</small>
            </aside>

            <aside className="woche-z__breakdown">
              <h3>Aus diesen Rezepten</h3>
              <ul>
                {WEEKPLAN_SLOTS.slice().sort((a, b) => a.dayOfWeek - b.dayOfWeek).map(slot => {
                  const recipe = recipeById(slot.recipeId);
                  if (!recipe) return null;
                  return (
                    <li key={slot.id} className="woche-z__breakdown-item">
                      <DayPill dayOfWeek={slot.dayOfWeek} size="sm" />
                      <span
                        className="woche-z__breakdown-emoji"
                        style={{ background: `var(${recipe.gradientVar})` }}
                      >
                        {recipe.emoji}
                      </span>
                      <span className="woche-z__breakdown-title">{recipe.titel}</span>
                      <span className="woche-z__breakdown-portionen">
                        {recipe.portionen} Port.
                      </span>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
