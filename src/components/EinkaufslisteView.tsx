import { useState } from 'react';
import { Check, Plus, ShoppingBag, Share2, Trash2 } from 'lucide-react';
import './EinkaufslisteView.css';
import type { ShoppingItem } from '../lib/shoppingList';
import { DayPill } from './DayPill';

type Props = {
  items: ShoppingItem[];
  embedded?: boolean;     // true = inline (z.B. Side-Panel), false = full page
  onClose?: () => void;
};

export function EinkaufslisteView({ items: initialItems, embedded = false, onClose }: Props) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [extraName, setExtraName] = useState('');

  const toggle = (key: string) => {
    setItems(items.map(i => i.key === key ? { ...i, checked: !i.checked } : i));
  };

  const setMenge = (key: string, menge: number) => {
    setItems(items.map(i => i.key === key ? { ...i, menge } : i));
  };

  const remove = (key: string) => {
    setItems(items.filter(i => i.key !== key));
  };

  const addExtra = () => {
    const name = extraName.trim();
    if (!name) return;
    setItems([
      ...items,
      { key: `extra-${Date.now()}`, name, menge: 1, einheit: 'Stk', sources: [], isExtra: true },
    ]);
    setExtraName('');
  };

  const uniqueDays = (item: ShoppingItem): number[] => {
    const set = new Set(item.sources.map(s => s.dayOfWeek));
    return Array.from(set).sort((a, b) => a - b);
  };

  const fromRecipes = items.filter(i => !i.isExtra);
  const extras = items.filter(i => i.isExtra);
  const remaining = items.filter(i => !i.checked).length;

  return (
    <section className={`einkaufsliste ${embedded ? 'is-embedded' : ''}`}>
      <header className="einkaufsliste__header">
        <div>
          <span className="einkaufsliste__eyebrow">
            <ShoppingBag size={14} strokeWidth={1.75} /> Einkaufsliste
          </span>
          <h2>{remaining} Zutaten · diese Woche</h2>
        </div>
        {!embedded && (
          <button className="einkaufsliste__bring">
            <Share2 size={14} strokeWidth={2} /> An Bring exportieren
          </button>
        )}
        {embedded && onClose && (
          <button className="einkaufsliste__close" onClick={onClose} aria-label="Schließen">×</button>
        )}
      </header>

      <div className="einkaufsliste__add">
        <input
          className="einkaufsliste__add-input"
          placeholder="Eigene Zutat hinzufügen…"
          value={extraName}
          onChange={e => setExtraName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addExtra(); }}
        />
        <button className="einkaufsliste__add-btn" onClick={addExtra} aria-label="Hinzufügen">
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="einkaufsliste__group">
        <h3 className="einkaufsliste__group-title">Aus Rezepten</h3>
        <ul className="einkaufsliste__list">
          {fromRecipes.map(item => (
            <li key={item.key} className={`einkaufsliste__item ${item.checked ? 'is-checked' : ''}`}>
              <button
                className="einkaufsliste__check"
                onClick={() => toggle(item.key)}
                aria-label={item.checked ? 'Abhaken aufheben' : 'Abhaken'}
              >
                {item.checked && <Check size={14} strokeWidth={2.5} />}
              </button>
              <span className="einkaufsliste__name">{item.name}</span>
              <span className="einkaufsliste__menge">
                <input
                  className="einkaufsliste__menge-input"
                  type="number"
                  step="0.5"
                  min="0"
                  value={item.menge}
                  onChange={e => setMenge(item.key, parseFloat(e.target.value) || 0)}
                />
                <span className="einkaufsliste__einheit">{item.einheit}</span>
              </span>
              <span className="einkaufsliste__days">
                {uniqueDays(item).map(d => <DayPill key={d} dayOfWeek={d} size="sm" />)}
              </span>
              <span className="einkaufsliste__origin" title={item.sources.map(s => s.recipeTitle).join(', ')}>
                {item.sources.length === 1 ? item.sources[0].recipeTitle : `${item.sources.length} Rezepte`}
              </span>
              <button className="einkaufsliste__remove" onClick={() => remove(item.key)} aria-label="Entfernen">
                <Trash2 size={13} strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {extras.length > 0 && (
        <div className="einkaufsliste__group">
          <h3 className="einkaufsliste__group-title">Extras</h3>
          <ul className="einkaufsliste__list">
            {extras.map(item => (
              <li key={item.key} className={`einkaufsliste__item ${item.checked ? 'is-checked' : ''}`}>
                <button className="einkaufsliste__check" onClick={() => toggle(item.key)}>
                  {item.checked && <Check size={14} strokeWidth={2.5} />}
                </button>
                <span className="einkaufsliste__name">{item.name}</span>
                <span className="einkaufsliste__menge">
                  <input
                    className="einkaufsliste__menge-input"
                    type="number"
                    step="0.5"
                    min="0"
                    value={item.menge}
                    onChange={e => setMenge(item.key, parseFloat(e.target.value) || 0)}
                  />
                  <span className="einkaufsliste__einheit">{item.einheit}</span>
                </span>
                <span className="einkaufsliste__days" />
                <span className="einkaufsliste__origin einkaufsliste__origin--extra">manuell</span>
                <button className="einkaufsliste__remove" onClick={() => remove(item.key)} aria-label="Entfernen">
                  <Trash2 size={13} strokeWidth={1.75} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {embedded && (
        <button className="einkaufsliste__bring einkaufsliste__bring--block">
          <Share2 size={14} strokeWidth={2} /> An Bring exportieren
        </button>
      )}
    </section>
  );
}
