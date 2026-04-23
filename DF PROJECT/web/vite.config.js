import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'icons.svg'],
            manifest: {
                name: 'GuardVault Enterprise',
                short_name: 'GuardVault',
                description: 'Secure Digital Asset Management',
                theme_color: '#3b82f6',
                background_color: '#0f172a',
                icons: [{
                    src: 'favicon.svg',
                    sizes: '192x192',
                    type: 'image/svg+xml',
                    purpose: 'any maskable'
                }]
            },
            workbox: {
                runtimeCaching: [{
                        urlPattern: /^https:\/\/api\./i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 3600 // 1 hour
                            }
                        }
                    },
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 86400 * 30 // 30 days
                            }
                        }
                    }
                ]
            }
        })
    ],
})