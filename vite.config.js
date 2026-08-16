import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { runReflection } from './api/_lib/reflection.js'

// Emulates the api/reflect.js Vercel serverless function locally, so
// `npm run dev` and `npm run preview` work end-to-end without needing the
// Vercel CLI. Same reflection logic runs in both dev and production.
function reflectApiMiddleware(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed.' }))
    return
  }

  let raw = ''
  req.on('data', (chunk) => {
    raw += chunk
  })
  req.on('end', async () => {
    let body = {}
    try {
      body = raw ? JSON.parse(raw) : {}
    } catch {
      body = {}
    }

    const result = await runReflection(body?.text)
    res.statusCode = result.status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result.body))
  })
}

function truenorthApiDevPlugin() {
  return {
    name: 'truenorth-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/reflect', reflectApiMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/reflect', reflectApiMiddleware)
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load unprefixed env vars (like GEMINI_API_KEY) from .env / .env.local
  // for the dev-only API middleware above. This runs in the Vite Node
  // process only — it is never bundled into client code.
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  }

  return {
    plugins: [react(), truenorthApiDevPlugin()],
  }
})
