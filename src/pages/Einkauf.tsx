import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Users, ShoppingBag, CheckCircle2 } from 'lucide-react';
import './Einkauf.css';
import { useAuth } from '../lib/auth';
import {
  isoWeekStart, isoWeekNumber, isoWeekRangeLabel, dayLabelShort, dayLabelLong, shiftWeek,
  getOrCreateWeekplan, setPortionenOverride,
  type WeekplanWithSlots, type Slot,
} from '../lib/weekplan';
import { getRecipe } from '../lib/recipes';
import type { Recipe } from '../lib/types/recipe';
import { ZutatIcon } from '../components/ZutatIcon';
import { useRealtimeReload } from '../lib/realtime';

// Liest aus dem Liste-localStorage die heute abgehakten Zutaten-Keys
function getCheckedKeys(): Set<string> {
  try {
    const raw = localStorage.getItem('mahlzeit:liste:checked');
    if (!raw) return new Set();
    const { date, keys } = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    return date === today ? new Set(keys as string[]) : new Set();
  } catch { return new Set(); }
}

// Prüft ob ein Zutat-Name in den abgehakten Keys steckt (fuzzy: lowercase-Vergleich)
function isIngredientChecked(name: string, checkedKeys: Set<string>): boolean {
  const n = name.toLowerCase().trim();
  for (const k of checkedKeys) {
    if (k.toLowerCase().includes(n) || n.includes(k.toLowerCase().split('-')[0])) return true;
  }
  return false;
}

export function Einkauf() {
  const auth = useAuth();
  const checkedKeys = getCheckedKeys();
  const shoppingDone = checkedKeys.size;
  const [weekStart, setWeekStart] = useState(() => isoWeekStart(new Date()));
  const [weekplan, setWeekplan] = useState<WeekplanWithSlots | null>(null);
  const [recipesById, setRecipesById] = useState<Record<string, Recipe>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const isJumping = useRef(false);

  const load = async () => {
    if (!auth.profile) return;
    setLoading(true);
    try {
      const wp = await getOrCreateWeekplan(weekStart);
      const ids = Array.from(new Set(wp.slots.map(s => s.recipe_id).filter(Boolean) as string[]));
      const recipes = await Promise.all(ids.map(id => getRecipe(id)));
      const map: Record<string, Recipe> = {};
      for (const r of recipes) if (r) map[r.id] = r;
      setWeekplan(wp);
      setRecipesById(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, auth.profile?.id]);

  useRealtimeReload('weekplan_slots', load, !!auth.profile);

  // Tabs: Mo–Fr immer + Wochenende nur falls verplant
  const plannedDaySet = useMemo(
    () => new Set<number>((weekplan?.slots ?? []).map(s => s.day_of_week)),
    [weekplan],
  );
  const tabDays = useMemo(() => {
    const base = [0, 1, 2, 3, 4];
    const weekend = [5, 6].filter(d => plannedDaySet.has(d));
    return [...base, ...weekend];
  }, [plannedDaySet]);
  // Sektionen nur für Tage mit Rezepten
  const days = useMemo(() => [...plannedDaySet].sort((a, b) => a - b), [plannedDaySet]);

  useEffect(() => {
    if (activeDay === null && days.length > 0) setActiveDay(days[0]);
  }, [days, activeDay]);

  const slotsForDay = (day: number): Slot[] =>
    weekplan?.slots.filter(s => s.day_of_week === day) ?? [];

  const dayNum = (d: number) => new Date(new Date(weekStart).getTime() + d * 86400000).getDate();

  // Scroll-Spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (isJumping.current) return;
        const visible = entries.filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const d = Number((visible[0].target as HTMLElement).dataset.day);
          if (!Number.isNaN(d)) setActiveDay(d);
        }
      },
      { rootMargin: '-170px 0px -55% 0px', threshold: 0 },
    );
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [days]);

  const jumpToDay = (d: number) => {
    setActiveDay(d);
    const el = sectionRefs.current[d];
    if (el) {
      isJumping.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => { isJumping.current = false; }, 600);
    }
  };

  const handlePortionen = async (slot: Slot, next: number) => {
    if (!weekplan) return;
    const val = Math.max(1, next);
    setWeekplan({
      ...weekplan,
      slots: weekplan.slots.map(s => s.id === slot.id ? { ...s, portionen_override: val } : s),
    });
    try { await setPortionenOverride(slot.id, val); }
    catch (e) { setError(e instanceof Error ? e.message : 'Konnte nicht speichern.'); }
  };

  const totalSlots = weekplan?.slots.length ?? 0;

  return (
    <div className="ekf">
      <header className="ekf__top">
        <div className="ekf__top-row">
          <span className="ekf__eyebrow">Kalenderwoche {isoWeekNumber(new Date(weekStart))}</span>
          <div className="ekf__weeknav">
            <button className="ekf__nav-btn" onClick={() => setWeekStart(shiftWeek(weekStart, -1))} aria-label="Vorherige Woche"><ChevronLeft size={18} strokeWidth={2} /></button>
            <button className="ekf__nav-btn" onClick={() => setWeekStart(shiftWeek(weekStart, 1))} aria-label="Nächste Woche"><ChevronRight size={18} strokeWidth={2} /></button>
          </div>
        </div>
        <div className="ekf__title-row">
          <h1 className="ekf__title">Einkauf prüfen</h1>
          {shoppingDone > 0 && (
            <span className="ekf__done-badge">
              <CheckCircle2 size={14} strokeWidth={2} /> {shoppingDone} eingekauft
            </span>
          )}
        </div>

        <div className="ekf__tabs" role="tablist">
          {tabDays.map(d => {
            const planned = plannedDaySet.has(d);
            return (
              <button
                key={d}
                className={`ekf__tab ${planned ? 'is-planned' : ''} ${activeDay === d ? 'is-active' : ''}`}
                onClick={() => planned && jumpToDay(d)}
                role="tab"
                aria-selected={activeDay === d}
                disabled={!planned}
              >
                {dayLabelShort(weekStart, d)}<small>{dayNum(d)}.</small>
              </button>
            );
          })}
        </div>
      </header>

      {error && <div className="ekf__error" onClick={() => setError(null)}>{error}</div>}
      {loading && <p className="ekf__loading">Lade Übersicht…</p>}

      {!loading && totalSlots === 0 && (
        <div className="ekf__empty">
          <p>Noch nichts geplant für diese Woche.</p>
          <Link to="/plan" className="ekf__cta">→ Zur Wochenplanung</Link>
        </div>
      )}

      <main className="ekf__sections">
        {days.map(d => (
          <section
            key={d}
            className="ekf__section"
            data-day={d}
            ref={el => { sectionRefs.current[d] = el; }}
          >
            <h2 className="ekf__section-head">{dayLabelLong(weekStart, d)}, {dayNum(d)}.</h2>
            {slotsForDay(d).map(slot => {
              const recipe = slot.recipe_id ? recipesById[slot.recipe_id] : null;
              if (!recipe) return null;
              const portionen = slot.portionen_override ?? recipe.portionen;
              const factor = recipe.portionen > 0 ? portionen / recipe.portionen : 1;
              return (
                <article key={slot.id} className="ekf__rec">
                  <header className="ekf__rec-head">
                    <Link to={`/rezepte/${recipe.id}`} className="ekf__rec-title">{recipe.titel}</Link>
                    <div className="ekf__port" aria-label="Portionen">
                      <button className="ekf__port-btn" onClick={() => handlePortionen(slot, portionen - 1)} aria-label="Weniger"><Minus size={13} strokeWidth={2.5} /></button>
                      <span className="ekf__port-val"><Users size={12} strokeWidth={2} /> {portionen}</span>
                      <button className="ekf__port-btn" onClick={() => handlePortionen(slot, portionen + 1)} aria-label="Mehr"><Plus size={13} strokeWidth={2.5} /></button>
                    </div>
                  </header>
                  <ul className="ekf__ing">
                    {recipe.zutaten.map((z, i) => {
                      const menge = z.menge != null ? Math.round(z.menge * factor * 10) / 10 : null;
                      const checked = shoppingDone > 0 && isIngredientChecked(z.name, checkedKeys);
                      return (
                        <li key={i} className={`ekf__ing-row ${checked ? 'is-checked' : ''}`}>
                          <span className="ekf__ing-name"><ZutatIcon name={z.name} size={15} /> {z.name}</span>
                          <span className="ekf__ing-qty">{menge != null ? `${menge} ${z.einheit ?? ''}` : (z.einheit || 'n. Geschm.')}</span>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </section>
        ))}
      </main>

      {totalSlots > 0 && (
        <div className="ekf__footer">
          <Link to="/liste" className={`ekf__footer-cta ${shoppingDone > 0 ? 'is-done' : ''}`}>
            <ShoppingBag size={18} strokeWidth={2} />
            {shoppingDone > 0 ? 'Einkauf erledigt' : 'Zur Einkaufsliste'}
          </Link>
        </div>
      )}
    </div>
  );
}
