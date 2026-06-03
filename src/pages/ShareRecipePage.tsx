/**
 * /share Route — Web Share Target Handler
 * Liest geteilte Instagram-Links, fetcht Caption, parst mit Groq LLM, öffnet Rezept-Form
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AddRecipeForm } from '../components/AddRecipeForm';

interface SharedData {
  title: string;
  text: string;
  url: string;
  timestamp: number;
}

interface ParsedRecipe {
  titel: string;
  zutaten: string[];
  zubereitung: string[];
}

export function ShareRecipePage() {
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [parsed, setParsed] = useState({ titel: '', zutaten: '', zubereitung: '' });
  const [parseError, setParseError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);

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

        // 2. Fetch Instagram Caption
        if (latest.url?.includes('instagram.com')) {
          try {
            const igRes = await fetch(latest.url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            });
            const html = await igRes.text();
            const ogMatch = html.match(/<meta property="og:description" content="([^"]*)"/);
            if (ogMatch) {
              const fullCaption = decodeHTMLEntities(ogMatch[1]);
              setCaption(fullCaption);

              // 3. Parse mit Groq LLM
              await parseWithGroq(fullCaption, latest.title || latest.text);
            }
          } catch (e) {
            console.error('Failed to fetch Instagram caption:', e);
            setParseError('Fehler beim Abrufen der Instagram-Caption');
          }
        }
      } catch (e) {
        console.error('Failed to read shared data:', e);
        navigate('/rezepte');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const parseWithGroq = async (caption: string, suggestedTitel: string) => {
    try {
      setParseError(null);
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
        setParseError('LLM-Parsing fehlgeschlagen, verwende Fallback...');
        // Fallback zu simpler Regex
        parseCaption(caption, suggestedTitel);
        return;
      }

      if (data) {
        console.log('[ShareRecipePage] Groq parse success:', data);
        setParsed({
          titel: data.titel,
          zutaten: data.zutaten.join('\n'),
          zubereitung: data.zubereitung.join('\n'),
        });
      }
    } catch (err) {
      console.error('[ShareRecipePage] Parse error:', err);
      setParseError('Parsing-Fehler, verwende Fallback...');
      // Fallback zu Regex
      parseCaption(caption, suggestedTitel);
    }
  };

  const parseCaption = (caption: string, suggestedTitel: string) => {
    // FALLBACK: Einfaches Regex-Parsing falls Groq fehlschlägt
    console.log('[ShareRecipePage] Using regex fallback parser');
    let titel = suggestedTitel.split('\n')[0].slice(0, 100) || 'Neues Rezept';
    let zutaten = '';
    let zubereitung = '';

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
        zutaten += trimmed.replace(/^[-•*]\s*/, '') + '\n';
      } else if (mode === 'zubereitung' && trimmed) {
        zubereitung += trimmed.replace(/^\d+[\.\)]\s*/, '') + '\n';
      }
    }

    setParsed({
      titel,
      zutaten: zutaten.trim(),
      zubereitung: zubereitung.trim(),
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⟳</div>
        <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>Instagram wird gelesen...</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Caption wird mit KI analysiert</p>
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
        {caption && (
          <p style={{ margin: '1rem 0 0 0', fontSize: '12px', color: '#666', maxHeight: '120px', overflow: 'auto', background: '#fff', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <strong>📝 Caption-Vorschau:</strong> {caption.slice(0, 200)}{caption.length > 200 ? '...' : ''}
          </p>
        )}
      </div>

      {parseError && (
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', fontSize: '13px', color: '#856404' }}>
          <strong>⚠️ Hinweis:</strong> {parseError}
          {!manualMode && (
            <button
              onClick={() => {
                setManualMode(true);
                setParseError(null);
              }}
              style={{
                marginLeft: '1rem',
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
              Manuell bearbeiten
            </button>
          )}
        </div>
      )}

      <AddRecipeForm
        initialTitel={parsed.titel}
        initialZutaten={parsed.zutaten}
        initialZubereitung={parsed.zubereitung}
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
