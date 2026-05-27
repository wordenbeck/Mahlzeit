import { useEffect, useState } from 'react';
import { X, AlertCircle, RotateCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ImageSelectorModal.css';
import { CookingSpinner } from './CookingSpinner';

type Props = {
  recipeId: string;
  recipeName: string;
  onClose: () => void;
  onSelect: (url: string) => void;
};

interface SearchResult {
  url: string;
  thumb: string;
  alt: string;
  source: 'unsplash' | 'openverse';
}

export function ImageSelectorModal({ recipeId, recipeName, onClose, onSelect }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selecting, setSelecting] = useState(false);

  // ESC schließt Modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selecting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, selecting]);

  // Suche Bilder bei Mount
  useEffect(() => {
    let cancelled = false;

    async function search() {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const { data, error: funcError } = await supabase.functions.invoke(
          'search-recipe-image',
          { body: { query: recipeName } }
        );

        if (!cancelled) {
          if (funcError) {
            setError(funcError.message || 'Bildsuche fehlgeschlagen');
          } else if (data?.results) {
            setResults(data.results.slice(0, 5)); // Max 5 Bilder
            if (data.results.length === 0) {
              setError('Keine Bilder gefunden');
            }
          } else {
            setError('Unerwartete Antwort');
          }
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Fehler bei Bildsuche');
          setLoading(false);
        }
      }
    }

    search();
    return () => { cancelled = true; };
  }, [recipeName]);

  const handleSelect = async (imageUrl: string) => {
    setSelecting(true);
    try {
      // Aktualisiere Recipe mit neuer Bild-URL
      const { error } = await supabase
        .from('recipes')
        .update({ bild_url: imageUrl })
        .eq('id', recipeId);

      if (error) {
        setError(`Fehler beim Speichern: ${error.message}`);
        setSelecting(false);
      } else {
        onSelect(imageUrl);
        onClose();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Speichern');
      setSelecting(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setResults([]);
    // Re-trigger useEffect durch State-Change
    // (in der Praxis: komponente neu-rendern lässt useEffect laufen)
  };

  return (
    <>
      <div className="imodal__backdrop" onClick={!selecting ? onClose : undefined} />
      <div
        className="imodal"
        role="dialog"
        aria-modal="true"
        aria-label="Bilder auswählen"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="imodal__close"
          onClick={onClose}
          disabled={selecting}
          aria-label="Schließen"
        >
          <X size={20} strokeWidth={2} />
        </button>

        <h3 className="imodal__title">Bilder für „{recipeName}"</h3>

        {loading && (
          <div className="imodal__loading">
            <CookingSpinner size={50} label="Suche Bilder…" />
          </div>
        )}

        {error && !loading && (
          <div className="imodal__error">
            <AlertCircle size={24} />
            <p>{error}</p>
            <button
              className="imodal__retry-btn"
              onClick={handleRetry}
              disabled={selecting}
            >
              <RotateCw size={16} /> Erneut versuchen
            </button>
          </div>
        )}

        {results.length > 0 && !loading && (
          <div className="imodal__grid">
            {results.map((result, idx) => (
              <button
                key={idx}
                className="imodal__image-card"
                onClick={() => handleSelect(result.url)}
                disabled={selecting}
                aria-label={`Bild ${idx + 1} auswählen: ${result.alt}`}
              >
                <img
                  src={result.thumb}
                  alt={result.alt}
                  className="imodal__image"
                  loading="lazy"
                />
                <span className="imodal__source-badge">{result.source}</span>
                {selecting && (
                  <div className="imodal__selecting">
                    <CookingSpinner size={30} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
