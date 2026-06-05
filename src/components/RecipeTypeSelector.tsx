/**
 * RecipeTypeSelector — Dropdown für Rezept-Kategorien
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type RecipeType =
  | 'frühstück'
  | 'hauptgericht'
  | 'beilage'
  | 'dessert'
  | 'snack'
  | 'getränk';

const RECIPE_TYPES: { value: RecipeType; label: string; emoji: string }[] = [
  { value: 'frühstück', label: 'Frühstück', emoji: '🥣' },
  { value: 'hauptgericht', label: 'Hauptgericht', emoji: '🍽️' },
  { value: 'beilage', label: 'Beilage', emoji: '🥗' },
  { value: 'dessert', label: 'Dessert', emoji: '🍰' },
  { value: 'snack', label: 'Snack', emoji: '🍿' },
  { value: 'getränk', label: 'Getränk', emoji: '🥤' },
];

interface RecipeTypeSelectorProps {
  recipeId: string;
  initialType?: RecipeType;
  onChange?: (type: RecipeType) => void;
}

export function RecipeTypeSelector({ recipeId, initialType = 'hauptgericht', onChange }: RecipeTypeSelectorProps) {
  const [type, setType] = useState<RecipeType>(initialType);
  const [saving, setSaving] = useState(false);

  const handleTypeChange = async (newType: RecipeType) => {
    setType(newType);
    setSaving(true);
    try {
      await supabase.from('recipes').update({ recipe_type: newType }).eq('id', recipeId);
      onChange?.(newType);
    } catch (error) {
      console.error('Failed to save recipe type:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rcn">
      <label className="rcn__label">🏷️ Rezept-Typ</label>
      <div className="rcn__pills">
        {RECIPE_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`rcn__pill ${type === t.value ? 'is-active' : ''}`}
            onClick={() => handleTypeChange(t.value)}
            disabled={saving}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
