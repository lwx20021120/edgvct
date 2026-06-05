import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Upload, Send, User, Loader2, X } from 'lucide-react'
import { useDataContext } from '../context/DataContext'
import { useWallContext } from '../context/WallContext'
import { useFanAuth } from '../context/FanAuthContext'
import { useToast } from '../components/shared/Toast'
import { presetVideos } from '../config/videos'
import { apiPost, getPublicUrl, apiUpload } from '../config/api'
import { MAX_MESSAGE_LENGTH } from '../config/constants'
import type { Player } from '../types'

// Player photo imports
import player0 from '../../jpg/0.png'
import playerChichoo from '../../jpg/CHICHOO.jpg'
import playerJieni7 from '../../jpg/jieni7.jpg'
import playerNobody from '../../jpg/Nobody_winning_Champions_2024.jpg'
import playerSmoggy from '../../jpg/Smoggy_winning_Champions_2024.jpg'
import playerZmjjKK from '../../jpg/ZmjjKK_at_VALORANT_Champions_2024.jpg'

const playerPhotos: Record<string, string> = {
  ZmjjKK: playerZmjjKK,
  nobody: playerNobody,
  Smoggy: playerSmoggy,
  CHICHOO: playerChichoo,
  Jieni7: playerJieni7,
  '0': player0,
}

/* ═══════════ Design Tokens (from SVG) ═══════════ */
const T = {
  accent: '#E11D48',
  accentHover: '#FB254E',
  bg: '#000000',
  bgCard: '#0C0C0D',
  bgElevated: '#09090B',
  border: '#312E81',
  borderLight: '#4C4899',
  text: '#F8FAFC',
  text2: '#94A3B8',
  text3: '#666666',
  featBg: '#09090B',
  featAccent: '#020204',
} as const

/* ═══════════ Shared: Divider ═══════════ */
function Divider() {
  return (
    <div
      className="w-full h-px"
      style={{
        background: `linear-gradient(90deg, transparent, ${T.border}66, ${T.accent}33, ${T.border}66, transparent)`,
      }}
    />
  )
}

/* ═══════════ Shared: Section Header ═══════════ */
function SecHead({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center" style={{ gap: 12, maxWidth: 800 }}>
      <span
        style={{
          fontSize: 14, fontWeight: 500, color: T.accent,
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: 2,
        }}
      >
        {tag}
      </span>
      <h2
        style={{
          fontSize: 40, fontWeight: 700, color: T.text,
          fontFamily: 'Space Grotesk, Inter, sans-serif',
        }}
      >
        {title}
      </h2>
      {desc && (
        <p style={{ fontSize: 16, fontWeight: 400, color: T.text2, fontFamily: 'Inter, sans-serif' }}>
          {desc}
        </p>
      )}
    </div>
  )
}

/* ═══════════ Header 77px ═══════════ */
function Header() {
  const { isLoggedIn, username } = useFanAuth()

  return (
    <header
      className="flex items-center justify-between w-full sticky top-0 z-50"
      style={{ height: 77, padding: '0 60px', backgroundColor: `${T.bg}F2`, backdropFilter: 'blur(12px)' }}
    >
      {/* Logo Group */}
      <div className="flex items-center" style={{ gap: 12 }}>
        <Link to="/">
          <span
            style={{
              fontSize: 24, fontWeight: 700, color: T.accent,
              fontFamily: 'Space Grotesk, Inter, sans-serif', letterSpacing: 4,
            }}
          >
            EDG
          </span>
        </Link>
        <div style={{ width: 1, height: 20, backgroundColor: T.border }} />
        <span
          style={{
            fontSize: 12, fontWeight: 500, color: T.text2,
            fontFamily: 'Space Grotesk, sans-serif', letterSpacing: 3,
          }}
        >
          VCT LONDON
        </span>
      </div>

      {/* Nav — desktop */}
      <nav className="hidden md:flex items-center" style={{ gap: 32 }}>
        {['直播', '赛程', '选手', '应援墙'].map((item) => (
          <a
            key={item}
            href={`#${item}`}
            style={{
              fontSize: 14, fontWeight: 500, color: T.text2,
              fontFamily: 'Inter, sans-serif', textDecoration: 'none',
            }}
            className="hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <div className="flex items-center" style={{ gap: 12 }}>
        {isLoggedIn && (
          <span
            className="hidden md:inline"
            style={{ fontSize: 13, fontWeight: 500, color: T.text2, fontFamily: 'Inter, sans-serif' }}
          >
            {username}
          </span>
        )}
        <Link to={isLoggedIn ? '/' : '/login'}>
          <button
            className="flex items-center justify-center"
            style={{
              height: 37, padding: '0 22px', backgroundColor: T.accent,
              cursor: 'pointer', border: 'none',
            }}
          >
            <span
              style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: 1.5 }}
            >
              {isLoggedIn ? username?.slice(0, 8) || '已登录' : '登录'}
            </span>
          </button>
        </Link>
      </div>
    </header>
  )
}

/* ═══════════ Hero Section ═══════════ */
function HeroSection() {
  const [showUpload, setShowUpload] = useState(false)
  const { isLoggedIn } = useFanAuth()
  const navigate = useNavigate()

  // Pick a random video from presets
  const [bvid, setBvid] = useState('')
  useEffect(() => {
    const videos = presetVideos
    const idx = Math.floor(Math.random() * videos.length)
    setBvid(videos[idx].bvid)
  }, [])

  function handleUploadClick() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    setShowUpload(true)
  }

  return (
    <section
      className="flex flex-col items-center relative"
      style={{
        width: '100%', maxWidth: 1440, padding: '100px 60px 80px',
        background: `linear-gradient(180deg, ${T.accent}14 0%, transparent 100%)`,
      }}
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center"
        style={{ height: 30, padding: '0 16px', backgroundColor: T.bgCard, gap: 12, marginBottom: 32 }}
      >
        <span
          style={{
            width: 8, height: 8, borderRadius: 4, backgroundColor: T.accent,
            boxShadow: `0 0 8px ${T.accent}CC`, display: 'inline-block',
          }}
        />
        <span
          style={{
            fontSize: 14, fontWeight: 500, color: T.accent,
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: 2,
          }}
        >
          LIVE · VCT 伦敦大师赛 2026
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
        style={{
          fontSize: 72, fontWeight: 700, color: T.text,
          fontFamily: 'Space Grotesk, Inter, sans-serif', letterSpacing: -1,
          maxWidth: 800,
          textShadow: `0 0 80px ${T.accent}26, 0 0 40px ${T.accent}4D, 0 0 16px ${T.accent}99`,
        }}
      >
        无畏契约 · 伦敦大师赛
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mt-4"
        style={{ fontSize: 24, fontWeight: 400, color: T.text2, fontFamily: 'Inter, sans-serif' }}
      >
        EDward Gaming · CN 电竞荣耀
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-2"
        style={{ fontSize: 16, fontWeight: 400, color: T.text2, fontFamily: 'Inter, sans-serif', maxWidth: 560, lineHeight: '26px' }}
      >
        上传你的应援视频，与全球粉丝一起为 EDG 加油！所有视频云端存储，随机播放
      </motion.p>

      {/* CTA Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex mt-8" style={{ gap: 16 }}
      >
        <button
          onClick={handleUploadClick}
          className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            height: 54, padding: '0 40px', backgroundColor: T.accent,
            boxShadow: `0 0 24px ${T.accent}66, 0 0 48px ${T.accent}33`,
            border: 'none', cursor: 'pointer',
          }}
        >
          <Upload className="w-5 h-5" />
          <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: 2 }}>
            上传视频
          </span>
        </button>
        <a href="#赛程">
          <button
            className="flex items-center justify-center hover:border-opacity-100 transition-all"
            style={{
              height: 50, padding: '0 38px', backgroundColor: 'transparent',
              border: `2px solid ${T.border}`,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: 'Inter, sans-serif', letterSpacing: 2 }}>
              查看赛程
            </span>
          </button>
        </a>
      </motion.div>

      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative mt-12"
        style={{ width: '100%', maxWidth: 800 }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            background: `linear-gradient(180deg, ${T.accent}0D 0%, transparent 100%)`,
            border: `1px solid ${T.border}80`,
            overflow: 'hidden',
          }}
        >
          {/* B站 iframe */}
          {bvid && (
            <iframe
              src={`https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0&muted=1&danmaku=0`}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none',
              }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="粉丝应援视频"
            />
          )}

          {/* Overlay label */}
          <div
            className="absolute top-4 left-4 flex items-center"
            style={{ gap: 8, zIndex: 5, pointerEvents: 'none' }}
          >
            <span
              style={{
                fontSize: 13, fontWeight: 600, color: T.text,
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1,
                backgroundColor: `${T.bg}99`, padding: '4px 12px',
              }}
            >
              粉丝视频墙 · 云端随机播放
            </span>
          </div>

          {/* Central play button overlay */}
          {bvid && (
            <div
              className="absolute flex items-center justify-center"
              style={{
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 80, height: 80, borderRadius: '50%',
                backgroundColor: `${T.accent}CC`,
                boxShadow: `0 0 32px ${T.accent}80`,
                zIndex: 5, pointerEvents: 'none',
              }}
            >
              <Play className="w-10 h-10 text-white" style={{ fill: 'white', marginLeft: 4 }} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && <VideoUploadModal onClose={() => setShowUpload(false)} />}
      </AnimatePresence>
    </section>
  )
}

/* ═══════════ Video Upload Modal ═══════════ */
function VideoUploadModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [bvidInput, setBvidInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { username } = useFanAuth()
  const { showToast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { showToast('请输入视频标题', 'warning'); return }
    if (!bvidInput.trim() && !file) { showToast('请输入B站BV号或上传视频文件', 'warning'); return }

    setUploading(true)
    try {
      let videoUrl: string | undefined
      if (file) {
        const fileName = `${Date.now()}_${file.name}`
        const res = await apiUpload('fan_videos', fileName, file)
        if (res.ok) {
          videoUrl = getPublicUrl('fan_videos', fileName)
        } else {
          showToast('视频上传失败，请重试', 'error')
          setUploading(false)
          return
        }
      }

      const payload = {
        title: title.trim(),
        author: username || '匿名粉丝',
        type: bvidInput.trim() ? 'bilibili' : 'upload',
        bvid: bvidInput.trim() || null,
        video_url: videoUrl || null,
        created_at: new Date().toISOString(),
        is_pinned: false,
      }

      await apiPost('/rest/v1/fan_videos', payload)
      showToast('视频上传成功！将加入随机播放队列')
      onClose()
    } catch {
      showToast('上传失败，请稍后重试', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md mx-4"
        style={{ backgroundColor: T.bgCard, border: `1px solid ${T.border}`, padding: 32 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            上传应援视频
          </h3>
          <button onClick={onClose} style={{ color: T.text3, background: 'none', border: 'none', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 16 }}>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="视频标题"
              className="w-full"
              style={{
                height: 48, padding: '0 16px', backgroundColor: T.bgElevated,
                border: `1px solid ${T.border}`, color: T.text, fontSize: 14,
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
          </div>

          <div>
            <input
              type="text"
              value={bvidInput}
              onChange={(e) => setBvidInput(e.target.value)}
              placeholder="B站视频 BV号（如 BV1xx...）"
              className="w-full"
              style={{
                height: 48, padding: '0 16px', backgroundColor: T.bgElevated,
                border: `1px solid ${T.border}`, color: T.text, fontSize: 14,
                fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
            <p style={{ fontSize: 12, color: T.text3, fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
              或直接上传视频文件
            </p>
          </div>

          <div>
            <label
              className="flex items-center justify-center gap-2 cursor-pointer hover:border-opacity-100 transition-all"
              style={{
                height: 48, border: `1px dashed ${T.border}`, color: T.text2,
                fontSize: 14, fontFamily: 'Inter, sans-serif',
              }}
            >
              <Upload className="w-4 h-4" />
              {file ? file.name : '点击上传视频文件'}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              height: 48, backgroundColor: T.accent, border: 'none',
              cursor: 'pointer', color: '#FFFFFF', fontSize: 16, fontWeight: 600,
              fontFamily: 'Inter, sans-serif', letterSpacing: 1.5,
            }}
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploading ? '上传中...' : '上传视频'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════ Schedule Section ═══════════ */
function ScheduleSection() {
  const { matches } = useDataContext()

  return (
    <section
      id="赛程"
      className="flex flex-col items-center"
      style={{
        width: '100%', maxWidth: 1440, padding: '100px 60px',
        background: `linear-gradient(180deg, #0D0D0D 0%, ${T.bg} 100%)`,
        gap: 48,
      }}
    >
      <SecHead tag="01 — 赛程安排" title="伦敦大师赛 · 赛程" desc="实时追踪 EDG 的比赛进度，不错过每一个精彩瞬间" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full" style={{ maxWidth: 1240 }}>
        {matches.slice(0, 3).map((m, i) => {
          const isLive = m.status === 'live'
          const statusLabel = m.status === 'finished' ? 'FINISHED' : m.status === 'live' ? 'LIVE' : 'UPCOMING'
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col"
              style={{
                padding: 24, gap: 14,
                backgroundColor: T.bgCard,
                border: isLive ? `1px solid ${T.accent}66` : `1px solid ${T.border}33`,
              }}
            >
              <span
                style={{
                  fontSize: 12, fontWeight: 700,
                  color: isLive ? T.accent : T.text2,
                  fontFamily: 'JetBrains Mono, monospace', letterSpacing: 2,
                }}
              >
                {isLive && (
                  <span
                    style={{
                      width: 6, height: 6, borderRadius: 3, backgroundColor: T.accent,
                      display: 'inline-block', marginRight: 8,
                      boxShadow: `0 0 8px ${T.accent}`,
                    }}
                  />
                )}
                {statusLabel}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: T.text2, fontFamily: 'Inter, sans-serif' }}>
                {m.startTime}
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: T.text, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
                {m.edgTeam.shortName} vs {m.opponentTeam.shortName}
              </span>
              <span style={{ fontSize: 14, fontWeight: 400, color: T.text3, fontFamily: 'Inter, sans-serif' }}>
                {m.stage}
              </span>
              {/* Score display */}
              {m.status !== 'upcoming' && (
                <div className="flex items-center" style={{ gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: T.text, fontFamily: 'JetBrains Mono, monospace' }}>
                    {m.score.edg}
                  </span>
                  <span style={{ fontSize: 16, color: T.text3 }}>:</span>
                  <span style={{ fontSize: 28, fontWeight: 700, color: T.text2, fontFamily: 'JetBrains Mono, monospace' }}>
                    {m.score.opponent}
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ═══════════ Players Section (3+2 layout) ═══════════ */
function PlayersSection() {
  const { edgPlayers } = useDataContext()

  // Order: ZmjjKK, nobody, Smoggy (row1) + CHICHOO, Jieni7 (row2)
  const order = ['ZmjjKK', 'nobody', 'Smoggy', 'CHICHOO', 'Jieni7']
  const ordered = order
    .map((name) => edgPlayers.find((p) => p.nickname === name))
    .filter(Boolean) as Player[]

  const row1 = ordered.slice(0, 3)
  const row2 = ordered.slice(3, 5)

  return (
    <section
      id="选手"
      className="flex flex-col items-center"
      style={{ width: '100%', maxWidth: 1440, padding: '100px 60px', gap: 48 }}
    >
      <SecHead tag="02 — 选手阵容" title="EDG 明星选手" desc="了解每一位为荣耀而战的选手" />

      {/* Row 1 — 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full" style={{ maxWidth: 1240 }}>
        {row1.map((p, i) => (
          <PlayerCard key={p.id} player={p} index={i} />
        ))}
      </div>

      {/* Row 2 — 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full" style={{ maxWidth: 820 }}>
        {row2.map((p, i) => (
          <PlayerCard key={p.id} player={p} index={i + 3} />
        ))}
      </div>
    </section>
  )
}

function PlayerCard({ player: p, index }: { player: Player; index: number }) {
  const photo = playerPhotos[p.nickname] || playerPhotos['0']
  const roleLabels: Record<string, string> = {
    Duelist: '决斗者', Initiator: '先锋', Controller: '控场者',
    Sentinel: '哨位', Flex: '自由人',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col group"
      style={{ backgroundColor: T.bgCard, overflow: 'hidden' }}
    >
      {/* Photo */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 280,
          background: `linear-gradient(180deg, ${T.accent}1A 0%, ${T.bgCard} 100%)`,
        }}
      >
        <img
          src={photo}
          alt={p.nickname}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, ${T.bgCard} 0%, transparent 50%)`,
          }}
        />
        {/* MVP badge */}
        {p.isMVP && (
          <div
            className="absolute top-3 right-3"
            style={{
              padding: '4px 10px', backgroundColor: T.accent,
              fontSize: 11, fontWeight: 700, color: '#FFF',
              fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1,
            }}
          >
            MVP
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col" style={{ padding: 20, gap: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
          {p.nickname}
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: T.accent, fontFamily: 'Inter, sans-serif' }}>
          {roleLabels[p.role] || p.role}
        </span>

        {/* Stats */}
        <div style={{ width: '100%', height: 1, backgroundColor: `${T.border}33`, marginTop: 8 }} />
        <div className="flex mt-3" style={{ gap: 4 }}>
          {[
            { label: 'ACS', value: p.stats.acs },
            { label: 'K/D', value: p.stats.kd },
            { label: 'HS%', value: `${p.stats.hsPercent}%` },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center flex-1" style={{ gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: T.text, fontFamily: 'JetBrains Mono, monospace' }}>
                {s.value}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: T.text2, fontFamily: 'Inter, sans-serif' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════ Fan Wall Section (cloud scrolling) ═══════════ */
function FanWallSection() {
  const { messages, addMessage } = useWallContext()
  const { isLoggedIn, username } = useFanAuth()
  const { showToast } = useToast()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSend() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    const trimmed = content.trim()
    if (!trimmed) { showToast('请输入留言内容', 'warning'); return }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      showToast(`留言不能超过${MAX_MESSAGE_LENGTH}字`, 'warning')
      return
    }
    setSubmitting(true)
    try {
      await addMessage({ nickname: username!, content: trimmed })
      setContent('')
      showToast('应援发送成功！')
    } catch {
      showToast('发送失败，请重试', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Randomly assign each message to row 1 or row 2 (stable by id hash)
  const { row1, row2 } = useMemo(() => {
    const r1: typeof messages = []
    const r2: typeof messages = []
    messages.forEach((m) => {
      const hash = m.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      ;(hash % 2 === 0 ? r1 : r2).push(m)
    })
    return { row1: r1, row2: r2 }
  }, [messages])

  return (
    <section
      id="应援墙"
      className="flex flex-col items-center overflow-hidden"
      style={{
        width: '100%', maxWidth: 1440, padding: '100px 60px',
        background: `linear-gradient(180deg, #0D0D0D 0%, ${T.bg} 100%)`,
        gap: 36,
      }}
    >
      <SecHead tag="03 — 应援加油" title="云端实时滚动" desc="留下你的祝福，与万千粉丝一起为 EDG 呐喊" />

      {/* Input + Send */}
      <div className="flex w-full" style={{ maxWidth: 800, gap: 12 }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
          placeholder={isLoggedIn ? `为 EDG 加油，${username}...` : '登录后发送留言，为 EDG 加油...'}
          maxLength={MAX_MESSAGE_LENGTH}
          className="flex-1"
          style={{
            height: 52, padding: '0 18px',
            backgroundColor: T.bgCard, border: `1px solid ${T.border}`,
            color: T.text, fontSize: 15, fontFamily: 'Inter, sans-serif', outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={submitting}
          className="flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{
            height: 52, padding: '0 28px', backgroundColor: T.accent, border: 'none',
            cursor: isLoggedIn ? 'pointer' : 'pointer',
            boxShadow: `0 0 16px ${T.accent}66`,
          }}
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isLoggedIn ? (
            <Send className="w-5 h-5" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span style={{ fontSize: 15, fontWeight: 600, color: '#FFF', fontFamily: 'Inter, sans-serif', letterSpacing: 1 }}>
            {isLoggedIn ? '发送应援' : '请先登录'}
          </span>
        </button>
      </div>

      {/* Two scrolling rows — each message randomly assigned to one row */}
      {messages.length > 0 ? (
        <div className="w-full overflow-hidden" style={{ maxWidth: 1240 }}>
          {/* Row 1 — scroll left */}
          <div className="relative" style={{ padding: '12px 0' }}>
            <motion.div
              className="flex"
              style={{ gap: 20 }}
              animate={{ x: ['0%', '-100%'] }}
              transition={{
                x: { repeat: Infinity, duration: Math.max(row1.length * 4, 12), ease: 'linear' },
              }}
            >
              {row1.map((msg) => (
                <div
                  key={msg.id}
                  className="flex-shrink-0 flex flex-col"
                  style={{
                    width: 340, padding: 18, gap: 8,
                    backgroundColor: T.bgCard,
                    border: `1px solid ${T.border}33`,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.accent, fontFamily: 'Inter, sans-serif' }}>
                    {msg.nickname}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 400, color: T.text, fontFamily: 'Inter, sans-serif', lineHeight: '22px' }}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
          {/* Row 2 — scroll right */}
          <div className="relative" style={{ padding: '12px 0' }}>
            <motion.div
              className="flex"
              style={{ gap: 20 }}
              animate={{ x: ['-100%', '0%'] }}
              transition={{
                x: { repeat: Infinity, duration: Math.max(row2.length * 4, 12), ease: 'linear' },
              }}
            >
              {row2.map((msg) => (
                <div
                  key={msg.id}
                  className="flex-shrink-0 flex flex-col"
                  style={{
                    width: 340, padding: 18, gap: 8,
                    backgroundColor: T.bgCard,
                    border: `1px solid ${T.border}33`,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.accent, fontFamily: 'Inter, sans-serif' }}>
                    {msg.nickname}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 400, color: T.text, fontFamily: 'Inter, sans-serif', lineHeight: '22px' }}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center" style={{ padding: '24px 0' }}>
          <span style={{ fontSize: 14, color: T.text3, fontFamily: 'Inter, sans-serif' }}>
            还没有应援留言，成为第一个为 EDG 加油的人吧！
          </span>
        </div>
      )}

    </section>
  )
}

/* ═══════════ 寄语 Section ═══════════ */
function MessageToPlayersSection() {
  const players = [
    {
      name: 'ZmjjKK · 康康',
      subtitle: 'CN 第一狙，世界顶级决斗者',
      message: '康康，你让我想起一句话：天才只是入场券，热爱才是天花板。你的狙不是工具，是刻在骨子里的直觉——开镜、甩枪、击杀，一气呵成。那些把外网解说惊到失语的精彩操作，是你每天训练十几个小时换来的肌肉记忆。从被质疑"只会炸鱼"到站在世界之巅，你用了不到两年。伦敦大师赛，继续用你的狙告诉所有人：CN 决斗者，从来不比任何人差。康神，我们等你再唱一次兰花草。',
    },
    {
      name: 'Smoggy · 张钊',
      subtitle: '御驾亲征，EDG 最稳的底牌',
      message: '钊哥，你是那种不需要数据证明自己的选手——因为看过比赛的人都知道你有多强。残局一打三面不改色，封烟控图行云流水。你不是舞台上最亮的灯，但你是整个舞台的地基。每一个队友的高光时刻背后，都有你默默架枪、铺烟、拉扯空间的影子。你说过"御驾亲征"，这次伦敦，我们等着你再披龙袍。老将不死，只是愈发锋利。钊哥，伦敦见。',
    },
    {
      name: 'CHICHOO · 球球',
      subtitle: '最高的丘陵，永远坚韧',
      message: '球球，你的成长是所有淀粉最骄傲的事。从那个被弹幕调侃身高的"小个子"，到捧起世界冠军奖杯的 CHICHOO，你用实力让所有玩笑变成了致敬——"最高的丘陵"不再是一句调侃，而是对手眼中最不想遇到的哨位。你的 Cypher 绊索和 Killjoy 炮台，每一样道具在你手里都像活过来了一样，总能预判到对手的路线，在最关键的位置架好枪等着他们自投罗网。你是 EDG 最可靠的兜底，是队友身后最稳的防线。伦敦，继续做那座让对手望而生畏的"最高的丘陵"。球球，冲！',
    },
    {
      name: 'Jieni7 · 杰尼龟',
      subtitle: '超级进化水箭龟，新人的锋芒无人可挡',
      message: '杰尼，你可能是这支 EDG 里最被低估的一个——但真正懂比赛的人，都知道你的价值。从替补席到首发，从默默无闻到关键时刻站出来的英雄，你用一场又一场的稳定发挥证明了：你配得上这个位置。年轻不是短板，是你的武器。你敢打敢拼、不怯场的心态，是很多老将都羡慕的品质。"进化水箭龟"不只是梗，是你一次次突破自我的真实写照。杰尼，伦敦是你的新舞台，让世界记住你的 ID。',
    },
    {
      name: 'nobody · 王森旭',
      subtitle: 'EDG 的大脑，CN 瓦最强 IGL',
      message: '王哥，如果说康康是 EDG 的尖刀，那你就是 EDG 的灵魂。指挥位是最容易被忽视的位置——镜头永远对准杀人的决斗者，很少有人能看到你在背后做了多少功课。每一张图的站位研究，每一个战术的反复推演，每一个残局的冷静调度——这些看不见的努力，才是 EDG 能走到今天的基石。从"电工钳"的玩笑到冠军指挥的蜕变，你经历了太多的压力和质疑，但你从没停下前进的脚步。王哥，伦敦的舞台上继续用你的指挥才华带领兄弟们冲锋。CN 瓦需要你这样的 IGL。',
    },
  ]

  return (
    <section
      className="flex flex-col items-center"
      style={{
        width: '100%', maxWidth: 1440, padding: '100px 60px', gap: 40,
        backgroundColor: T.featAccent,
      }}
    >
      {/* Title */}
      <div className="flex flex-col items-center text-center" style={{ gap: 12, maxWidth: 800 }}>
        <span
          style={{
            fontSize: 14, fontWeight: 500, color: T.accent,
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: 2,
          }}
        >
          04 — 粉丝寄语
        </span>
        <h2
          style={{
            fontSize: 36, fontWeight: 700, color: T.accent,
            fontFamily: 'Space Grotesk, Inter, sans-serif',
          }}
        >
          寄语
        </h2>
        <p
          style={{
            fontSize: 16, fontWeight: 400, color: T.text2, fontFamily: 'Inter, sans-serif',
            lineHeight: '1.7', maxWidth: 700,
          }}
        >
          致 EDG 的每一位战士——从伊斯坦布尔到伦敦，四年赛场征战
        </p>
      </div>

      {/* Player cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" style={{ maxWidth: 1240 }}>
        {players.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="flex flex-col"
            style={{
              padding: 28, gap: 12,
              backgroundColor: T.bgCard,
              borderLeft: `3px solid ${T.accent}`,
            }}
          >
            <div className="flex flex-col" style={{ gap: 4 }}>
              <h3
                style={{
                  fontSize: 18, fontWeight: 700, color: T.text,
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                }}
              >
                {p.name}
              </h3>
              <span
                style={{
                  fontSize: 13, fontWeight: 600, color: T.accent,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {p.subtitle}
              </span>
            </div>
            <p
              style={{
                fontSize: 14, fontWeight: 400, color: T.text2,
                fontFamily: 'Inter, sans-serif', lineHeight: '1.75',
              }}
            >
              {p.message}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Conclusion */}
      <div
        className="flex flex-col items-center text-center w-full"
        style={{
          maxWidth: 800, marginTop: 16, padding: 32,
          backgroundColor: T.bgCard, border: `1px solid ${T.border}33`,
          gap: 8,
        }}
      >
        <p
          style={{
            fontSize: 18, fontWeight: 600, color: T.text,
            fontFamily: 'Space Grotesk, Inter, sans-serif', lineHeight: '1.6',
          }}
        >
          五个人，五种风格，一颗冠军的心
        </p>
        <p
          style={{
            fontSize: 16, fontWeight: 500, color: T.accent,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          EDG，去伦敦把冠军再带回来一次。淀粉，永远在。
        </p>
      </div>
    </section>
  )
}

/* ═══════════ Final CTA ═══════════ */
function FinalCTA() {
  return (
    <section
      className="flex flex-col items-center justify-center text-center"
      style={{
        width: '100%', maxWidth: 1440, padding: '120px 60px', gap: 28,
      }}
    >
      <h2
        style={{
          fontSize: 48, fontWeight: 700, color: T.text,
          fontFamily: 'Space Grotesk, Inter, sans-serif', maxWidth: 700,
          textShadow: `0 0 40px ${T.accent}26`,
        }}
      >
        准备好为 EDG 呐喊了吗？
      </h2>
      <p style={{ fontSize: 18, fontWeight: 400, color: T.text2, fontFamily: 'Inter, sans-serif', maxWidth: 500 }}>
        加入应援站，不错过每一场精彩比赛
      </p>
    </section>
  )
}

/* ═══════════ Footer ═══════════ */
function Footer() {
  return (
    <footer
      className="flex flex-col items-center"
      style={{
        width: '100%', maxWidth: 1440, padding: '60px 60px 24px', gap: 40,
        background: `linear-gradient(180deg, #0D0D0D 0%, ${T.bg} 100%)`,
      }}
    >
      <div className="flex justify-between items-start w-full" style={{ maxWidth: 1240 }}>
        <div className="flex flex-col" style={{ gap: 12 }}>
          <span
            style={{
              fontSize: 24, fontWeight: 700, color: T.accent,
              fontFamily: 'Space Grotesk, Inter, sans-serif', letterSpacing: 4,
            }}
          >
            EDG
          </span>
          <span
            style={{
              fontSize: 12, fontWeight: 500, color: T.text2,
              fontFamily: 'JetBrains Mono, monospace', letterSpacing: 2,
            }}
          >
            VCT LONDON 2026
          </span>
        </div>

        <div className="hidden md:flex" style={{ gap: 40 }}>
          {['直播', '赛程', '选手', '应援墙'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              style={{
                fontSize: 14, fontWeight: 500, color: T.text2, fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col md:flex-row justify-between items-center w-full pt-5"
        style={{ maxWidth: 1240, borderTop: `1px solid ${T.border}4D`, gap: 12 }}
      >
        <span style={{ fontSize: 12, fontWeight: 400, color: T.text3, fontFamily: 'JetBrains Mono, monospace' }}>
          © 2026 EDG VCT London Fan Site. All rights reserved.
        </span>
        <div className="flex items-center" style={{ gap: 16 }}>
          <Link
            to="/admin"
            style={{ fontSize: 12, fontWeight: 400, color: T.text3, fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}
          >
            管理入口
          </Link>
          <span style={{ fontSize: 12, fontWeight: 400, color: T.text3, fontFamily: 'Inter, sans-serif' }}>
            Made with ❤️ by EDG fans
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════ HomePage ═══════════ */
export function HomePage() {
  return (
    <div className="flex flex-col items-center w-full min-h-dvh" style={{ backgroundColor: T.bg }}>

      {/* Header */}
      <Header />

      {/* Hero */}
      <HeroSection />

      <Divider />

      {/* Schedule */}
      <ScheduleSection />

      <Divider />

      {/* Players */}
      <PlayersSection />

      <Divider />

      {/* Fan Wall */}
      <FanWallSection />

      <Divider />

      {/* 寄语 */}
      <MessageToPlayersSection />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />

    </div>
  )
}
