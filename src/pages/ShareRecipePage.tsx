/**
 * /share Route — Web Share Target Handler
 * Liest geteilte Instagram-Links, fetcht Caption, parst mit Groq LLM, öffnet Rezept-Form
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AddRecipeForm } from '../components/AddRecipeForm';
import './ShareRecipePage.css';
import { ImageSelectionModal, type SearchResult } from '../components/ImageSelectionModal';
import { getErrorInfo, formatErrorDisplay, type AppError } from '../lib/errors';
import { trackEvent, trackRecipeParsed, trackImageSelected, trackError } from '../lib/analytics';

interface SharedData {
  title: string;
  text: string;
  url: string;
  timestamp: number;
}

interface ParsedZutat {
  name: string;
  menge: number | null;
  einheit: string | null;
  hinweis: string | null;
}

interface ParsedRecipe {
  titel: string;
  zutaten: ParsedZutat[];
  zubereitung: string[];
}

type LoadingStage = 'fetching' | 'parsing' | 'ready';

export function ShareRecipePage() {
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [loadingStage, setLoadingStage] = useState<LoadingStage | null>('fetching');
  const [caption, setCaption] = useState('');
  const [parsed, setParsed] = useState<ParsedRecipe>({ titel: '', zutaten: [], zubereitung: [] });
  const [parseError, setParseError] = useState<AppError | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [recipeImageUrl, setRecipeImageUrl] = useState<string | null>(null);
  const [imageSearching, setImageSearching] = useState(false);
  const [imageSearchResults, setImageSearchResults] = useState<SearchResult[] | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalRecipeName, setImageModalRecipeName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // 1. Hole geteilte Daten aus IndexedDB
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const req = indexedDB.open('MealPlannerDB', 2);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });

        const tx = db.transaction('shared-recipes', 'readonly');
        const store = tx.objectStore('shared-recipes');
        const allData = await new Promise<SharedData[]>((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });

        db.close();

        if (allData.length === 0) {
          navigate('/rezepte');
          return;
        }

        const latest = allData[allData.length - 1];
        setSharedData(latest);
        trackEvent('instagram_recipe_shared', { url: latest.url?.split('/').slice(3, 5).join('/') });

        // 2. Fetch Instagram Caption + Thumbnail
        if (latest.url?.includes('instagram.com')) {
          try {
            const igRes = await fetch(latest.url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            });

            if (!igRes.ok) {
              if (igRes.status === 404) {
                setParseError(getErrorInfo('ERR_INSTAGRAM_PRIVATE', 'Reel not found (404)'));
              } else {
                setParseError(getErrorInfo('ERR_INSTAGRAM_BLOCKED', `HTTP ${igRes.status}`));
              }
              setLoadingStage(null);
              return;
            }

            const html = await igRes.text();

            // Extract caption (og:description)
            const ogDescMatch = html.match(/<meta property="og:description" content="([^"]*)"/);
            if (ogDescMatch) {
              const fullCaption = decodeHTMLEntities(ogDescMatch[1]);
              setCaption(fullCaption);
            }

            // Extract thumbnail (og:image)
            const ogImageMatch = html.match(/<meta property="og:image" content="([^"]*)"/);
            if (ogImageMatch) {
              setThumbnailUrl(decodeHTMLEntities(ogImageMatch[1]));
            }

            // 3. Parse mit Groq LLM (falls Caption vorhanden)
            if (ogDescMatch) {
              const fullCaption = decodeHTMLEntities(ogDescMatch[1]);
              if (fullCaption.trim().length < 20) {
                setParseError(getErrorInfo('ERR_CAPTION_EMPTY', fullCaption));
                setLoadingStage(null);
                return;
              }
              await parseWithGroq(fullCaption, latest.title || latest.text);
            } else {
              setParseError(getErrorInfo('ERR_CAPTION_EMPTY', 'No og:description found'));
              setLoadingStage(null);
            }
          } catch (e) {
            console.error('Failed to fetch Instagram caption:', e);
            setParseError(getErrorInfo('ERR_NETWORK', String(e)));
            setLoadingStage(null);
          }
        }
      } catch (e) {
        console.error('Failed to read shared data:', e);
        navigate('/rezepte');
      } finally {
        setLoadingStage(null);
      }
    })();
  }, [navigate]);

  const searchRecipeImage = async (recipeName: string) => {
    try {
      setImageSearching(true);
      console.log('[ShareRecipePage] Searching for recipe image:', recipeName);

      const { data, error } = await supabase.functions.invoke('search-recipe-image', {
        body: { query: recipeName },
      });

      if (error) {
        console.error('[ShareRecipePage] Image search error:', error);
        setImageSearching(false);
        return;
      }

      if (data?.results && data.results.length > 0) {
        console.log('[ShareRecipePage] Found', data.results.length, 'images');
        // Show modal for user to pick image (not auto-save!)
        setImageSearchResults(data.results);
        setImageModalRecipeName(recipeName);
        setShowImageModal(true);
      }
    } catch (err) {
      console.error('[ShareRecipePage] Image search failed:', err);
    } finally {
      setImageSearching(false);
    }
  };

  const handleImageSelected = (imageUrl: string) => {
    console.log('[ShareRecipePage] Image selected:', imageUrl);
    setRecipeImageUrl(imageUrl);

    // Track image selection
    if (imageSearchResults && imageSearchResults.length > 0) {
      const selectedImg = imageSearchResults.find(r => r.url === imageUrl);
      if (selectedImg) {
        trackImageSelected(selectedImg.source);
      }
    }

    setShowImageModal(false);
    setImageSearchResults(null);
  };

  const handleImageSkipped = () => {
    console.log('[ShareRecipePage] Image skipped');
    setShowImageModal(false);
    setImageSearchResults(null);
  };

  const handleImageRetry = () => {
    console.log('[ShareRecipePage] Image retry');
    // Retry search with same recipe name
    if (imageModalRecipeName) {
      setShowImageModal(false);
      setImageSearchResults(null);
      searchRecipeImage(imageModalRecipeName);
    }
  };

  const parseWithGroq = async (caption: string, suggestedTitel: string) => {
    try {
      setParseError(null);
      setLoadingStage('parsing');
      console.log('[ShareRecipePage] Calling parse-recipe-caption Edge Function...');

      // Call Groq via Edge Function
      const { data, error } = await supabase.functions.invoke('parse-recipe-caption', {
        body: {
          caption,
          recipeName: suggestedTitel,
        },
      });

      if (error) {
        console.error('[ShareRecipePage] Groq parse error:', error);

        // Map Edge Function error to AppError code
        let errorCode: any = 'ERR_GROQ_FAILED';
        const errorStr = String(error);

        // Check for specific error codes from Edge Function
        if (errorStr.includes('GROQ_RATE_LIMIT') || errorStr.includes('429')) {
          errorCode = 'ERR_GROQ_RATELIMIT';
        } else if (errorStr.includes('GROQ_SERVER_ERROR') || errorStr.includes('500')) {
          errorCode = 'ERR_GROQ_SERVER_ERROR';
        } else if (errorStr.includes('timeout') || errorStr.includes('AbortError')) {
          errorCode = 'ERR_GROQ_TIMEOUT';
        } else if (errorStr.includes('network') || errorStr.includes('Failed to fetch')) {
          errorCode = 'ERR_NETWORK';
        }

        setParseError(getErrorInfo(errorCode, errorStr));
        trackError(errorCode, errorStr);
        // Fallback zu simpler Regex
        parseCaption(caption, suggestedTitel);
        return;
      }

      if (data) {
        console.log('[ShareRecipePage] Groq parse success:', data);
        // Data already has structured zutaten as objects
        setParsed(data);

        // Track successful parse
        trackRecipeParsed('groq', data.zutaten.length, data.zubereitung.length);

        // Search for recipe image in background
        await searchRecipeImage(data.titel);

        setLoadingStage('ready');
      }
    } catch (err) {
      console.error('[ShareRecipePage] Parse error:', err);
      setParseError(getErrorInfo('ERR_PARSE_FAILED', String(err)));
      // Fallback zu Regex
      parseCaption(caption, suggestedTitel);
      setLoadingStage('ready');
    }
  };

  const parseCaption = (caption: string, suggestedTitel: string) => {
    // FALLBACK: Einfaches Regex-Parsing falls Groq fehlschlägt
    console.log('[ShareRecipePage] Using regex fallback parser');
    trackRecipeParsed('fallback', 0, 0); // Will be updated after parsing
    let titel = suggestedTitel.split('\n')[0].slice(0, 100) || 'Neues Rezept';
    const zutatenList: ParsedZutat[] = [];
    const zubereitungList: string[] = [];

    const lines = caption.split('\n');
    let mode = 'pre';

    for (const line of lines) {
      if (/^(zutaten|ingredients|das brauchst)/i.test(line)) {
        mode = 'zutaten';
        continue;
      }
      if (/^(zubereitung|anleitung|so geht)/i.test(line)) {
        mode = 'zubereitung';
        continue;
      }
      if (/^(nährwerte|gefällt|folge|#)/i.test(line)) break;

      const trimmed = line.trim();
      if (!trimmed) continue;

      if (mode === 'zutaten' && /^[-•*]/.test(line)) {
        const zutatenText = trimmed.replace(/^[-•*]\s*/, '');
        // Try to parse quantity + unit
        const match = zutatenText.match(/^([\d.]+)\s*([a-zA-Z]+)?\s+(.+)$/);
        if (match) {
          zutatenList.push({
            name: match[3],
            menge: parseFloat(match[1]),
            einheit: match[2] || null,
            hinweis: null,
          });
        } else {
          // Fallback: Just use as name
          zutatenList.push({
            name: zutatenText,
            menge: null,
            einheit: null,
            hinweis: null,
          });
        }
      } else if (mode === 'zubereitung' && trimmed) {
        zubereitungList.push(trimmed.replace(/^\d+[\.\)]\s*/, ''));
      }
    }

    const parsedData = {
      titel,
      zutaten: zutatenList.length > 0 ? zutatenList : [{ name: '', menge: null, einheit: null, hinweis: null }],
      zubereitung: zubereitungList.length > 0 ? zubereitungList : [''],
    };
    setParsed(parsedData);

    // Search for recipe image in background
    if (titel && titel !== 'Neues Rezept') {
      searchRecipeImage(titel);
    }

    setLoadingStage('ready');
  };

  if (loadingStage === 'fetching' || loadingStage === 'parsing') {
    const messages = {
      fetching: { icon: '📱', title: 'Instagram wird gelesen…', subtitle: 'Caption wird abgerufen' },
      parsing: { icon: '🤖', title: 'KI analysiert Rezept…', subtitle: 'Groq parst die Caption' },
    } as const;
    const msg = messages[loadingStage];

    return (
      <div className="srp__loading">
        <div className="srp__loading-icon">{msg.icon}</div>
        <h2>{msg.title}</h2>
        <p>{msg.subtitle}</p>
        <div className="srp__bar"><div className="srp__bar-fill" /></div>
      </div>
    );
  }

  if (!sharedData) {
    return (
      <div className="srp__empty">
        <p>Keine Daten gefunden.</p>
        <button className="srp__back" onClick={() => navigate('/rezepte')}>← Zurück zu Rezepten</button>
      </div>
    );
  }

  return (
    <div className="srp">
      {/* Image Selection Modal */}
      {showImageModal && imageSearchResults && (
        <ImageSelectionModal
          results={imageSearchResults}
          recipeName={imageModalRecipeName}
          onSelect={handleImageSelected}
          onSkip={handleImageSkipped}
          onRetry={handleImageRetry}
          loading={imageSearching}
        />
      )}

      <div className="srp__head">
        <button className="srp__back" onClick={() => navigate('/rezepte')}>← Zurück zu Rezepten</button>
        <h1 className="srp__title">📸 Instagram-Rezept hinzufügen</h1>
      </div>

      <div className="srp__source">
        <p className="srp__source-url"><strong>🔗 Quelle:</strong> {sharedData.url}</p>

        {thumbnailUrl && (
          <div className="srp__thumb">
            <img src={thumbnailUrl} alt="Instagram Reel Thumbnail" />
          </div>
        )}

        {caption && (
          <div className="srp__caption">
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>📝 Caption-Vorschau:</strong>
            <pre>{caption.slice(0, 300)}{caption.length > 300 ? '\n…' : ''}</pre>
          </div>
        )}
      </div>

      {parseError && (() => {
        const display = formatErrorDisplay(parseError);
        return (
          <div className="srp__error">
            <div>
              <strong>{display.icon} {parseError.code}:</strong> {parseError.message}
            </div>
            {!manualMode && (
              <div className="srp__error-actions">
                {parseError.action === 'RETRY' && (
                  <button
                    className="srp__error-btn srp__error-btn--primary"
                    onClick={async () => {
                      setParseError(null);
                      if (caption) await parseWithGroq(caption, sharedData?.title || sharedData?.text);
                    }}
                  >
                    🔄 Nochmal versuchen
                  </button>
                )}
                {(parseError.action === 'MANUAL_EDIT' || parseError.action === 'RETRY') && (
                  <button
                    className="srp__error-btn srp__error-btn--primary"
                    onClick={() => { setManualMode(true); setParseError(null); }}
                  >
                    ✏️ Manuell bearbeiten
                  </button>
                )}
                {(parseError.action === 'SKIP' || parseError.action === 'RETRY') && (
                  <button className="srp__error-btn srp__error-btn--ghost" onClick={() => setParseError(null)}>
                    ➡️ Überspringen
                  </button>
                )}
              </div>
            )}
            {parseError.details && (
              <p className="srp__error-debug">Debug: {parseError.details.slice(0, 100)}</p>
            )}
          </div>
        );
      })()}

      <AddRecipeForm
        initialTitel={parsed.titel}
        initialZutaten={parsed.zutaten}
        initialZubereitung={parsed.zubereitung.join('\n')}
        initialBildUrl={recipeImageUrl}
        onSuccess={(recipeId) => {
          // Cleanup IndexedDB nach erfolgreicher Speicherung
          (async () => {
            try {
              const db = await new Promise<IDBDatabase>((resolve, reject) => {
                const req = indexedDB.open('MealPlannerDB', 2);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
              });

              const tx = db.transaction('shared-recipes', 'readwrite');
              const store = tx.objectStore('shared-recipes');
              await new Promise<void>((resolve, reject) => {
                const req = store.clear();
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
              });

              db.close();
              console.log('[ShareRecipePage] Cleaned up shared data from IndexedDB');
            } catch (err) {
              console.warn('[ShareRecipePage] Failed to cleanup IndexedDB:', err);
            }

            // Rezept gespeichert → Success Screen mit Auto-Redirect
            navigate(`/share/success?recipeId=${recipeId}&name=${encodeURIComponent(parsed.titel || 'Rezept')}`);
          })();
        }}
        onCancel={() => navigate('/rezepte')}
      />
    </div>
  );
}

function decodeHTMLEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}
