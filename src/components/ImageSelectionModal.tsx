/**
 * ImageSelectionModal — Nutzer wählt ein Rezeptbild aus Suchergebnissen.
 * Zeigt grosse Vorschau + Thumbnails. Tokens/Klassen statt Inline-Styles.
 */

import { useState } from 'react';
import { Check, RotateCw, X } from 'lucide-react';
import './ImageSelectionModal.css';

export interface SearchResult {
  url: string;
  thumb: string;
  alt: string;
  source: 'unsplash' | 'openverse';
}

interface ImageSelectionModalProps {
  results: SearchResult[];
  recipeName: string;
  onSelect: (url: string) => void;
  onSkip: () => void;
  onRetry: () => void;
  loading?: boolean;
}

export function ImageSelectionModal({
  results, recipeName, onSelect, onSkip, onRetry, loading,
}: ImageSelectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [preview, setPreview] = useState<SearchResult | null>(results[0] || null);

  if (!results || results.length === 0) {
    return (
      <div className="ism__overlay">
        <div className="ism">
          <h2 className="ism__title">🖼️ Keine Bilder gefunden</h2>
          <p className="ism__sub">Für „{recipeName}" konnten keine passenden Bilder gefunden werden.</p>
          <div className="ism__actions">
            <button className="ism__btn ism__btn--primary" onClick={onRetry} disabled={loading}>
              <RotateCw size={15} /> Nochmal suchen
            </button>
            <button className="ism__btn ism__btn--secondary" onClick={onSkip}>
              <X size={15} /> Überspringen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ism__overlay">
      <div className="ism">
        <h2 className="ism__title">🖼️ Passendes Bild wählen</h2>
        <p className="ism__sub">Wähle eines der Bilder oder überspringen</p>

        {preview && (
          <div className="ism__preview">
            <img
              className="ism__preview-img"
              src={preview.url}
              alt={preview.alt}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="ism__preview-meta">
              <span>📌 {preview.source === 'unsplash' ? 'Unsplash' : 'Openverse'}</span>
              <span>{selectedIndex + 1} / {results.length}</span>
            </div>
          </div>
        )}

        <div className="ism__thumbs">
          {results.map((result, idx) => (
            <button
              key={idx}
              type="button"
              className={`ism__thumb ${selectedIndex === idx ? 'is-active' : ''}`}
              onClick={() => { setSelectedIndex(idx); setPreview(result); }}
              disabled={loading}
            >
              <img
                src={result.thumb}
                alt={result.alt}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </button>
          ))}
        </div>

        <div className="ism__actions">
          <button
            className="ism__btn ism__btn--primary"
            onClick={() => onSelect(preview?.url || results[0].url)}
            disabled={loading || !preview}
          >
            <Check size={15} /> Dieses Bild
          </button>
          <button className="ism__btn ism__btn--secondary" onClick={onRetry} disabled={loading}>
            <RotateCw size={15} /> Andere suchen
          </button>
          <button className="ism__btn ism__btn--secondary" onClick={onSkip}>
            <X size={15} /> Überspringen
          </button>
        </div>
      </div>
    </div>
  );
}
