const SUPABASE_URL = 'https://pnimmsjwvxeksyuoqrze.supabase.co'
const SUPABASE_KEY = 'sb_publishable_JrxjyUq4OIwo4FmjEcnEew_T6mKSeC7'

export default async function handler(request) {
  const url = new URL(request.url)
  const table = url.searchParams.get('table')
  const select = url.searchParams.get('select') || '*'
  const order = url.searchParams.get('order')
  const limit = url.searchParams.get('limit')

  if (!table) {
    return new Response(JSON.stringify({ error: 'table param required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  let path = `/rest/v1/${table}?select=${encodeURIComponent(select)}`
  if (order) path += `&order=${encodeURIComponent(order)}`
  if (limit) path += `&limit=${limit}`

  const res = await fetch(`${SUPABASE_URL}${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  })
  const data = await res.text()

  return new Response(data, {
    status: res.status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
