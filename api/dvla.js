import { lookupVehicleOrDemo, sanitizeVrm } from '../server/dvlaLookup.mjs'

function readVrm(req) {
  if (req.method === 'GET') {
    const q = req.query?.vrm ?? req.query?.registrationNumber
    return typeof q === 'string' ? q : Array.isArray(q) ? q[0] : ''
  }
  const body = req.body || {}
  return body.vrm || body.registrationNumber || ''
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const apiKey = process.env.DVLA_API_KEY
    const vrm = sanitizeVrm(readVrm(req))
    const data = await lookupVehicleOrDemo(vrm, apiKey)
    res.status(200).json(data)
  } catch (err) {
    const status = err?.status || 500
    res.status(status).json({
      error: err instanceof Error ? err.message : 'DVLA lookup failed',
    })
  }
}
