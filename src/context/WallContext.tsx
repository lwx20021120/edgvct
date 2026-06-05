import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { WallMessage } from '../types'
import { apiGet, apiPost, apiPatch, apiDelete } from '../config/api'

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
  try {
    localStorage.setItem(WALL_KEY, JSON.stringify(messages))
  } catch { /* ignore */ }
}

/** 尝试从 Supabase 拉取留言，失败则用本地数据 */
async function tryFetchRemote(): Promise<WallMessage[] | null> {
  try {
    const data = await apiGet('/rest/v1/wall_messages?select=*&order=created_at.desc&limit=100')
    if (!Array.isArray(data) || !data.length) return null
    return data.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      nickname: r.nickname as string,
      content: r.content as string,
      imageUrl: r.image_url as string | undefined,
      createdAt: new Date(r.created_at as string).getTime(),
      isPinned: (r.is_pinned as boolean) || false,
    }))
  } catch {
    return null
  }
}

/** 尝试同步单条留言到 Supabase */
async function tryPushRemote(msg: WallMessage): Promise<boolean> {
  try {
    await apiPost('/rest/v1/wall_messages', {
      id: msg.id,
      nickname: msg.nickname,
      content: msg.content,
      image_url: msg.imageUrl || null,
      created_at: new Date(msg.createdAt).toISOString(),
      is_pinned: msg.isPinned,
    })
    return true
  } catch {
    return false
  }
}

/** 同步置顶状态到 Supabase */
async function tryUpdateRemote(id: string, isPinned: boolean): Promise<boolean> {
  try {
    await apiPatch(`/rest/v1/wall_messages?id=eq.${encodeURIComponent(id)}`, { is_pinned: isPinned })
    return true
  } catch {
    return false
  }
}

/** 从 Supabase 删除留言 */
async function tryDeleteRemote(id: string): Promise<boolean> {
  try {
    await apiDelete(`/rest/v1/wall_messages?id=eq.${encodeURIComponent(id)}`)
    return true
  } catch {
    return false
  }
}

/** 合并远程和本地留言（去重，远程为主，保留本地独有的） */
function mergeRemote(prev: WallMessage[], remote: WallMessage[]): WallMessage[] {
  const ids = new Set(remote.map((m) => m.id))
  const localOnly = prev.filter((m) => !ids.has(m.id))
  return [...remote, ...localOnly]
}

export function WallProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<WallMessage[]>(loadLocal)
  const [hasMore, setHasMore] = useState(true)
  // 首次加载：先用本地数据渲染，再尝试从 Supabase 同步
  useEffect(() => {
    tryFetchRemote().then((remote) => {
      if (remote && remote.length > 0) {
        setMessages((prev) => {
          const merged = mergeRemote(prev, remote)
          saveLocal(merged)
          return merged
        })
      }
    }).catch(() => {})
  }, [])

  // 定期同步（每30秒）
  useEffect(() => {
    const interval = setInterval(() => {
      tryFetchRemote().then((remote) => {
        if (remote && remote.length > 0) {
          setMessages((prev) => {
            const merged = mergeRemote(prev, remote)
            saveLocal(merged)
            return merged
          })
        }
      }).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const addMessage = useCallback(async (msg: Omit<WallMessage, 'id' | 'createdAt' | 'isPinned'>) => {
    const newMsg: WallMessage = {
      id: crypto.randomUUID(),
      ...msg,
      createdAt: Date.now(),
      isPinned: false,
    }

    // 立即更新本地
    setMessages((prev) => {
      const updated = [newMsg, ...prev]
      saveLocal(updated)
      return updated
    })

    // 后台尝试同步到云端
    tryPushRemote(newMsg).then((ok) => {
      if (!ok) console.debug('应援墙：留言已保存到本地（云端暂不可用）')
    })
  }, [])

  const pinMessage = useCallback((id: string) => {
    setMessages((prev) => {
      const target = prev.find((m) => m.id === id)
      if (!target) return prev
      const newPinned = !target.isPinned
      const updated = prev.map((m) =>
        m.id === id ? { ...m, isPinned: newPinned } : m,
      )
      saveLocal(updated)
      // 后台同步到云端
      tryUpdateRemote(id, newPinned).then((ok) => {
        if (!ok) console.debug('应援墙：置顶状态已保存到本地（云端暂不可用）')
      })
      return updated
    })
  }, [])

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      saveLocal(updated)
      return updated
    })
    // 后台同步删除到云端
    tryDeleteRemote(id).then((ok) => {
      if (!ok) console.debug('应援墙：删除已保存到本地（云端暂不可用）')
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
