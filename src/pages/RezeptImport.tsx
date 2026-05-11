import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Link2, Pencil, Sparkles, AlertTriangle, ChefHat } from 'lucide-react';
import './RezeptImport.css';
import { CookingSpinner } from '../components/CookingSpinner';
import {
  RECIPE_PARSER_SYSTEM_PROMPT,
  formatRecipeFewShotExamples,
} from '../lib/prompts/recipeParserPrompt';
import { importRecipeFromUrl, saveRecipe, type SaveRecipeInput } from '../lib/recipes';
import type { Recipe, RecipeSource } from '../lib/types/recipe';

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
          <Link to="/rezepte/bulk" className="rimp__bulk-link">
            Mehrere auf einmal →
          </Link>
        </div>
      </header>

      <nav className="rimp__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'url'}
          className={`rimp__tab ${tab === 'url' ? 'is-active' : ''}`}
          onClick={() => setTab('url')}
        >
          <Link2 size={14} strokeWidth={2} /> Aus URL / Insta
        </button>
        <button
          role="tab"
          aria-selected={tab === 'manual'}
          className={`rimp__tab ${tab === 'manual' ? 'is-active' : ''}`}
          onClick={() => setTab('manual')}
        >
          <Pencil size={14} strokeWidth={2} /> Manuell
        </button>
        <button
          role="tab"
          aria-selected={tab === 'ai'}
          className={`rimp__tab ${tab === 'ai' ? 'is-active' : ''}`}
          onClick={() => setTab('ai')}
          disabled
          title="KI-Generation kommt in Sprint 6"
        >
          <Sparkles size={14} strokeWidth={2} /> KI <small>(bald)</small>
        </button>
      </nav>

      <main className="rimp__main">
        {tab === 'url' && <UrlImport onSaved={(id) => navigate(`/rezepte/${id}`)} />}
        {tab === 'manual' && <ManualEntry onSaved={(id) => navigate(`/rezepte/${id}`)} />}
        {tab === 'ai' && (
          <div className="rimp__placeholder">
            <Sparkles size={32} />
            <h3>KI-Generation kommt in Sprint 6</h3>
            <p>Du wirst dann beschreiben können was du essen willst, und Mahlzeit baut dir ein passendes Rezept.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// URL-Import-Tab
// ---------------------------------------------------------------------------

function UrlImport({ onSaved }: { onSaved: (id: string) => void }) {
  const [url, setUrl] = useState('');
  const [manualCaption, setManualCaption] = useState('');
  const [showCaptionFallback, setShowCaptionFallback] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<NonNullable<Recipe> | null>(null);
  const [saving, setSaving] = useState(false);

  const detectSource = (u: string): RecipeSource => {
    if (u.includes('instagram.com')) return 'instagram';
    if (u.includes('tiktok.com')) return 'tiktok';
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    return 'url';
  };

  const handleImport = async () => {
    setError(null);
    setParsed(null);
    setParsing(true);
    try {
      const result = await importRecipeFromUrl(
        url.trim(),
        RECIPE_PARSER_SYSTEM_PROMPT,
        formatRecipeFewShotExamples(),
        manualCaption.trim() || undefined
      );

      if (result.status === 'extraction_failed') {
        setShowCaptionFallback(true);
        setError(result.error ?? 'Caption konnte nicht extrahiert werden — füge sie manuell unten ein.');
        return;
      }

      if (result.status === 'error' || !result.result?.rezept) {
        setError(result.error ?? result.result?.rueckfrage ?? 'Parsing fehlgeschlagen.');
        return;
      }

      // Build "preview" Recipe für UI
      setParsed({
        id: 'preview',
        workspace_id: '',
        created_by: '',
        created_at: '',
        updated_at: '',
        ...result.result.rezept,
        source: detectSource(url),
        source_url: url,
        source_author: result.extracted_author ?? null,
        source_caption_raw: result.extracted_caption ?? null,
      } as Recipe);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Import.');
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async () => {
    if (!parsed) return;
    setSaving(true);
    setError(null);
    try {
      const input: SaveRecipeInput = {
        source: parsed.source,
        source_url: parsed.source_url,
        source_author: parsed.source_author,
        source_caption_raw: parsed.source_caption_raw,
        titel: parsed.titel,
        beschreibung: parsed.beschreibung,
        portionen: parsed.portionen,
        zubereitungszeit_min: parsed.zubereitungszeit_min,
        schwierigkeit: parsed.schwierigkeit,
        kategorie: parsed.kategorie,
        zutaten: parsed.zutaten,
        zubereitung: parsed.zubereitung,
        tags: parsed.tags,
        bild_url: parsed.bild_url,
        is_favorite: false,
        ai_confidence: parsed.ai_confidence,
        ai_warnings: parsed.ai_warnings,
      };
      const saved = await saveRecipe(input);
      onSaved(saved.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Speichern fehlgeschlagen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rimp__panel">
      <label className="rimp__field">
        <span>Insta-Reel-URL oder Rezept-Link</span>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.instagram.com/reel/…"
        />
      </label>

      {showCaptionFallback && (
        <label className="rimp__field">
          <span>Caption manuell einfügen</span>
          <textarea
            rows={5}
            value={manualCaption}
            onChange={e => setManualCaption(e.target.value)}
            placeholder="Caption aus Instagram kopieren…"
          />
        </label>
      )}

      {error && (
        <div className="rimp__error">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {!parsed && !parsing && (
        <button
          className="rimp__cta"
          disabled={!url.trim()}
          onClick={handleImport}
        >
          Rezept extrahieren
        </button>
      )}

      {parsing && (
        <div className="rimp__parsing">
          <CookingSpinner size={80} label="Rührt im Topf — extrahiere Rezept-Daten…" />
        </div>
      )}

      {parsed && (
        <>
          <RecipePreview recipe={parsed} />
          <div className="rimp__actions">
            <button className="rimp__secondary" onClick={() => setParsed(null)}>
              Verwerfen
            </button>
            <button className="rimp__cta" disabled={saving} onClick={handleSave}>
              {saving ? 'Speichere…' : 'Speichern'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Manuell-Tab — minimaler MVP
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
    setError(null);
    setSaving(true);
    try {
      // Zutaten-Format: 1 pro Zeile, "200g Mehl" → grobe Heuristik
      const zutaten = zutatenText
        .split('\n')
        .map(z => z.trim())
        .filter(Boolean)
        .map(line => ({
          name: line,
          menge: null,
          einheit: '',
          hinweis: null,
        }));

      const zubereitungSteps = zubereitung
        .split('\n')
        .map(z => z.trim())
        .filter(Boolean);

      const input: SaveRecipeInput = {
        source: 'manual',
        source_url: null,
        source_author: null,
        source_caption_raw: null,
        titel: titel.trim(),
        beschreibung: null,
        portionen,
        zubereitungszeit_min: zeit ? parseInt(zeit, 10) : null,
        schwierigkeit: null,
        kategorie: [],
        zutaten,
        zubereitung: zubereitungSteps,
        tags: [],
        bild_url: null,
        is_favorite: false,
        ai_confidence: null,
        ai_warnings: [],
      };
      const saved = await saveRecipe(input);
      onSaved(saved.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Speichern fehlgeschlagen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rimp__panel">
      <label className="rimp__field">
        <span>Titel</span>
        <input value={titel} onChange={e => setTitel(e.target.value)} placeholder="z.B. Linsenbowl mit Feta" />
      </label>

      <div className="rimp__row">
        <label className="rimp__field">
          <span>Zeit (Minuten)</span>
          <input type="number" min="0" value={zeit} onChange={e => setZeit(e.target.value)} />
        </label>
        <label className="rimp__field">
          <span>Portionen</span>
          <input type="number" min="1" value={portionen} onChange={e => setPortionen(parseInt(e.target.value) || 1)} />
        </label>
      </div>

      <label className="rimp__field">
        <span>Zutaten <small>(eine pro Zeile)</small></span>
        <textarea rows={6} value={zutatenText} onChange={e => setZutatenText(e.target.value)} placeholder="200 g Linsen
150 g Feta
3 EL Olivenöl" />
      </label>

      <label className="rimp__field">
        <span>Zubereitung <small>(ein Schritt pro Zeile)</small></span>
        <textarea rows={6} value={zubereitung} onChange={e => setZubereitung(e.target.value)} placeholder="Linsen kochen.
Feta zerbröseln.
Alles vermischen." />
      </label>

      {error && <div className="rimp__error"><AlertTriangle size={14} /> {error}</div>}

      <button className="rimp__cta" disabled={!titel.trim() || saving} onClick={handleSave}>
        {saving ? 'Speichere…' : 'Speichern'}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recipe-Preview
// ---------------------------------------------------------------------------

function RecipePreview({ recipe }: { recipe: Recipe }) {
  return (
    <article className="rimp__preview">
      <header className="rimp__preview-header">
        {recipe.bild_url ? (
          <img src={recipe.bild_url} alt="" />
        ) : (
          <div className="rimp__preview-placeholder"><ChefHat size={32} /></div>
        )}
        <div>
          <h2>{recipe.titel}</h2>
          {recipe.beschreibung && <p>{recipe.beschreibung}</p>}
          <div className="rimp__preview-meta">
            {recipe.zubereitungszeit_min && <span>⏱ {recipe.zubereitungszeit_min} Min</span>}
            {recipe.schwierigkeit && <span>· {recipe.schwierigkeit}</span>}
            <span>· {recipe.portionen} Portionen</span>
          </div>
        </div>
      </header>

      {recipe.ai_warnings.length > 0 && (
        <div className="rimp__warnings">
          <strong>Hinweise:</strong>
          <ul>{recipe.ai_warnings.map(w => <li key={w}>{w}</li>)}</ul>
        </div>
      )}

      <div className="rimp__preview-cols">
        <section>
          <h3>Zutaten</h3>
          <ul className="rimp__list">
            {recipe.zutaten.map((z, i) => (
              <li key={i}>
                <span>
                  {z.menge != null ? `${z.menge} ` : ''}
                  {z.einheit && `${z.einheit} `}
                </span>
                {z.name}
                {z.hinweis && <em> · {z.hinweis}</em>}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Zubereitung</h3>
          <ol className="rimp__list rimp__list--ordered">
            {recipe.zubereitung.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
      </div>
    </article>
  );
}
