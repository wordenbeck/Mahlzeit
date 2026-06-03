import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

// Web Share Target API: Register custom Service Worker BEFORE vite-plugin-pwa SW
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(reg => console.log('[App] Custom Share SW registered:', reg.scope))
    .catch(err => console.warn('[App] Failed to register Share SW:', err));

  // Register vite-plugin-pwa SW (auto-generated)
  navigator.serviceWorker.register('/dev/sw.js', { scope: '/' })
    .then(reg => console.log('[App] PWA Service Worker registered:', reg.scope))
    .catch(() => {
      // During dev mode, vite-plugin-pwa might not be available
      console.log('[App] PWA SW not available (expected in dev)');
    });
}
