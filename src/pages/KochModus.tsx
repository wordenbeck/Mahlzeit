import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChefHat, Timer, X, Play, Pause, RotateCcw } from 'lucide-react';
import './KochModus.css';
import { getRecipe } from '../lib/recipes';
import { ZutatIcon } from '../components/ZutatIcon';
import type { Recipe } from '../lib/types/recipe';

interface KochSession {
  phase: 1 | 2;
  checkedZutaten: string[];
  currentStep: number;
  startedAt: number | null;
}

function sessionKey(id: string) { return `kochsession_${id}`; }

function loadSession(id: string): KochSession {
  try {
    const raw = localStorage.getItem(sessionKey(id));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { phase: 1, checkedZutaten: [], currentStep: 0, startedAt: null };
}

function saveSession(id: string, s: KochSession) {
  localStorage.setItem(sessionKey(id), JSON.stringify(s));
}

function clearSession(id: string) {
  localStorage.removeItem(sessionKey(id));
}

function formatElapsed(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

function formatCountdown(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

// Erkennt Zeitangaben im Schritt-Text: "5 Minuten", "20 min", "1 Stunde"
function extractMinutes(text: string): number | null {
  const m = text.match(/(\d+)\s*(stund(?:en?)?|std\.?|h\b)/i);
  if (m) return parseInt(m[1]) * 60;
  const m2 = text.match(/(\d+)\s*(min(?:uten?)?\.?)/i);
  if (m2) return parseInt(m2[1]);
  return null;
}

export function KochModus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<KochSession>({ phase: 1, checkedZutaten: [], currentStep: 0, startedAt: null });

  // Stopwatch
  const [elapsed, setElapsed] = useState(0);
  const stopwatchRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown-Timer pro Schritt
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch-Swipe
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!id) return;
    getRecipe(id)
      .then(r => { setRecipe(r); if (r) setSession(loadSession(r.id)); })
      .finally(() => setLoading(false));
  }, [id]);

  // Stopwatch starten wenn Phase 2
  useEffect(() => {
    if (session.phase === 2 && session.startedAt) {
      setElapsed(Date.now() - session.startedAt);
      stopwatchRef.current = setInterval(() => {
        setElapsed(Date.now() - session.startedAt!);
      }, 1000);
    }
    return () => { if (stopwatchRef.current) clearInterval(stopwatchRef.current); };
  }, [session.phase, session.startedAt]);

  // Countdown
  useEffect(() => {
    if (countdownRunning && countdown !== null && countdown > 0) {
      countdownRef.current = setInterval(() => setCountdown(c => (c ?? 1) - 1), 1000);
    } else {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (countdown === 0) setCountdownRunning(false);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [countdownRunning, countdown]);

  const update = (patch: Partial<KochSession>) => {
    const next = { ...session, ...patch };
    setSession(next);
    if (recipe) saveSession(recipe.id, next);
  };

  const toggleZutat = (name: string) => {
    const checked = session.checkedZutaten.includes(name)
      ? session.checkedZutaten.filter(n => n !== name)
      : [...session.checkedZutaten, name];
    update({ checkedZutaten: checked });
  };

  const startKochen = () => {
    update({ phase: 2, currentStep: 0, startedAt: Date.now() });
  };

  const goStep = (delta: number) => {
    if (!recipe) return;
    const next = session.currentStep + delta;
    if (next < 0 || next >= recipe.zubereitung.length) return;
    // Countdown reset beim Schritt-Wechsel
    setCountdown(null);
    setCountdownRunning(false);
    const suggestedMin = extractMinutes(recipe.zubereitung[next]);
    update({ currentStep: next });
    if (suggestedMin) setCountdown(suggestedMin * 60);
  };

  const finishKochen = () => {
    if (recipe) clearSession(recipe.id);
    navigate(`/rezepte/${recipe?.id}`, { state: { cooked: true } });
  };

  const abbrechen = () => {
    navigate(-1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goStep(1);  // swipe left = nächster
      else goStep(-1);         // swipe right = zurück
    }
    touchStartX.current = null;
  };

  if (loading) return <div className="koch"><p className="koch__loading">Lade…</p></div>;
  if (!recipe) return <div className="koch"><p className="koch__loading">Rezept nicht gefunden.</p></div>;

  // Zutaten sortiert: Gewürze (menge==null) nach unten
  const sortedZutaten = [...recipe.zutaten].sort((a, b) => (a.menge == null ? 1 : 0) - (b.menge == null ? 1 : 0));
  const allChecked = sortedZutaten.every(z => session.checkedZutaten.includes(z.name));
  const step = recipe.zubereitung[session.currentStep];
  const isLast = session.currentStep === recipe.zubereitung.length - 1;
  const suggestedMin = step ? extractMinutes(step) : null;

  return (
    <div className="koch">
      <header className="koch__header">
        <button className="koch__back" onClick={abbrechen} aria-label="Zurück">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <div className="koch__header-center">
          <span className="koch__recipe-name">{recipe.titel}</span>
          {session.phase === 2 && (
            <span className="koch__elapsed"><Timer size={13} strokeWidth={2} /> {formatElapsed(elapsed)}</span>
          )}
        </div>
        {session.phase === 2 && (
          <span className="koch__step-count">{session.currentStep + 1} / {recipe.zubereitung.length}</span>
        )}
      </header>

      {/* ── PHASE 1: Zutaten-Check ── */}
      {session.phase === 1 && (
        <div className="koch__phase1">
          <div className="koch__phase1-head">
            <ChefHat size={24} strokeWidth={1.5} />
            <h2>Zutaten bereitstellen</h2>
            <p>{recipe.portionen} Portionen · {recipe.zubereitungszeit_min ? `${recipe.zubereitungszeit_min} Min` : ''}</p>
          </div>
          <ul className="koch__zutaten">
            {sortedZutaten.map((z, i) => {
              const checked = session.checkedZutaten.includes(z.name);
              const mengeText = z.menge != null
                ? `${z.menge}${z.einheit ? ' ' + z.einheit : ''}`
                : 'n.G.';
              return (
                <li
                  key={i}
                  className={`koch__zutat ${checked ? 'is-checked' : ''}`}
                  onClick={() => toggleZutat(z.name)}
                >
                  <span className="koch__zutat-check">
                    {checked && <Check size={16} strokeWidth={3} />}
                  </span>
                  <ZutatIcon name={z.name} size={20} />
                  <span className="koch__zutat-name">{z.name}</span>
                  <span className="koch__zutat-menge">{mengeText}</span>
                </li>
              );
            })}
          </ul>
          <div className="koch__phase1-footer">
            <button
              className="koch__start-btn"
              onClick={startKochen}
            >
              {allChecked ? 'Kochen starten' : 'Trotzdem starten'} <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* ── PHASE 2: Schritt-für-Schritt ── */}
      {session.phase === 2 && (
        <div
          className="koch__phase2"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="koch__body">
            {/* ── Timeline Sidebar: alle Schritte ── */}
            <nav className="koch__timeline" aria-label="Schritte">
              {recipe.zubereitung.map((_, i) => {
                const isDone = i < session.currentStep;
                const isCurrent = i === session.currentStep;
                const isLast = i === recipe.zubereitung.length - 1;
                const dotClass = isDone
                  ? 'koch__tl-dot--done'
                  : isCurrent
                  ? 'koch__tl-dot--current'
                  : 'koch__tl-dot--future';
                return (
                  <div key={i} className="koch__tl-item">
                    <div className={`koch__tl-dot ${dotClass}`}>{i + 1}</div>
                    {!isLast && (
                      <div className={`koch__tl-line ${isDone ? 'koch__tl-line--done' : ''}`} />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ── Schritt-Bereich: vergangen + aktuell + zukünftig ── */}
            <div className="koch__step-area">
              {/* Vergangene Schritte dezent im Hintergrund */}
              {recipe.zubereitung.slice(0, session.currentStep).map((s, i) => (
                <div key={i} className="koch__hist-step">
                  <p>{s}</p>
                </div>
              ))}

              {/* Aktueller Schritt */}
              <div className="koch__step-card">
                <span className="koch__step-badge">{session.currentStep + 1}</span>
                <p className="koch__step-text">{step}</p>

                {/* Timer */}
                {(suggestedMin || countdown !== null) && (
                  <div className="koch__timer">
                    {countdown !== null ? (
                      <div className="koch__countdown">
                        <span className={`koch__countdown-val ${countdown === 0 ? 'is-done' : ''}`}>
                          {countdown === 0 ? '✓ Fertig!' : formatCountdown(countdown)}
                        </span>
                        <div className="koch__countdown-btns">
                          <button className="koch__timer-btn" onClick={() => setCountdownRunning(r => !r)} aria-label={countdownRunning ? 'Pause' : 'Starten'}>
                            {countdownRunning ? <Pause size={16} strokeWidth={2} /> : <Play size={16} strokeWidth={2} />}
                          </button>
                          <button className="koch__timer-btn" onClick={() => { setCountdown(suggestedMin ? suggestedMin * 60 : null); setCountdownRunning(false); }} aria-label="Zurücksetzen">
                            <RotateCcw size={16} strokeWidth={2} />
                          </button>
                          <button className="koch__timer-btn" onClick={() => { setCountdown(null); setCountdownRunning(false); }} aria-label="Schließen">
                            <X size={16} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    ) : suggestedMin ? (
                      <button className="koch__timer-start" onClick={() => { setCountdown(suggestedMin * 60); setCountdownRunning(true); }}>
                        <Timer size={15} strokeWidth={2} /> {suggestedMin} Min Timer starten
                      </button>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Zukünftige Schritte dezent angedeutet */}
              {recipe.zubereitung.slice(session.currentStep + 1).map((s, i) => (
                <div key={i} className="koch__future-step">
                  <p>{s}</p>
                </div>
              ))}

              <div className="koch__step-spacer" />
            </div>
          </div>

          {/* Navigation — gleich groß, Weiter CTA */}
          <div className="koch__nav">
            <button
              className="koch__nav-btn koch__nav-btn--back"
              onClick={() => goStep(-1)}
              disabled={session.currentStep === 0}
            >
              <ArrowLeft size={18} strokeWidth={2} /> Zurück
            </button>

            {isLast ? (
              <button className="koch__nav-btn koch__nav-btn--finish" onClick={finishKochen}>
                <Check size={20} strokeWidth={2.5} /> Fertig!
              </button>
            ) : (
              <button className="koch__nav-btn koch__nav-btn--next" onClick={() => goStep(1)}>
                Weiter <ArrowRight size={20} strokeWidth={2} />
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
