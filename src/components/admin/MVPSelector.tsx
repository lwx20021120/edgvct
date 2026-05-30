import { useState } from 'react'
import { Star, StarOff, Save } from 'lucide-react'
import { useDataContext } from '../../context/DataContext'
import { useToast } from '../shared/Toast'
import type { Player } from '../../types'

export function MVPSelector() {
  const { edgPlayers, opponentPlayers, applyOverride, overrides } = useDataContext()
  const { showToast } = useToast()
  const [localMVP, setLocalMVP] = useState<Record<string, boolean>>({
    ...overrides.mvpOverrides,
  })

  function togglePlayer(playerId: string) {
    setLocalMVP((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }))
  }

  function handleSave() {
    applyOverride({ mvpOverrides: localMVP })
    showToast('MVP 已更新')
  }

  const allPlayers = [...edgPlayers, ...opponentPlayers]

  return (
    <div className="space-y-5">
      {allPlayers.length === 0 ? (
        <p className="text-text-tertiary text-body-sm">选手数据尚未加载</p>
      ) : (
        <>
          {/* EDG */}
          {edgPlayers.length > 0 && (
            <div>
              <h4 className="text-body-sm font-semibold text-primary mb-2">EDG 选手</h4>
              <div className="space-y-1.5">
                {edgPlayers.map((p) => (
                  <MVPPlayerRow
                    key={p.id}
                    player={p}
                    isMVP={!!localMVP[p.id]}
                    onToggle={() => togglePlayer(p.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Opponent */}
          {opponentPlayers.length > 0 && (
            <div>
              <h4 className="text-body-sm font-semibold text-text-secondary mb-2 mt-4">对手选手</h4>
              <div className="space-y-1.5">
                {opponentPlayers.map((p) => (
                  <MVPPlayerRow
                    key={p.id}
                    player={p}
                    isMVP={!!localMVP[p.id]}
                    onToggle={() => togglePlayer(p.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-border">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-body-sm text-white font-medium hover:bg-primary-hover active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              保存 MVP 状态
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function MVPPlayerRow({
  player,
  isMVP,
  onToggle,
}: {
  player: Player
  isMVP: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 transition-colors text-left ${
        isMVP
          ? 'bg-gold/10 border border-gold/30'
          : 'bg-bg-secondary border border-border hover:border-border-light'
      }`}
    >
      <div className="h-8 w-8 rounded-full bg-bg-elevated border border-border overflow-hidden flex-shrink-0">
        <img
          src={player.avatar}
          alt={player.nickname}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-semibold text-text-primary">{player.nickname}</p>
        <p className="text-caption text-text-tertiary">{player.realName}</p>
      </div>
      <div className={`flex-shrink-0 ${isMVP ? 'text-gold' : 'text-text-tertiary'}`}>
        {isMVP ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
      </div>
    </button>
  )
}
