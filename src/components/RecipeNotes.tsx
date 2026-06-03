/**
 * RecipeNotes — Haushalt-Notizen zu Rezepten
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RecipeNotesProps {
  recipeId: string;
  workspaceId: string;
}

export function RecipeNotes({ recipeId, workspaceId }: RecipeNotesProps) {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [recipeId]);

  const loadNotes = async () => {
    try {
      const { data } = await supabase
        .from('recipe_notes')
        .select('content')
        .eq('recipe_id', recipeId)
        .eq('workspace_id', workspaceId)
        .single();

      if (data) {
        setNotes(data.content);
      }
    } catch (error) {
      // No notes yet
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (notes.trim()) {
        await supabase.from('recipe_notes').upsert(
          {
            workspace_id: workspaceId,
            recipe_id: recipeId,
            content: notes,
          },
          { onConflict: 'workspace_id,recipe_id' }
        );
      } else {
        // Delete if empty
        await supabase
          .from('recipe_notes')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('workspace_id', workspaceId);
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
        📝 Notizen zu diesem Rezept
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleSave}
        placeholder="z.B. 'Zu viel Salz', 'Familie liebt es!', 'Nächstes Mal weniger Knoblauch'"
        disabled={saving}
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontFamily: 'inherit',
          fontSize: '13px',
          resize: 'vertical',
        }}
      />
      <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
        Alle im Haushalt können diese Notizen sehen.
      </p>
    </div>
  );
}
