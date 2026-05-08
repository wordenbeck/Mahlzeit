import './RecipeCard.css';
import { Clock, Star } from 'lucide-react';
import type { Recipe } from '../mocks/recipes';
import { ProfileDot } from './ProfileDot';
import { SchwierigkeitBadge } from './SchwierigkeitBadge';

export type RecipeCardVariant = 'classic' | 'minimal' | 'image-heavy' | 'list';

type Props = {
  recipe: Recipe;
  variant?: RecipeCardVariant;
};

export function RecipeCard({ recipe, variant = 'list' }: Props) {
  if (variant === 'list') {
    return (
      <article className="recipe-card recipe-card--list">
        <div
          className="recipe-card__image recipe-card__image--list"
          style={{ background: `var(${recipe.gradientVar})` }}
        >
          <span className="recipe-card__emoji recipe-card__emoji--lg">{recipe.emoji}</span>
          {recipe.isFavorite && <Star size={14} className="recipe-card__fav-icon" fill="currentColor" />}
        </div>
        <div className="recipe-card__body">
          <h3 className="recipe-card__title">{recipe.titel}</h3>
          <div className="recipe-card__meta">
            <span className="recipe-card__meta-item">
              <Clock size={13} strokeWidth={1.75} /> {recipe.zeitMin} Min
            </span>
            <span className="recipe-card__dot-sep">·</span>
            <SchwierigkeitBadge schwierigkeit={recipe.schwierigkeit} size={13} />
          </div>
          <div className="recipe-card__tags">
            {recipe.kategorien.slice(0, 2).map(k => (
              <span key={k} className="recipe-card__tag">{k}</span>
            ))}
          </div>
        </div>
        <ProfileDot profileId={recipe.createdBy} />
      </article>
    );
  }

  if (variant === 'image-heavy') {
    return (
      <article className="recipe-card recipe-card--image-heavy">
        <div
          className="recipe-card__image recipe-card__image--full"
          style={{ background: `var(${recipe.gradientVar})` }}
        >
          <span className="recipe-card__emoji recipe-card__emoji--xl">{recipe.emoji}</span>
          <div className="recipe-card__overlay">
            <h3 className="recipe-card__title recipe-card__title--overlay">{recipe.titel}</h3>
            <span className="recipe-card__meta recipe-card__meta--overlay">
              <Clock size={13} strokeWidth={1.75} /> {recipe.zeitMin} Min
            </span>
          </div>
          <div className="recipe-card__profile-overlay">
            <ProfileDot profileId={recipe.createdBy} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'minimal') {
    return (
      <article className="recipe-card recipe-card--minimal">
        <div
          className="recipe-card__image recipe-card__image--small"
          style={{ background: `var(${recipe.gradientVar})` }}
        >
          <span className="recipe-card__emoji">{recipe.emoji}</span>
        </div>
        <h3 className="recipe-card__title">{recipe.titel}</h3>
        <span className="recipe-card__meta">
          <Clock size={11} strokeWidth={1.75} /> {recipe.zeitMin} Min
        </span>
      </article>
    );
  }

  // classic
  return (
    <article className="recipe-card recipe-card--classic">
      <div
        className="recipe-card__image"
        style={{ background: `var(${recipe.gradientVar})` }}
      >
        <span className="recipe-card__emoji">{recipe.emoji}</span>
        {recipe.isFavorite && <Star size={16} className="recipe-card__fav-icon" fill="currentColor" />}
      </div>
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.titel}</h3>
        <div className="recipe-card__meta">
          <span className="recipe-card__meta-item">
            <Clock size={13} strokeWidth={1.75} /> {recipe.zeitMin} Min
          </span>
          <span className="recipe-card__dot-sep">·</span>
          <SchwierigkeitBadge schwierigkeit={recipe.schwierigkeit} size={13} showLabel={false} />
        </div>
        <div className="recipe-card__profile">
          <ProfileDot profileId={recipe.createdBy} />
        </div>
      </div>
    </article>
  );
}
