import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Home, Users, Calendar, MessageSquare, Video, FileText,
  Plus, Edit3, Trash2, Search, Star, Database, Menu,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useDataContext } from '../../context/DataContext'
import { useWallContext } from '../../context/WallContext'
import { useToast } from '../shared/Toast'
import { ScoreEditor } from './ScoreEditor'
import { MVPSelector } from './MVPSelector'
import { DataSyncPanel } from './DataSyncPanel'
import { pushOverride } from '../../config/sync'
import type { PlayerRole } from '../../types'

interface AdminDashboardProps {
  onLogout: () => void
}

/* ═══════ Design Tokens ═══════ */
const DT = {
  bg: '#05050A',
  sidebar: '#09090B',
  accent: '#E11D48',
  text: '#F8FAFC',
  text2: '#94A3B8',
  text3: '#64748B',
  border: '#312E81',
  cardBg: '#0C0C0D',
}

type NavTab = 'players' | 'schedule' | 'messages' | 'videos' | 'homepage' | 'score' | 'mvp' | 'sync'

const NAV_ITEMS: { id: NavTab; label: string; icon: typeof Users }[] = [
  { id: 'players', label: '选手管理', icon: Users },
  { id: 'schedule', label: '赛程管理', icon: Calendar },
  { id: 'messages', label: '留言管理', icon: MessageSquare },
  { id: 'videos', label: '视频管理', icon: Video },
  { id: 'homepage', label: '首页内容', icon: FileText },
  { id: 'score', label: '比分编辑', icon: Edit3 },
  { id: 'mvp', label: 'MVP 选择', icon: Star },
  { id: 'sync', label: '数据同步', icon: Database },
]

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<NavTab>('players')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAdminAuth()
  const { edgPlayers, matches } = useDataContext()
  const { messages } = useWallContext()

  function handleLogout() {
    logout()
    onLogout()
  }

  const stats = {
    players: edgPlayers.length,
    matches: matches.filter((m) => m.status === 'live').length,
    messages: messages.length,
    videos: 47, // from design
  }

  return (
    <div className="flex min-h-dvh" style={{ backgroundColor: DT.bg }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══ Sidebar 240px ═══ */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-dvh flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: 240, backgroundColor: DT.sidebar, borderRight: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* Brand */}
        <div className="flex flex-col" style={{ padding: '24px 20px 20px', gap: 4 }}>
          <span
            style={{
              fontSize: 20, fontWeight: 700, color: DT.accent,
              fontFamily: 'Space Grotesk, Inter, sans-serif', letterSpacing: 4,
            }}
          >
            EDG ADMIN
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: DT.text3, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>
            VCT LONDON 2026
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col" style={{ padding: '8px 12px', gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                className="flex items-center transition-colors text-left"
                style={{
                  gap: 10, padding: '10px 12px',
                  backgroundColor: isActive ? `${DT.accent}1A` : 'transparent',
                  color: isActive ? DT.accent : DT.text3,
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  fontFamily: 'Inter, sans-serif',
                  border: 'none', cursor: 'pointer',
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom: user + logout */}
        <div className="flex flex-col" style={{ padding: '12px', gap: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center" style={{ gap: 8, padding: '4px 8px' }}>
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: 28, height: 28, backgroundColor: DT.accent }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FFF' }}>A</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: DT.text2, fontFamily: 'Inter, sans-serif' }}>
              管理员
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-red-400 transition-colors"
            style={{
              padding: '8px 12px', color: DT.text3, fontSize: 13,
              fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between sticky top-0 z-30"
          style={{
            padding: '16px 24px',
            backgroundColor: `${DT.bg}F2`, backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex items-center" style={{ gap: 12 }}>
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: DT.text2 }}
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 style={{ fontSize: 18, fontWeight: 700, color: DT.text, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label || '管理面板'}
            </h1>

            {/* Badge */}
            {activeTab === 'players' && (
              <span
                className="flex items-center justify-center"
                style={{
                  height: 22, padding: '0 10px', backgroundColor: `${DT.accent}33`,
                  fontSize: 12, fontWeight: 600, color: DT.accent,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {edgPlayers.length} 位选手
              </span>
            )}
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            style={{ fontSize: 13, color: DT.text2, fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">返回首页</span>
          </Link>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: '选手总数', value: stats.players, color: DT.accent },
              { label: '进行中赛事', value: stats.matches, color: '#F59E0B' },
              { label: '粉丝留言', value: stats.messages, color: '#3B82F6' },
              { label: '粉丝视频', value: stats.videos, color: '#10B981' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col"
                style={{
                  padding: 20, backgroundColor: DT.cardBg,
                  border: `1px solid ${DT.border}33`, gap: 8,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 500, color: DT.text3, fontFamily: 'Inter, sans-serif' }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 32, fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {s.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Panel content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'players' && <PlayerManagement />}
              {activeTab === 'schedule' && <ScheduleManagement />}
              {activeTab === 'messages' && <MessageManagement />}
              {activeTab === 'videos' && <VideoManagement />}
              {activeTab === 'homepage' && <HomepageContent />}
              {activeTab === 'score' && <ScoreEditor />}
              {activeTab === 'mvp' && <MVPSelector />}
              {activeTab === 'sync' && <DataSyncPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

/* ═══════ Player Management ═══════ */
function PlayerManagement() {
  const { edgPlayers } = useDataContext()
  const roleLabels: Record<PlayerRole, string> = {
    Duelist: '决斗者', Initiator: '先锋', Controller: '控场者',
    Sentinel: '哨位', Flex: '自由人',
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center"
            style={{
              height: 40, padding: '0 12px', backgroundColor: DT.cardBg,
              border: `1px solid ${DT.border}33`, gap: 8,
            }}
          >
            <Search className="w-4 h-4" style={{ color: DT.text3 }} />
            <input
              type="text"
              placeholder="搜索选手..."
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: DT.text, fontSize: 13, fontFamily: 'Inter, sans-serif',
                width: 200,
              }}
            />
          </div>
        </div>
        <button
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            height: 40, padding: '0 20px', backgroundColor: DT.accent,
            border: 'none', cursor: 'pointer',
          }}
        >
          <Plus className="w-4 h-4" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#FFF', fontFamily: 'Inter, sans-serif' }}>
            添加选手
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ border: `1px solid ${DT.border}22` }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: DT.sidebar }}>
              {['#', '选手名', '定位', 'ACS', 'K/D', 'HS%', '照片', '操作'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 12, fontWeight: 600, color: DT.text3,
                    fontFamily: 'JetBrains Mono, monospace',
                    borderBottom: `1px solid ${DT.border}22`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {edgPlayers.map((p, i) => (
              <tr
                key={p.id}
                style={{ borderBottom: `1px solid ${DT.border}11` }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td style={{ padding: '12px 16px', fontSize: 13, color: DT.text3, fontFamily: 'JetBrains Mono, monospace' }}>
                  {i + 1}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <div
                      className="rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: 32, height: 32,
                        backgroundColor: `${DT.accent}33`,
                        fontSize: 12, fontWeight: 700, color: DT.accent,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {p.nickname[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: DT.text, fontFamily: 'Inter, sans-serif' }}>
                        {p.nickname}
                      </p>
                      <p style={{ fontSize: 11, color: DT.text3, fontFamily: 'Inter, sans-serif' }}>
                        {p.realName}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: 12, fontWeight: 500, color: DT.accent,
                      fontFamily: 'Inter, sans-serif',
                      padding: '2px 10px', backgroundColor: `${DT.accent}1A`,
                    }}
                  >
                    {roleLabels[p.role]}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: DT.text, fontFamily: 'JetBrains Mono, monospace' }}>
                  {p.stats.acs}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: DT.text, fontFamily: 'JetBrains Mono, monospace' }}>
                  {p.stats.kd}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: DT.text, fontFamily: 'JetBrains Mono, monospace' }}>
                  {p.stats.hsPercent}%
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 12, color: DT.text3 }}>
                    {p.avatar ? '✓' : '—'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex items-center" style={{ gap: 6 }}>
                    <button
                      className="hover:text-white transition-colors"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: DT.text3, padding: 4 }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      className="hover:text-red-400 transition-colors"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: DT.text3, padding: 4 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════ Schedule Management ═══════ */
function ScheduleManagement() {
  const { matches, applyOverride } = useDataContext()
  const { showToast } = useToast()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((m) => {
          const isLive = m.status === 'live'
          const isFinished = m.status === 'finished'
          const statusLabel = isLive ? '进行中' : isFinished ? '已结束' : '即将开始'
          const statusColor = isLive ? '#F59E0B' : isFinished ? '#10B981' : DT.text3
          return (
            <div
              key={m.id}
              className="flex flex-col"
              style={{
                padding: 20, backgroundColor: DT.cardBg,
                border: `1px solid ${DT.border}33`, gap: 12,
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, fontWeight: 600, color: DT.text, fontFamily: 'Inter, sans-serif' }}>
                  {m.stage}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: statusColor, fontFamily: 'JetBrains Mono, monospace' }}>
                  {statusLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, color: DT.text2, fontFamily: 'Inter, sans-serif' }}>
                  {new Date(m.startTime).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={{ fontSize: 12, color: DT.text3, fontFamily: 'JetBrains Mono, monospace' }}>
                  {m.format}
                </span>
              </div>
              <div className="flex items-center justify-center" style={{ gap: 16, padding: '8px 0' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: DT.text, fontFamily: 'JetBrains Mono, monospace' }}>
                  {m.edgTeam.shortName}
                </span>
                <span style={{ fontSize: 20, fontWeight: 700, color: m.status === 'finished' ? DT.accent : DT.text, fontFamily: 'JetBrains Mono, monospace' }}>
                  {m.score.edg}
                </span>
                <span style={{ fontSize: 14, color: DT.text3 }}>:</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: m.status === 'finished' ? DT.text3 : DT.text, fontFamily: 'JetBrains Mono, monospace' }}>
                  {m.score.opponent}
                </span>
                <span style={{ fontSize: 20, fontWeight: 700, color: DT.text2, fontFamily: 'JetBrains Mono, monospace' }}>
                  {m.opponentTeam.shortName}
                </span>
              </div>
              {/* Quick actions */}
              <div className="flex" style={{ gap: 8 }}>
                {!isLive && !isFinished && (
                  <button
                    className="flex-1 flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                    style={{ height: 32, backgroundColor: '#F59E0B', border: 'none', cursor: 'pointer' }}
                    onClick={() => {
                      applyOverride({ statusOverrides: { [m.id]: 'live' } })
                      pushOverride('status', { [m.id]: 'live' })
                      showToast(`${m.edgTeam.shortName} vs ${m.opponentTeam.shortName} 设置为进行中`)
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#000', fontFamily: 'Inter, sans-serif' }}>
                      开始比赛
                    </span>
                  </button>
                )}
                {isLive && (
                  <button
                    className="flex-1 flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                    style={{ height: 32, backgroundColor: '#10B981', border: 'none', cursor: 'pointer' }}
                    onClick={() => {
                      applyOverride({ statusOverrides: { [m.id]: 'finished' } })
                      pushOverride('status', { [m.id]: 'finished' })
                      showToast(`${m.edgTeam.shortName} vs ${m.opponentTeam.shortName} 已结束`)
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#FFF', fontFamily: 'Inter, sans-serif' }}>
                      结束比赛
                    </span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════ Message Management ═══════ */
function MessageManagement() {
  const { messages, pinMessage, removeMessage } = useWallContext()

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 13, color: DT.text2, fontFamily: 'Inter, sans-serif' }}>
          共 {messages.length} 条留言
        </span>
        <div
          className="flex items-center"
          style={{
            height: 40, padding: '0 12px', backgroundColor: DT.cardBg,
            border: `1px solid ${DT.border}33`, gap: 8,
          }}
        >
          <Search className="w-4 h-4" style={{ color: DT.text3 }} />
          <input
            type="text"
            placeholder="搜索留言..."
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: DT.text, fontSize: 13, fontFamily: 'Inter, sans-serif', width: 200,
            }}
          />
        </div>
      </div>

      {/* Message list */}
      <div className="overflow-x-auto" style={{ border: `1px solid ${DT.border}22` }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: DT.sidebar }}>
              {['#', '用户', '留言内容', '时间', '置顶', '操作'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 12, fontWeight: 600, color: DT.text3,
                    fontFamily: 'JetBrains Mono, monospace',
                    borderBottom: `1px solid ${DT.border}22`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {messages.slice(0, 50).map((msg, i) => (
              <tr
                key={msg.id}
                style={{ borderBottom: `1px solid ${DT.border}11` }}
                className="hover:bg-white/[0.02]"
              >
                <td style={{ padding: '12px 16px', fontSize: 13, color: DT.text3, fontFamily: 'JetBrains Mono, monospace' }}>
                  {i + 1}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: DT.accent, fontFamily: 'Inter, sans-serif' }}>
                    {msg.nickname}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: 13, color: DT.text, fontFamily: 'Inter, sans-serif',
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', maxWidth: 400,
                    }}
                  >
                    {msg.content}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: DT.text3, fontFamily: 'Inter, sans-serif' }}>
                  {new Date(msg.createdAt).toLocaleDateString('zh-CN')}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => pinMessage(msg.id)}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: msg.isPinned ? `${DT.accent}33` : 'transparent',
                      border: `1px solid ${msg.isPinned ? DT.accent : DT.border}66`,
                      color: msg.isPinned ? DT.accent : DT.text3,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {msg.isPinned ? '已置顶' : '置顶'}
                  </button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => { if (confirm('确定删除该留言？')) removeMessage(msg.id) }}
                    className="hover:text-red-400 transition-colors"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: DT.text3, padding: 4 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════ Video Management ═══════ */
function VideoManagement() {
  const { showToast } = useToast()

  function handlePin(_videoId: string) {
    showToast('视频置顶状态已切换')
  }

  function handleDelete(_videoId: string) {
    if (confirm('确定删除该视频？')) showToast('视频已删除')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 13, color: DT.text2, fontFamily: 'Inter, sans-serif' }}>
          共 47 个粉丝视频
        </span>
        <button
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{
            height: 40, padding: '0 20px', backgroundColor: DT.accent,
            border: 'none', cursor: 'pointer',
          }}
        >
          <Plus className="w-4 h-4" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#FFF', fontFamily: 'Inter, sans-serif' }}>
            添加视频
          </span>
        </button>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col"
            style={{
              padding: 16, backgroundColor: DT.cardBg,
              border: `1px solid ${DT.border}33`, gap: 10,
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                height: 120, backgroundColor: '#0A0A0F',
                border: `1px solid ${DT.border}22`,
              }}
            >
              <Video className="w-8 h-8" style={{ color: DT.text3 }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: DT.text, fontFamily: 'Inter, sans-serif', lineHeight: '1.3' }}>
              应援视频 #{i + 1}
            </p>
            <p style={{ fontSize: 11, color: DT.text3, fontFamily: 'Inter, sans-serif' }}>
              匿名粉丝 · B站
            </p>
            <div className="flex" style={{ gap: 8 }}>
              <button
                onClick={() => handlePin(`${i}`)}
                className="flex-1 flex items-center justify-center gap-1 hover:border-opacity-100 transition-all"
                style={{
                  height: 30, border: `1px solid ${DT.border}66`,
                  fontSize: 11, fontWeight: 500, color: DT.text2,
                  fontFamily: 'Inter, sans-serif', background: 'none', cursor: 'pointer',
                }}
              >
                <Star className="w-3 h-3" /> 置顶
              </button>
              <button
                onClick={() => handleDelete(`${i}`)}
                className="flex-1 flex items-center justify-center gap-1 hover:border-red-500 hover:text-red-400 transition-all"
                style={{
                  height: 30, border: `1px solid ${DT.border}66`,
                  fontSize: 11, fontWeight: 500, color: DT.text2,
                  fontFamily: 'Inter, sans-serif', background: 'none', cursor: 'pointer',
                }}
              >
                <Trash2 className="w-3 h-3" /> 删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════ Homepage Content Management ═══════ */
function HomepageContent() {
  return (
    <div className="space-y-4">
      <p style={{ fontSize: 14, color: DT.text2, fontFamily: 'Inter, sans-serif' }}>
        管理首页各区块的内容：Hero 视频、选手展示、赛程高亮、应援墙设置等。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Hero 视频源', desc: '选择首页 Hero 区域展示的 B站 视频 BV 号', value: 'BV1QKqtYAESH' },
          { title: '应援墙公告', desc: '置顶在应援墙顶部的公告消息', value: '暂无公告' },
          { title: '高亮赛事', desc: '首页赛程区高亮的比赛 ID', value: 'match-1' },
          { title: 'SEO 描述', desc: '网站 Meta 描述文本', value: 'EDG 无畏契约伦敦大师赛应援站' },
        ].map((item) => (
          <div
            key={item.title}
            className="flex flex-col"
            style={{
              padding: 20, backgroundColor: DT.cardBg,
              border: `1px solid ${DT.border}33`, gap: 8,
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 600, color: DT.text, fontFamily: 'Inter, sans-serif' }}>
              {item.title}
            </h4>
            <p style={{ fontSize: 12, color: DT.text3, fontFamily: 'Inter, sans-serif' }}>{item.desc}</p>
            <input
              type="text"
              defaultValue={item.value}
              style={{
                height: 40, padding: '0 12px', marginTop: 4,
                backgroundColor: '#0A0A0F', border: `1px solid ${DT.border}33`,
                color: DT.text, fontSize: 13, fontFamily: 'JetBrains Mono, monospace', outline: 'none',
              }}
            />
            <button
              className="self-end hover:opacity-90 transition-opacity"
              style={{
                height: 32, padding: '0 16px', backgroundColor: DT.accent,
                border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                color: '#FFF', fontFamily: 'Inter, sans-serif',
              }}
            >
              保存
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
