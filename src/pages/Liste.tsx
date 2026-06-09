import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import './Liste.css';
import { useAuth } from '../lib/auth';
import {
  isoWeekStart, isoWeekRangeLabel,
  getOrCreateWeekplan, consolidateFromSlots,
  type ShoppingItem,
} from '../lib/weekplan';
import { ZutatIcon } from '../components/ZutatIcon';

const DAY_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

// localStorage: checked Keys pro Datum — nach Tageswechsel automatisch weg
const CHECKED_KEY = 'mahlzeit:liste:checked';
type CheckedStore = { date: string; keys: string[] };

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "2026-06-10"
}

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(CHECKED_KEY);
    if (!raw) return new Set();
    const stored: CheckedStore = JSON.parse(raw);
    // Anderer Tag → frisch starten (auto-clear nach 1 Tag)
    if (stored.date !== todayStr()) {
      localStorage.removeItem(CHECKED_KEY);
      return new Set();
    }
    return new Set(stored.keys);
  } catch {
    return new Set();
  }
}

function saveChecked(keys: string[]) {
  const payload: CheckedStore = { date: todayStr(), keys };
  localStorage.setItem(CHECKED_KEY, JSON.stringify(payload));
}

export function Liste() {
  const auth = useAuth();
  const [weekStart] = useState(() => isoWeekStart(new Date()));
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extraName, setExtraName] = useState('');
  const [checkedOpen, setCheckedOpen] = useState(false);
  const checkedKeysRef = useRef<Set<string>>(loadChecked());
  const checkedSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!auth.profile) return;
      setLoading(true);
      try {
        const wp = await getOrCreateWeekplan(weekStart);
        const list = await consolidateFromSlots(wp.slots);
        if (!cancelled) {
          // Gespeicherte checked-Keys auf geladene Items anwenden
          const saved = loadChecked();
          checkedKeysRef.current = saved;
          setItems(list.map(i => ({ ...i, checked: saved.has(i.key) })));
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler beim Laden');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [weekStart, auth.profile?.id]);

  // Checked-State in localStorage synchron halten
  const applyItems = (next: ShoppingItem[]) => {
    setItems(next);
    saveChecked(next.filter(i => i.checked).map(i => i.key));
  };

  const unchecked = items.filter(i => !i.checked);
  const checked   = items.filter(i => i.checked);
  const remaining = unchecked.length;

  const toggle = (key: string) =>
    applyItems(items.map(i => i.key === key ? { ...i, checked: !i.checked } : i));

  const setMenge = (key: string, raw: string) =>
    applyItems(items.map(i => i.key === key ? { ...i, menge: parseFloat(raw.replace(',', '.')) || 0 } : i));

  const addExtra = () => {
    const name = extraName.trim();
    if (!name) return;
    applyItems([...items, { key: `extra-${Date.now()}`, name, menge: 1, einheit: 'Stk', sources: [], isExtra: true }]);
    setExtraName('');
  };

  const daysOf = (item: ShoppingItem): string =>
    Array.from(new Set(item.sources.map(s => s.dayOfWeek))).sort((a, b) => a - b).map(d => DAY_SHORT[d]).join('·');

  const fmt = (n: number) => Number.isInteger(n) ? String(n) : n.toFixed(1);

  const exportToBring = () => {
    if (unchecked.length === 0) return;
    const payload = unchecked.map(i => ({ n: i.name, m: i.menge, e: i.einheit }));
    const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
    const myUrl = `https://mahlzeit123.vercel.app/api/bring?items=${encoded}`;
    const bringUrl = `https://api.getbring.com/rest/bringrecipes/deeplink?url=${encodeURIComponent(myUrl)}&source=web`;
    window.location.href = bringUrl;
  };

  // Alle offenen Items als eingekauft markieren
  const clearList = () => {
    applyItems(items.map(i => ({ ...i, checked: true })));
  };

  // "Eingekauft"-Bereich aufklappen und dorthin scrollen
  const jumpToChecked = useCallback(() => {
    setCheckedOpen(true);
    setTimeout(() => {
      checkedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50); // kurz warten bis Bereich aufgeklappt ist
  }, []);

  const renderRow = (item: ShoppingItem) => {
    const days = daysOf(item);
    return (
      <div key={item.key} className={`liste__row ${item.checked ? 'is-checked' : ''}`}>
        <button className="liste__check" onClick={() => toggle(item.key)} aria-label={item.checked ? 'Nicht gekauft' : 'Gekauft'}>
          {item.checked && <Check size={14} strokeWidth={3} />}
        </button>
        <span className="liste__name"><ZutatIcon name={item.name} size={16} /> {item.name}</span>
        <span className="liste__qty">
          <input
            className="liste__qty-input"
            type="text"
            inputMode="decimal"
            value={fmt(item.menge)}
            onChange={e => setMenge(item.key, e.target.value)}
            aria-label={`Menge ${item.name}`}
          />
          <span className="liste__einheit">{item.einheit}</span>
        </span>
        <span className="liste__day-pill">{days || (item.isExtra ? 'extra' : '')}</span>
      </div>
    );
  };

  return (
    <div className="liste">
      <header className="liste__top">
        <Link to="/einkauf" className="liste__back"><ArrowLeft size={14} strokeWidth={2} /> Wochenübersicht</Link>
        <div className="liste__top-row">
          <div>
            <span className="liste__eyebrow">Einkaufsliste</span>
            <h1>{isoWeekRangeLabel(weekStart)}</h1>
          </div>
          <button className="liste__bring" onClick={exportToBring} disabled={remaining === 0}>
            <ShoppingCart size={15} strokeWidth={2} /> Bring
          </button>
        </div>
        <div className="liste__counts">
          <span>{remaining} {remaining === 1 ? 'Zutat offen' : 'Zutaten offen'}</span>
          {checked.length > 0 && (
            <button className="liste__counts-done" onClick={jumpToChecked}>
              · {checked.length} eingekauft ↓
            </button>
          )}
        </div>
      </header>

      {error && <div className="liste__error">{error}</div>}
      {loading && <p className="liste__loading">Lade Liste…</p>}

      {!loading && (
        <main className="liste__main">
          <div className="liste__add">
            <input
              className="liste__add-input"
              placeholder="Eigene Zutat hinzufügen…"
              value={extraName}
              onChange={e => setExtraName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addExtra(); }}
            />
            <button className="liste__add-btn" onClick={addExtra} aria-label="Hinzufügen">
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="liste__empty">
              <p>Diese Woche ist nichts geplant.</p>
              <Link to="/plan" className="liste__cta-link">→ Jetzt planen</Link>
            </div>
          ) : (
            <>
              {/* Offene Zutaten */}
              {unchecked.length > 0 && (
                <div className="liste__table">
                  {unchecked.map(renderRow)}
                </div>
              )}

              {/* Eingekauft — aufklappbar */}
              {checked.length > 0 && (
                <div className="liste__checked-section" ref={checkedSectionRef}>
                  <button
                    className={`liste__checked-toggle ${checkedOpen ? 'is-open' : ''}`}
                    onClick={() => setCheckedOpen(o => !o)}
                  >
                    <span>{checked.length} eingekauft</span>
                    <ChevronDown size={16} strokeWidth={2} />
                  </button>
                  {checkedOpen && (
                    <div className="liste__table liste__table--done">
                      {checked.map(renderRow)}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      )}

      {!loading && items.length > 0 && (
        <div className="liste__footer">
          <button className="liste__footer-bring" onClick={exportToBring} disabled={remaining === 0}>
            <ShoppingCart size={18} strokeWidth={2} /> In Bring! importieren
          </button>
          <button className="liste__footer-cta" onClick={clearList} disabled={remaining === 0}>
            <Trash2 size={18} strokeWidth={2} /> Einkaufswagen leeren
          </button>
        </div>
      )}
    </div>
  );
}
