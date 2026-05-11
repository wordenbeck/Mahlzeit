import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Users, ArrowRight, ArrowLeft, AlertTriangle, Check, PartyPopper } from 'lucide-react';
import { MahlzeitLogo } from '../components/MahlzeitLogo';
import './Onboarding.css';
import { createWorkspace, joinWorkspaceByCode, lookupWorkspaceByCode } from '../lib/workspace';
import { useAuth } from '../lib/auth';

type Step = 'name' | 'choice' | 'create' | 'join' | 'success';

const stepIndex = (s: Step): number => {
  if (s === 'name') return 1;
  if (s === 'success') return 3;
  return 2; // choice / create / join
};

function StepIndicator({ current }: { current: Step }) {
  const idx = stepIndex(current);
  const steps = [
    { n: 1, label: 'Dein Name' },
    { n: 2, label: 'Haushalt' },
    { n: 3, label: "Los geht's" },
  ];
  return (
    <div className="onboarding__steps" aria-label="Onboarding-Fortschritt">
      {steps.map((s, i) => {
        const isActive = idx === s.n;
        const isDone = idx > s.n;
        return (
          <span key={s.n} className="onboarding__step-wrap">
            <span className={`onboarding__step ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}>
              <span className="onboarding__step-num">
                {isDone ? <Check size={11} strokeWidth={3} /> : s.n}
              </span>
              <span className="onboarding__step-label">{s.label}</span>
            </span>
            {i < steps.length - 1 && (
              <span className={`onboarding__step-line ${idx > s.n ? 'is-passed' : ''}`} />
            )}
          </span>
        );
      })}
    </div>
  );
}

export function Onboarding() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const prefilledCode = params.get('code') ?? '';

  const [step, setStep] = useState<Step>('name');
  const [displayName, setDisplayName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [code, setCode] = useState(prefilledCode);
  const [foundWorkspaceName, setFoundWorkspaceName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successPayload, setSuccessPayload] = useState<{ workspace: string; isNew: boolean } | null>(null);

  // Nach Success: 1.6s zeigen, dann redirect
  useEffect(() => {
    if (step !== 'success') return;
    const t = setTimeout(() => {
      navigate('/', { replace: true });
      window.location.reload();
    }, 1800);
    return () => clearTimeout(t);
  }, [step, navigate]);

  if (!auth.configured) {
    return (
      <div className="onboarding">
        <div className="onboarding__card onboarding__card--warn">
          <AlertTriangle size={32} strokeWidth={1.75} />
          <h2>Setup nicht abgeschlossen</h2>
          <p>
            Die App kann keine Verbindung zu Supabase herstellen. Trag
            <code> VITE_SUPABASE_URL </code> und <code> VITE_SUPABASE_ANON_KEY </code>
            in <code>.env.local</code> ein und starte den Dev-Server neu.
          </p>
        </div>
      </div>
    );
  }

  if (auth.loading) {
    return <div className="onboarding"><div className="onboarding__card"><p>Lade…</p></div></div>;
  }

  const handleCreate = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await createWorkspace(workspaceName.trim(), displayName.trim());
      setSuccessPayload({ workspace: workspaceName.trim(), isNew: true });
      setStep('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konnte Haushalt nicht anlegen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async () => {
    setError(null);
    setFoundWorkspaceName(null);
    if (!code.trim()) return;
    try {
      const ws = await lookupWorkspaceByCode(code);
      if (!ws) {
        setError('Code nicht gefunden. Tippfehler?');
        return;
      }
      setFoundWorkspaceName(ws.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lookup fehlgeschlagen.');
    }
  };

  const handleJoin = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await joinWorkspaceByCode(code, displayName.trim());
      setSuccessPayload({ workspace: foundWorkspaceName ?? '', isNew: false });
      setStep('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beitritt fehlgeschlagen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="onboarding">
      <div className="onboarding__blob onboarding__blob--a" aria-hidden />
      <div className="onboarding__blob onboarding__blob--b" aria-hidden />

      <header className="onboarding__brand">
        <span className="onboarding__logo"><MahlzeitLogo size={24} /></span>
        <span>Mahlzeit</span>
      </header>

      <StepIndicator current={step} />

      <main className="onboarding__card">
        {step === 'name' && (
          <>
            <h1>Willkommen 👋</h1>
            <p className="onboarding__lead">
              Mahlzeit ist deine Wochen-Mealplanning-App. Kein Login nötig — sag uns nur, wie du heißt.
            </p>
            <label className="onboarding__field">
              <span>Dein Name</span>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="z.B. Thomas"
                autoFocus
              />
            </label>
            <button
              className="onboarding__cta"
              disabled={!displayName.trim()}
              onClick={() => setStep(prefilledCode ? 'join' : 'choice')}
            >
              Weiter <ArrowRight size={16} strokeWidth={2} />
            </button>
          </>
        )}

        {step === 'choice' && (
          <>
            <button className="onboarding__back" onClick={() => setStep('name')}>
              <ArrowLeft size={14} strokeWidth={2} /> zurück
            </button>
            <h1>Hi {displayName}!</h1>
            <p className="onboarding__lead">Hast du schon einen Haushalt, oder legen wir einen neuen an?</p>

            <div className="onboarding__choice">
              <button className="onboarding__choice-card" onClick={() => setStep('create')}>
                <ChefHat size={28} strokeWidth={1.75} />
                <strong>Neuen Haushalt anlegen</strong>
                <span>Du startest frisch und bekommst einen Code, den deine Familie eintippen kann.</span>
              </button>
              <button className="onboarding__choice-card" onClick={() => setStep('join')}>
                <Users size={28} strokeWidth={1.75} />
                <strong>Bestehendem beitreten</strong>
                <span>Jemand aus deiner Familie hat dir einen Code gegeben.</span>
              </button>
            </div>
          </>
        )}

        {step === 'create' && (
          <>
            <button className="onboarding__back" onClick={() => setStep('choice')}>
              <ArrowLeft size={14} strokeWidth={2} /> zurück
            </button>
            <h1>Neuer Haushalt</h1>
            <p className="onboarding__lead">Wie soll euer Haushalt heißen?</p>
            <label className="onboarding__field">
              <span>Haushalts-Name</span>
              <input
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                placeholder="z.B. Familie Wordenbeck"
                autoFocus
              />
            </label>
            {error && <div className="onboarding__error">{error}</div>}
            <button
              className="onboarding__cta"
              disabled={!workspaceName.trim() || submitting}
              onClick={handleCreate}
            >
              {submitting ? 'Lege an…' : 'Haushalt anlegen'} <ArrowRight size={16} strokeWidth={2} />
            </button>
          </>
        )}

        {step === 'join' && (
          <>
            <button className="onboarding__back" onClick={() => setStep(prefilledCode ? 'name' : 'choice')}>
              <ArrowLeft size={14} strokeWidth={2} /> zurück
            </button>
            <h1>Beitreten</h1>
            <p className="onboarding__lead">Gib den 4-stelligen Code ein, den dir jemand geschickt hat.</p>
            <label className="onboarding__field">
              <span>Workspace-Code</span>
              <input
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                onBlur={handleLookup}
                placeholder="0000"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoFocus
                className="onboarding__code-input"
              />
            </label>
            {foundWorkspaceName && (
              <div className="onboarding__found">
                Gefunden: <strong>{foundWorkspaceName}</strong>
              </div>
            )}
            {error && <div className="onboarding__error">{error}</div>}
            <button
              className="onboarding__cta"
              disabled={!code.trim() || !foundWorkspaceName || submitting}
              onClick={handleJoin}
            >
              {submitting ? 'Trete bei…' : 'Beitreten'} <ArrowRight size={16} strokeWidth={2} />
            </button>
            {!foundWorkspaceName && code.trim() && (
              <button className="onboarding__secondary" onClick={handleLookup}>
                Code prüfen
              </button>
            )}
          </>
        )}

        {step === 'success' && successPayload && (
          <div className="onboarding__success">
            <span className="onboarding__success-icon">
              <PartyPopper size={56} strokeWidth={1.75} />
            </span>
            <h1>{successPayload.isNew ? 'Haushalt angelegt!' : 'Willkommen!'}</h1>
            <p className="onboarding__lead">
              {successPayload.isNew
                ? <>„{successPayload.workspace}" ist bereit. Es kann losgehen, {displayName}.</>
                : <>Du bist jetzt Teil von „{successPayload.workspace}", {displayName}.</>
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
