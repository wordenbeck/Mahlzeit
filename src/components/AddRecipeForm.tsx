/**
 * AddRecipeForm — Neues Rezept hinzufügen
 * Verwendet für Web Share Target + manuelles Erstellen
 */

import { useState } from 'react';
import type { Schwierigkeit } from '../lib/types/recipe';
import { insertRecipe } from '../lib/recipes';
import './AddRecipeForm.css';

interface AddRecipeFormProps {
  initialTitel?: string;
  initialZutaten?: string;
  initialZubereitung?: string;
  onSuccess?: (recipeId: string) => void;
  onCancel?: () => void;
}

export function AddRecipeForm({
  initialTitel = '',
  initialZutaten = '',
  initialZubereitung = '',
  onSuccess,
  onCancel,
}: AddRecipeFormProps) {
  const [titel, setTitel] = useState(initialTitel);
  const [zutaten, setZutaten] = useState(initialZutaten);
  const [zubereitung, setZubereitung] = useState(initialZubereitung);
  const [zeit, setZeit] = useState('');
  const [schwierigkeit, setSchwierigkeit] = useState<Schwierigkeit>('mittel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validierung
      if (!titel.trim()) throw new Error('❌ Titel ist erforderlich');
      if (titel.trim().length < 3) throw new Error('❌ Titel mindestens 3 Zeichen');
      if (!zutaten.trim()) throw new Error('❌ Zutaten sind erforderlich');
      if (!zubereitung.trim()) throw new Error('❌ Zubereitung ist erforderlich');

      // Parse Zutaten (zeilenweise)
      const zutatenLines = zutaten
        .split('\n')
        .map((z) => z.trim())
        .filter((z) => z);

      if (zutatenLines.length === 0) {
        throw new Error('❌ Mindestens eine Zutat erforderlich');
      }

      const zutatenJson = zutatenLines.map((name) => ({
        name,
        menge: null,
        einheit: null,
        hinweis: null,
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

      onSuccess?.(recipeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-recipe-form" onSubmit={handleSubmit}>
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

      <div className="form-group">
        <label htmlFor="zutaten">Zutaten (zeilenweise) *</label>
        <textarea
          id="zutaten"
          value={zutaten}
          onChange={(e) => setZutaten(e.target.value)}
          placeholder={`400g Nudeln\n200g Hackmasse\n1 Zwiebel\n...`}
          rows={5}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="zubereitung">Zubereitung (zeilenweise) *</label>
        <textarea
          id="zubereitung"
          value={zubereitung}
          onChange={(e) => setZubereitung(e.target.value)}
          placeholder={`Wasser erhitzen\nNudeln hinzufügen\nSoße rühren\n...`}
          rows={5}
          disabled={loading}
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
