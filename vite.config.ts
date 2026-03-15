import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
    VitePWA({
      devOptions: {
        enabled: false,
      },
      filename: 'sw.ts',
      includeAssets: [
        'favicon.png',
        'assets/guts-image-optimized.webp',
        'assets/guts-swords-crossed-transparent-optimized.png',
        'assets/og-image.webp',
        'pwa/apple-touch-icon.png',
      ],
      injectManifest: {
        globPatterns: ['**/*.{css,html,ico,js,json,mp3,png,svg,webp,woff2}'],
      },
      manifest: {
        background_color: '#fafafa',
        display: 'standalone',
        icons: [
          {
            src: '/pwa/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            src: '/pwa/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        name: 'Tekketsu',
        orientation: 'portrait',
        scope: '/',
        short_name: 'Tekketsu',
        start_url: '/workout',
        theme_color: '#fafafa',
      },
      registerType: 'prompt',
      srcDir: 'src',
      strategies: 'injectManifest',
    }),
  ],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src') + '/',
      '@convex/': path.resolve(__dirname, './convex') + '/',
    },
  },
})
