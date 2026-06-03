/**
 * /share Route — Web Share Target Handler
 * Liest geteilte Instagram-Links, fetcht Caption, parst mit Groq LLM, öffnet Rezept-Form
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AddRecipeForm } from '../components/AddRecipeForm';
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

  if (loadingStage) {
    const messages = {
      fetching: { icon: '📱', title: 'Instagram wird gelesen...', subtitle: 'Caption wird abrufen' },
      parsing: { icon: '🤖', title: 'KI analysiert Rezept...', subtitle: 'Groq LLM parst Caption' },
    };
    const msg = messages[loadingStage];

    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
          {msg.icon}
        </div>
        <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>{msg.title}</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '2rem' }}>{msg.subtitle}</p>

        {/* Progress bar */}
        <div style={{ width: '200px', height: '4px', background: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: '#006c49',
              animation: `progress ${loadingStage === 'fetching' ? '1.5' : '2'}s ease-in-out infinite`,
            }}
          />
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 80%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (!sharedData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>❌ Keine Daten gefunden</p>
        <button onClick={() => navigate('/rezepte')}>← Zurück zu Rezepten</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', minHeight: '100vh', background: '#fff' }}>
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

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/rezepte')}
          style={{
            background: 'none',
            border: 'none',
            color: '#006c49',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '0.5rem 0',
            marginBottom: '1rem',
          }}
        >
          ← Zurück zu Rezepten
        </button>
        <h1 style={{ margin: '0.5rem 0 0 0', fontSize: '28px' }}>📸 Instagram-Rezept hinzufügen</h1>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f0f8f5', border: '1px solid #c8e6c9', borderRadius: '8px' }}>
        <p style={{ margin: '0.5rem 0', fontSize: '12px', color: '#555', wordBreak: 'break-all' }}>
          <strong>🔗 Quelle:</strong> {sharedData.url}
        </p>

        {thumbnailUrl && (
          <div style={{ margin: '1rem 0', borderRadius: '6px', overflow: 'hidden', maxHeight: '200px', background: '#fff' }}>
            <img
              src={thumbnailUrl}
              alt="Instagram Reel Thumbnail"
              style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
            />
          </div>
        )}

        {caption && (
          <div style={{ margin: '1rem 0 0 0', fontSize: '12px', color: '#666', maxHeight: '150px', overflow: 'auto', background: '#fff', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>📝 Caption-Vorschau:</strong>
            <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '11px', color: '#666' }}>
              {caption.slice(0, 300)}{caption.length > 300 ? '\n...' : ''}
            </pre>
          </div>
        )}
      </div>

      {parseError && (() => {
        const display = formatErrorDisplay(parseError);
        return (
          <div
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              background: parseError.code.includes('ERR_') ? '#fff3cd' : '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#856404',
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <strong>{display.icon} {parseError.code}:</strong> {parseError.message}
            </div>
            {!manualMode && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {parseError.action === 'RETRY' && (
                  <button
                    onClick={async () => {
                      setParseError(null);
                      if (caption) {
                        await parseWithGroq(caption, sharedData?.title || sharedData?.text);
                      }
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#ffc107',
                      color: '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    🔄 Nochmal versuchen
                  </button>
                )}
                {(parseError.action === 'MANUAL_EDIT' || parseError.action === 'RETRY') && (
                  <button
                    onClick={() => {
                      setManualMode(true);
                      setParseError(null);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#e3f2fd',
                      color: '#1565c0',
                      border: '1px solid #2196f3',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ✏️ Manuell bearbeiten
                  </button>
                )}
                {(parseError.action === 'SKIP' || parseError.action === 'RETRY') && (
                  <button
                    onClick={() => {
                      setParseError(null);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f0f0f0',
                      color: '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ➡️ Überspringen
                  </button>
                )}
              </div>
            )}
            {parseError.details && (
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
                Debug: {parseError.details.slice(0, 100)}
              </p>
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
