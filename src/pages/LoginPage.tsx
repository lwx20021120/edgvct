import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, LogIn, Loader2 } from 'lucide-react'
import { useFanAuth } from '../context/FanAuthContext'

const T = {
  accent: '#E11D48',
  bgCard: '#0C0C0D',
  border: '#302E82',
  text: '#F8FAFC',
  text2: '#94A3B8',
  text3: '#666666',
}

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useFanAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) return
    if (!password.trim()) return

    setLoading(true)
    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 400))
    login(username.trim())
    setLoading(false)
    navigate('/', { replace: true })
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-4 relative"
      style={{
        background: 'linear-gradient(180deg, #0A0A0F 0%, #05050A 100%)',
      }}
    >
      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-8 left-8 inline-flex items-center gap-1.5 hover:text-white transition-colors"
        style={{ fontSize: 14, color: T.text2, fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
        style={{
          width: 440,
          padding: '48px 40px',
          backgroundColor: `${T.bgCard}99`,
          border: `1px solid ${T.border}4D`,
          gap: 28,
        }}
      >
        {/* Brand */}
        <div className="flex flex-col items-center" style={{ gap: 8 }}>
          <span
            style={{
              fontSize: 36, fontWeight: 700, color: T.accent,
              fontFamily: 'Space Grotesk, Inter, sans-serif', letterSpacing: 6,
            }}
          >
            EDG
          </span>
          <span
            style={{
              fontSize: 13, fontWeight: 500, color: T.text2,
              fontFamily: 'Space Grotesk, Inter, sans-serif', letterSpacing: 2,
            }}
          >
            VCT LONDON 2026 · 选手登录
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%', height: 1,
            background: `linear-gradient(90deg, transparent, ${T.border}66, ${T.accent}33, ${T.border}66, transparent)`,
          }}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col w-full" style={{ gap: 20 }}>
          {/* Username */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="游戏名#标签"
              autoFocus
              maxLength={30}
              style={{
                height: 50, padding: '0 16px',
                backgroundColor: '#0A0A0F',
                border: `1px solid ${T.border}66`,
                color: T.text, fontSize: 15, fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
              className="focus:border-red-500 transition-colors"
            />
            <span style={{ fontSize: 12, color: T.text3, fontFamily: 'Inter, sans-serif', paddingLeft: 2 }}>
              建议格式：游戏名#标签，如 EDGZmjjKK#CN
            </span>
          </div>

          {/* Password */}
          <div className="flex flex-col" style={{ gap: 6 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="······"
              maxLength={6}
              style={{
                height: 50, padding: '0 16px',
                backgroundColor: '#0A0A0F',
                border: `1px solid ${T.border}66`,
                color: T.text, fontSize: 15, fontFamily: 'Inter, sans-serif',
                outline: 'none', letterSpacing: 4,
              }}
              className="focus:border-red-500 transition-colors"
            />
            <span style={{ fontSize: 12, color: T.text3, fontFamily: 'Inter, sans-serif', paddingLeft: 2 }}>
              建议使用6位数字密码
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-all mt-2"
            style={{
              height: 50, backgroundColor: T.accent, border: 'none', cursor: 'pointer',
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: 2 }}>
              {loading ? '登录中...' : '登录'}
            </span>
          </button>
        </form>

        {/* Bottom hint */}
        <p style={{ fontSize: 13, color: T.text3, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          登录后自动返回首页
        </p>
      </motion.div>
    </div>
  )
}
