import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Loader2, ArrowLeft } from 'lucide-react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useToast } from '../shared/Toast'
import { Link } from 'react-router-dom'

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const { showToast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return

    setLoading(true)
    const success = await login(username.trim(), password)
    setLoading(false)

    if (success) {
      showToast('登录成功')
      onLogin()
    } else {
      showToast('用户名或密码错误', 'error')
      setPassword('')
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-bg-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-body-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <div className="rounded-xl border border-border bg-bg-card p-6 shadow-elevated">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mt-3 text-h2 font-bold text-text-primary">管理面板</h1>
            <p className="mt-1 text-body-sm text-text-tertiary">请输入管理员账号和密码</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="管理员账号"
              autoFocus
              className="w-full rounded-md border border-border bg-bg-secondary px-4 py-3 text-body text-text-primary placeholder-text-tertiary outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="管理密码"
              className="w-full rounded-md border border-border bg-bg-secondary px-4 py-3 text-body text-text-primary placeholder-text-tertiary outline-none focus:border-primary/50 transition-colors mt-3"
            />
            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="mt-4 w-full rounded-md bg-primary py-3 text-body font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              ) : (
                '登录'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
