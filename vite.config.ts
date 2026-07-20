import { writeFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only endpoint used once to write the generated share card to disk from
 * og-gen.html. Kept in the repo so the image can be regenerated after a copy
 * or brand change instead of being a mystery binary nobody can reproduce.
 * It never ships: `apply: 'serve'` keeps it out of the build.
 */
function ogWriter() {
  return {
    name: 'og-writer',
    apply: 'serve' as const,
    configureServer(server: {
      middlewares: {
        use: (path: string, fn: (req: unknown, res: unknown) => void) => void
      }
    }) {
      server.middlewares.use('/__save-og', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('POST only')
          return
        }
        let body = ''
        req.on('data', (chunk: Buffer) => {
          body += chunk
        })
        req.on('end', () => {
          const base64 = body.replace(/^data:image\/png;base64,/, '')
          writeFileSync(new URL('./public/og.png', import.meta.url), Buffer.from(base64, 'base64'))
          res.statusCode = 200
          res.end('written')
        })
      })
    },
  }
}

// Relative base so the built site opens from a file server, a subpath on
// GitHub Pages, or a laptop with no network — all three are real delivery
// targets for this project.
export default defineConfig({
  base: './',
  plugins: [react(), ogWriter()],
  build: {
    assetsInlineLimit: 0,
  },
})
