/**
 * Service Worker Handler für Web Share Target API
 * Registriert den /share route und speichert die geteilten Daten in IndexedDB
 * Damit kann die React-App später darauf zugreifen
 */

declare const self: ServiceWorkerGlobalScope;

export function setupShareHandler() {
  self.addEventListener('fetch', (event: FetchEvent) => {
    const { request } = event;

    // /share POST requests
    if (request.method === 'POST' && request.url.includes('/share')) {
      event.respondWith(
        request.clone().text().then(async (body) => {
          // Parse form data: "title=...&text=...&url=..."
          const params = new URLSearchParams(body);
          const sharedData = {
            title: params.get('title') || '',
            text: params.get('text') || '',
            url: params.get('url') || '',
            timestamp: Date.now(),
          };

          // Store in IndexedDB für später
          try {
            const db = await new Promise<IDBDatabase>((resolve, reject) => {
              const req = indexedDB.open('MealPlannerDB', 1);
              req.onsuccess = () => resolve(req.result);
              req.onerror = () => reject(req.error);
            });

            const tx = db.transaction('sharedData', 'readwrite');
            const store = tx.objectStore('sharedData');
            store.add(sharedData);

            db.close();
          } catch (e) {
            console.error('Failed to store shared data:', e);
          }

          // Redirect zu /share page
          return new Response('', {
            status: 303,
            headers: { Location: '/share' },
          });
        })
      );
    }
  });
}

// Initiate IndexedDB bei Service Worker install
self.addEventListener('install', () => {
  const db = indexedDB.open('MealPlannerDB', 1);
  db.onupgradeneeded = (e: IDBVersionChangeEvent) => {
    const database = (e.target as IDBOpenDBRequest).result;
    if (!database.objectStoreNames.contains('sharedData')) {
      database.createObjectStore('sharedData', { keyPath: 'timestamp' });
    }
  };
});
