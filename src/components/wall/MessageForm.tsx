import { useState, useRef } from 'react'
import { ImagePlus, Send, X, Loader2 } from 'lucide-react'
import { useWallContext } from '../../context/WallContext'
import { useToast } from '../shared/Toast'
import { compressImage } from '../../hooks/useWallMessages'
import { MAX_NICKNAME_LENGTH, MAX_MESSAGE_LENGTH } from '../../config/constants'

export function MessageForm() {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addMessage } = useWallContext()
  const { showToast } = useToast()

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'warning')
      return
    }
    setUploading(true)
    try {
      const base64 = await compressImage(file)
      setImage(base64)
    } catch {
      showToast('图片处理失败，请重试', 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedNick = nickname.trim()
    const trimmedContent = content.trim()

    if (!trimmedNick) { showToast('请输入昵称', 'warning'); return }
    if (!trimmedContent) { showToast('请输入留言内容', 'warning'); return }
    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      showToast(`留言内容不能超过${MAX_MESSAGE_LENGTH}字`, 'warning')
      return
    }

    setSubmitting(true)
    try {
      await addMessage({
        nickname: trimmedNick,
        content: trimmedContent,
        imageUrl: image ?? undefined,
      })
      showToast('应援发送成功！')
      setNickname('')
      setContent('')
      setImage(null)
    } catch {
      showToast('发送失败，请重试', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-[#111] p-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, MAX_NICKNAME_LENGTH))}
          placeholder="你的昵称"
          maxLength={MAX_NICKNAME_LENGTH}
          className="w-28 flex-shrink-0 rounded-md bg-gradient-to-b from-[#1e1e1e] to-[#111] px-3 py-2 text-body-sm text-text-primary placeholder-text-tertiary outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            placeholder="写下你的应援...（最多500字）"
            maxLength={MAX_MESSAGE_LENGTH}
            rows={3}
            className="w-full resize-none rounded-md bg-gradient-to-b from-[#1e1e1e] to-[#111] px-3 py-2 text-body-sm text-text-primary placeholder-text-tertiary outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <span className="absolute bottom-2 right-2 text-caption text-text-tertiary">
            {content.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>

      {/* Image preview */}
      {image && (
        <div className="mt-3 relative inline-block">
          <img
            src={image}
            alt="上传预览"
            className="h-20 w-20 rounded-md object-cover ring-1 ring-white/10"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-bg-elevated ring-1 ring-white/10 text-text-tertiary hover:text-text-primary"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Emoji 快捷选择 */}
      <div className="mt-3 flex items-center gap-1.5">
        {['🔥', '💪', '⚡', '🏆', '❤️'].map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setContent((c) => (c + emoji).slice(0, MAX_MESSAGE_LENGTH))}
            className="rounded-md px-2 py-1 text-lg hover:bg-bg-elevated transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-md ring-1 ring-white/10 px-3 py-1.5 text-caption text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? '处理中...' : '上传图片'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-gradient-to-r from-primary to-primary-hover
            py-3 text-body font-bold text-white shadow-[0_0_15px_rgba(225,6,0,0.25)]
            hover:shadow-[0_0_25px_rgba(225,6,0,0.4)] transition-all duration-200
            active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          发送应援 🔥
        </button>
      </div>
    </form>
  )
}
