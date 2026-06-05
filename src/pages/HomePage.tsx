import { useState, useEffect, useRef } from 'react'
import { ErrorBoundary } from '../components/shared/ErrorBoundary'
import { WallSection } from '../components/wall/WallSection'
import { useDataContext } from '../context/DataContext'
import { presetVideos } from '../config/videos'
import { apiPost, apiUpload, getPublicUrl } from '../config/api'
import { useToast } from '../components/shared/Toast'
import { ChevronLeft, ChevronRight, Pause, Play, Upload, Loader2 } from 'lucide-react'
import type { Match, Player } from '../types'

/* ──────────────── 设计令牌 ──────────────── */
const COLORS = {
  accent: '#E11D48',
  bg: '#000000',
  bgCard: '#0C0C0D',
  bgSecondary: '#09090B',
  border: '#312E81',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#666666',
} as const

/* ──────────────── 角色标签映射 ──────────────── */
const ROLE_LABELS: Record<string, string> = {
  Duelist: '决斗者',
  Initiator: '先锋',
  Controller: '控场者',
  Sentinel: '哨卫',
  Flex: '自由人',
}

/* ──────────────── 视频类型 ──────────────── */
interface VideoItem {
  id: string
  title: string
  author: string
  type: 'bilibili' | 'upload'
  bvid?: string
  videoUrl?: string
  createdAt: number
  isPinned: boolean
}

const PRESET_VIDEO_ITEMS: VideoItem[] = presetVideos.map((v, i) => ({
  id: `preset-${i}`,
  title: v.title,
  author: v.author,
  type: v.type,
  bvid: v.bvid,
  createdAt: Date.now(),
  isPinned: v.isPinned,
}))

/* ──────────────── 工具：北京时间 ──────────────── */
function toBeijingTime(iso: string): string {
  const date = new Date(iso)
  const opts: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Shanghai',
  }
  return new Intl.DateTimeFormat('zh-CN', opts).format(date)
}

/* ──────────────── 工具：比赛状态 ──────────────── */
function getStatusConfig(status: string) {
  switch (status) {
    case 'live':
      return { label: 'LIVE', live: true }
    case 'finished':
      return { label: 'FINISHED', live: false }
    default:
      return { label: 'UPCOMING', live: false }
  }
}

/* ──────────────── Header ──────────────── */
function Header() {
  return (
    <header className="sticky top-0 z-50 px-[60px] h-[77px] flex items-center justify-between bg-transparent">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span
          className="text-[24px] font-bold tracking-[4px]"
          style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.accent }}
        >
          EDG
        </span>
        <div className="w-px h-5" style={{ backgroundColor: COLORS.border }} />
        <span
          className="text-[12px] tracking-[3px]"
          style={{ fontFamily: 'Space Grotesk, sans-serif', color: COLORS.textSecondary, fontWeight: 500 }}
        >
          VCT LONDON
        </span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-8 text-[14px]" style={{ fontWeight: 500 }}>
        <span style={{ color: COLORS.textPrimary, cursor: 'pointer' }}>直播</span>
        <span style={{ color: COLORS.textSecondary, cursor: 'pointer' }}>赛程</span>
        <span style={{ color: COLORS.textSecondary, cursor: 'pointer' }}>选手</span>
        <span style={{ color: COLORS.textSecondary, cursor: 'pointer' }}>应援墙</span>
      </nav>

      {/* CTA Button */}
      <button
        className="px-6 py-[10px] text-[14px] font-semibold tracking-[1.5px] transition-colors"
        style={{ backgroundColor: COLORS.accent, color: '#FFFFFF' }}
      >
        进入直播间
      </button>
    </header>
  )
}

/* ──────────────── Section Header ──────────────── */
function SectionHeader({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <span
        className="text-[14px] tracking-[2px]"
        style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.accent, fontWeight: 500 }}
      >
        {tag}
      </span>
      <h2
        className="text-[40px] font-bold"
        style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
      >
        {title}
      </h2>
      <p className="text-[18px]" style={{ color: COLORS.textSecondary }}>
        {desc}
      </p>
    </div>
  )
}

/* ──────────────── Neon Divider ──────────────── */
function Divider() {
  return (
    <div className="w-full flex justify-center py-24">
      <div
        className="w-full max-w-[1240px] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.border}66, ${COLORS.accent}33, ${COLORS.border}66, transparent)`,
        }}
      />
    </div>
  )
}

/* ════════════════════════════ VIDEO PLAYER ════════════════════════════ */
function VideoPlayer({
  videos,
  currentIndex,
  onPrev,
  onNext,
  onSelectIndex,
  isPlaying,
  onTogglePlay,
}: {
  videos: VideoItem[]
  currentIndex: number
  onPrev: () => void
  onNext: () => void
  onSelectIndex: (i: number) => void
  isPlaying: boolean
  onTogglePlay: () => void
}) {
  if (videos.length === 0) {
    return (
      <div
        className="w-[800px] h-[360px] flex items-center justify-center"
        style={{
          background: `linear-gradient(180deg, ${COLORS.accent}0D 0%, transparent 100%)`,
          border: `1px solid ${COLORS.border}80`,
        }}
      >
        <span
          className="text-[14px] tracking-[1px]"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textSecondary }}
        >
          暂无视频
        </span>
      </div>
    )
  }

  const current = videos[currentIndex]

  return (
    <div className="flex flex-col gap-4">
      {/* Main player */}
      <div
        className="relative w-[800px] h-[360px] overflow-hidden"
        style={{ border: `1px solid ${COLORS.border}80` }}
      >
        {current.type === 'bilibili' ? (
          <iframe
            key={current.bvid}
            src={`https://player.bilibili.com/player.html?bvid=${current.bvid}&autoplay=1&muted=1`}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <video
            key={current.videoUrl}
            src={current.videoUrl}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            controls
            autoPlay
            muted
            playsInline
          />
        )}

        {/* Overlay info */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-end p-4"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${COLORS.bgCard}E6 100%)`,
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-semibold" style={{ color: COLORS.textPrimary }}>
              {current.title}
            </span>
            <span className="text-[12px]" style={{ color: COLORS.textSecondary }}>
              @{current.author}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-[800px]">
        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            className="rounded-lg p-2 transition-colors hover:opacity-80"
            style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}66` }}
          >
            <ChevronLeft size={20} style={{ color: COLORS.textSecondary }} />
          </button>
          <button
            onClick={onTogglePlay}
            className="rounded-lg p-2 transition-colors hover:opacity-80"
            style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}66` }}
          >
            {isPlaying ? (
              <Pause size={20} style={{ color: COLORS.textSecondary }} />
            ) : (
              <Play size={20} style={{ color: COLORS.textSecondary }} />
            )}
          </button>
          <button
            onClick={onNext}
            className="rounded-lg p-2 transition-colors hover:opacity-80"
            style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}66` }}
          >
            <ChevronRight size={20} style={{ color: COLORS.textSecondary }} />
          </button>
        </div>

        <span
          className="text-[12px] tracking-[1px]"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textTertiary }}
        >
          {currentIndex + 1} / {videos.length}
        </span>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto w-[800px] pb-1">
        {videos.map((v, i) => (
          <button
            key={v.id}
            onClick={() => onSelectIndex(i)}
            className={`relative flex-shrink-0 w-[120px] h-[68px] rounded-lg overflow-hidden border-2 transition-colors ${
              i === currentIndex ? 'border-[#E11D48]' : 'border-transparent'
            }`}
            style={{ backgroundColor: COLORS.bgCard }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {v.type === 'bilibili' ? (
                <span className="text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textTertiary }}>
                  B站视频
                </span>
              ) : (
                <Play size={16} style={{ color: COLORS.textTertiary }} />
              )}
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5"
              style={{ backgroundColor: `${COLORS.bgCard}CC` }}
            >
              <p className="text-[10px] truncate" style={{ color: COLORS.textSecondary }}>
                {v.title}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════ VIDEO UPLOAD FORM ════════════════════════════ */
function VideoUploadForm() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  async function handleUpload(file: File) {
    if (!title || !author) {
      showToast('请填写标题和昵称', 'warning')
      return
    }
    setUploading(true)
    const fileName = `${Date.now()}-${file.name}`

    const res = await apiUpload('fan_videos', fileName, file)
    if (!res.ok) {
      showToast('上传失败，请稍后重试', 'error')
      setUploading(false)
      return
    }

    const publicUrl = getPublicUrl('fan_videos', fileName)

    await apiPost('/rest/v1/video_playlist', {
      title,
      author,
      type: 'upload',
      video_url: publicUrl,
    })

    showToast('上传成功！视频已加入轮播列表')
    setTitle('')
    setAuthor('')
    setUploading(false)
  }

  return (
    <div
      className="flex flex-col gap-5 p-8 max-w-[600px] mx-auto"
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.border}66`,
      }}
    >
      <div className="flex items-center gap-3">
        <Upload size={24} style={{ color: COLORS.accent }} />
        <h3
          className="text-[20px] font-bold"
          style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
        >
          上传应援视频
        </h3>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="视频标题（如：EDG加油混剪）"
        className="w-full px-4 py-3 text-[14px] transition-colors"
        style={{
          backgroundColor: COLORS.bgSecondary,
          border: `1px solid ${COLORS.border}66`,
          color: COLORS.textPrimary,
          outline: 'none',
        }}
      />

      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="你的昵称"
        className="w-full px-4 py-3 text-[14px] transition-colors"
        style={{
          backgroundColor: COLORS.bgSecondary,
          border: `1px solid ${COLORS.border}66`,
          color: COLORS.textPrimary,
          outline: 'none',
        }}
      />

      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full py-3.5 text-[14px] font-bold tracking-[1.5px] transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: COLORS.accent, color: '#FFFFFF' }}
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            上传中...
          </>
        ) : (
          '选择视频文件'
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />

      <p
        className="text-[12px] text-center"
        style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textTertiary }}
      >
        支持 mp4 / webm，建议不超过 50MB
      </p>
    </div>
  )
}

/* ════════════════════════════ MATCH CARD ════════════════════════════ */
function MatchCardInline({ match }: { match: Match }) {
  const statusCfg = getStatusConfig(match.status)

  return (
    <div
      className="flex-1 flex flex-col gap-4 p-6"
      style={{
        backgroundColor: COLORS.bgCard,
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {/* Status badge */}
      <span
        className="text-[12px] font-bold tracking-[2px]"
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          color: statusCfg.live ? COLORS.accent : COLORS.textSecondary,
        }}
      >
        {statusCfg.live && (
          <span
            className="inline-block w-[6px] h-[6px] rounded-full mr-2 align-middle"
            style={{
              backgroundColor: COLORS.accent,
              boxShadow: `0 0 8px ${COLORS.accent}`,
            }}
          />
        )}
        {statusCfg.label}
      </span>

      {/* Time */}
      <span className="text-[14px]" style={{ color: COLORS.textSecondary, fontWeight: 500 }}>
        {toBeijingTime(match.startTime)}（北京时间）
      </span>

      {/* Teams */}
      <span
        className="text-[24px] font-bold"
        style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
      >
        {match.edgTeam.shortName} vs {match.opponentTeam.shortName}
      </span>

      {/* Stage + Score */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[14px]" style={{ color: COLORS.textTertiary }}>
          {match.stage}
        </span>
        {match.status !== 'upcoming' && (
          <span
            className="text-[16px] font-bold tracking-[1px]"
            style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
          >
            {match.score.edg} : {match.score.opponent}
          </span>
        )}
      </div>

      {/* Format + Casters */}
      <div className="flex items-center gap-4 text-[12px]" style={{ color: COLORS.textTertiary }}>
        <span>{match.format}</span>
        {match.casters && match.casters.length > 0 && (
          <span>解说：{match.casters.join('、')}</span>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════ PLAYER CARD ════════════════════════════ */
function PlayerCardInline({ player }: { player: Player }) {
  const bgPhotoUrl = player.id ? `/players-bg/${player.id}.jpg` : null

  return (
    <div
      className="flex-1 flex flex-col min-w-[180px]"
      style={{ backgroundColor: COLORS.bgCard }}
    >
      {/* Photo */}
      <div
        className="h-[240px] flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${COLORS.accent}1A 0%, ${COLORS.bgCard} 100%)`,
        }}
      >
        {/* Background photo watermark */}
        {bgPhotoUrl && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${bgPhotoUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 15%',
            }}
          />
        )}
        {/* Avatar fallback */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div
            className={`h-20 w-20 rounded-full overflow-hidden flex items-center justify-center ${
              player.isMVP
                ? 'ring-2 ring-[#D4A853] shadow-[0_0_20px_rgba(212,168,83,0.3)]'
                : 'ring-1 ring-white/10'
            }`}
            style={{ backgroundColor: COLORS.bgSecondary }}
          >
            <img
              src={player.avatar}
              alt={player.nickname}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                const el = e.target as HTMLImageElement
                el.style.display = 'none'
                const parent = el.parentElement
                if (parent) {
                  parent.style.display = 'flex'
                  parent.style.alignItems = 'center'
                  parent.style.justifyContent = 'center'
                  parent.textContent = player.nickname.charAt(0).toUpperCase()
                }
              }}
            />
          </div>
          {player.isMVP && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded"
              style={{
                backgroundColor: '#D4A8531A',
                color: '#D4A853',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              MVP
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-[6px] p-5">
        <span
          className="text-[20px] font-bold"
          style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
        >
          {player.nickname}
        </span>
        <span className="text-[14px]" style={{ color: COLORS.textSecondary }}>
          {player.realName}
        </span>
        <span className="text-[14px]" style={{ color: COLORS.accent }}>
          {ROLE_LABELS[player.role] || player.role}
        </span>

        {/* Stats row */}
        <div className="w-full h-px my-2" style={{ backgroundColor: '#FFFFFF1A' }} />
        <div className="flex gap-0 mt-1">
          <div className="flex-1 flex flex-col gap-1 py-1">
            <span
              className="text-[20px] font-bold"
              style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
            >
              {player.stats.acs}
            </span>
            <span className="text-[11px]" style={{ color: COLORS.textSecondary, fontWeight: 500 }}>
              ACS
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1 py-1">
            <span
              className="text-[20px] font-bold"
              style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
            >
              {player.stats.kd.toFixed(2)}
            </span>
            <span className="text-[11px]" style={{ color: COLORS.textSecondary, fontWeight: 500 }}>
              K/D
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1 py-1">
            <span
              className="text-[20px] font-bold"
              style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.textPrimary }}
            >
              {player.stats.hsPercent}%
            </span>
            <span className="text-[11px]" style={{ color: COLORS.textSecondary, fontWeight: 500 }}>
              HS%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════ HOMEPAGE ════════════════════════════ */
export function HomePage() {
  const { matches, edgPlayers } = useDataContext()

  // ──── Video player state ────
  const [videos] = useState<VideoItem[]>(PRESET_VIDEO_ITEMS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-rotation
  useEffect(() => {
    if (!isPlaying || videos.length === 0) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length)
    }, 180000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, videos.length])

  const prevVideo = () => setCurrentIndex((i) => (i - 1 + videos.length) % videos.length)
  const nextVideo = () => setCurrentIndex((i) => (i + 1) % videos.length)
  const togglePlay = () => setIsPlaying((p) => !p)

  return (
    <div className="min-h-dvh w-full" style={{ backgroundColor: COLORS.bg }}>
      <Header />

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="flex flex-col items-center gap-10"
        style={{
          padding: '120px 100px 100px',
          background: `linear-gradient(180deg, ${COLORS.accent}14 0%, transparent 100%)`,
        }}
      >
        {/* Badge */}
        <div
          className="flex items-center gap-3 px-4 py-[6px]"
          style={{
            backgroundColor: COLORS.bgCard,
            boxShadow: `0 0 12px ${COLORS.accent}4D`,
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              backgroundColor: COLORS.accent,
              boxShadow: `0 0 8px ${COLORS.accent}CC`,
            }}
          />
          <span
            className="text-[14px] tracking-[2px] font-medium"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.accent }}
          >
            LIVE · VCT 伦敦大师赛 2025
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[72px] font-bold text-center leading-[1.28] max-w-[800px]"
          style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            color: COLORS.textPrimary,
            textShadow: `
              0 0 80px ${COLORS.accent}26,
              0 0 40px ${COLORS.accent}4D,
              0 0 16px ${COLORS.accent}99
            `,
          }}
        >
          无畏契约 · 伦敦大师赛
        </h1>

        {/* Subtitle */}
        <p className="text-[24px] text-center max-w-[600px]" style={{ color: COLORS.textSecondary }}>
          EDward Gaming · CN 电竞荣耀
        </p>
        <p
          className="text-[18px] text-center max-w-[560px] leading-[28px]"
          style={{ color: COLORS.textSecondary }}
        >
          直播、赛中数据、选手信息、应援墙一站聚合。与万千粉丝一起，为 EDG 呐喊！
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            className="px-10 py-4 text-[18px] font-bold tracking-[2px] transition-opacity hover:opacity-90"
            style={{
              backgroundColor: COLORS.accent,
              color: '#FFFFFF',
              boxShadow: `0 0 24px ${COLORS.accent}66, 0 0 48px ${COLORS.accent}33`,
            }}
          >
            进入直播间
          </button>
          <button
            className="px-[38px] py-[14px] text-[18px] font-semibold tracking-[2px] transition-colors hover:border-opacity-80"
            style={{
              backgroundColor: 'transparent',
              color: COLORS.textPrimary,
              border: `2px solid ${COLORS.border}`,
            }}
          >
            查看赛程
          </button>
        </div>

        {/* Video Player (replaces old placeholder) */}
        <VideoPlayer
          videos={videos}
          currentIndex={currentIndex}
          onPrev={prevVideo}
          onNext={nextVideo}
          onSelectIndex={setCurrentIndex}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
      </section>

      <Divider />

      {/* ═══════════════ SCHEDULE (01) ═══════════════ */}
      <section
        className="flex flex-col gap-12 px-[100px] py-[100px]"
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`,
        }}
      >
        <SectionHeader
          tag="01 — 赛程安排"
          title="伦敦大师赛 · 赛程"
          desc="实时追踪 EDG 的比赛进度，不错过每一个精彩瞬间"
        />

        {matches.length === 0 ? (
          <div
            className="flex items-center justify-center py-12"
            style={{
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${COLORS.border}66`,
            }}
          >
            <p
              className="text-[14px]"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textTertiary }}
            >
              赛程即将公布，敬请期待
            </p>
          </div>
        ) : (
          <div className="flex gap-6">
            {matches.map((match) => (
              <MatchCardInline key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      <Divider />

      {/* ═══════════════ PLAYERS (02) ═══════════════ */}
      <section className="flex flex-col gap-12 px-[100px] py-[100px]">
        <SectionHeader
          tag="02 — 选手阵容"
          title="EDG 明星选手"
          desc="了解每一位为荣耀而战的选手"
        />

        {edgPlayers.length === 0 ? (
          <div
            className="flex items-center justify-center py-12"
            style={{
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${COLORS.border}66`,
            }}
          >
            <p
              className="text-[14px]"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textTertiary }}
            >
              选手数据即将公布，敬请期待
            </p>
          </div>
        ) : (
          <div className="flex gap-5">
            {edgPlayers.map((player) => (
              <PlayerCardInline key={player.id} player={player} />
            ))}
          </div>
        )}
      </section>

      <Divider />

      {/* ═══════════════ FAN WALL (03) ═══════════════ */}
      <section
        className="flex flex-col gap-12 px-[100px] py-[100px]"
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`,
        }}
      >
        <SectionHeader
          tag="03 — 应援加油"
          title="粉丝应援墙"
          desc="留下你的祝福，与万千粉丝一起为 EDG 呐喊"
        />

        {/* Featured messages */}
        <div className="flex gap-4">
          {[
            { user: '电竞追梦人', msg: 'EDG冲！伦敦捧杯！CN VALORANT加油，这是我们的时代！' },
            { user: 'Valorantfans', msg: '康康加油！Smoggy最棒！从冠军赛开始就在关注了' },
            { user: 'EDG死忠粉', msg: '每天必看直播！EDG的配合越来越默契了，期待伦敦的精彩表现' },
          ].map((msg, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col gap-4 p-6"
              style={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${COLORS.border}66`,
              }}
            >
              <span className="text-[14px] font-semibold" style={{ color: COLORS.accent }}>
                {msg.user}
              </span>
              <p className="text-[16px] leading-6" style={{ color: COLORS.textPrimary }}>
                {msg.msg}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Wall */}
        <ErrorBoundary>
          <WallSection />
        </ErrorBoundary>
      </section>

      <Divider />

      {/* ═══════════════ VIDEO UPLOAD ═══════════════ */}
      <section className="flex flex-col gap-12 px-[100px] py-[100px]">
        <SectionHeader
          tag="04 — 视频应援"
          title="上传你的应援视频"
          desc="分享你的创意，让更多人看到 EDG 的精彩瞬间"
        />
        <VideoUploadForm />
      </section>

      <Divider />

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section
        className="flex flex-col items-center gap-8 px-[100px] py-[140px] mx-auto max-w-[1040px]"
        style={{ backgroundColor: '#020204' }}
      >
        <h2
          className="text-[36px] font-bold text-center"
          style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.accent }}
        >
          为什么选择 EDG 应援站？
        </h2>
        <p
          className="text-[16px] text-center max-w-[900px] leading-[1.6]"
          style={{ color: COLORS.textSecondary }}
        >
          一站聚合 EDG 所有赛事信息，从直播到数据、从选手到社区
        </p>

        <div className="flex flex-col gap-4 w-full max-w-[1000px] mt-4">
          {[
            { title: '实时直播追踪', tag: 'Live Coverage', desc: '多平台直播源聚合，不放过 EDG 任何一场比赛。自动切换最优画质，支持弹幕互动与实时比分同步。' },
            { title: '赛中数据面板', tag: 'Match Analytics', desc: '选手 ACS、K/D、爆头率实时更新，赛后自动生成数据分析报告。支持历史数据回溯与对比。' },
            { title: '选手资料档案', tag: 'Player Profiles', desc: '每位选手的完整资料：英雄池热力图、近期状态评分、高光时刻集锦。数据来源 Riot 官方 API 与社区精选。' },
            { title: '粉丝应援社区', tag: 'Fan Community', desc: '应援墙实时互动，为选手加油鼓劲。支持文字、图片、语音多种应援形式，精选应援直达选手。' },
            { title: '赛事日程管理', tag: 'Schedule & Alerts', desc: 'EDG 比赛日程一目了然，赛前推送提醒、赛中实时比分、赛后自动生成战报。支持日历订阅与多渠道通知。' },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 flex flex-col gap-3"
              style={{
                backgroundColor: COLORS.bgSecondary,
                borderRadius: '12px',
              }}
            >
              <h3
                className="text-[22px] font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                {feature.title}
              </h3>
              <span
                className="text-[14px] font-semibold"
                style={{ color: COLORS.accent }}
              >
                {feature.tag}
              </span>
              <p
                className="text-[15px] leading-[1.625]"
                style={{ color: COLORS.textSecondary }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <p
          className="text-[16px] font-semibold mt-8 text-center max-w-[900px]"
          style={{ color: COLORS.accent }}
        >
          更多功能持续开发中。如果你有想法，欢迎在应援墙留言或访问我们的 GitHub 仓库贡献代码。
        </p>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="flex flex-col items-center gap-8 py-[120px] px-[100px]">
        <h2
          className="text-[48px] font-bold text-center max-w-[700px]"
          style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            color: COLORS.textPrimary,
            textShadow: `0 0 40px ${COLORS.accent}26`,
          }}
        >
          准备好为 EDG 呐喊了吗？
        </h2>
        <p className="text-[18px] text-center max-w-[500px]" style={{ color: COLORS.textSecondary }}>
          加入应援站，不错过每一场精彩比赛
        </p>
        <button
          className="px-12 py-[18px] text-[18px] font-bold tracking-[2px] transition-opacity hover:opacity-90"
          style={{
            backgroundColor: COLORS.accent,
            color: '#FFFFFF',
            boxShadow: `0 0 24px ${COLORS.accent}66`,
          }}
        >
          立即进入直播间
        </button>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer
        className="flex flex-col gap-10 px-[100px] pt-[60px] pb-5"
        style={{
          background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`,
        }}
      >
        <div className="flex justify-between items-start">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span
              className="text-[24px] font-bold tracking-[4px]"
              style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', color: COLORS.accent }}
            >
              EDG
            </span>
            <span
              className="text-[12px] tracking-[2px]"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textSecondary, fontWeight: 500 }}
            >
              VCT LONDON 2025
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="flex justify-between items-center pt-5"
          style={{ borderTop: `1px solid ${COLORS.border}4D` }}
        >
          <span className="text-[12px]" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.textTertiary }}>
            © 2025 EDG VCT London Fan Site. All rights reserved.
          </span>
          <span className="text-[12px]" style={{ color: COLORS.textTertiary }}>
            Made with ❤️ by EDG fans
          </span>
        </div>
      </footer>
    </div>
  )
}
