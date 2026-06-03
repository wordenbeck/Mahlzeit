/**
 * /share Route — Web Share Target Handler
 * Liest geteilte Instagram-Links, parst Caption, öffnet Rezept-Form
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddRecipeForm } from '../components/AddRecipeForm';

interface SharedData {
  title: string;
  text: string;
  url: string;
  timestamp: number;
}

export function ShareRecipePage() {
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [parsed, setParsed] = useState({ titel: '', zutaten: '', zubereitung: '' });

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
              // 3. Einfaches Parsing
              parseCaption(fullCaption, latest.title || latest.text);
            }
          } catch (e) {
            console.error('Failed to fetch Instagram caption:', e);
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

  const parseCaption = (caption: string, suggestedTitel: string) => {
    // Sehr einfaches Parsing: Trennung nach "Zutaten" / "Zubereitung" Keywords
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
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>📱 Instagram wird gelesen...</p>
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📸 Instagram-Rezept hinzufügen</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fafafa', borderRadius: '8px' }}>
        <p style={{ margin: '0.5rem 0', fontSize: '12px', color: '#666' }}>
          <strong>Quelle:</strong> {sharedData.url}
        </p>
        {caption && (
          <p style={{ margin: '0.5rem 0', fontSize: '12px', color: '#666', maxHeight: '100px', overflow: 'hidden' }}>
            <strong>Caption Preview:</strong> {caption.slice(0, 150)}...
          </p>
        )}
      </div>

      <AddRecipeForm
        initialTitel={parsed.titel}
        initialZutaten={parsed.zutaten}
        initialZubereitung={parsed.zubereitung}
        onSuccess={(recipeId) => {
          // Rezept gespeichert → zu Rezept-Details
          navigate(`/rezepte?open=${recipeId}`);
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
