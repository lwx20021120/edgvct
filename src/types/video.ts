export interface VideoItem {
  id: string
  title: string
  author: string
  type: 'bilibili' | 'upload'
  bvid?: string
  videoUrl?: string
  thumbnail?: string
  createdAt: number
  isPinned: boolean
}
