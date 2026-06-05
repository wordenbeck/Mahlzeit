/**
 * Web Share Target Handler
 * Wird per workbox.importScripts in den generierten Service Worker injiziert.
 * Fängt POST /share (vom Web Share Target) ab und legt die Daten in IndexedDB,
 * danach Redirect auf /share wo die React-Seite sie ausliest.
 *
 * WICHTIG: Diese Datei läuft im SW-Scope (kein window). Kein eigener
 * skipWaiting/clientsClaim nötig — das macht der Workbox-SW (autoUpdate).
 */

const SHARE_STORE = 'shared-recipes';
const SHARE_DB = 'MealPlannerDB';
const SHARE_DB_VERSION = 2;

function shareInitDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(SHARE_DB, SHARE_DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(SHARE_STORE)) {
        db.createObjectStore(SHARE_STORE, { keyPath: 'timestamp', autoIncrement: true });
      }
    };
  });
}

async function shareSave(data) {
  const db = await shareInitDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SHARE_STORE, 'readwrite');
    const store = tx.objectStore(SHARE_STORE);
    const req = store.add({ ...data, timestamp: Date.now() });
    req.onsuccess = () => { db.close(); resolve(req.result); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method === 'POST' && request.url.includes('/share')) {
    event.respondWith(
      request.clone().text().then(async (body) => {
        const params = new URLSearchParams(body);
        const sharedData = {
          title: params.get('title') || '',
          text: params.get('text') || '',
          url: params.get('url') || '',
        };
        try {
          await shareSave(sharedData);
        } catch (error) {
          console.error('[ShareSW] save failed:', error);
        }
        return Response.redirect('/share', 303);
      }).catch((error) => {
        console.error('[ShareSW] processing error:', error);
        return new Response('Error processing share', { status: 500 });
      })
    );
  }
});
