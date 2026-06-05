import { useState } from 'react'
import { Download, Trash2, AlertTriangle, Upload, RefreshCw } from 'lucide-react'
import { useDataContext } from '../../context/DataContext'
import { useToast } from '../shared/Toast'
import { Modal } from '../shared/Modal'
import { pushOverride, pullOverrides } from '../../config/sync'

export function DataSyncPanel() {
  const { overrides, resetOverrides, applyOverride, matches, edgPlayers, opponentPlayers } = useDataContext()
  const { showToast } = useToast()
  const [showResetModal, setShowResetModal] = useState(false)
  const [syncing, setSyncing] = useState(false)

  function handleExport() {
    const exportData = {
      exportedAt: new Date().toISOString(),
      overrides,
      snapshot: {
        matches: matches.map((m) => ({
          id: m.id,
          stage: m.stage,
          status: m.status,
          score: m.score,
          maps: m.maps,
        })),
        edgPlayers: edgPlayers.map((p) => ({
          id: p.id,
          nickname: p.nickname,
          isMVP: p.isMVP,
          stats: p.stats,
        })),
        opponentPlayers: opponentPlayers.map((p) => ({
          id: p.id,
          nickname: p.nickname,
          isMVP: p.isMVP,
          stats: p.stats,
        })),
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `edg-vct-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('数据已导出')
  }

  function handleReset() {
    resetOverrides()
    setShowResetModal(false)
    showToast('覆盖数据已清除，已恢复默认数据')
  }

  /** 将当前本地覆盖数据推送到 Supabase */
  async function handlePushToCloud() {
    setSyncing(true)
    try {
      // 推送 MVP
      if (Object.keys(overrides.mvpOverrides).length > 0) {
        await pushOverride('mvp', overrides.mvpOverrides as unknown as Record<string, unknown>)
      }
      // 推送 Score
      if (Object.keys(overrides.scoreOverrides).length > 0) {
        await pushOverride('score', overrides.scoreOverrides as unknown as Record<string, unknown>)
      }
      // 推送 Status
      if (Object.keys(overrides.statusOverrides).length > 0) {
        await pushOverride('status', overrides.statusOverrides as unknown as Record<string, unknown>)
      }
      showToast('已同步到云端')
    } catch {
      showToast('同步失败，请检查网络连接', 'error')
    } finally {
      setSyncing(false)
    }
  }

  /** 从 Supabase 拉取覆盖数据并应用到本地 */
  async function handlePullFromCloud() {
    setSyncing(true)
    try {
      const remote = await pullOverrides()
      if (remote) {
        applyOverride({
          mvpOverrides: remote.mvpOverrides,
          scoreOverrides: remote.scoreOverrides as Record<string, { score: { edg: number; opponent: number }; maps: import('../../types').MapResult[] }>,
          statusOverrides: remote.statusOverrides as Record<string, import('../../types').MatchStatus>,
        })
        showToast('已从云端拉取最新数据')
      } else {
        showToast('云端暂无数据', 'warning')
      }
    } catch {
      showToast('拉取失败，请检查网络连接', 'error')
    } finally {
      setSyncing(false)
    }
  }

  const hasOverrides = Object.keys(overrides.mvpOverrides).length > 0
    || Object.keys(overrides.scoreOverrides).length > 0
    || Object.keys(overrides.statusOverrides).length > 0

  return (
    <div className="space-y-5">
      {/* Current overrides info */}
      <div className="rounded-lg border border-border bg-bg-secondary p-4">
        <h4 className="text-body-sm font-semibold text-text-primary mb-2">当前覆盖状态</h4>
        <div className="space-y-1 text-body-sm text-text-secondary">
          <p>
            MVP 覆盖：
            <span className="text-text-primary font-mono">
              {Object.keys(overrides.mvpOverrides).length} 项
            </span>
          </p>
          <p>
            比分覆盖：
            <span className="text-text-primary font-mono">
              {Object.keys(overrides.scoreOverrides).length} 项
            </span>
          </p>
          <p>
            状态覆盖：
            <span className="text-text-primary font-mono">
              {Object.keys(overrides.statusOverrides).length} 项
            </span>
          </p>
        </div>
        {!hasOverrides && (
          <p className="mt-2 text-caption text-text-tertiary">
            暂无覆盖数据，所有显示均为 JSON 默认值
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm text-white font-medium hover:bg-primary-hover active:scale-95 transition-all"
        >
          <Download className="h-4 w-4" />
          导出 JSON
        </button>
        <button
          onClick={handlePushToCloud}
          disabled={syncing || !hasOverrides}
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Upload className="h-4 w-4" />
          {syncing ? '同步中...' : '同步到云端'}
        </button>
        <button
          onClick={handlePullFromCloud}
          disabled={syncing}
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RefreshCw className="h-4 w-4" />
          {syncing ? '拉取中...' : '从云端拉取'}
        </button>
        <button
          onClick={() => setShowResetModal(true)}
          disabled={!hasOverrides}
          className="flex items-center gap-2 rounded-md border border-error/40 px-4 py-2 text-body-sm text-error font-medium hover:bg-error/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
          清除覆盖
        </button>
      </div>

      {/* Reset confirm modal */}
      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="确认清除"
      >
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-warning mb-3" />
          <p className="text-body text-text-primary mb-1">
            确定要清除所有覆盖数据吗？
          </p>
          <p className="text-body-sm text-text-tertiary mb-4">
            所有手动修改的比分、MVP 状态将恢复为 JSON 默认值
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowResetModal(false)}
              className="rounded-md border border-border px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleReset}
              className="rounded-md bg-error px-4 py-2 text-body-sm text-white font-medium hover:bg-red-600 transition-colors"
            >
              确认清除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
