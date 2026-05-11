import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Square, Check, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import './BulkImport.css';
import { CookingSpinner } from '../components/CookingSpinner';
import {
  RECIPE_PARSER_SYSTEM_PROMPT,
  formatRecipeFewShotExamples,
} from '../lib/prompts/recipeParserPrompt';
import { importRecipeFromUrl, saveRecipe } from '../lib/recipes';
import type { RecipeSource } from '../lib/types/recipe';

type ItemStatus = 'pending' | 'running' | 'ok' | 'error' | 'skipped';

type Item = {
  url: string;
  status: ItemStatus;
  message?: string;
  recipeId?: string;
  recipeTitle?: string;
};

const DELAY_BETWEEN_REQUESTS_MS = 4000;  // Groq Free hat Rate-Limits — 4s schont's

function detectSource(url: string): RecipeSource {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'url';
}

export function BulkImport() {
  const [rawText, setRawText] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  const parseInput = (): string[] => {
    return rawText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && /^https?:\/\//i.test(l));
  };

  const startImport = async () => {
    const urls = parseInput();
    if (urls.length === 0) return;
    setItems(urls.map(url => ({ url, status: 'pending' })));
    setRunning(true);
    cancelRef.current = false;

    const fewShots = formatRecipeFewShotExamples();

    for (let i = 0; i < urls.length; i++) {
      if (cancelRef.current) {
        setItems(prev => prev.map((it, idx) =>
          idx > i ? { ...it, status: 'skipped', message: 'Vom User abgebrochen' } : it
        ));
        break;
      }

      // Mark running
      setItems(prev => prev.map((it, idx) =>
        idx === i ? { ...it, status: 'running' } : it
      ));

      try {
        const url = urls[i];
        const result = await importRecipeFromUrl(url, RECIPE_PARSER_SYSTEM_PROMPT, fewShots);

        if (result.status !== 'ok' || !result.result?.rezept) {
          setItems(prev => prev.map((it, idx) =>
            idx === i ? {
              ...it,
              status: 'error',
              message: result.status === 'extraction_failed'
                ? 'Caption konnte nicht extrahiert werden'
                : (result.error ?? 'Parser-Fehler'),
            } : it
          ));
          continue;
        }

        const rezept = result.result.rezept;
        const saved = await saveRecipe({
          source: detectSource(url) as RecipeSource,
          source_url: url,
          source_author: result.extracted_author ?? rezept.source_author ?? null,
          source_caption_raw: result.extracted_caption ?? rezept.source_caption_raw ?? null,
          titel: rezept.titel,
          beschreibung: rezept.beschreibung ?? null,
          portionen: rezept.portionen,
          zubereitungszeit_min: rezept.zubereitungszeit_min ?? null,
          schwierigkeit: rezept.schwierigkeit ?? null,
          kategorie: rezept.kategorie ?? [],
          zutaten: rezept.zutaten ?? [],
          zubereitung: rezept.zubereitung ?? [],
          tags: rezept.tags ?? [],
          bild_url: rezept.bild_url ?? null,
          ai_confidence: rezept.ai_confidence ?? null,
          ai_warnings: rezept.ai_warnings ?? [],
          is_favorite: false,
        });

        setItems(prev => prev.map((it, idx) =>
          idx === i ? { ...it, status: 'ok', recipeId: saved.id, recipeTitle: saved.titel } : it
        ));
      } catch (e) {
        setItems(prev => prev.map((it, idx) =>
          idx === i ? { ...it, status: 'error', message: e instanceof Error ? e.message : String(e) } : it
        ));
      }

      // Throttle vor dem nächsten Request
      if (i < urls.length - 1 && !cancelRef.current) {
        await new Promise(r => setTimeout(r, DELAY_BETWEEN_REQUESTS_MS));
      }
    }

    setRunning(false);
  };

  const cancel = () => {
    cancelRef.current = true;
  };

  const reset = () => {
    setItems([]);
    setRawText('');
  };

  const okCount = items.filter(i => i.status === 'ok').length;
  const errorCount = items.filter(i => i.status === 'error').length;
  const skippedCount = items.filter(i => i.status === 'skipped').length;

  return (
    <div className="bulk">
      <header className="bulk__header">
        <Link to="/rezepte" className="bulk__back">
          <ArrowLeft size={14} strokeWidth={2} /> zurück zu Rezepten
        </Link>
        <div>
          <span className="bulk__eyebrow">Mahlzeit · Bulk-Import</span>
          <h1>Mehrere Rezepte auf einmal</h1>
        </div>
      </header>

      {items.length === 0 && (
        <section className="bulk__intro">
          <p>
            Pack deine Recipe-Links rein — eine URL pro Zeile. Wir gehen die Liste der Reihe nach
            durch (~4s pro Rezept wegen Rate-Limits) und legen die Rezepte für dich an.
          </p>
          <p className="bulk__hint">
            Tipp: Aus Excel die ganze Spalte mit den Links kopieren und hier reinkleben — das funktioniert.
          </p>

          <textarea
            className="bulk__textarea"
            placeholder={`https://www.instagram.com/reel/...\nhttps://www.instagram.com/reel/...\nhttps://www.chefkoch.de/rezepte/...\nhttps://www.tiktok.com/@.../video/...`}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            rows={12}
            disabled={running}
          />

          <div className="bulk__actions">
            <span className="bulk__count">
              {parseInput().length} {parseInput().length === 1 ? 'Link erkannt' : 'Links erkannt'}
            </span>
            <button
              className="bulk__cta"
              disabled={parseInput().length === 0 || running}
              onClick={startImport}
            >
              <Play size={14} strokeWidth={2} /> Import starten
            </button>
          </div>
        </section>
      )}

      {items.length > 0 && (
        <section className="bulk__progress">
          <header className="bulk__progress-header">
            <div>
              <span className="bulk__eyebrow">
                {running ? 'Import läuft…' : 'Import abgeschlossen'}
              </span>
              <h2>
                {okCount} von {items.length} fertig
                {errorCount > 0 && <span className="bulk__error-count"> · {errorCount} Fehler</span>}
                {skippedCount > 0 && <span className="bulk__skip-count"> · {skippedCount} abgebrochen</span>}
              </h2>
            </div>
            {running ? (
              <button className="bulk__cancel" onClick={cancel}>
                <Square size={14} strokeWidth={2} /> Abbrechen
              </button>
            ) : (
              <div className="bulk__final-actions">
                <Link to="/rezepte" className="bulk__cta">
                  <Sparkles size={14} strokeWidth={2} /> Zu meinen Rezepten
                </Link>
                <button className="bulk__secondary" onClick={reset}>Neuen Batch starten</button>
              </div>
            )}
          </header>

          {running && (
            <div className="bulk__spinner">
              <CookingSpinner size={60} label={`Rezept ${items.findIndex(i => i.status === 'running') + 1} von ${items.length}`} />
            </div>
          )}

          <ul className="bulk__list">
            {items.map((item, idx) => (
              <li key={idx} className={`bulk__item bulk__item--${item.status}`}>
                <span className="bulk__item-icon">
                  {item.status === 'pending' && <span className="bulk__dot" />}
                  {item.status === 'running' && <span className="bulk__dot bulk__dot--running" />}
                  {item.status === 'ok' && <Check size={14} strokeWidth={2.5} />}
                  {item.status === 'error' && <AlertCircle size={14} strokeWidth={2} />}
                  {item.status === 'skipped' && <span className="bulk__dot bulk__dot--skipped">–</span>}
                </span>
                <div className="bulk__item-body">
                  <span className="bulk__item-url">{item.url}</span>
                  {item.recipeTitle && (
                    <span className="bulk__item-result">→ {item.recipeTitle}</span>
                  )}
                  {item.message && (
                    <span className="bulk__item-message">{item.message}</span>
                  )}
                </div>
                {item.recipeId && (
                  <Link to={`/rezepte/${item.recipeId}`} className="bulk__item-link" aria-label="Rezept öffnen">
                    <ExternalLink size={14} strokeWidth={1.75} />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
