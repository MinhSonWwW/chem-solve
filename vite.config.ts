import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(() => {
  const isGitHub = !!(process.env.GITHUB_ACTIONS || process.env.GITHUB_PAGES);
  const base = process.env.BASE_URL || (isGitHub ? '/chem-solve/' : '/');

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'mask-icon.svg'],
        workbox: {
          // App shell + all lesson chunks (default) + the 7 tiny reward videos (~340 KB).
          // Videos are precached because they are fetched with Range requests (206),
          // which runtime caching cannot store.
          // Plus the six small currency/HUD icons shown on almost every screen (~480 KB),
          // so the header never shows broken images offline even if they were never seen online.
          globPatterns: [
            '**/*.{js,wasm,css,html}',
            'assets/animations/*.mp4',
            'assets/icons/{chem-coin,gem-crystal,heart-flask,streak-flame,xp-potion}.png',
            'assets/roadmap/trophy-gold.png',
          ],
          runtimeCaching: [
            {
              // Mascots, icons, roadmap art (~45 MB total): cache each image the first
              // time it is shown, so it keeps working offline without a huge first download.
              urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'sci-images',
                expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 90 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'google-fonts-css' },
            },
            {
              urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-files',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        manifest: {
          name: 'Sci-Solve: Học Khoa Học Tự Nhiên THCS',
          short_name: 'SciSolve',
          description: 'Web giải bài tập Khoa học Tự nhiên THCS (Hóa học, Sinh học, Vật lý) lớp 6-9 theo phương pháp tương tác',
          theme_color: '#151513',
          background_color: '#151513',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['motion'],
            'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});
