import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Square, Check, AlertCircle, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import './BulkImport.css';
import { CookingSpinner } from '../components/CookingSpinner';
import {
  RECIPE_PARSER_SYSTEM_PROMPT,
  formatRecipeFewShotExamples,
} from '../lib/prompts/recipeParserPrompt';
import { importRecipeFromUrl, saveRecipe, listExistingSourceUrls } from '../lib/recipes';
import type { RecipeSource } from '../lib/types/recipe';
import { useAuth } from '../lib/auth';

type ItemStatus = 'pending' | 'running' | 'ok' | 'error' | 'skipped';

type Item = {
  url: string;
  status: ItemStatus;
  message?: string;
  recipeId?: string;
  recipeTitle?: string;
};

const DELAY_BETWEEN_REQUESTS_MS = 30000;  // Groq Free TPM-Limit: 12000 TPM, ~5300 Tokens/Request → ~30s safe
const RETRY_DELAY_MS = 60000;             // Fallback, wenn die Fehlermeldung keine Zeit nennt
const MAX_RETRIES = 5;                    // Bei Rate-Limit so oft automatisch wiederholen

// Erkennt einen Rate-Limit-Fehler anhand der Meldung
function isRateLimitError(msg: string): boolean {
  return /rate.?limit|rate.?mit|429|too many|TPM|RPM|später erneut/i.test(msg);
}

// Liest die in der Fehlermeldung angegebene Wartezeit aus (Groq: "Please try again in 7.456s"
// oder "in 1m30.5s"). Gibt Millisekunden zurück, oder null wenn nichts gefunden.
function parseRetryAfterMs(msg: string): number | null {
  if (!msg) return null;
  // "in 1m30s" / "in 1m 30.5s"
  const mAndS = msg.match(/in\s+(\d+)\s*m\s*([\d.]+)\s*s/i);
  if (mAndS) {
    return Math.ceil((parseInt(mAndS[1], 10) * 60 + parseFloat(mAndS[2])) * 1000);
  }
  // "in 1m" / "in 1 min"
  const mOnly = msg.match(/in\s+(\d+)\s*m(?:in)?\b/i);
  if (mOnly) return parseInt(mOnly[1], 10) * 60 * 1000;
  // "in 7.456s" / "try again in 12s"
  const sOnly = msg.match(/in\s+([\d.]+)\s*s/i);
  if (sOnly) return Math.ceil(parseFloat(sOnly[1]) * 1000);
  // "retry-after: 30" (Sekunden)
  const retryAfter = msg.match(/retry[-\s]?after[:\s]+(\d+)/i);
  if (retryAfter) return parseInt(retryAfter[1], 10) * 1000;
  return null;
}

const LS_KEY = (workspaceId: string) => `mahlzeit:bulk-import:${workspaceId}`;

type PersistedState = {
  items: Item[];
  savedAt: number;
};

function detectSource(url: string): RecipeSource {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'url';
}

export function BulkImport() {
  const auth = useAuth();
  const [rawText, setRawText] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [running, setRunning] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<Item[] | null>(null);
  const cancelRef = useRef(false);

  // Persistierten State beim Mount checken
  useEffect(() => {
    if (!auth.workspace?.id) return;
    const raw = localStorage.getItem(LS_KEY(auth.workspace.id));
    if (!raw) return;
    try {
      const parsed: PersistedState = JSON.parse(raw);
      const incomplete = parsed.items.some(i => i.status === 'pending' || i.status === 'running');
      if (incomplete) {
        // running → pending zurücksetzen (war vermutlich beim Browser-Close mittendrin)
        const normalized = parsed.items.map(i =>
          i.status === 'running' ? { ...i, status: 'pending' as ItemStatus } : i
        );
        setResumePrompt(normalized);
      } else {
        // Alle fertig — abgeschlossener Lauf, kein Resume-Prompt nötig
        localStorage.removeItem(LS_KEY(auth.workspace.id));
      }
    } catch {
      localStorage.removeItem(LS_KEY(auth.workspace.id));
    }
  }, [auth.workspace?.id]);

  const persist = (next: Item[]) => {
    if (!auth.workspace?.id) return;
    const payload: PersistedState = { items: next, savedAt: Date.now() };
    localStorage.setItem(LS_KEY(auth.workspace.id), JSON.stringify(payload));
  };

  const clearPersist = () => {
    if (!auth.workspace?.id) return;
    localStorage.removeItem(LS_KEY(auth.workspace.id));
  };

  const updateItem = (index: number, patch: Partial<Item>) => {
    setItems(prev => {
      const next = prev.map((it, idx) => idx === index ? { ...it, ...patch } : it);
      persist(next);
      return next;
    });
  };

  // Wartet ms Millisekunden und zeigt dabei einen Sekunden-Countdown in der Item-Message.
  // Bricht früh ab, wenn der User abbricht (cancelRef).
  const sleepWithCountdown = async (index: number, ms: number, label: (sec: number) => string) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      if (cancelRef.current) return;
      const secLeft = Math.ceil((end - Date.now()) / 1000);
      updateItem(index, { status: 'running', message: label(secLeft) });
      await new Promise(r => setTimeout(r, 1000));
    }
  };

  // Normalize Instagram-URLs (strip query params + trailing slash) für Dedup
  const normalizeUrl = (url: string): string => {
    try {
      const u = new URL(url);
      // Insta: /reel/:id/ — query weg
      return `${u.origin}${u.pathname.replace(/\/$/, '')}`;
    } catch {
      return url.trim();
    }
  };

  const parseInput = (): string[] => {
    const lines = rawText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && /^https?:\/\//i.test(l));
    // Dedup nach normalisierter URL
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const l of lines) {
      const key = normalizeUrl(l);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(l);
      }
    }
    return unique;
  };

  const startImport = async (resumeWith?: Item[]) => {
    let startItems: Item[];
    if (resumeWith) {
      startItems = resumeWith;
    } else {
      const urls = parseInput();
      // Gegen DB dedupen: schon importierte source_urls überspringen
      try {
        const existing = await listExistingSourceUrls();
        const existingNorm = new Set(existing.map(normalizeUrl));
        startItems = urls.map(url => {
          if (existingNorm.has(normalizeUrl(url))) {
            return { url, status: 'skipped' as ItemStatus, message: 'Schon importiert' };
          }
          return { url, status: 'pending' as ItemStatus };
        });
      } catch {
        startItems = urls.map(url => ({ url, status: 'pending' as ItemStatus }));
      }
    }
    if (startItems.length === 0) return;
    setItems(startItems);
    persist(startItems);
    setRunning(true);
    cancelRef.current = false;
    setResumePrompt(null);

    const fewShots = formatRecipeFewShotExamples();

    // Aktuellen DB-Stand laden für Titel-Duplikat-Check während des Imports
    let existingSet = new Set<string>();
    try {
      const existing = await listExistingSourceUrls();
      existingSet = new Set(existing);
    } catch { /* ignorieren */ }

    for (let i = 0; i < startItems.length; i++) {
      if (cancelRef.current) {
        const skipped = startItems.map((it, idx) =>
          idx > i && it.status === 'pending' ? { ...it, status: 'skipped' as ItemStatus, message: 'Vom User abgebrochen' } : it
        );
        setItems(skipped);
        persist(skipped);
        break;
      }
      // Skip schon-erledigte Items beim Resume
      if (startItems[i].status === 'ok' || startItems[i].status === 'error' || startItems[i].status === 'skipped') {
        continue;
      }

      // Mark running
      updateItem(i, { status: 'running' });

      try {
        const url = startItems[i].url;

        // Import mit Auto-Retry bei Rate-Limit: Fehlermeldung auslesen, angegebene
        // Wartezeit nehmen (sonst Fallback), Countdown zeigen, erneut versuchen.
        let result = await importRecipeFromUrl(url, RECIPE_PARSER_SYSTEM_PROMPT, fewShots);
        let attempt = 0;
        while (
          result.status === 'error' &&
          isRateLimitError(result.error ?? '') &&
          attempt < MAX_RETRIES &&
          !cancelRef.current
        ) {
          attempt++;
          const waitMs = parseRetryAfterMs(result.error ?? '') ?? RETRY_DELAY_MS;
          await sleepWithCountdown(i, waitMs, sec =>
            `Rate-Limit erreicht — neuer Versuch in ${sec}s (${attempt}/${MAX_RETRIES})…`
          );
          if (cancelRef.current) break;
          updateItem(i, { status: 'running', message: `Erneuter Versuch ${attempt}/${MAX_RETRIES}…` });
          result = await importRecipeFromUrl(url, RECIPE_PARSER_SYSTEM_PROMPT, fewShots);
        }
        if (cancelRef.current) break;

        if (result.status !== 'ok' || !result.result?.rezept) {
          const rawMsg = result.status === 'extraction_failed'
            ? 'Caption konnte nicht extrahiert werden (Insta-Login-Wall?)'
            : (result.error ?? 'Parser-Fehler');
          const msg = isRateLimitError(rawMsg)
            ? `Rate-Limit — auch nach ${MAX_RETRIES} Versuchen nicht durchgekommen. Später erneut probieren.`
            : rawMsg;
          updateItem(i, { status: 'error', message: msg });
          // Bei Auth-Fehlern zusätzlich kurz pausieren, damit nicht alle folgenden
          // Items sofort kollabieren.
          if (/auth|401|403/i.test(rawMsg)) {
            await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
          }
          continue;
        }

        const rezept = result.result.rezept;

        // Titel-Duplikat-Check (fängt Fälle ohne source_url)
        const titelKey = `titel::${rezept.titel?.toLowerCase().trim().replace(/\s+/g, ' ')}`;
        if (existingSet.has(titelKey)) {
          updateItem(i, { status: 'skipped', message: `Rezept mit gleichem Titel schon vorhanden: „${rezept.titel}"` });
          continue;
        }

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
          recipe_type: 'hauptgericht',
        });

        updateItem(i, { status: 'ok', recipeId: saved.id, recipeTitle: saved.titel });
        // Neu gespeicherten Titel zum Set hinzufügen (kein Duplikat in gleicher Session)
        existingSet.add(`titel::${saved.titel?.toLowerCase().trim().replace(/\s+/g, ' ')}`);
      } catch (e) {
        updateItem(i, { status: 'error', message: e instanceof Error ? e.message : String(e) });
      }

      // Throttle vor dem nächsten Request
      if (i < startItems.length - 1 && !cancelRef.current) {
        await new Promise(r => setTimeout(r, DELAY_BETWEEN_REQUESTS_MS));
      }
    }

    setRunning(false);
    // Wenn alles durch ist, persistierte State löschen
    setItems(current => {
      const allDone = current.every(i => i.status !== 'pending' && i.status !== 'running');
      if (allDone) clearPersist();
      return current;
    });
  };

  const resume = () => {
    if (!resumePrompt) return;
    startImport(resumePrompt);
  };

  const discardResume = () => {
    setResumePrompt(null);
    clearPersist();
  };

  const cancel = () => {
    cancelRef.current = true;
  };

  const reset = () => {
    setItems([]);
    setRawText('');
    clearPersist();
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

      {resumePrompt && items.length === 0 && (
        <section className="bulk__resume">
          <RefreshCw size={20} strokeWidth={2} />
          <div>
            <strong>Unterbrochener Import gefunden</strong>
            <p>
              {resumePrompt.filter(i => i.status === 'ok').length} von {resumePrompt.length} Rezepten waren fertig.
              Weitermachen mit den verbleibenden {resumePrompt.filter(i => i.status === 'pending').length}?
            </p>
          </div>
          <div className="bulk__resume-actions">
            <button className="bulk__cta" onClick={resume}>
              <Play size={14} strokeWidth={2} /> Fortsetzen
            </button>
            <button className="bulk__secondary" onClick={discardResume}>Verwerfen</button>
          </div>
        </section>
      )}

      {items.length === 0 && !resumePrompt && (
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
              onClick={() => startImport()}
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
