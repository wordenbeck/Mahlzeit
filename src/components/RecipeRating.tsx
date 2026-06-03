/**
 * RecipeRating — Sterne bewerten + Notizen
 */

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './RecipeRating.css';

interface RecipeRatingProps {
  recipeId: string;
  workspaceId: string;
  userId: string;
  initialStars?: number;
  initialNotes?: string;
  onRatingChange?: (stars: number, notes: string) => void;
}

export function RecipeRating({
  recipeId,
  workspaceId,
  userId,
  initialStars = 0,
  initialNotes = '',
  onRatingChange,
}: RecipeRatingProps) {
  const [stars, setStars] = useState(initialStars);
  const [notes, setNotes] = useState(initialNotes);
  const [hoverStars, setHoverStars] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleStarClick = async (newStars: number) => {
    setStars(newStars);
    await saveRating(newStars, notes);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
  };

  const handleNotesSave = async () => {
    await saveRating(stars, notes);
  };

  const saveRating = async (newStars: number, newNotes: string) => {
    setSaving(true);
    try {
      if (newStars === 0) {
        // Delete rating if 0 stars
        await supabase
          .from('recipe_ratings')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('workspace_id', workspaceId)
          .eq('user_id', userId);
      } else {
        // Upsert rating
        await supabase.from('recipe_ratings').upsert(
          {
            workspace_id: workspaceId,
            recipe_id: recipeId,
            user_id: userId,
            stars: newStars,
            notes: newNotes || null,
          },
          { onConflict: 'workspace_id,recipe_id,user_id' }
        );
      }
      onRatingChange?.(newStars, newNotes);
    } catch (error) {
      console.error('Failed to save rating:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="recipe-rating">
      {/* Stars */}
      <div className="recipe-rating__stars">
        <label style={{ fontSize: '13px', color: '#666', marginBottom: '0.5rem', display: 'block' }}>
          👍 Wie hat's geschmeckt?
        </label>
        <div className="recipe-rating__star-group">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`recipe-rating__star ${
                num <= (hoverStars || stars) ? 'active' : ''
              }`}
              onClick={() => handleStarClick(num)}
              onMouseEnter={() => setHoverStars(num)}
              onMouseLeave={() => setHoverStars(0)}
              disabled={saving}
              aria-label={`${num} Sterne`}
            >
              ★
            </button>
          ))}
        </div>
        {stars > 0 && (
          <button
            className="recipe-rating__clear"
            onClick={() => handleStarClick(0)}
            disabled={saving}
            style={{ fontSize: '11px', marginTop: '0.5rem' }}
          >
            ✕ Bewertung löschen
          </button>
        )}
      </div>

      {/* Notes */}
      {stars > 0 && (
        <div className="recipe-rating__notes">
          <label style={{ fontSize: '13px', color: '#666', marginBottom: '0.5rem', display: 'block' }}>
            📝 Notiz (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            onBlur={handleNotesSave}
            placeholder="z.B. 'Hat der Familie sehr geschmeckt!'"
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '13px',
              resize: 'vertical',
            }}
          />
        </div>
      )}
    </div>
  );
}
