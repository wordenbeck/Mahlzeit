import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Copy, Share2, LogOut, Pencil, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import './Profile.css';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { listMembers, updateDisplayName, type Member } from '../lib/members';

const PROFILE_COLORS = [
  '--profile-amber',
  '--profile-rose',
  '--profile-sage',
  '--profile-sky',
  '--profile-lavender',
  '--profile-ochre',
];

export function Profile() {
  const auth = useAuth();
  const [copied, setCopied] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [savingName, setSavingName] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!auth.workspace) return;
    listMembers().then(setMembers).catch(() => {});
  }, [auth.workspace?.id]);

  useEffect(() => {
    if (!auth.workspace || !canvasRef.current) return;
    const joinLink = `${window.location.origin}/join/${encodeURIComponent(auth.workspace.code)}`;
    QRCode.toCanvas(canvasRef.current, joinLink, {
      width: 180,
      margin: 1,
      color: { dark: '#006C49', light: '#FFFFFF' },
    }).catch(() => {});
  }, [auth.workspace?.code]);

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
      // ignore
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
        // user cancelled
      }
    } else {
      copy(joinLink, 'share');
    }
  };

  const startEditName = () => {
    setNameDraft(auth.profile?.display_name ?? '');
    setEditingName(true);
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === auth.profile?.display_name) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      await updateDisplayName(trimmed);
      window.location.reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Konnte Namen nicht ändern.');
    } finally {
      setSavingName(false);
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
        {editingName ? (
          <div className="profile__name-edit">
            <input
              className="profile__name-input"
              value={nameDraft}
              onChange={e => setNameDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
              autoFocus
            />
            <button className="profile__name-save" onClick={saveName} disabled={savingName}>
              <Save size={14} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <button className="profile__name" onClick={startEditName}>
            <h1>{auth.profile.display_name}</h1>
            <Pencil size={14} strokeWidth={1.75} />
          </button>
        )}
      </header>

      <section className="profile__card">
        <span className="profile__card-eyebrow">Haushalt</span>
        <h2>{auth.workspace.name}</h2>

        <div className="profile__share-row">
          <div className="profile__qr">
            <canvas ref={canvasRef} />
            <small>QR scannen zum Beitreten</small>
          </div>
          <div className="profile__share-fields">
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
            </div>

            <button className="profile__share" onClick={shareViaSystem}>
              <Share2 size={16} strokeWidth={2} />
              {copied === 'share' ? 'Link kopiert' : 'Teilen'}
            </button>
          </div>
        </div>
      </section>

      <section className="profile__card">
        <span className="profile__card-eyebrow">Mitglieder</span>
        <h3>{members.length} im Haushalt</h3>
        <ul className="profile__members">
          {members.map(m => (
            <li key={m.id} className="profile__member">
              <span
                className="profile__member-dot"
                style={{ background: `var(${PROFILE_COLORS.includes(m.color) ? m.color : '--profile-amber'})` }}
              >
                {m.display_name[0]?.toUpperCase()}
              </span>
              <span className="profile__member-name">{m.display_name}</span>
              {m.id === auth.profile?.id && <span className="profile__member-you">du</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="profile__danger">
        <button className="profile__signout" onClick={signOut}>
          <LogOut size={14} strokeWidth={1.75} />
          Abmelden
        </button>
        <small>Ohne Workspace-Code kommst du danach nicht zurück. Code abspeichern!</small>
      </section>
    </div>
  );
}
