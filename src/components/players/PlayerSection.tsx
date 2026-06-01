import { useDataContext } from '../../context/DataContext'
import { PlayerCard } from './PlayerCard'

export function PlayerSection() {
  const { edgPlayers, opponentPlayers } = useDataContext()

  return (
    <div className="w-full">
      {/* EDG 选手 - flex wrap 居中，末行自动居中 */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {edgPlayers.map(player => (
          <div key={player.id} className="w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.85rem)] lg:w-[calc(20%-1rem)] min-w-[160px]">
            <PlayerCard player={player} isEdg={true} />
          </div>
        ))}
      </div>

      {opponentPlayers.length > 0 && (
        <>
          <h3 className="mt-8 mb-4 text-lg font-semibold text-text-secondary text-center">对手阵容</h3>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {opponentPlayers.map(player => (
              <div key={player.id} className="w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.85rem)] lg:w-[calc(20%-1rem)] min-w-[160px]">
                <PlayerCard player={player} isEdg={false} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
