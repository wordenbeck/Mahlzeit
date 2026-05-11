import { useState } from 'react';
import { ArrowLeft, Check, Copy, Share2, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

export function Profile() {
  const auth = useAuth();
  const [copied, setCopied] = useState<string | null>(null);

  if (!auth.profile || !auth.workspace) {
    return (
      <div className="profile">
        <Link to="/" className="profile__back">
          <ArrowLeft size={14} strokeWidth={2} /> zurück
        </Link>
        <p style={{ padding: 32, textAlign: 'center' }}>Lade Profil…</p>
      </div>
    );
  }

  const code = auth.workspace.code;
  const joinLink = `${window.location.origin}/join/${encodeURIComponent(code)}`;

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard kann blockiert sein — silently fail
    }
  };

  const shareViaSystem = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mahlzeit · Beitritt',
          text: `Tritt unserem Haushalt „${auth.workspace!.name}" bei`,
          url: joinLink,
        });
      } catch {
        // User hat abgebrochen, ignorieren
      }
    } else {
      copy(joinLink, 'share');
    }
  };

  const signOut = async () => {
    if (!confirm('Wirklich abmelden? Du musst dich danach neu mit dem Workspace-Code anmelden.')) return;
    await supabase.auth.signOut();
    window.location.href = '/onboarding';
  };

  return (
    <div className="profile">
      <Link to="/" className="profile__back">
        <ArrowLeft size={14} strokeWidth={2} /> zurück
      </Link>

      <header className="profile__hero">
        <div
          className="profile__avatar"
          style={{ background: `var(${auth.profile.color})` }}
        >
          {auth.profile.display_name[0]?.toUpperCase()}
        </div>
        <h1>{auth.profile.display_name}</h1>
      </header>

      <section className="profile__card">
        <span className="profile__card-eyebrow">Haushalt</span>
        <h2>{auth.workspace.name}</h2>

        <div className="profile__code-block">
          <span className="profile__code-label">Haushalts-Code</span>
          <div className="profile__code-row">
            <code className="profile__code">{code}</code>
            <button
              className="profile__copy-btn"
              onClick={() => copy(code, 'code')}
              aria-label="Code kopieren"
            >
              {copied === 'code' ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={1.75} />}
            </button>
          </div>
          <small>Für andere zum Beitritt. Tippen sie diesen Code beim Onboarding ein.</small>
        </div>

        <div className="profile__code-block">
          <span className="profile__code-label">Beitritts-Link</span>
          <div className="profile__code-row">
            <code className="profile__code profile__code--link">{joinLink}</code>
            <button
              className="profile__copy-btn"
              onClick={() => copy(joinLink, 'link')}
              aria-label="Link kopieren"
            >
              {copied === 'link' ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={1.75} />}
            </button>
          </div>
          <small>Klick öffnet das Onboarding direkt mit dem Code.</small>
        </div>

        <button className="profile__share" onClick={shareViaSystem}>
          <Share2 size={16} strokeWidth={2} />
          {copied === 'share' ? 'Link kopiert' : 'Teilen'}
        </button>
      </section>

      <section className="profile__danger">
        <button className="profile__signout" onClick={signOut}>
          <LogOut size={14} strokeWidth={1.75} />
          Abmelden
        </button>
        <small>
          Achtung: ohne Workspace-Code kommst du danach nicht zurück. Code abspeichern!
        </small>
      </section>
    </div>
  );
}
