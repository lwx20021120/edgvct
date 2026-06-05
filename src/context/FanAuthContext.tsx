import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface FanAuthValue {
  username: string | null
  isLoggedIn: boolean
  login: (username: string) => void
  logout: () => void
}

const FanAuthContext = createContext<FanAuthValue | null>(null)

const STORAGE_KEY = 'edg_vct_fan_auth'

function loadUsername(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveUsername(username: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, username)
  } catch { /* ignore */ }
}

function clearUsername() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}

export function FanAuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(loadUsername)

  const login = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    saveUsername(trimmed)
    setUsername(trimmed)
  }, [])

  const logout = useCallback(() => {
    clearUsername()
    setUsername(null)
  }, [])

  return (
    <FanAuthContext.Provider value={{ username, isLoggedIn: !!username, login, logout }}>
      {children}
    </FanAuthContext.Provider>
  )
}

export function useFanAuth() {
  const ctx = useContext(FanAuthContext)
  if (!ctx) throw new Error('useFanAuth must be used within FanAuthProvider')
  return ctx
}
