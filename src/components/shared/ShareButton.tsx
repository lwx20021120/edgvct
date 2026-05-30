import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface ShareButtonProps {
  title?: string
  text?: string
  url?: string
  className?: string
}

export function ShareButton({
  title = 'EDG 无畏契约伦敦大师赛应援站',
  text = '为 EDward Gaming 加油！直播、赛中数据、选手信息、应援墙一站聚合。',
  url = typeof window !== 'undefined' ? window.location.href : '',
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch {
        // User cancelled or API failed, fall through to copy
      }
    }
    // Fallback: copy link (WeChat built-in browser, etc.)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Last resort: select and copy
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm text-white transition-colors hover:bg-primary-hover active:scale-95 ${className}`}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {copied ? '链接已复制' : '分享给更多淀粉'}
    </button>
  )
}
