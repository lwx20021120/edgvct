import { useState, useRef } from 'react'
import { ImagePlus, Send, X, Loader2, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWallContext } from '../../context/WallContext'
import { useFanAuth } from '../../context/FanAuthContext'
import { useToast } from '../shared/Toast'
import { compressImage } from '../../hooks/useWallMessages'
import { MAX_MESSAGE_LENGTH } from '../../config/constants'

export function MessageForm() {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addMessage } = useWallContext()
  const { isLoggedIn, username } = useFanAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

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
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    const trimmedContent = content.trim()

    if (!trimmedContent) { showToast('请输入留言内容', 'warning'); return }
    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      showToast(`留言内容不能超过${MAX_MESSAGE_LENGTH}字`, 'warning')
      return
    }

    setSubmitting(true)
    try {
      await addMessage({
        nickname: username || '匿名粉丝',
        content: trimmedContent,
        imageUrl: image ?? undefined,
      })
      showToast('应援发送成功！')
      setContent('')
      setImage(null)
    } catch {
      showToast('发送失败，请重试', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className="rounded-lg bg-[#111]/80 backdrop-blur-sm border border-white/[0.05] p-4">
        <div className="flex flex-col items-center" style={{ gap: 12 }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            placeholder="登录后发送留言，为 EDG 加油..."
            maxLength={MAX_MESSAGE_LENGTH}
            rows={3}
            className="w-full resize-none rounded-md bg-gradient-to-b from-[#1e1e1e] to-[#111] px-3 py-2 text-body-sm text-text-primary placeholder-text-tertiary outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full rounded-lg bg-gradient-to-r from-primary to-primary-hover
              py-3 text-body font-bold text-white shadow-[0_0_15px_rgba(225,6,0,0.25)]
              hover:shadow-[0_0_25px_rgba(225,6,0,0.4)] transition-all duration-200
              active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            请先登录
          </button>
        </div>
      </div>
    )
  }

  // Logged in state
  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-[#111]/80 backdrop-blur-sm border border-white/[0.05] p-4">
      {/* Username display */}
      <div className="mb-3 flex items-center" style={{ gap: 8 }}>
        <span
          style={{
            fontSize: 12, fontWeight: 500, color: '#E11D48',
            fontFamily: 'Inter, sans-serif', letterSpacing: 0.5,
          }}
        >
          已登录：
        </span>
        <span
          style={{
            fontSize: 13, fontWeight: 600, color: '#F8FAFC',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {username}
        </span>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          placeholder={`为 EDG 加油，${username}...`}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={3}
          className="w-full resize-none rounded-md bg-gradient-to-b from-[#1e1e1e] to-[#111] px-3 py-2 text-body-sm text-text-primary placeholder-text-tertiary outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        <span className="absolute bottom-2 right-2 text-caption text-text-tertiary">
          {content.length}/{MAX_MESSAGE_LENGTH}
        </span>
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

      {/* Emoji quick select */}
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
