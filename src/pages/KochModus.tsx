import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Timer, X, Play, Pause, RotateCcw, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import './KochModus.css';
import { getRecipe } from '../lib/recipes';
import { ZutatIcon } from '../components/ZutatIcon';
import type { Recipe } from '../lib/types/recipe';

interface KochSession {
  currentStep: number;
  startedAt: number | null;
}

function sessionKey(id: string) { return `kochsession_${id}`; }
function loadSession(id: string): KochSession {
  try { const r = localStorage.getItem(sessionKey(id)); if (r) return JSON.parse(r); } catch { /* ignore */ }
  return { currentStep: 0, startedAt: null };
}
function saveSession(id: string, s: KochSession) { localStorage.setItem(sessionKey(id), JSON.stringify(s)); }
function clearSession(id: string) { localStorage.removeItem(sessionKey(id)); }

function formatElapsed(ms: number) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}
function formatCountdown(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function extractMinutes(text: string): number | null {
  const h = text.match(/(\d+)\s*(stund(?:en?)?|std\.?|h\b)/i);
  if (h) return parseInt(h[1]) * 60;
  const m = text.match(/(\d+)\s*(min(?:uten?)?\.?)/i);
  if (m) return parseInt(m[1]);
  return null;
}

export function KochModus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<KochSession>({ currentStep: 0, startedAt: null });

  // Dark mode toggle — gespeichert in localStorage
  const [dark, setDark] = useState(() => localStorage.getItem('koch-dark') !== 'false');
  const toggleDark = () => setDark(d => { localStorage.setItem('koch-dark', String(!d)); return !d; });

  // Zutaten auf-/zugeklappt
  const [zutatenOpen, setZutatenOpen] = useState(false);

  // Stopwatch
  const [elapsed, setElapsed] = useState(0);
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch-Swipe
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!id) return;
    getRecipe(id).then(r => {
      setRecipe(r);
      if (r) {
        const saved = loadSession(r.id);
        setSession({ currentStep: saved.currentStep, startedAt: saved.startedAt ?? Date.now() });
      }
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (session.startedAt) {
      setElapsed(Date.now() - session.startedAt);
      swRef.current = setInterval(() => setElapsed(Date.now() - session.startedAt!), 1000);
    }
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [session.startedAt]);

  useEffect(() => {
    if (countdownRunning && countdown !== null && countdown > 0) {
      cdRef.current = setInterval(() => setCountdown(c => (c ?? 1) - 1), 1000);
    } else {
      if (cdRef.current) clearInterval(cdRef.current);
      if (countdown === 0) setCountdownRunning(false);
    }
    return () => { if (cdRef.current) clearInterval(cdRef.current); };
  }, [countdownRunning, countdown]);

  const update = (patch: Partial<KochSession>) => {
    const next = { ...session, ...patch };
    setSession(next);
    if (recipe) saveSession(recipe.id, next);
  };

  const goStep = (delta: number) => {
    if (!recipe) return;
    const next = session.currentStep + delta;
    if (next < 0 || next >= recipe.zubereitung.length) return;
    setCountdown(null);
    setCountdownRunning(false);
    const min = extractMinutes(recipe.zubereitung[next]);
    update({ currentStep: next });
    if (min) setCountdown(min * 60);
  };

  const finishKochen = () => {
    if (recipe) clearSession(recipe.id);
    navigate(`/rezepte/${recipe?.id}`, { state: { cooked: true } });
  };

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) dx < 0 ? goStep(1) : goStep(-1);
    touchStartX.current = null;
  };

  if (loading) return <div className="koch"><p className="koch__loading">Lade…</p></div>;
  if (!recipe) return <div className="koch"><p className="koch__loading">Rezept nicht gefunden.</p></div>;

  const step = recipe.zubereitung[session.currentStep];
  const isLast = session.currentStep === recipe.zubereitung.length - 1;
  const suggestedMin = step ? extractMinutes(step) : null;
  const sortedZutaten = [...recipe.zutaten].sort((a, b) => (a.menge == null ? 1 : 0) - (b.menge == null ? 1 : 0));

  return (
    <div className={`koch ${dark ? 'koch--dark' : 'koch--light'}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* Header */}
      <header className="koch__header">
        <button className="koch__back" onClick={() => navigate(-1)} aria-label="Zurück">
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div className="koch__header-center">
          <span className="koch__recipe-name">{recipe.titel}</span>
          <span className="koch__elapsed"><Timer size={12} strokeWidth={2} /> {formatElapsed(elapsed)}</span>
        </div>
        <span className="koch__step-count">{session.currentStep + 1} / {recipe.zubereitung.length}</span>
        <button className="koch__dark-toggle" onClick={toggleDark} aria-label="Dark Mode umschalten">
          {dark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
        </button>
      </header>

      {/* Body: Timeline + Schritte */}
      <div className="koch__body">

        {/* Timeline Sidebar */}
        <nav className="koch__timeline">
          {recipe.zubereitung.map((_, i) => {
            const isDone = i < session.currentStep;
            const isCurrent = i === session.currentStep;
            return (
              <div key={i} className="koch__tl-item">
                <div className={`koch__tl-dot ${isDone ? 'koch__tl-dot--done' : isCurrent ? 'koch__tl-dot--current' : 'koch__tl-dot--future'}`}>
                  {isDone ? <Check size={11} strokeWidth={3} /> : i + 1}
                </div>
                {i < recipe.zubereitung.length - 1 && (
                  <div className={`koch__tl-line ${isDone ? 'koch__tl-line--done' : ''}`} />
                )}
              </div>
            );
          })}
        </nav>

        {/* Schritt-Bereich — scrollbar, endet vor Nav */}
        <div className="koch__step-area">

          {/* Zutaten aufklappbar */}
          <button className="koch__zutaten-toggle" onClick={() => setZutatenOpen(o => !o)}>
            <span>Zutaten ({sortedZutaten.length})</span>
            {zutatenOpen ? <ChevronUp size={15} strokeWidth={2} /> : <ChevronDown size={15} strokeWidth={2} />}
          </button>
          {zutatenOpen && (
            <ul className="koch__zutaten-list">
              {sortedZutaten.map((z, i) => (
                <li key={i} className="koch__zutat-row">
                  <ZutatIcon name={z.name} size={15} />
                  <span className="koch__zutat-name">{z.name}</span>
                  <span className="koch__zutat-menge">
                    {z.menge != null ? `${z.menge}${z.einheit ? ' ' + z.einheit : ''}` : 'n.G.'}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Vergangene Schritte */}
          {recipe.zubereitung.slice(0, session.currentStep).map((s, i) => (
            <div key={i} className="koch__hist-step"><p>{s}</p></div>
          ))}

          {/* Aktiver Schritt */}
          <div className="koch__step-card">
            <span className="koch__step-badge">{session.currentStep + 1}</span>
            <p className="koch__step-text">{step}</p>

            {(suggestedMin || countdown !== null) && (
              <div className="koch__timer">
                {countdown !== null ? (
                  <div className="koch__countdown">
                    <span className={`koch__countdown-val ${countdown === 0 ? 'is-done' : ''}`}>
                      {countdown === 0 ? '✓ Fertig!' : formatCountdown(countdown)}
                    </span>
                    <div className="koch__countdown-btns">
                      <button className="koch__timer-btn" onClick={() => setCountdownRunning(r => !r)}>
                        {countdownRunning ? <Pause size={15} strokeWidth={2} /> : <Play size={15} strokeWidth={2} />}
                      </button>
                      <button className="koch__timer-btn" onClick={() => { setCountdown(suggestedMin ? suggestedMin * 60 : null); setCountdownRunning(false); }}>
                        <RotateCcw size={15} strokeWidth={2} />
                      </button>
                      <button className="koch__timer-btn" onClick={() => { setCountdown(null); setCountdownRunning(false); }}>
                        <X size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="koch__timer-start" onClick={() => { setCountdown(suggestedMin! * 60); setCountdownRunning(true); }}>
                    <Timer size={14} strokeWidth={2} /> {suggestedMin} Min Timer starten
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Zukünftige Schritte */}
          {recipe.zubereitung.slice(session.currentStep + 1).map((s, i) => (
            <div key={i} className="koch__future-step"><p>{s}</p></div>
          ))}

          <div className="koch__step-spacer" />
        </div>
      </div>

      {/* Navigation — immer sichtbar, außerhalb des Scrollbereichs */}
      <div className="koch__nav">
        <button className="koch__nav-btn koch__nav-btn--back" onClick={() => goStep(-1)} disabled={session.currentStep === 0}>
          <ArrowLeft size={18} strokeWidth={2} /> Zurück
        </button>
        {isLast ? (
          <button className="koch__nav-btn koch__nav-btn--finish" onClick={finishKochen}>
            <Check size={18} strokeWidth={2.5} /> Fertig!
          </button>
        ) : (
          <button className="koch__nav-btn koch__nav-btn--next" onClick={() => goStep(1)}>
            Weiter <ArrowRight size={18} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
