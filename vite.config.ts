import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site serves from /trevio-site/, not the domain root —
  // asset URLs need this prefix or they 404 there (local dev is unaffected).
  base: process.env.GITHUB_PAGES ? '/trevio-site/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // The site itself.
        main: resolve(__dirname, 'index.html'),
        // Standalone tuning page for the signal sphere (/sandbox.html).
        // Kept as a separate entry so it never lands in the site's bundle,
        // and so work on the sphere and work on the site don't block each
        // other.
        sandbox: resolve(__dirname, 'sandbox.html'),
      },
    },
  },
})
