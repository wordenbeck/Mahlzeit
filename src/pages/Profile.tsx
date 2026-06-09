import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Copy, Share2, LogOut, Pencil, Save, Eye, EyeOff, QrCode, Users, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import './Profile.css';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { listMembers, updateDisplayName, type Member } from '../lib/members';
import { listRecipesFull } from '../lib/recipes';
import { exportRecipesToExcel } from '../lib/exportRecipes';

const PROFILE_COLORS = ['--profile-amber','--profile-rose','--profile-sage','--profile-sky','--profile-lavender','--profile-ochre'];

export function Profile() {
  const auth = useAuth();
  const [copied, setCopied] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!auth.workspace) return;
    listMembers().then(setMembers).catch(() => {});
  }, [auth.workspace?.id]);

  // PIN laden / generieren
  useEffect(() => {
    if (!auth.userId) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.from('profiles').select('pin').eq('id', auth.userId!).maybeSingle();
        let p = (data as any)?.pin as string | null;
        if (!p) {
          const wsCode = auth.workspace?.code ?? '';
          do { p = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); } while (p === wsCode);
          await supabase.from('profiles').update({ pin: p }).eq('id', auth.userId!);
        }
        if (!cancelled) setPin(p);
      } catch { /* Spalte evtl. noch nicht migriert */ }
    })();
    return () => { cancelled = true; };
  }, [auth.userId]);

  const code = auth.workspace?.code ?? '';
  const joinLink = code ? `${window.location.origin}/join/${encodeURIComponent(code)}` : '';

  useEffect(() => {
    if (!showQr || !canvasRef.current || !joinLink) return;
    QRCode.toCanvas(canvasRef.current, joinLink, { width: 180, margin: 1, color: { dark: '#006C49', light: '#FFFFFF' } }).catch(() => {});
  }, [showQr, joinLink]);

  if (!auth.profile || !auth.workspace) {
    return (
      <div className="profile">
        <Link to="/" className="profile__back"><ArrowLeft size={14} strokeWidth={2} /> zurück</Link>
        <p className="profile__loading">Lade Profil…</p>
      </div>
    );
  }

  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); } catch { /* */ }
  };
  const shareViaSystem = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Mahlzeit · Beitritt', text: `Tritt unserem Haushalt „${auth.workspace!.name}" bei`, url: joinLink }); } catch { /* */ }
    } else copy(joinLink, 'share');
  };
  const startEditName = () => { setNameDraft(auth.profile?.display_name ?? ''); setEditingName(true); };
  const saveName = async () => {
    const t = nameDraft.trim();
    if (!t || t === auth.profile?.display_name) { setEditingName(false); return; }
    setSavingName(true);
    try { await updateDisplayName(t); window.location.reload(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Konnte Namen nicht ändern.'); }
    finally { setSavingName(false); }
  };
  const signOut = async () => {
    if (!confirm('Wirklich abmelden? Du musst dich danach neu mit Haushalt-Code + PIN anmelden.')) return;
    await supabase.auth.signOut();
    window.location.href = '/onboarding';
  };

  const initial = auth.profile.display_name[0]?.toUpperCase() ?? '?';

  return (
    <div className="profile">
      <Link to="/" className="profile__back"><ArrowLeft size={14} strokeWidth={2} /> zurück</Link>

      {/* Kombinierte Karte: Ich + Haushalt + PIN + Mitglieder */}
      <section className="profile__card">
        <div className="profile__id">
          <div className="profile__avatar" style={{ background: `var(${auth.profile.color})` }}>{initial}</div>
          <div className="profile__id-text">
            {editingName ? (
              <div className="profile__name-edit">
                <input className="profile__name-input" value={nameDraft} autoFocus
                  onChange={e => setNameDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }} />
                <button className="profile__name-save" onClick={saveName} disabled={savingName}><Save size={14} strokeWidth={2} /></button>
              </div>
            ) : (
              <button className="profile__name" onClick={startEditName}>
                <h1>{auth.profile.display_name}</h1><Pencil size={14} strokeWidth={1.75} />
              </button>
            )}
            <span className="profile__household">Haushalt <b>{auth.workspace.name}</b></span>
          </div>
        </div>

        <div className="profile__pin">
          <span className="profile__pin-lbl">🔑 Deine PIN</span>
          <span className="profile__pin-val">{pin ? (showPin ? pin : '••••') : '—'}</span>
          <button className="profile__pin-eye" onClick={() => setShowPin(v => !v)} aria-label={showPin ? 'PIN verbergen' : 'PIN anzeigen'} disabled={!pin}>
            {showPin ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
          </button>
        </div>

        <span className="profile__section-lbl"><Users size={13} strokeWidth={2} /> Mitglieder · {members.length}</span>
        <ul className="profile__members">
          {members.map(m => (
            <li key={m.id} className="profile__member">
              <span className="profile__member-dot" style={{ background: `var(${PROFILE_COLORS.includes(m.color) ? m.color : '--profile-amber'})` }}>{m.display_name[0]?.toUpperCase()}</span>
              <span className="profile__member-name">{m.display_name}</span>
              {m.id === auth.profile?.id && <span className="profile__member-you">du</span>}
            </li>
          ))}
        </ul>
      </section>

      {/* Einladen */}
      <section className="profile__card">
        <span className="profile__section-lbl">Familie einladen</span>
        <p className="profile__hint">Haushalts-Code zum Beitreten</p>
        <div className="profile__code-row">
          <code className="profile__code">{code}</code>
          <button className="profile__copy" onClick={() => copy(code, 'code')}>
            {copied === 'code' ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={1.75} />} Kopieren
          </button>
        </div>
        <button className="profile__share" onClick={shareViaSystem}>
          <Share2 size={16} strokeWidth={2} /> {copied === 'share' ? 'Link kopiert' : 'Einladungslink teilen'}
        </button>
        <button className="profile__qr-toggle" onClick={() => setShowQr(v => !v)}>
          <QrCode size={14} strokeWidth={2} /> {showQr ? 'QR-Code verbergen' : 'QR-Code zeigen'}
        </button>
        {showQr && <div className="profile__qr"><canvas ref={canvasRef} /></div>}
      </section>

      <section className="profile__card">
        <span className="profile__section-lbl">Daten</span>
        <button
          className="profile__export-btn"
          onClick={async () => {
            setExporting(true);
            try {
              const all = await listRecipesFull();
              exportRecipesToExcel(all);
            } finally {
              setExporting(false);
            }
          }}
          disabled={exporting}
        >
          <Download size={14} strokeWidth={2} />
          {exporting ? 'Wird exportiert…' : `Rezepte als Excel exportieren`}
        </button>
      </section>

      <button className="profile__signout" onClick={signOut}><LogOut size={14} strokeWidth={1.75} /> Abmelden</button>
      <p className="profile__warn">Code + PIN merken — damit kommst du auf jedem Gerät wieder rein.</p>
    </div>
  );
}
