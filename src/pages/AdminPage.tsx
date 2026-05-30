import { useState, useCallback } from 'react'
import { AdminLogin } from '../components/admin/AdminLogin'
import { AdminDashboard } from '../components/admin/AdminDashboard'

export function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('edg_vct_admin_auth') === 'true',
  )

  const handleLogin = useCallback(() => setAuthed(true), [])
  const handleLogout = useCallback(() => setAuthed(false), [])

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
