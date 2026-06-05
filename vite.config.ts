import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: false,        // wir nutzen das manuell gepflegte public/manifest.webmanifest
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Web-Share-Target-Handler in den generierten SW injizieren —
        // EIN Service Worker für Caching/Update UND /share-POST.
        importScripts: ['share-handler.js'],
        // Recipe-Bilder aus Supabase Storage: stale-while-revalidate cachen
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'mahlzeit-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },  // 30d
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Supabase API: nicht aggressive cachen — Realtime soll greifen
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'mahlzeit-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/rest\//, /^\/auth\//],
        // Vermeidet dass alte Service-Worker stale Daten zeigen
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: false,  // im Dev nicht — interferiert mit HMR
      },
    }),
  ],
});
