import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Link2, Pencil, Sparkles, AlertTriangle, X } from 'lucide-react';
import './RezeptImport.css';
import { CookingSpinner } from '../components/CookingSpinner';
import {
  RECIPE_PARSER_SYSTEM_PROMPT,
  formatRecipeFewShotExamples,
} from '../lib/prompts/recipeParserPrompt';
import { importRecipeFromUrl, saveRecipe, listExistingSourceUrls, type SaveRecipeInput } from '../lib/recipes';
import type { RecipeSource } from '../lib/types/recipe';

type Tab = 'url' | 'manual' | 'ai';

export function RezeptImport() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('url');

  return (
    <div className="rimp">
      <header className="rimp__header">
        <Link to="/rezepte" className="rimp__back">
          <ArrowLeft size={14} strokeWidth={2} /> zurück zu Rezepten
        </Link>
        <div className="rimp__header-row">
          <div>
            <span className="rimp__eyebrow">Mahlzeit · Rezept hinzufügen</span>
            <h1>Neues Rezept</h1>
          </div>
          <Link to="/rezepte/bulk" className="rimp__bulk-link">Mehrere auf einmal →</Link>
        </div>
      </header>

      <nav className="rimp__tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'url'} className={`rimp__tab ${tab === 'url' ? 'is-active' : ''}`} onClick={() => setTab('url')}>
          <Link2 size={14} strokeWidth={2} /> Aus URL / Insta
        </button>
        <button role="tab" aria-selected={tab === 'manual'} className={`rimp__tab ${tab === 'manual' ? 'is-active' : ''}`} onClick={() => setTab('manual')}>
          <Pencil size={14} strokeWidth={2} /> Manuell
        </button>
        <button role="tab" aria-selected={tab === 'ai'} className={`rimp__tab ${tab === 'ai' ? 'is-active' : ''}`} onClick={() => setTab('ai')} disabled title="KI-Generation kommt später">
          <Sparkles size={14} strokeWidth={2} /> KI <small>(bald)</small>
        </button>
      </nav>

      <main className="rimp__main">
        {tab === 'url' && <UrlImport onSaved={(id) => navigate(`/rezepte/${id}`)} />}
        {tab === 'manual' && <ManualEntry onSaved={(id) => navigate(`/rezepte/${id}`)} />}
        {tab === 'ai' && (
          <div className="rimp__placeholder">
            <Sparkles size={32} />
            <h3>KI-Generation kommt später</h3>
            <p>Du wirst dann beschreiben können was du essen willst, und Mahlzeit baut dir ein passendes Rezept.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// URL-Import — erkennt Link → importiert + speichert direkt
// ---------------------------------------------------------------------------

function UrlImport({ onSaved }: { onSaved: (id: string) => void }) {
  const [url, setUrl] = useState('');
  const [manualCaption, setManualCaption] = useState('');
  const [showCaptionFallback, setShowCaptionFallback] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateOf, setDuplicateOf] = useState<string | null>(null);
  const triedRef = useRef('');

  const detectSource = (u: string): RecipeSource => {
    if (u.includes('instagram.com')) return 'instagram';
    if (u.includes('tiktok.com')) return 'tiktok';
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    return 'url';
  };
  const normalizeUrl = (u: string): string => {
    try { const p = new URL(u); return `${p.origin}${p.pathname.replace(/\/$/, '')}`; } catch { return u.trim(); }
  };
  const isRecognized = (u: string): boolean => {
    try { const x = new URL(u.trim()); return !!x.hostname && x.pathname.length > 1; } catch { return false; }
  };

  const run = async (withCaption: boolean) => {
    if (busy) return;
    setError(null); setDuplicateOf(null); setBusy(true);
    try {
      const norm = normalizeUrl(url.trim());
      try {
        const existing = await listExistingSourceUrls();
        if (existing.some(u => normalizeUrl(u) === norm)) {
          setDuplicateOf(norm);
          setError('Dieses Rezept ist schon importiert.');
          return;
        }
      } catch { /* Dedup-Lookup optional */ }

      const result = await importRecipeFromUrl(
        url.trim(), RECIPE_PARSER_SYSTEM_PROMPT, formatRecipeFewShotExamples(),
        withCaption ? (manualCaption.trim() || undefined) : undefined,
      );

      if (result.status === 'extraction_failed') {
        setShowCaptionFallback(true);
        setError(result.error ?? 'Caption konnte nicht automatisch gelesen werden — füge sie unten ein.');
        return;
      }
      if (result.status === 'error' || !result.result?.rezept) {
        setError(result.error ?? result.result?.rueckfrage ?? 'Parsing fehlgeschlagen.');
        return;
      }

      const rz = result.result.rezept;
      const input: SaveRecipeInput = {
        source: detectSource(url),
        source_url: url,
        source_author: result.extracted_author ?? null,
        source_caption_raw: result.extracted_caption ?? null,
        titel: rz.titel,
        beschreibung: rz.beschreibung,
        portionen: rz.portionen,
        zubereitungszeit_min: rz.zubereitungszeit_min,
        schwierigkeit: rz.schwierigkeit,
        kategorie: rz.kategorie,
        zutaten: rz.zutaten,
        zubereitung: rz.zubereitung,
        tags: rz.tags,
        bild_url: rz.bild_url,
        is_favorite: false,
        ai_confidence: rz.ai_confidence,
        ai_warnings: rz.ai_warnings,
        recipe_type: rz.recipe_type ?? 'hauptgericht',
      };
      const saved = await saveRecipe(input);
      onSaved(saved.id); // direkt aufs neue Rezept
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Import.');
    } finally {
      setBusy(false);
    }
  };

  // Erkannter Link → automatisch importieren (kurze Verzögerung)
  useEffect(() => {
    const u = url.trim();
    if (!u || busy || showCaptionFallback || duplicateOf) return;
    if (!isRecognized(u) || triedRef.current === u) return;
    const t = setTimeout(() => { triedRef.current = u; run(false); }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, busy, showCaptionFallback, duplicateOf]);

  const clear = () => {
    setUrl(''); setError(null); setDuplicateOf(null);
    setShowCaptionFallback(false); setManualCaption(''); triedRef.current = '';
  };

  return (
    <div className="rimp__panel">
      <label className="rimp__field">
        <span>Insta-Reel-URL oder Rezept-Link</span>
        <div className="rimp__url-wrap">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/reel/…"
            autoFocus
            disabled={busy}
          />
          {url && !busy && (
            <button type="button" className="rimp__url-clear" onClick={clear} aria-label="Löschen"><X size={16} strokeWidth={2.5} /></button>
          )}
        </div>
      </label>

      {duplicateOf && (
        <div className="rimp__warning">⚠️ Dieses Rezept ist schon in deiner Sammlung. <Link to="/rezepte">Zu Rezepten</Link></div>
      )}

      {showCaptionFallback && (
        <>
          <label className="rimp__field">
            <span>Caption manuell einfügen</span>
            <textarea rows={5} value={manualCaption} onChange={e => setManualCaption(e.target.value)} placeholder="Caption aus Instagram kopieren…" />
          </label>
          <button className="rimp__cta" disabled={busy || !manualCaption.trim()} onClick={() => run(true)}>
            {busy ? 'Speichere…' : 'Mit Caption hinzufügen'}
          </button>
        </>
      )}

      {error && !showCaptionFallback && (
        <div className="rimp__error"><AlertTriangle size={14} /> {error}</div>
      )}

      {busy && (
        <div className="rimp__parsing"><CookingSpinner size={80} label="Erkannt — importiere & speichere…" /></div>
      )}

      {!busy && !showCaptionFallback && !error && isRecognized(url) && (
        <p className="rimp__hint">Link erkannt — wird automatisch hinzugefügt…</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Manuell-Tab
// ---------------------------------------------------------------------------

function ManualEntry({ onSaved }: { onSaved: (id: string) => void }) {
  const [titel, setTitel] = useState('');
  const [zeit, setZeit] = useState('');
  const [portionen, setPortionen] = useState(2);
  const [zubereitung, setZubereitung] = useState('');
  const [zutatenText, setZutatenText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null); setSaving(true);
    try {
      const zutaten = zutatenText.split('\n').map(z => z.trim()).filter(Boolean)
        .map(line => ({ name: line, menge: null, einheit: '', hinweis: null }));
      const zubereitungSteps = zubereitung.split('\n').map(z => z.trim()).filter(Boolean);
      const input: SaveRecipeInput = {
        source: 'manual', source_url: null, source_author: null, source_caption_raw: null,
        titel: titel.trim(), beschreibung: null, portionen,
        zubereitungszeit_min: zeit ? parseInt(zeit, 10) : null, schwierigkeit: null,
        kategorie: [], zutaten, zubereitung: zubereitungSteps, tags: [], bild_url: null,
        is_favorite: false, ai_confidence: null, ai_warnings: [], recipe_type: 'hauptgericht',
      };
      const saved = await saveRecipe(input);
      onSaved(saved.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Speichern fehlgeschlagen.');
    } finally { setSaving(false); }
  };

  return (
    <div className="rimp__panel">
      <label className="rimp__field"><span>Titel</span>
        <input value={titel} onChange={e => setTitel(e.target.value)} placeholder="z.B. Linsenbowl mit Feta" /></label>
      <div className="rimp__row">
        <label className="rimp__field"><span>Zeit (Minuten)</span>
          <input type="number" min="0" value={zeit} onChange={e => setZeit(e.target.value)} /></label>
        <label className="rimp__field"><span>Portionen</span>
          <input type="number" min="1" value={portionen} onChange={e => setPortionen(parseInt(e.target.value) || 1)} /></label>
      </div>
      <label className="rimp__field"><span>Zutaten <small>(eine pro Zeile)</small></span>
        <textarea rows={6} value={zutatenText} onChange={e => setZutatenText(e.target.value)} placeholder={'200 g Linsen\n150 g Feta\n3 EL Olivenöl'} /></label>
      <label className="rimp__field"><span>Zubereitung <small>(ein Schritt pro Zeile)</small></span>
        <textarea rows={6} value={zubereitung} onChange={e => setZubereitung(e.target.value)} placeholder={'Linsen kochen.\nFeta zerbröseln.\nAlles vermischen.'} /></label>
      {error && <div className="rimp__error"><AlertTriangle size={14} /> {error}</div>}
      <button className="rimp__cta" disabled={!titel.trim() || saving} onClick={handleSave}>{saving ? 'Speichere…' : 'Speichern'}</button>
    </div>
  );
}
