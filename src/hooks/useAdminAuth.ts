import { useState, useCallback } from 'react'

const STORAGE_KEY = 'edg_vct_admin_auth'

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true',
  )

  const login = useCallback(async (password: string): Promise<boolean> => {
    const hash = await sha256(password)
    const expectedHash =
      import.meta.env.VITE_ADMIN_PASSWORD_HASH ||
      '5e884898da28047151d0e56f8dc6292773603d0d6aabbdde2a5efcf1ab0a7e1c'

    if (hash === expectedHash) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, login, logout }
}
