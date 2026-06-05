/**
 * CookedButton — "Gekocht markieren" für Tracking
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check } from 'lucide-react';

interface CookedButtonProps {
  recipeId: string;
  workspaceId: string;
  userId: string;
}

export function CookedButton({ recipeId, workspaceId, userId }: CookedButtonProps) {
  const [lastCooked, setLastCooked] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLastCooked();
  }, [recipeId]);

  const loadLastCooked = async () => {
    try {
      const { data } = await supabase
        .from('recipe_history')
        .select('cooked_at')
        .eq('recipe_id', recipeId)
        .eq('workspace_id', workspaceId)
        .order('cooked_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setLastCooked(data.cooked_at);
      }
    } catch (error) {
      // No history yet
    }
  };

  const handleCooked = async () => {
    setLoading(true);
    try {
      await supabase.from('recipe_history').insert({
        workspace_id: workspaceId,
        recipe_id: recipeId,
        user_id: userId,
        cooked_at: new Date().toISOString(),
      });

      setLastCooked(new Date().toISOString());
    } catch (error) {
      console.error('Failed to mark as cooked:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (days === 0) return 'heute';
    if (days === 1) return 'gestern';
    return `vor ${days} Tagen`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
      <button
        onClick={handleCooked}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '13px',
          transition: 'background 0.2s',
        }}
      >
        <Check size={16} />
        {loading ? 'Speichert...' : 'Gekocht!'}
      </button>

      {lastCooked && (
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Zuletzt gekocht: {getDaysAgo(lastCooked)}
        </p>
      )}
    </div>
  );
}
