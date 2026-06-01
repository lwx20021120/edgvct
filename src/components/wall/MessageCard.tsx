import { Pin, Trash2 } from 'lucide-react'
import { useWallMessages } from '../../hooks/useWallMessages'
import { useWallContext } from '../../context/WallContext'
import type { WallMessage } from '../../types'

const FAN_BADGES = ['🔥 淀粉', '⚡ 铁粉', '👑 十年老粉', '🎯 死忠粉']

function getFanBadge(nickname: string): string {
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = ((hash << 5) - hash) + nickname.charCodeAt(i)
    hash |= 0
  }
  return FAN_BADGES[Math.abs(hash) % FAN_BADGES.length]
}

interface MessageCardProps {
  message: WallMessage
  isAdmin: boolean
}

export function MessageCard({ message, isAdmin }: MessageCardProps) {
  const { formatRelativeTime } = useWallMessages()
  const { pinMessage, removeMessage } = useWallContext()
  const badge = getFanBadge(message.nickname)

  return (
    <div
      className={`relative rounded-lg bg-[#111]/80 backdrop-blur-sm p-4 transition-all duration-200 ${
        message.isPinned
          ? 'border-l-[3px] border-l-gold bg-gradient-to-r from-gold/[0.08] to-transparent border border-gold/10'
          : 'border border-white/[0.04] border-l-[3px] border-l-transparent hover:border-l-primary/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {message.isPinned && (
            <span className="inline-flex items-center gap-0.5 rounded bg-gold/15 px-1.5 py-0.5 text-caption font-medium text-gold flex-shrink-0">
              <Pin className="h-3 w-3" />
              置顶
            </span>
          )}
          <span className="text-body-sm font-bold text-text-primary truncate">
            {message.nickname}
          </span>
          <span className="text-caption text-primary/70 bg-primary/5 rounded px-1.5 py-0.5 font-medium flex-shrink-0">
            {badge}
          </span>
          <span className="text-caption text-text-tertiary flex-shrink-0">
            {formatRelativeTime(message.createdAt)}
          </span>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <button
              onClick={() => pinMessage(message.id)}
              className={`rounded p-1 transition-colors ${
                message.isPinned
                  ? 'text-gold hover:text-gold-light'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
              title={message.isPinned ? '取消置顶' : '置顶'}
            >
              <Pin className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => removeMessage(message.id)}
              className="rounded p-1 text-text-tertiary hover:text-error transition-colors"
              title="删除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="mt-2 text-body-sm text-text-secondary whitespace-pre-wrap break-words">
        {message.content}
      </p>

      {/* Image */}
      {message.imageUrl && (
        <div className="mt-2">
          <img
            src={message.imageUrl}
            alt="留言图片"
            className="max-h-48 w-auto rounded-md ring-1 ring-white/10 object-cover"
            loading="lazy"
          />
        </div>
      )}
    </div>
  )
}
