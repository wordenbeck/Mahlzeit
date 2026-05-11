import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Share2, Trash2, ShoppingBag } from 'lucide-react';
import './Liste.css';
import { useAuth } from '../lib/auth';
import {
  isoWeekStart, isoWeekRangeLabel,
  getOrCreateWeekplan, consolidateFromSlots,
  type ShoppingItem,
} from '../lib/weekplan';
import { ZutatIcon } from '../components/ZutatIcon';

export function Liste() {
  const auth = useAuth();
  const [weekStart] = useState(() => isoWeekStart(new Date()));
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extraName, setExtraName] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!auth.profile) return;
      setLoading(true);
      try {
        const wp = await getOrCreateWeekplan(weekStart);
        const list = await consolidateFromSlots(wp.slots);
        if (!cancelled) setItems(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler beim Laden');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [weekStart, auth.profile?.id]);

  const remaining = items.filter(i => !i.checked).length;
  const fromRecipes = useMemo(() => items.filter(i => !i.isExtra), [items]);
  const extras = useMemo(() => items.filter(i => i.isExtra), [items]);

  const toggle = (key: string) =>
    setItems(items.map(i => i.key === key ? { ...i, checked: !i.checked } : i));

  const remove = (key: string) =>
    setItems(items.filter(i => i.key !== key));

  const setMenge = (key: string, menge: number) =>
    setItems(items.map(i => i.key === key ? { ...i, menge } : i));

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

  const dayShort = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const exportToBring = async () => {
    // Web-Share-API als Bridge: User wählt Bring im iOS-Share-Sheet
    // Format: eine Zutat pro Zeile, "Menge Einheit Name"
    const lines = items
      .filter(i => !i.checked)
      .map(i => {
        const m = Number.isInteger(i.menge) ? i.menge : i.menge.toFixed(1);
        return `${m} ${i.einheit} ${i.name}`;
      });
    const text = `Mahlzeit Einkaufsliste · ${isoWeekRangeLabel(weekStart)}\n\n${lines.join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Einkaufsliste', text });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Liste in Zwischenablage kopiert — füg sie in Bring ein.');
      } catch {
        alert('Web-Share nicht verfügbar. Markier die Liste und kopier sie manuell.');
      }
    }
  };

  return (
    <div className="liste">
      <header className="liste__header">
        <Link to="/einkauf" className="liste__back">
          <ArrowLeft size={14} strokeWidth={2} /> zurück zur Wochenübersicht
        </Link>
        <div>
          <span className="liste__eyebrow">Mahlzeit · Einkaufsliste</span>
          <h1>{isoWeekRangeLabel(weekStart)}</h1>
        </div>
      </header>

      {error && <div className="liste__error">{error}</div>}
      {loading && <p className="liste__loading">Lade Liste…</p>}

      {!loading && (
        <main className="liste__main">
          <section className="liste__card">
            <header className="liste__card-header">
              <div>
                <span className="liste__card-eyebrow">
                  <ShoppingBag size={14} strokeWidth={1.75} /> Einkaufsliste
                </span>
                <h2>{remaining} {remaining === 1 ? 'Zutat' : 'Zutaten'} · diese Woche</h2>
              </div>
              <button
                className="liste__bring"
                onClick={exportToBring}
                disabled={items.filter(i => !i.checked).length === 0}
                title="Öffnet iOS-Share-Sheet — wähle Bring aus"
              >
                <Share2 size={14} strokeWidth={2} /> Teilen / An Bring
              </button>
            </header>

            <div className="liste__add">
              <input
                className="liste__add-input"
                placeholder="Eigene Zutat hinzufügen…"
                value={extraName}
                onChange={e => setExtraName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addExtra(); }}
              />
              <button className="liste__add-btn" onClick={addExtra} aria-label="Hinzufügen">
                <Plus size={16} strokeWidth={2} />
              </button>
            </div>

            {items.length === 0 && (
              <div className="liste__empty">
                <p>Diese Woche ist nichts geplant.</p>
                <Link to="/plan" className="liste__cta-link">→ Jetzt planen</Link>
              </div>
            )}

            {fromRecipes.length > 0 && (
              <div className="liste__group">
                <h3 className="liste__group-title">Aus Rezepten</h3>
                <ul className="liste__list">
                  {fromRecipes.map(item => (
                    <li key={item.key} className={`liste__item ${item.checked ? 'is-checked' : ''}`}>
                      <button className="liste__check" onClick={() => toggle(item.key)}>
                        {item.checked && <Check size={14} strokeWidth={2.5} />}
                      </button>
                      <span className="liste__name">
                        <ZutatIcon name={item.name} size={18} />
                        {item.name}
                      </span>
                      <span className="liste__menge">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={item.menge}
                          onChange={e => setMenge(item.key, parseFloat(e.target.value) || 0)}
                          className="liste__menge-input"
                        />
                        <span className="liste__einheit">{item.einheit}</span>
                      </span>
                      <span className="liste__days">
                        {uniqueDays(item).map(d => (
                          <span key={d} className="liste__day-pill">{dayShort[d]}</span>
                        ))}
                      </span>
                      <span className="liste__origin" title={item.sources.map(s => s.recipeTitle).join(', ')}>
                        {item.sources.length === 1
                          ? item.sources[0].recipeTitle
                          : `${item.sources.length} Rezepte`}
                      </span>
                      <button className="liste__remove" onClick={() => remove(item.key)} aria-label="Entfernen">
                        <Trash2 size={13} strokeWidth={1.75} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {extras.length > 0 && (
              <div className="liste__group">
                <h3 className="liste__group-title">Extras</h3>
                <ul className="liste__list">
                  {extras.map(item => (
                    <li key={item.key} className={`liste__item ${item.checked ? 'is-checked' : ''}`}>
                      <button className="liste__check" onClick={() => toggle(item.key)}>
                        {item.checked && <Check size={14} strokeWidth={2.5} />}
                      </button>
                      <span className="liste__name">
                        <ZutatIcon name={item.name} size={18} />
                        {item.name}
                      </span>
                      <span className="liste__menge">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={item.menge}
                          onChange={e => setMenge(item.key, parseFloat(e.target.value) || 0)}
                          className="liste__menge-input"
                        />
                        <span className="liste__einheit">{item.einheit}</span>
                      </span>
                      <span className="liste__days" />
                      <span className="liste__origin liste__origin--extra">manuell</span>
                      <button className="liste__remove" onClick={() => remove(item.key)} aria-label="Entfernen">
                        <Trash2 size={13} strokeWidth={1.75} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
