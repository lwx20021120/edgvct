import { Download, Trash2, AlertTriangle } from 'lucide-react'
import { useDataContext } from '../../context/DataContext'
import { useToast } from '../shared/Toast'
import { Modal } from '../shared/Modal'
import { useState } from 'react'

export function DataSyncPanel() {
  const { overrides, resetOverrides, matches, edgPlayers, opponentPlayers } = useDataContext()
  const { showToast } = useToast()
  const [showResetModal, setShowResetModal] = useState(false)

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
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm text-white font-medium hover:bg-primary-hover active:scale-95 transition-all"
        >
          <Download className="h-4 w-4" />
          导出 JSON
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
