export default async function handler(request) {
  const url = new URL(request.url)
  const roomId = url.searchParams.get('room')
  const type = url.searchParams.get('type')
  const tsUrl = url.searchParams.get('tsUrl')

  const headers = {
    'Referer': 'https://live.bilibili.com',
    'Origin': 'https://live.bilibili.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }

  if (type === 'playurl') {
    const apiUrl = `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomId}&platform=web&qn=0`
    const res = await fetch(apiUrl, { headers })
    const data = await res.json()

    if (data.code === 0 && data.data?.durl?.length > 0) {
      const streamUrl = data.data.durl[0].url
      if (streamUrl.includes('.m3u8')) {
        const m3u8Res = await fetch(streamUrl, { headers })
        let m3u8Content = await m3u8Res.text()
        m3u8Content = m3u8Content.replace(
          /(https?:\/\/[^\s]+\.ts[^\s]*)/g,
          (match) => `/bilibili-proxy?type=ts&tsUrl=${encodeURIComponent(match)}`
        )
        return new Response(m3u8Content, {
          headers: { 'Content-Type': 'application/vnd.apple.mpegurl', 'Access-Control-Allow-Origin': '*' }
        })
      }
      return Response.json({ url: streamUrl })
    }
    return Response.json({ error: data.message || '获取失败' }, { status: 400 })
  }

  if (type === 'ts') {
    const res = await fetch(tsUrl, { headers })
    return new Response(res.body, {
      headers: {
        'Content-Type': 'video/mp2t',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      }
    })
  }

  return new Response('Invalid type', { status: 400 })
}
