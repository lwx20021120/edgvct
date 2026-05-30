// In dev, requests go through Vite proxy (/api/supabase)
// In production EdgeOne, the full URL is used directly
const BASE = import.meta.env.DEV
  ? '/api/supabase'
  : 'https://pnimmsjwvxeksyuoqrze.supabase.co'

const KEY = 'sb_publishable_JrxjyUq4OIwo4FmjEcnEew_T6mKSeC7'

const headers = {
  'apikey': KEY,
  'Authorization': `Bearer ${KEY}`,
  'Cache-Control': 'no-cache',
}

export async function apiGet(path: string) {
  const r = await fetch(`${BASE}${path}`, { headers })
  const text = await r.text()
  if (!r.ok) throw new Error(`${r.status}: ${text.slice(0, 200)}`)
  try { return JSON.parse(text) } catch { return text }
}

export async function apiPost(path: string, body: unknown) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(body),
  })
  const text = await r.text()
  if (!r.ok) throw new Error(`${r.status}: ${text.slice(0, 200)}`)
  try { return JSON.parse(text) } catch { return text }
}

export function apiUpload(bucket: string, fileName: string, file: File) {
  return fetch(`${BASE}/storage/v1/object/${bucket}/${fileName}`, {
    method: 'POST',
    headers: { ...headers, 'Cache-Control': 'max-age=31536000' },
    body: file,
  })
}

export function getPublicUrl(bucket: string, fileName: string) {
  return `${BASE}/storage/v1/object/public/${bucket}/${fileName}`
}
