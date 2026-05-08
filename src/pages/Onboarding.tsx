import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Users, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { MahlzeitLogo } from '../components/MahlzeitLogo';
import './Onboarding.css';
import { createWorkspace, joinWorkspaceByCode, lookupWorkspaceByCode } from '../lib/workspace';
import { useAuth } from '../lib/auth';

type Step = 'name' | 'choice' | 'create' | 'join';

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

  if (!auth.configured) {
    return (
      <div className="onboarding">
        <div className="onboarding__card onboarding__card--warn">
          <AlertTriangle size={32} strokeWidth={1.75} />
          <h2>Setup nicht abgeschlossen</h2>
          <p>
            Die App kann keine Verbindung zu Supabase herstellen. Trag
            <code> VITE_SUPABASE_URL </code> und <code> VITE_SUPABASE_ANON_KEY </code>
            in <code>.env.local</code> ein und starte den Dev-Server neu. Details: <code>SETUP.md</code>.
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
      navigate('/', { replace: true });
      window.location.reload();
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
      navigate('/', { replace: true });
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Beitritt fehlgeschlagen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="onboarding">
      <header className="onboarding__brand">
        <span className="onboarding__logo"><MahlzeitLogo size={24} /></span>
        <span>Mahlzeit</span>
      </header>

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
            <p className="onboarding__lead">Gib den 6-stelligen Code ein, den dir jemand geschickt hat.</p>
            <label className="onboarding__field">
              <span>Workspace-Code</span>
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onBlur={handleLookup}
                placeholder="KOCH-42"
                maxLength={7}
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
              {submitting ? 'Trete bei…' : `Beitreten`} <ArrowRight size={16} strokeWidth={2} />
            </button>
            {!foundWorkspaceName && code.trim() && (
              <button className="onboarding__secondary" onClick={handleLookup}>
                Code prüfen
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
