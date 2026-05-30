import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { WallMessage } from '../types'
import { apiGet, apiPost } from '../config/api'

interface WallContextValue {
  messages: WallMessage[]
  addMessage: (msg: Omit<WallMessage, 'id' | 'createdAt' | 'isPinned'>) => Promise<void>
  pinMessage: (id: string) => void
  removeMessage: (id: string) => void
  loadMore: () => void
  hasMore: boolean
}

const WallContext = createContext<WallContextValue | null>(null)

const WALL_KEY = 'edg_vct_wall_messages'

function loadLocal(): WallMessage[] {
  try {
    const raw = localStorage.getItem(WALL_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function saveLocal(messages: WallMessage[]) {
  localStorage.setItem(WALL_KEY, JSON.stringify(messages))
}

export function WallProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<WallMessage[]>(loadLocal)
  const [hasMore, setHasMore] = useState(true)

  const fetchMessages = useCallback(async () => {
    try {
      const data = await apiGet('/rest/v1/wall_messages?select=*&order=created_at.desc&limit=50')
      if (!data?.length) return
      const remote: WallMessage[] = data.map((r: Record<string, unknown>) => ({
        id: r.id as string,
        nickname: r.nickname as string,
        content: r.content as string,
        imageUrl: r.image_url as string | undefined,
        createdAt: new Date(r.created_at as string).getTime(),
        isPinned: (r.is_pinned as boolean) || false,
      }))
      setMessages(remote)
      saveLocal(remote)
    } catch { /* silent fail */ }
  }, [])

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  const addMessage = useCallback(async (msg: Omit<WallMessage, 'id' | 'createdAt' | 'isPinned'>) => {
    const newMsg: WallMessage = {
      id: crypto.randomUUID(),
      ...msg,
      createdAt: Date.now(),
      isPinned: false,
    }

    setMessages((prev) => {
      const updated = [newMsg, ...prev]
      saveLocal(updated)
      return updated
    })

    try {
      await apiPost('/rest/v1/wall_messages', {
        id: newMsg.id,
        nickname: newMsg.nickname,
        content: newMsg.content,
        image_url: newMsg.imageUrl || null,
        created_at: new Date(newMsg.createdAt).toISOString(),
        is_pinned: newMsg.isPinned,
      })
    } catch { /* silent fail */ }
  }, [])

  const pinMessage = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, isPinned: !m.isPinned } : m,
      )
      saveLocal(updated)
      return updated
    })
  }, [])

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      saveLocal(updated)
      return updated
    })
  }, [])

  const loadMore = useCallback(() => {
    setHasMore(false)
  }, [])

  return (
    <WallContext.Provider value={{ messages, addMessage, pinMessage, removeMessage, loadMore, hasMore }}>
      {children}
    </WallContext.Provider>
  )
}

export function useWallContext() {
  const ctx = useContext(WallContext)
  if (!ctx) throw new Error('useWallContext must be used within WallProvider')
  return ctx
}
