export interface WallMessage {
  id: string
  nickname: string
  content: string
  imageUrl?: string
  createdAt: number
  isPinned: boolean
}
