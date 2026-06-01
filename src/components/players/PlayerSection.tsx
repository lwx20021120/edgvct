import { useDataContext } from '../../context/DataContext'
import { PlayerCard } from './PlayerCard'

export function PlayerSection() {
  const { edgPlayers, opponentPlayers } = useDataContext()

  return (
    <div className="w-full">
      {/* EDG 选手 — 5列从 md 开始，卡片自适应缩小 */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {edgPlayers.map(player => (
          <div key={player.id} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-0.5rem)] md:w-[calc(20%-0.6rem)] min-w-[130px] max-w-[220px] flex-1">
            <PlayerCard player={player} isEdg={true} />
          </div>
        ))}
      </div>

      {opponentPlayers.length > 0 && (
        <>
          <h3 className="mt-8 mb-4 text-lg font-semibold text-text-secondary text-center">对手阵容</h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {opponentPlayers.map(player => (
              <div key={player.id} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-0.5rem)] md:w-[calc(20%-0.6rem)] min-w-[130px] max-w-[220px] flex-1">
                <PlayerCard player={player} isEdg={false} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
