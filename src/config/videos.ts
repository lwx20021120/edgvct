import { apiGet, apiPost } from './api'

export const presetVideos = [
  {
    title: 'EDG最新应援曲《康丝戏（冠军戏）》完整版',
    author: '陈杏语',
    type: 'bilibili' as const,
    bvid: 'BV1hBVa6CEi6',
    isPinned: false,
  },
  {
    title: 'EDG民谣摇滚《康神指月》超高音 · 应援ZmjjKK',
    author: 'EDG粉丝',
    type: 'bilibili' as const,
    bvid: 'BV1DnRQBwETw',
    isPinned: false,
  },
  {
    title: 'When The World Ends - EDG LEV入场音乐（首尔全球冠军赛仁川入场曲）',
    author: 'EDG电子竞技俱乐部',
    type: 'bilibili' as const,
    bvid: 'BV1QKqtYAESH',
    isPinned: true,
  },
]

export async function seedVideos() {
  try {
    const data = await apiGet('/rest/v1/video_playlist?select=id&limit=1')
    if (typeof data === 'string') {
      console.error('seedVideos: API returned text:', data)
      return
    }
    if (Array.isArray(data) && data.length > 0) {
      console.log('seedVideos: data already exists, skipping')
      return
    }
    for (const v of presetVideos) {
      await apiPost('/rest/v1/video_playlist', v)
      console.log('seedVideos: inserted', v.bvid)
    }
  } catch (e) {
    console.error('seedVideos exception:', e)
  }
}
