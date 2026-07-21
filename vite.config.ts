import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error — plain Node ESM helper, no types
import { handleGenerateRequest } from './server/geminiCarImage.mjs'

function geminiCarImageApi(): Plugin {
  return {
    name: 'gemini-car-image-api',
    configureServer(server) {
      server.middlewares.use(
        '/api/generate-car-image',
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204
            res.end()
            return
          }
          if (req.method !== 'POST') {
            next()
            return
          }

          const chunks: Buffer[] = []
          req.on('data', (c: Buffer) => chunks.push(c))
          req.on('end', async () => {
            try {
              const env = loadEnv(server.config.mode, process.cwd(), '')
              const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY
              if (!apiKey) {
                res.statusCode = 503
                res.setHeader('Content-Type', 'application/json')
                res.end(
                  JSON.stringify({
                    error:
                      'GEMINI_API_KEY missing. Create .env.local with GEMINI_API_KEY=...',
                  }),
                )
                return
              }

              const raw = Buffer.concat(chunks).toString('utf8')
              const body = raw ? JSON.parse(raw) : {}
              const origin = `http://${req.headers.host || '127.0.0.1:5173'}`
              const result = await handleGenerateRequest(body, origin, apiKey)
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(result))
            } catch (err: unknown) {
              const status =
                err && typeof err === 'object' && 'status' in err
                  ? Number((err as { status: number }).status) || 500
                  : 500
              res.statusCode = status
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  error:
                    err instanceof Error
                      ? err.message
                      : 'Image generation failed',
                }),
              )
            }
          })
        },
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), geminiCarImageApi()],
})
