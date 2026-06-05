/**
 * StructuredIngredientForm — Zutaten mit Menge + Einheit bearbeiten.
 * Responsive via CSS (kein JS-Breakpoint), Design-Tokens statt Inline-Styles.
 */

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import './StructuredIngredientForm.css';

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

const COMMON_UNITS = ['g', 'kg', 'ml', 'l', 'EL', 'TL', 'Prise', 'Pck', 'Bund', 'Scheibe'];

export function StructuredIngredientForm({ initialZutaten, onChange, disabled }: StructuredIngredientFormProps) {
  const [zutaten, setZutaten] = useState<Zutat[]>(initialZutaten);
  const [showRawText, setShowRawText] = useState(false);

  const update = (next: Zutat[]) => { setZutaten(next); onChange(next); };

  const handleChange = (index: number, field: keyof Zutat, value: any) => {
    update(zutaten.map((z, i) => i === index ? { ...z, [field]: value } : z));
  };
  const handleAdd = () => update([...zutaten, { name: '', menge: null, einheit: null, hinweis: null }]);
  const handleRemove = (index: number) => update(zutaten.filter((_, i) => i !== index));

  if (showRawText) {
    const textValue = zutaten.map(z =>
      z.menge !== null && z.einheit ? `${z.menge} ${z.einheit} ${z.name}`
        : z.menge !== null ? `${z.menge} ${z.name}` : z.name
    ).join('\n');

    return (
      <div className="sif">
        <div className="sif__head">
          <label className="sif__label" htmlFor="zutaten-raw">Zutaten (Textmodus)</label>
          <button type="button" className="sif__mode" onClick={() => setShowRawText(false)} disabled={disabled}>
            ← Strukturiert
          </button>
        </div>
        <textarea
          id="zutaten-raw"
          className="sif__raw"
          value={textValue}
          onChange={(e) => {
            const lines = e.target.value.split('\n').filter(l => l.trim());
            update(lines.map(line => {
              const match = line.match(/^([\d.]+)\s*([a-zA-Z]+)?\s+(.+)$/);
              return match
                ? { name: match[3], menge: parseFloat(match[1]), einheit: match[2] || null, hinweis: null }
                : { name: line, menge: null, einheit: null, hinweis: null };
            }));
          }}
          placeholder={'400 g Nudeln\n2 EL Olivenöl\nSalz nach Geschmack'}
          rows={6}
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className="sif">
      <div className="sif__head">
        <label className="sif__label">Zutaten *</label>
        <button type="button" className="sif__mode" onClick={() => setShowRawText(true)} disabled={disabled}>
          Textmodus →
        </button>
      </div>

      <div className="sif__rows">
        {zutaten.map((zutat, idx) => (
          <div key={idx} className="sif__row">
            <div className="sif__cell--menge">
              <span className="sif__field-label">Menge</span>
              <input
                type="number" step="0.5" min="0"
                className="sif__input"
                value={zutat.menge ?? ''}
                onChange={(e) => handleChange(idx, 'menge', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="400"
                disabled={disabled}
              />
            </div>
            <div className="sif__cell--einheit">
              <span className="sif__field-label">Einheit</span>
              <input
                type="text" list={`units-${idx}`}
                className="sif__input"
                value={zutat.einheit ?? ''}
                onChange={(e) => handleChange(idx, 'einheit', e.target.value || null)}
                placeholder="g, ml, EL"
                disabled={disabled}
              />
              <datalist id={`units-${idx}`}>
                {COMMON_UNITS.map(u => <option key={u} value={u} />)}
              </datalist>
            </div>
            <div className="sif__cell--name">
              <span className="sif__field-label">Zutat</span>
              <input
                type="text"
                className="sif__input"
                value={zutat.name}
                onChange={(e) => handleChange(idx, 'name', e.target.value)}
                placeholder="Zutatname"
                disabled={disabled}
              />
            </div>
            <button
              type="button"
              className="sif__del"
              onClick={() => handleRemove(idx)}
              disabled={disabled || zutaten.length === 1}
              aria-label="Zutat entfernen"
            >
              <Trash2 size={15} strokeWidth={1.75} />
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="sif__add" onClick={handleAdd} disabled={disabled}>
        <Plus size={15} strokeWidth={2.5} /> Zutat hinzufügen
      </button>
    </div>
  );
}
