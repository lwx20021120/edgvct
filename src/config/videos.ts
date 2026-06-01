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
  // GitHub Pages 静态托管下跳过 API 调用，使用本地预设数据
  if (import.meta.env.PROD && window.location.hostname.includes('github.io')) {
    console.log('seedVideos: static hosting detected, using preset videos')
    return
  }
  try {
    const data = await apiGet('/rest/v1/video_playlist?select=id&limit=1')
    if (typeof data === 'string') {
      console.warn('seedVideos: API returned text, using preset videos')
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
    console.warn('seedVideos: API unavailable (expected on static hosting), using preset videos')
  }
}
