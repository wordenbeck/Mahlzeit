/**
 * Custom Service Worker für Web Share Target API
 * Handlet Instagram-Reel-Shares und speichert sie in IndexedDB
 * Wird VOR dem Workbox/vite-plugin-pwa SW registriert
 */

const STORE_NAME = 'shared-recipes';
const DB_NAME = 'MealPlannerDB';
const DB_VERSION = 2;

// IndexedDB initialisieren
function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);

    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'timestamp', autoIncrement: true });
      }
    };
  });
}

// Speichere geteilte Daten
async function saveSharedRecipe(data) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.add({
      ...data,
      timestamp: Date.now(),
    });

    req.onsuccess = () => {
      db.close();
      resolve(req.result);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

// Handle Share Target POST
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method === 'POST' && request.url.includes('/share')) {
    event.respondWith(
      request
        .clone()
        .text()
        .then(async (body) => {
          const params = new URLSearchParams(body);
          const sharedData = {
            title: params.get('title') || '',
            text: params.get('text') || '',
            url: params.get('url') || '',
          };

          try {
            await saveSharedRecipe(sharedData);
          } catch (error) {
            console.error('[SW] Failed to save shared recipe:', error);
          }

          // Redirect zu /share page
          return new Response('', {
            status: 303,
            headers: { Location: '/share' },
          });
        })
        .catch((error) => {
          console.error('[SW] Error processing share:', error);
          return new Response('Error processing share', { status: 500 });
        })
    );
  }
});

// Service Worker installieren/aktivieren
self.addEventListener('install', () => {
  console.log('[SW] Share Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('[SW] Share Service Worker activating...');
  self.clients.claim();
});
