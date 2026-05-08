import './DaySlot.css';
import { Clock, GripVertical } from 'lucide-react';
import { recipeById, type WeekplanSlot } from '../mocks/recipes';
import { ProfileDot } from './ProfileDot';
import { SchwierigkeitBadge } from './SchwierigkeitBadge';

type Props = {
  slot: WeekplanSlot;
  compact?: boolean;
  showMeta?: boolean;
};

export function DaySlot({ slot, compact = false, showMeta = true }: Props) {
  const recipe = recipeById(slot.recipeId);
  if (!recipe) return null;

  return (
    <div className={`day-slot ${compact ? 'day-slot--compact' : ''}`}>
      <div
        className="day-slot__thumb"
        style={{ background: `var(${recipe.gradientVar})` }}
      >
        <span className="day-slot__emoji">{recipe.emoji}</span>
      </div>
      <div className="day-slot__body">
        <span className="day-slot__title">{recipe.titel}</span>
        {showMeta && !compact && (
          <span className="day-slot__meta">
            <span className="day-slot__meta-item">
              <Clock size={11} strokeWidth={1.75} /> {recipe.zeitMin} Min
            </span>
            <span className="day-slot__meta-sep">·</span>
            <SchwierigkeitBadge schwierigkeit={recipe.schwierigkeit} size={11} />
          </span>
        )}
      </div>
      <ProfileDot profileId={slot.addedBy} size={14} />
      <span className="day-slot__drag" aria-label="Verschieben (später per Drag & Drop)">
        <GripVertical size={14} strokeWidth={1.75} />
      </span>
    </div>
  );
}

export function AddSlotButton() {
  return (
    <button className="day-slot__add" type="button">
      <span>＋</span> Hinzufügen
    </button>
  );
}
