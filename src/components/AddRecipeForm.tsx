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
import { trackEvent } from '../lib/analytics';
import { fetchInstagramCaption, isValidInstagramUrl } from '../lib/instagram';
import { parseRecipeFromText } from '../lib/groqRecipeParser';
import './AddRecipeForm.css';

interface AddRecipeFormProps {
  initialTitel?: string;
  initialZutaten?: string | Zutat[];
  initialZubereitung?: string;
  initialBildUrl?: string | null;
  onSuccess?: (recipeId: string) => void;
  onCancel?: () => void;
}

export function AddRecipeForm({
  initialTitel = '',
  initialZutaten = [],
  initialZubereitung = '',
  initialBildUrl = null,
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
  const [bildUrl, setBildUrl] = useState(initialBildUrl || '');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [parsingInstagram, setParsingInstagram] = useState(false);

  // Auto-save to SessionStorage whenever form data changes
  useEffect(() => {
    sessionStorage.setItem('recipe-draft-titel', titel);
    sessionStorage.setItem('recipe-draft-zutaten-json', JSON.stringify(zutaten));
    sessionStorage.setItem('recipe-draft-zubereitung', zubereitung);
    sessionStorage.setItem('recipe-draft-zeit', zeit);
    sessionStorage.setItem('recipe-draft-schwierigkeit', schwierigkeit);
  }, [titel, zutaten, zubereitung, zeit, schwierigkeit]);

  // Parse Instagram Reel caption
  const handleParseInstagram = async () => {
    if (!instagramUrl.trim()) {
      setError('❌ Instagram URL erforderlich');
      return;
    }

    if (!isValidInstagramUrl(instagramUrl)) {
      setError('❌ Ungültige Instagram URL (muss von instagram.com/p/... sein)');
      return;
    }

    setError(null);
    setParsingInstagram(true);

    try {
      // Fetch caption from Instagram
      const caption = await fetchInstagramCaption(instagramUrl);

      if (!caption.trim()) {
        throw new Error('Keine Caption gefunden');
      }

      // Parse caption with Groq
      const parsed = await parseRecipeFromText(caption);

      // Prefill form fields
      if (parsed.titel && !titel.trim()) {
        setTitel(parsed.titel);
      }
      if (parsed.zutaten && parsed.zutaten.length > 0 && zutaten.length === 0) {
        setZutaten(parsed.zutaten);
      }
      if (parsed.zubereitung && !zubereitung.trim()) {
        setZubereitung(parsed.zubereitung);
      }
      if (parsed.zeit && !zeit) {
        setZeit(parsed.zeit.toString());
      }
      if (parsed.schwierigkeit && schwierigkeit === 'mittel') {
        setSchwierigkeit(parsed.schwierigkeit);
      }

      // Clear Instagram URL field
      setInstagramUrl('');
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? `❌ Parse-Fehler: ${err.message}`
          : '❌ Fehler beim Parsen der Caption'
      );
    } finally {
      setParsingInstagram(false);
    }
  };

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

      // Validate menge: no negatives, reasonable max
      const zutatenJson = validZutaten.map((z) => {
        let menge = z.menge;
        if (menge !== null && typeof menge === 'number') {
          if (menge < 0) {
            throw new Error(`❌ Zutat "${z.name.trim()}" hat negative Menge`);
          }
          if (menge > 10000) {
            throw new Error(`❌ Zutat "${z.name.trim()}" hat unrealistische Menge (>10000)`);
          }
        }
        return {
          name: z.name.trim(),
          menge,
          einheit: z.einheit,
          hinweis: z.hinweis,
        };
      });

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
        bild_url: bildUrl || null,
      });

      // Track recipe save
      trackEvent('recipe_saved', {
        source: 'instagram',
        zutatenCount: zutatenJson.length,
        zubereitungCount: zubereitungLines.length,
        hasBild: !!bildUrl,
        schwierigkeit,
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

      {/* Instagram URL Parser */}
      <div className="form-group" style={{ background: '#fff3cd', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ffc107' }}>
        <label htmlFor="instagramUrl" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '13px' }}>
          🎬 Instagram Reel URL (optional)
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            id="instagramUrl"
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="z.B. https://instagram.com/p/ABC123..."
            disabled={parsingInstagram || loading}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={handleParseInstagram}
            disabled={parsingInstagram || loading || !instagramUrl.trim()}
            style={{
              padding: '0.6rem 1rem',
              background: parsingInstagram ? '#ccc' : '#ffc107',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '12px',
              cursor: parsingInstagram || loading ? 'wait' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {parsingInstagram ? '⏳ Parsing...' : '🔍 Parse'}
          </button>
        </div>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '11px', color: '#666' }}>
          Caption wird automatisch geparst und in die Form eingefüllt
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="titel">Titel *</label>
        <input
          id="titel"
          type="text"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="z.B. Pasta Bolognese"
          disabled={loading || parsingInstagram}
        />
      </div>

      <StructuredIngredientForm
        initialZutaten={zutaten}
        onChange={setZutaten}
        disabled={loading}
      />

      {bildUrl && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <img
            src={bildUrl}
            alt="Rezept-Bild"
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '6px',
              marginBottom: '0.5rem',
            }}
            onError={() => setBildUrl('')}
          />
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '11px', color: '#666', wordBreak: 'break-all' }}>
            🖼️ {bildUrl.slice(0, 60)}...
          </p>
          <button
            type="button"
            onClick={() => setBildUrl('')}
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.4rem 0.8rem',
              background: '#ffebee',
              color: '#c33',
              border: '1px solid #ffcdd2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ✕ Bild entfernen
          </button>
        </div>
      )}

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
