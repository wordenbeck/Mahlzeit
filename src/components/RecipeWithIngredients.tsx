import { Clock, Minus, Plus, Users } from 'lucide-react';
import './RecipeWithIngredients.css';
import { recipeById, type WeekplanSlot, type Zutat } from '../mocks/recipes';
import { SchwierigkeitBadge } from './SchwierigkeitBadge';
import { formatMenge } from '../lib/shoppingList';

type Props = {
  slot: WeekplanSlot;
  portionen: number;
  onPortionenChange: (n: number) => void;
  zutatenOverrides?: Record<string, number>;     // zutatName.lower → custom menge
  onZutatChange?: (zutatName: string, menge: number) => void;
  compact?: boolean;
  cardStyle?: 'subtle' | 'bring';     // subtle = mint-soft, bring = mint-gradient prominent
};

export function RecipeWithIngredients({
  slot,
  portionen,
  onPortionenChange,
  zutatenOverrides = {},
  onZutatChange,
  compact = false,
  cardStyle = 'subtle',
}: Props) {
  const recipe = recipeById(slot.recipeId);
  if (!recipe) return null;

  const factor = portionen / recipe.portionen;

  const skaliert = (z: Zutat) => {
    const override = zutatenOverrides[z.name.toLowerCase()];
    if (override !== undefined) return override;
    return Math.round(z.menge * factor * 10) / 10;
  };

  return (
    <article className={`rwi rwi--${cardStyle} ${compact ? 'rwi--compact' : ''}`}>
      <header className="rwi__header">
        <div
          className="rwi__thumb"
          style={{ background: `var(${recipe.gradientVar})` }}
        >
          <span className="rwi__emoji">{recipe.emoji}</span>
        </div>
        <div className="rwi__title-block">
          <h3 className="rwi__title">{recipe.titel}</h3>
          <div className="rwi__meta">
            <span className="rwi__meta-item">
              <Clock size={12} strokeWidth={1.75} /> {recipe.zeitMin} Min
            </span>
            <span className="rwi__meta-sep">·</span>
            <SchwierigkeitBadge schwierigkeit={recipe.schwierigkeit} size={12} />
          </div>
        </div>
        <div className="rwi__portionen">
          <Users size={13} strokeWidth={1.75} />
          <button
            className="rwi__portionen-btn"
            onClick={() => onPortionenChange(Math.max(1, portionen - 1))}
            aria-label="Weniger Portionen"
          >
            <Minus size={12} strokeWidth={2.5} />
          </button>
          <span className="rwi__portionen-value">{portionen}</span>
          <button
            className="rwi__portionen-btn"
            onClick={() => onPortionenChange(portionen + 1)}
            aria-label="Mehr Portionen"
          >
            <Plus size={12} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <ul className="rwi__zutaten">
        {recipe.zutaten.map(z => {
          const menge = skaliert(z);
          const isOverridden = zutatenOverrides[z.name.toLowerCase()] !== undefined;
          return (
            <li key={z.name} className={`rwi__zutat ${isOverridden ? 'is-overridden' : ''}`}>
              <span className="rwi__zutat-bullet" />
              <span className="rwi__zutat-name">{z.name}</span>
              {onZutatChange ? (
                <input
                  className="rwi__zutat-menge-input"
                  type="number"
                  step="0.5"
                  min="0"
                  value={menge}
                  onChange={e => onZutatChange(z.name.toLowerCase(), parseFloat(e.target.value) || 0)}
                />
              ) : (
                <span className="rwi__zutat-menge">{formatMenge(menge, z.einheit)}</span>
              )}
              {onZutatChange && <span className="rwi__zutat-einheit">{z.einheit}</span>}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
