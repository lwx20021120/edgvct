import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { useDataContext } from '../../context/DataContext'
import { useToast } from '../shared/Toast'
import type { Score, MapResult, MatchStatus } from '../../types'

const MAP_OPTIONS = [
  'Bind', 'Haven', 'Ascent', 'Split', 'Lotus', 'Pearl',
  'Fracture', 'Breeze', 'Icebox', 'Sunset', 'Abyss', 'TBD',
]

export function ScoreEditor() {
  const { matches, applyOverride } = useDataContext()
  const { showToast } = useToast()
  const [selectedId, setSelectedId] = useState(matches[0]?.id ?? '')
  const match = matches.find((m) => m.id === selectedId)

  const [score, setScore] = useState<Score>(match?.score ?? { edg: 0, opponent: 0 })
  const [status, setStatus] = useState<MatchStatus>(match?.status ?? 'upcoming')
  const [maps, setMaps] = useState<MapResult[]>(
    match?.maps.map((m) => ({ ...m })) ?? [],
  )

  function selectMatch(id: string) {
    setSelectedId(id)
    const m = matches.find((m) => m.id === id)
    if (m) {
      setScore({ ...m.score })
      setStatus(m.status)
      setMaps(m.maps.map((x) => ({ ...x })))
    }
  }

  function updateMap(index: number, partial: Partial<MapResult>) {
    setMaps((prev) => prev.map((m, i) => (i === index ? { ...m, ...partial } : m)))
  }

  function handleSave() {
    if (!match) return
    applyOverride({
      scoreOverrides: { [match.id]: { score, maps } },
      statusOverrides: { [match.id]: status },
    })
    showToast('比分已更新')
  }

  function handleReset() {
    if (!match) return
    setScore({ ...match.score })
    setStatus(match.status)
    setMaps(match.maps.map((m) => ({ ...m })))
  }

  return (
    <div className="space-y-5">
      {/* Match selector */}
      <div>
        <label className="text-body-sm font-medium text-text-secondary mb-1.5 block">选择比赛</label>
        <select
          value={selectedId}
          onChange={(e) => selectMatch(e.target.value)}
          className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2 text-body-sm text-text-primary outline-none focus:border-primary/50"
        >
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.stage} — {m.opponentTeam.name}
            </option>
          ))}
        </select>
      </div>

      {match && (
        <>
          {/* Big score + status */}
          <div className="flex items-end gap-4">
            <div>
              <label className="text-body-sm font-medium text-text-secondary mb-1.5 block">大比分</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-caption text-primary font-bold">EDG</span>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={score.edg}
                    onChange={(e) => setScore((s) => ({ ...s, edg: Number(e.target.value) }))}
                    className="w-16 rounded-md border border-border bg-bg-secondary px-3 py-2 text-center text-body font-mono text-text-primary outline-none focus:border-primary/50"
                  />
                </div>
                <span className="text-text-tertiary text-body">:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={score.opponent}
                    onChange={(e) => setScore((s) => ({ ...s, opponent: Number(e.target.value) }))}
                    className="w-16 rounded-md border border-border bg-bg-secondary px-3 py-2 text-center text-body font-mono text-text-primary outline-none focus:border-primary/50"
                  />
                  <span className="text-caption text-text-secondary font-bold">
                    {match.opponentTeam.shortName}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-body-sm font-medium text-text-secondary mb-1.5 block">状态</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MatchStatus)}
                className="rounded-md border border-border bg-bg-secondary px-3 py-2 text-body-sm text-text-primary outline-none focus:border-primary/50"
              >
                <option value="upcoming">即将开始</option>
                <option value="live">进行中</option>
                <option value="finished">已结束</option>
              </select>
            </div>
          </div>

          {/* Map scores */}
          <div>
            <h4 className="text-body-sm font-medium text-text-secondary mb-2">
              地图比分（{match.format}）
            </h4>
            <div className="space-y-2">
              {maps.map((m, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-bg-secondary px-3 py-2">
                  <select
                    value={m.mapName}
                    onChange={(e) => updateMap(i, { mapName: e.target.value })}
                    className="w-28 rounded border border-border bg-bg-tertiary px-2 py-1 text-body-sm text-text-primary outline-none"
                  >
                    {MAP_OPTIONS.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>

                  <span className="text-caption text-primary font-bold">EDG</span>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={m.edgScore}
                    onChange={(e) => updateMap(i, { edgScore: Number(e.target.value) })}
                    className="w-14 rounded border border-border bg-bg-tertiary px-2 py-1 text-center text-body-sm font-mono text-text-primary outline-none"
                  />
                  <span className="text-text-tertiary text-body-sm">:</span>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={m.opponentScore}
                    onChange={(e) => updateMap(i, { opponentScore: Number(e.target.value) })}
                    className="w-14 rounded border border-border bg-bg-tertiary px-2 py-1 text-center text-body-sm font-mono text-text-primary outline-none"
                  />

                  <select
                    value={m.status}
                    onChange={(e) => updateMap(i, { status: e.target.value as MapResult['status'] })}
                    className="rounded border border-border bg-bg-tertiary px-2 py-1 text-caption text-text-primary outline-none"
                  >
                    <option value="upcoming">未开始</option>
                    <option value="live">进行中</option>
                    <option value="finished">已结束</option>
                  </select>

                  <select
                    value={m.winner ?? ''}
                    onChange={(e) => updateMap(i, { winner: (e.target.value || null) as 'edg' | 'opponent' | null })}
                    className="rounded border border-border bg-bg-tertiary px-2 py-1 text-caption text-text-primary outline-none"
                  >
                    <option value="">无胜者</option>
                    <option value="edg">EDG 胜</option>
                    <option value="opponent">对手胜</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-border">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm text-white font-medium hover:bg-primary-hover active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              保存修改
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </button>
          </div>
        </>
      )}
    </div>
  )
}
