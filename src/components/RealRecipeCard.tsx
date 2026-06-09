// Recipe-Card für ECHTE Recipe-Daten aus DB.

import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import './RealRecipeCard.css';
import { SchwierigkeitBadge } from './SchwierigkeitBadge';
import type { RecipeListItem } from '../lib/recipes';
import type { Schwierigkeit } from '../mocks/recipes';

type Props = {
  recipe: RecipeListItem;
  onClick?: () => void;     // Wenn gesetzt: Card wird Button (für Modal-Trigger statt Navigation)
  linkState?: Record<string, unknown>; // Optionaler Router-State beim Navigieren
};

function fallbackGradient(id: string): string {
  const gradients = [
    '--gradient-recipe-1', '--gradient-recipe-2', '--gradient-recipe-3',
    '--gradient-recipe-4', '--gradient-recipe-5', '--gradient-recipe-6',
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return gradients[Math.abs(hash) % gradients.length];
}

export function RealRecipeCard({ recipe, onClick, linkState }: Props) {
  const hasImage = Boolean(recipe.bild_url);
  const gradientVar = fallbackGradient(recipe.id);

  const inner = (
    <>
      <div
        className="rrc__image"
        style={{
          background: hasImage
            ? `url(${recipe.bild_url}) center/cover`
            : `var(${gradientVar})`,
        }}
      >
        {!hasImage && <span className="rrc__placeholder">🍽</span>}
        {recipe.is_favorite && <Star size={14} fill="currentColor" className="rrc__fav" />}
      </div>
      <div className="rrc__body">
        <h3 className="rrc__title">{recipe.titel}</h3>
        <div className="rrc__meta">
          {recipe.zubereitungszeit_min != null && (
            <span className="rrc__meta-item">
              <Clock size={13} strokeWidth={1.75} /> {recipe.zubereitungszeit_min} Min
            </span>
          )}
          {recipe.schwierigkeit && recipe.zubereitungszeit_min != null && (
            <span className="rrc__sep">·</span>
          )}
          {recipe.schwierigkeit && (
            <SchwierigkeitBadge schwierigkeit={recipe.schwierigkeit as Schwierigkeit} size={13} />
          )}
        </div>
        {recipe.tags.length > 0 && (
          <div className="rrc__tags">
            {recipe.tags.slice(0, 2).map(t => (
              <span key={t} className="rrc__tag">{t}</span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="rrc" onClick={onClick}>
        {inner}
      </button>
    );
  }
  return <Link to={`/rezepte/${recipe.id}`} state={linkState} className="rrc">{inner}</Link>;
}
