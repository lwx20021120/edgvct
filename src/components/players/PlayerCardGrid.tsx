import { PlayerCard } from './PlayerCard'
import type { Player } from '../../types'

interface PlayerCardGridProps {
  players: Player[]
  isEdg: boolean
}

export function PlayerCardGrid({ players, isEdg }: PlayerCardGridProps) {
  if (players.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-[#111]/80 backdrop-blur-sm border border-white/[0.04] py-8 w-full max-w-5xl mx-auto">
        <p className="text-text-tertiary text-body-sm">选手数据待更新</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl mx-auto justify-items-center">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} isEdg={isEdg} />
      ))}
    </div>
  )
}
