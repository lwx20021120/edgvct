import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Home, Edit3, Star, Database } from 'lucide-react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { ScoreEditor } from './ScoreEditor'
import { MVPSelector } from './MVPSelector'
import { DataSyncPanel } from './DataSyncPanel'
import { Link } from 'react-router-dom'

interface AdminDashboardProps {
  onLogout: () => void
}

const TABS = [
  { id: 'score', label: '比分编辑', icon: Edit3 },
  { id: 'mvp', label: 'MVP 选择', icon: Star },
  { id: 'sync', label: '数据同步', icon: Database },
] as const

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('score')
  const { logout } = useAdminAuth()

  function handleLogout() {
    logout()
    onLogout()
  }

  return (
    <div className="min-h-[100dvh] bg-bg-primary">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-bg-primary/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">返回首页</span>
            </Link>
            <span className="text-text-tertiary">|</span>
            <span className="text-body font-semibold text-text-primary">管理面板</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-body-sm text-text-secondary hover:text-error hover:border-error/40 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="border-b border-border bg-bg-secondary">
        <div className="flex gap-1 px-4 max-w-5xl mx-auto overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-body-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="admin-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Panel content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'score' && <ScoreEditor />}
            {activeTab === 'mvp' && <MVPSelector />}
            {activeTab === 'sync' && <DataSyncPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
