/**
 * StructuredIngredientForm — Edit ingredients with quantity + unit
 * Shows table-like form for menge/einheit/name per ingredient
 */

import { useState } from 'react';

export interface Zutat {
  name: string;
  menge: number | null;
  einheit: string | null;
  hinweis: string | null;
}

interface StructuredIngredientFormProps {
  initialZutaten: Zutat[];
  onChange: (zutaten: Zutat[]) => void;
  disabled?: boolean;
}

export function StructuredIngredientForm({ initialZutaten, onChange, disabled }: StructuredIngredientFormProps) {
  const [zutaten, setZutaten] = useState<Zutat[]>(initialZutaten);
  const [showRawText, setShowRawText] = useState(false);

  const handleChange = (index: number, field: keyof Zutat, value: any) => {
    const updated = [...zutaten];
    updated[index] = { ...updated[index], [field]: value };
    setZutaten(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    const updated = [...zutaten, { name: '', menge: null, einheit: null, hinweis: null }];
    setZutaten(updated);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = zutaten.filter((_, i) => i !== index);
    setZutaten(updated);
    onChange(updated);
  };

  const commonUnits = ['g', 'kg', 'ml', 'l', 'EL', 'TL', 'Prise', 'Pck', 'Bund', 'Scheibe'];

  if (showRawText) {
    // Fallback: Edit as raw text (one per line)
    const textValue = zutaten.map(z => {
      if (z.menge !== null && z.einheit) {
        return `${z.menge} ${z.einheit} ${z.name}`;
      } else if (z.menge !== null) {
        return `${z.menge} ${z.name}`;
      } else {
        return z.name;
      }
    }).join('\n');

    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label htmlFor="zutaten-raw" style={{ fontWeight: '600', fontSize: '14px' }}>
            Zutaten (Textmodus)
          </label>
          <button
            type="button"
            onClick={() => setShowRawText(false)}
            disabled={disabled}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '12px',
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ← Strukturiert
          </button>
        </div>
        <textarea
          id="zutaten-raw"
          value={textValue}
          onChange={(e) => {
            const lines = e.target.value.split('\n').filter(l => l.trim());
            const parsed = lines.map(line => {
              const match = line.match(/^([\d.]+)\s*([a-zA-Z]+)?\s+(.+)$/);
              if (match) {
                return {
                  name: match[3],
                  menge: parseFloat(match[1]),
                  einheit: match[2] || null,
                  hinweis: null,
                };
              }
              return { name: line, menge: null, einheit: null, hinweis: null };
            });
            setZutaten(parsed);
            onChange(parsed);
          }}
          placeholder="400g Nudeln\n2 EL Olivenöl\nSalz nach Geschmack"
          rows={5}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontFamily: 'inherit',
            fontSize: '14px',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ fontWeight: '600', fontSize: '14px' }}>Zutaten (Strukturiert) *</label>
        <button
          type="button"
          onClick={() => setShowRawText(true)}
          disabled={disabled}
          style={{
            padding: '0.4rem 0.8rem',
            fontSize: '12px',
            background: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Textmodus →
        </button>
      </div>

      {/* Table-like structure */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
        {zutaten.map((zutat, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 80px 1fr 30px',
              gap: '0.5rem',
              alignItems: 'center',
              padding: '0.75rem',
              background: '#fafafa',
              borderRadius: '6px',
              border: '1px solid #eee',
            }}
          >
            {/* Menge */}
            <input
              type="number"
              value={zutat.menge ?? ''}
              onChange={(e) => handleChange(idx, 'menge', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="z.B. 400"
              disabled={disabled}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            />

            {/* Einheit */}
            <input
              type="text"
              list={`units-${idx}`}
              value={zutat.einheit ?? ''}
              onChange={(e) => handleChange(idx, 'einheit', e.target.value || null)}
              placeholder="g, ml, EL"
              disabled={disabled}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            />
            <datalist id={`units-${idx}`}>
              {commonUnits.map(u => <option key={u} value={u} />)}
            </datalist>

            {/* Name */}
            <input
              type="text"
              value={zutat.name}
              onChange={(e) => handleChange(idx, 'name', e.target.value)}
              placeholder="Zutatname"
              disabled={disabled}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              disabled={disabled || zutaten.length === 1}
              style={{
                padding: '6px',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        style={{
          marginTop: '1rem',
          padding: '10px 16px',
          background: '#e8f5e9',
          border: '1px solid #c8e6c9',
          color: '#006c49',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        + Zutat hinzufügen
      </button>
    </div>
  );
}
