import {
  handleGenerateRequest,
} from '../server/geminiCarImage.mjs'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      res.status(503).json({
        error:
          'GEMINI_API_KEY is not configured. Add it in Vercel env or .env.local for local dev.',
      })
      return
    }

    const origin =
      (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host']
        ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
        : null) ||
      (req.headers.origin ? String(req.headers.origin) : null) ||
      'http://127.0.0.1:5173'

    const result = await handleGenerateRequest(req.body, origin, apiKey)
    res.status(200).json(result)
  } catch (err) {
    const status = err?.status || 500
    res.status(status).json({
      error: err instanceof Error ? err.message : 'Image generation failed',
    })
  }
}
