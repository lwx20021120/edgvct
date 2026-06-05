import { useState, useCallback } from 'react'
import { apiGet } from '../config/api'

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

  /** 通过 Supabase admin_users 表验证用户名 + 密码 */
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const hash = await sha256(password)

    try {
      const data = await apiGet(
        `/rest/v1/admin_users?username=eq.${encodeURIComponent(username)}&select=password_hash&limit=1`,
      )
      if (Array.isArray(data) && data.length === 1 && data[0].password_hash) {
        if (hash === data[0].password_hash) {
          sessionStorage.setItem(STORAGE_KEY, 'true')
          setIsAuthenticated(true)
          return true
        }
        return false
      }
    } catch {
      // API 不可用，回退到环境变量
      console.warn('admin_users 表查询失败，回退到环境变量验证')
    }

    // Fallback: 环境变量中的预设哈希（开发/离线模式）
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
