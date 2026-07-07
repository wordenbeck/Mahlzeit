import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './styles/tokens.css';
import './styles/reset.css';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// =====================================================================
// Service Worker — EIN SW (vite-plugin-pwa generiert, autoUpdate).
// Der Share-Target-POST-Handler ist via workbox.importScripts injiziert.
// Vorher gab es ZWEI konkurrierende SW (custom /sw.js + generierter) die
// auf denselben Dateinamen kollidierten → Fixes erschienen nie am iPhone.
// =====================================================================
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Neue Version ist da. autoUpdate aktiviert sie; wir zeigen kurz einen
    // Hinweis und laden dann neu, damit der Nutzer sieht dass es frisch ist.
    showUpdateToast(() => updateSW(true));
  },
  onRegisteredSW(_swUrl, registration) {
    // Alle 60s nach Updates schauen — so landen Deploys auch in einer
    // lange offenen PWA-Session, ohne dass man die App neu starten muss.
    if (registration) {
      setInterval(() => registration.update(), 60 * 1000);
    }
  },
});

function showUpdateToast(onReload: () => void) {
  const bar = document.createElement('div');
  bar.setAttribute('role', 'status');
  bar.style.cssText = [
    'position:fixed', 'left:50%', 'bottom:24px', 'transform:translateX(-50%)',
    'z-index:9999', 'background:#006C49', 'color:#fff', 'padding:12px 18px',
    'border-radius:14px', 'box-shadow:0 8px 30px rgba(6,78,59,.35)',
    'font:600 14px/1.2 -apple-system,system-ui,sans-serif',
    'display:flex', 'align-items:center', 'gap:12px',
  ].join(';');
  const label = document.createElement('span');
  label.textContent = '✨ Neue Version geladen';
  bar.appendChild(label);
  const btn = document.createElement('button');
  btn.textContent = 'Aktualisieren';
  btn.style.cssText = 'background:#fff;color:#006C49;border:none;border-radius:999px;padding:7px 14px;font:700 13px -apple-system,system-ui;';
  btn.onclick = onReload;
  bar.appendChild(btn);
  document.body.appendChild(bar);
  // Falls der Nutzer nicht tippt: nach 4s automatisch neu laden.
  setTimeout(onReload, 4000);
}
