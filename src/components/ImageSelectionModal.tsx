/**
 * ImageSelectionModal — Let user pick recipe image from search results
 * Shows 3-5 thumbnails, user selects one or skips
 */

import { useState } from 'react';

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
  results,
  recipeName,
  onSelect,
  onSkip,
  onRetry,
  loading,
}: ImageSelectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [preview, setPreview] = useState<SearchResult | null>(results[0] || null);

  if (!results || results.length === 0) {
    return (
      <div style={{ overlay }}>
        <div style={modalContent}>
          <h2 style={{ marginTop: 0 }}>🖼️ Keine Bilder gefunden</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Für "{recipeName}" konnten keine passenden Bilder gefunden werden.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={onRetry} disabled={loading} style={btnPrimary}>
              🔄 Nochmal suchen
            </button>
            <button onClick={onSkip} style={btnSecondary}>
              ✕ Überspringen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay}>
      <div style={{ ...modalContent, maxWidth: '600px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>🖼️ Passendes Bild wählen</h2>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '1.5rem' }}>
          Wähle eines der Bilder oder überspringen
        </p>

        {/* Large Preview */}
        {preview && (
          <div style={{ marginBottom: '1.5rem' }}>
            <img
              src={preview.url}
              alt={preview.alt}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid #ddd',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#999' }}>
                📌 {preview.source === 'unsplash' ? 'Unsplash' : 'Openverse'}
              </span>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {selectedIndex + 1} / {results.length}
              </span>
            </div>
          </div>
        )}

        {/* Thumbnail Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {results.map((result, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIndex(idx);
                setPreview(result);
              }}
              disabled={loading}
              style={{
                padding: 0,
                border: selectedIndex === idx ? '3px solid #006c49' : '2px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'none',
                transition: 'border 0.2s',
              }}
            >
              <img
                src={result.thumb}
                alt={result.alt}
                style={{
                  width: '100%',
                  height: '80px',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelect(preview?.url || results[0].url)}
            disabled={loading || !preview}
            style={{ ...btnPrimary, flex: 1, minWidth: '120px' }}
          >
            ✅ Dieses Bild
          </button>
          <button onClick={onRetry} disabled={loading} style={{ ...btnSecondary, flex: 1, minWidth: '120px' }}>
            🔄 Andere suchen
          </button>
          <button onClick={onSkip} style={{ ...btnSecondary, flex: 1, minWidth: '120px' }}>
            ✕ Überspringen
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
};

const modalContent = {
  background: 'white',
  borderRadius: '12px',
  padding: '2rem',
  maxWidth: '500px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  maxHeight: '90vh',
  overflow: 'auto' as const,
};

const btnPrimary = {
  padding: '10px 16px',
  background: '#006c49',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer' as const,
  fontWeight: '600' as const,
  fontSize: '14px',
  transition: 'opacity 0.2s',
};

const btnSecondary = {
  padding: '10px 16px',
  background: '#f0f0f0',
  color: '#333',
  border: '1px solid #ddd',
  borderRadius: '6px',
  cursor: 'pointer' as const,
  fontWeight: '600' as const,
  fontSize: '14px',
  transition: 'opacity 0.2s',
};
