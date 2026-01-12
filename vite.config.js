import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
      VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/favicon.ico'],
      manifest: {
        name: '爱爱的祥',
        short_name: '爱爱的祥',
        description: '爱祥cp网站',
        start_url: '/',
        display: 'standalone',
        background_color: '#ba91cc',
        theme_color: '#ba91cc',
        icons: [
          {
            src: 'assets/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
        workbox: {
          navigateFallback: '/'
        }
    })
  ],
  server: {
    host: true, // Set to true to listen on all addresses, or '0.0.0.0'
    port: 5173, // Optional: specify a port (default is 5173)
  },
})
