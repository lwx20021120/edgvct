import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'http'

const SUPABASE_URL = 'https://pninmmjwvxeksyuoqrze.supabase.co'
// Supabase Key — Publishable Key 也可用于 REST API
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_JrxjyUq4OIwo4FmjEcnEew_T6mKSeC7' // fallback

function dataProxyMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    if (!url.pathname.startsWith('/data-proxy')) return next()

    const table = url.searchParams.get('table')
    const select = url.searchParams.get('select') || '*'
    const order = url.searchParams.get('order')
    const limit = url.searchParams.get('limit')

    if (!table) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify({ error: 'table param required' }))
      return
    }

    let supabasePath = `/rest/v1/${table}?select=${encodeURIComponent(select)}`
    if (order) supabasePath += `&order=${encodeURIComponent(order)}`
    if (limit) supabasePath += `&limit=${limit}`

    try {
      const r = await fetch(`${SUPABASE_URL}${supabasePath}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      })
      const data = await r.text()
      res.writeHead(r.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(data)
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      res.end(JSON.stringify({ error: String(e) }))
    }
  }
}

function bilibiliProxyMiddleware() {
  const headers = {
    'Referer': 'https://live.bilibili.com',
    'Origin': 'https://live.bilibili.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  }

  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    if (!url.pathname.startsWith('/api/bilibili-proxy')) return next()

    const roomId = url.searchParams.get('room')
    const type = url.searchParams.get('type')
    const tsUrl = url.searchParams.get('tsUrl')

    try {
      if (type === 'playurl' && roomId) {
        const apiUrl = `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomId}&platform=web&qn=0`
        const apiRes = await fetch(apiUrl, { headers })
        const data = await apiRes.json()

        if (data.code === 0 && data.data?.durl?.length > 0) {
          const streamUrl = data.data.durl[0].url
          if (streamUrl.includes('.m3u8')) {
            const m3u8Res = await fetch(streamUrl, { headers })
            let m3u8Content = await m3u8Res.text()
            m3u8Content = m3u8Content.replace(
              /(https?:\/\/[^\s]+\.ts[^\s]*)/g,
              (match: string) =>
                `/api/bilibili-proxy?type=ts&tsUrl=${encodeURIComponent(match)}`
            )
            res.writeHead(200, { 'Content-Type': 'application/vnd.apple.mpegurl', 'Access-Control-Allow-Origin': '*' })
            res.end(m3u8Content)
            return
          }
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
          res.end(JSON.stringify({ url: streamUrl }))
          return
        }
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ error: data.message || '获取失败' }))
        return
      }

      if (type === 'ts' && tsUrl) {
        const tsRes = await fetch(tsUrl, { headers })
        const buf = await tsRes.arrayBuffer()
        res.writeHead(200, {
          'Content-Type': 'video/mp2t',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60',
        })
        res.end(Buffer.from(buf))
        return
      }

      res.writeHead(400)
      res.end('Invalid type')
    } catch (e) {
      res.writeHead(500)
      res.end(String(e))
    }
  }
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/edgvct/' : '/',
  plugins: [react(), {
    name: 'bilibili-proxy-dev',
    configureServer(server) {
      server.middlewares.use(dataProxyMiddleware())
      server.middlewares.use(bilibiliProxyMiddleware())
    },
  }],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/supabase': {
        target: 'https://pninmmjwvxeksyuoqrze.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/supabase/, ''),
      },
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
}))
