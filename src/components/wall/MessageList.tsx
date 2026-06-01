import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { MessageCard } from './MessageCard'
import type { WallMessage } from '../../types'

interface MessageListProps {
  messages: WallMessage[]
  hasMore: boolean
  onLoadMore: () => void
  isAdmin: boolean
}

export function MessageList({ messages, hasMore, onLoadMore, isAdmin }: MessageListProps) {
  const sorted = useMemo(() => {
    const pinned = messages.filter((m) => m.isPinned)
    const normal = messages.filter((m) => !m.isPinned)
    // Pinned first, then by createdAt desc
    return [
      ...pinned.sort((a, b) => b.createdAt - a.createdAt),
      ...normal.sort((a, b) => b.createdAt - a.createdAt),
    ]
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-[#111]/80 backdrop-blur-sm py-12">
        <p className="text-text-tertiary text-body">还没有应援留言</p>
        <p className="mt-1 text-caption text-text-tertiary">成为第一个为 EDG 加油的淀粉吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map((msg) => (
        <MessageCard key={msg.id} message={msg} isAdmin={isAdmin} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onLoadMore}
            className="flex items-center gap-2 rounded-md ring-1 ring-white/10 px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary hover:bg-[#111] transition-colors"
          >
            <Loader2 className="h-4 w-4" />
            加载更多
          </button>
        </div>
      )}
    </div>
  )
}
