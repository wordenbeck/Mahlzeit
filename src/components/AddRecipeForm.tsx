/**
 * AddRecipeForm — Neues Rezept hinzufügen
 * Verwendet für Web Share Target + manuelles Erstellen
 * Auto-saves draft to SessionStorage
 * Supports both string-based and structured ingredient input
 */

import { useState, useEffect } from 'react';
import type { Schwierigkeit } from '../lib/types/recipe';
import { insertRecipe } from '../lib/recipes';
import { StructuredIngredientForm, type Zutat } from './StructuredIngredientForm';
import './AddRecipeForm.css';

interface AddRecipeFormProps {
  initialTitel?: string;
  initialZutaten?: string | Zutat[];
  initialZubereitung?: string;
  onSuccess?: (recipeId: string) => void;
  onCancel?: () => void;
}

export function AddRecipeForm({
  initialTitel = '',
  initialZutaten = [],
  initialZubereitung = '',
  onSuccess,
  onCancel,
}: AddRecipeFormProps) {
  // Normalize initialZutaten to array
  const normalizedZutaten = Array.isArray(initialZutaten)
    ? initialZutaten
    : typeof initialZutaten === 'string' && initialZutaten.trim()
      ? initialZutaten.split('\n').map(z => ({ name: z.trim(), menge: null, einheit: null, hinweis: null }))
      : [];

  // Try to restore from SessionStorage on mount
  const [titel, setTitel] = useState(() => {
    const saved = sessionStorage.getItem('recipe-draft-titel');
    return saved || initialTitel;
  });
  const [zutaten, setZutaten] = useState<Zutat[]>(() => {
    const saved = sessionStorage.getItem('recipe-draft-zutaten-json');
    if (saved) {
      return JSON.parse(saved);
    }
    return normalizedZutaten;
  });
  const [zubereitung, setZubereitung] = useState(() => {
    const saved = sessionStorage.getItem('recipe-draft-zubereitung');
    return saved || initialZubereitung;
  });
  const [zeit, setZeit] = useState(() => {
    const saved = sessionStorage.getItem('recipe-draft-zeit');
    return saved || '';
  });
  const [schwierigkeit, setSchwierigkeit] = useState<Schwierigkeit>(() => {
    const saved = sessionStorage.getItem('recipe-draft-schwierigkeit');
    return (saved as Schwierigkeit) || 'mittel';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-save to SessionStorage whenever form data changes
  useEffect(() => {
    sessionStorage.setItem('recipe-draft-titel', titel);
    sessionStorage.setItem('recipe-draft-zutaten-json', JSON.stringify(zutaten));
    sessionStorage.setItem('recipe-draft-zubereitung', zubereitung);
    sessionStorage.setItem('recipe-draft-zeit', zeit);
    sessionStorage.setItem('recipe-draft-schwierigkeit', schwierigkeit);
  }, [titel, zutaten, zubereitung, zeit, schwierigkeit]);

  // Keyboard shortcut: Ctrl/Cmd + Enter to save
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const form = (e.target as HTMLTextAreaElement).closest('form');
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validierung
      if (!titel.trim()) throw new Error('❌ Titel ist erforderlich');
      if (titel.trim().length < 3) throw new Error('❌ Titel mindestens 3 Zeichen');
      if (zutaten.length === 0) throw new Error('❌ Zutaten sind erforderlich');
      if (!zubereitung.trim()) throw new Error('❌ Zubereitung ist erforderlich');

      // Validate zutaten have names
      const validZutaten = zutaten.filter(z => z.name && z.name.trim());
      if (validZutaten.length === 0) {
        throw new Error('❌ Mindestens eine Zutat mit Name erforderlich');
      }

      const zutatenJson = validZutaten.map((z) => ({
        name: z.name.trim(),
        menge: z.menge,
        einheit: z.einheit,
        hinweis: z.hinweis,
      }));

      // Parse Zubereitung (zeilenweise, entferne Nummern)
      const zubereitungLines = zubereitung
        .split('\n')
        .map((z) => z.trim().replace(/^\d+[\.\)]\s*/, ''))
        .filter((z) => z);

      if (zubereitungLines.length === 0) {
        throw new Error('❌ Mindestens ein Zubereitungsschritt erforderlich');
      }

      // Validiere Zubereitungszeit
      let zubereitungszeit = null;
      if (zeit) {
        const zeitNum = parseInt(zeit);
        if (zeitNum < 0) {
          throw new Error('❌ Zubereitungszeit darf nicht negativ sein');
        }
        if (zeitNum > 1440) {
          throw new Error('❌ Zubereitungszeit darf max. 24h sein');
        }
        zubereitungszeit = zeitNum;
      }

      // Speichern
      const recipeId = await insertRecipe({
        titel: titel.trim(),
        zutaten: zutatenJson,
        zubereitung: zubereitungLines,
        zubereitungszeit_min: zubereitungszeit,
        schwierigkeit,
        source: 'instagram',
      });

      // Clear SessionStorage draft after successful save
      sessionStorage.removeItem('recipe-draft-titel');
      sessionStorage.removeItem('recipe-draft-zutaten-json');
      sessionStorage.removeItem('recipe-draft-zubereitung');
      sessionStorage.removeItem('recipe-draft-zeit');
      sessionStorage.removeItem('recipe-draft-schwierigkeit');

      onSuccess?.(recipeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  const hasDraft = sessionStorage.getItem('recipe-draft-titel') !== null;

  const clearDraft = () => {
    if (confirm('Entwurf wirklich löschen?')) {
      sessionStorage.removeItem('recipe-draft-titel');
      sessionStorage.removeItem('recipe-draft-zutaten-json');
      sessionStorage.removeItem('recipe-draft-zubereitung');
      sessionStorage.removeItem('recipe-draft-zeit');
      sessionStorage.removeItem('recipe-draft-schwierigkeit');
      setTitel('');
      setZutaten([]);
      setZubereitung('');
      setZeit('');
      setSchwierigkeit('mittel');
      setError(null);
    }
  };

  return (
    <form className="add-recipe-form" onSubmit={handleSubmit}>
      {hasDraft && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '6px', fontSize: '12px', color: '#1565c0' }}>
          💾 Entwurf aus letzter Session wiederhergestellt
          <button
            type="button"
            onClick={clearDraft}
            disabled={loading}
            style={{
              marginLeft: '1rem',
              padding: '0.4rem 0.8rem',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            ✕ Löschen
          </button>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="titel">Titel *</label>
        <input
          id="titel"
          type="text"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="z.B. Pasta Bolognese"
          disabled={loading}
        />
      </div>

      <StructuredIngredientForm
        initialZutaten={zutaten}
        onChange={setZutaten}
        disabled={loading}
      />

      <div className="form-group">
        <label htmlFor="zubereitung">Zubereitung (zeilenweise) *</label>
        <textarea
          id="zubereitung"
          value={zubereitung}
          onChange={(e) => setZubereitung(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Wasser erhitzen\nNudeln hinzufügen\nSoße rühren\n...`}
          rows={5}
          disabled={loading}
          title="Cmd/Ctrl+Enter zum Speichern"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="zeit">Zubereitungszeit (Min.)</label>
          <input
            id="zeit"
            type="number"
            value={zeit}
            onChange={(e) => setZeit(e.target.value)}
            placeholder="z.B. 30"
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="schwierigkeit">Schwierigkeit</label>
          <select
            id="schwierigkeit"
            value={schwierigkeit}
            onChange={(e) => setSchwierigkeit(e.target.value as Schwierigkeit)}
            disabled={loading}
          >
            <option value="einfach">Einfach</option>
            <option value="mittel">Mittel</option>
            <option value="aufwendig">Aufwendig</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? '⏳' : '←'} Abbrechen
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
              {' Speichert...'}
            </>
          ) : (
            '✅ Speichern'
          )}
        </button>
      </div>
    </form>
  );
}
