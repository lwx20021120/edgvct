import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Upload, Send, User, Loader2, X } from 'lucide-react'
import { ErrorBoundary } from '../components/shared/ErrorBoundary'
import { WallSection } from '../components/wall/WallSection'
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

  // Split messages into 2 rows for scrolling effect
  const row1 = messages.filter((_, i) => i % 2 === 0).slice(0, 20)
  const row2 = messages.filter((_, i) => i % 2 === 1).slice(0, 20)

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

      {/* Scrolling message rows */}
      {messages.length > 0 && (
        <div className="w-full overflow-hidden" style={{ maxWidth: 1240 }}>
          {/* Row 1 — scroll left */}
          <ScrollingRow messages={row1} direction="left" />
          {/* Row 2 — scroll right */}
          <ScrollingRow messages={row2} direction="right" />
        </div>
      )}

      {/* Original WallSection (interactive) */}
      <ErrorBoundary>
        <WallSection />
      </ErrorBoundary>
    </section>
  )
}

/* ═══════════ Scrolling Message Row ═══════════ */
function ScrollingRow({ messages, direction }: { messages: import('../types').WallMessage[]; direction: 'left' | 'right' }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Duplicate messages for seamless loop
  const items = [...messages, ...messages]

  return (
    <div className="overflow-hidden relative" style={{ padding: '12px 0' }}>
      <motion.div
        ref={scrollRef}
        className="flex"
        style={{ gap: 16 }}
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: messages.length * 4,
            ease: 'linear',
          },
        }}
      >
        {items.map((msg, i) => (
          <div
            key={`${msg.id}-${i}`}
            className="flex-shrink-0 flex flex-col"
            style={{
              width: 300, padding: 16, gap: 8,
              backgroundColor: T.bgCard,
              border: `1px solid ${T.border}33`,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: T.accent, fontFamily: 'Inter, sans-serif' }}>
              {msg.nickname}
            </span>
            <span
              style={{
                fontSize: 14, fontWeight: 400, color: T.text,
                fontFamily: 'Inter, sans-serif', lineHeight: '20px',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ═══════════ Features Section ═══════════ */
function FeaturesSection() {
  const features = [
    { t: '实时直播追踪', tag: 'Live Coverage', d: '多平台直播源聚合，不放过 EDG 任何一场比赛。自动切换最优画质，支持弹幕互动与实时比分同步。' },
    { t: '赛中数据面板', tag: 'Match Analytics', d: '选手 ACS、K/D、爆头率实时更新，赛后自动生成数据分析报告。支持历史数据回溯与对比。' },
    { t: '选手资料档案', tag: 'Player Profiles', d: '每位选手的完整资料：英雄池热力图、近期状态评分、高光时刻集锦。数据来源 Riot 官方 API 与社区精选。' },
    { t: '粉丝应援社区', tag: 'Fan Community', d: '应援墙实时互动，为选手加油鼓劲。支持文字、图片多种应援形式，精选应援直达选手。' },
    { t: '赛事日程管理', tag: 'Schedule & Alerts', d: 'EDG 比赛日程一目了然，赛前推送提醒、赛中实时比分、赛后自动生成战报。' },
  ]

  return (
    <section
      className="flex flex-col items-center"
      style={{
        width: '100%', maxWidth: 1440, padding: '120px 60px', gap: 32,
        backgroundColor: T.featAccent,
      }}
    >
      <h2
        className="text-center"
        style={{ fontSize: 36, fontWeight: 700, color: T.accent, fontFamily: 'Space Grotesk, Inter, sans-serif' }}
      >
        为什么选择 EDG 应援站？
      </h2>
      <p
        className="text-center"
        style={{ fontSize: 16, fontWeight: 400, color: T.text2, fontFamily: 'Inter, sans-serif', maxWidth: 900, lineHeight: '1.6' }}
      >
        一站聚合 EDG 所有赛事信息，从直播到数据、从选手到社区
      </p>

      <div className="flex flex-col w-full" style={{ gap: 12, maxWidth: 1000, marginTop: 16 }}>
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="flex flex-col"
            style={{
              padding: 28, gap: 10,
              backgroundColor: T.featBg,
              borderLeft: `3px solid ${T.accent}66`,
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, fontFamily: 'Inter, sans-serif' }}>
              {f.t}
            </h3>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.accent, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>
              {f.tag}
            </span>
            <p style={{ fontSize: 14, fontWeight: 400, color: T.text2, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
              {f.d}
            </p>
          </motion.div>
        ))}
      </div>

      <p
        className="text-center"
        style={{ fontSize: 16, fontWeight: 600, color: T.accent, fontFamily: 'Inter, sans-serif', maxWidth: 900, marginTop: 32 }}
      >
        更多功能持续开发中。如果你有想法，欢迎在应援墙留言或访问我们的 GitHub 仓库贡献代码。
      </p>
    </section>
  )
}

/* ═══════════ Final CTA ═══════════ */
function FinalCTA() {
  const { isLoggedIn } = useFanAuth()

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
      <Link to={isLoggedIn ? '/' : '/login'}>
        <button
          className="flex items-center justify-center hover:opacity-90 transition-opacity"
          style={{
            height: 58, padding: '0 48px', backgroundColor: T.accent, border: 'none', cursor: 'pointer',
            boxShadow: `0 0 24px ${T.accent}66`,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: 2 }}>
            {isLoggedIn ? '立即上传应援视频' : '立即登录加入'}
          </span>
        </button>
      </Link>
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

      {/* Features */}
      <FeaturesSection />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />

    </div>
  )
}
