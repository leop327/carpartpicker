import type { IncomingMessage, ServerResponse } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error — plain Node ESM helper, no types
import { handleGenerateRequest } from './server/geminiCarImage.mjs'
// @ts-expect-error — plain Node ESM helper, no types
import { lookupVehicleOrDemo, sanitizeVrm } from './server/dvlaLookup.mjs'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

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

          void (async () => {
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

              const raw = await readBody(req)
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
          })()
        },
      )
    },
  }
}

function dvlaApi(): Plugin {
  return {
    name: 'dvla-api',
    configureServer(server) {
      server.middlewares.use(
        '/api/dvla',
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204
            res.end()
            return
          }
          if (req.method !== 'GET' && req.method !== 'POST') {
            next()
            return
          }

          void (async () => {
            try {
              const env = loadEnv(server.config.mode, process.cwd(), '')
              const apiKey = env.DVLA_API_KEY || process.env.DVLA_API_KEY

              let vrm = ''
              if (req.method === 'GET') {
                const url = new URL(
                  req.url || '',
                  `http://${req.headers.host || '127.0.0.1'}`,
                )
                vrm = url.searchParams.get('vrm') || ''
              } else {
                const raw = await readBody(req)
                const body = raw ? JSON.parse(raw) : {}
                vrm = body.vrm || body.registrationNumber || ''
              }

              const data = await lookupVehicleOrDemo(
                sanitizeVrm(vrm),
                apiKey || undefined,
              )
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
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
                    err instanceof Error ? err.message : 'DVLA lookup failed',
                }),
              )
            }
          })()
        },
      )
    },
  }
}

function audioPlaceholderMime(): Plugin {
  return {
    name: 'audio-placeholder-mime',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (!url.startsWith('/audio/') || !url.endsWith('.mp3')) {
          next()
          return
        }
        const filePath = join(process.cwd(), 'public', url)
        if (!existsSync(filePath)) {
          next()
          return
        }
        try {
          const buf = readFileSync(filePath)
          const isWav =
            buf.length >= 12 &&
            buf.toString('ascii', 0, 4) === 'RIFF' &&
            buf.toString('ascii', 8, 12) === 'WAVE'
          res.statusCode = 200
          res.setHeader(
            'Content-Type',
            isWav ? 'audio/wav' : 'audio/mpeg',
          )
          res.setHeader('Cache-Control', 'public, max-age=3600')
          res.end(buf)
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), geminiCarImageApi(), dvlaApi(), audioPlaceholderMime()],
})
