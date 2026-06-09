import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}']
      },
      includeAssets: ['favicon.svg', 'pwa-icon.svg'],
      manifest: {
        name: 'KTR-KART',
        short_name: 'KTR-KART',
        description: 'KTR-KART campus marketplace for buying, selling, and chatting with SRM students.',
        theme_color: '#090d16',
        background_color: '#090d16',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
