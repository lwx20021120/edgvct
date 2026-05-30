import { useDataContext } from '../../context/DataContext'
import { PlayerCard } from './PlayerCard'

export function PlayerSection() {
  const { edgPlayers, opponentPlayers } = useDataContext()

  return (
    <div className="w-full">
      {/* EDG 选手 - 桌面5列、平板3列、手机2列 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {edgPlayers.map(player => (
          <PlayerCard key={player.id} player={player} isEdg={true} />
        ))}
      </div>

      {opponentPlayers.length > 0 && (
        <>
          <h3 className="mt-8 mb-4 text-lg font-semibold text-text-secondary text-center">对手阵容</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {opponentPlayers.map(player => (
              <PlayerCard key={player.id} player={player} isEdg={false} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
