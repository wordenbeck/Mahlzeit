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
      <select
        className="rcn__select"
        value={type}
        onChange={(e) => handleTypeChange(e.target.value as RecipeType)}
        disabled={saving}
      >
        {RECIPE_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.emoji} {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
