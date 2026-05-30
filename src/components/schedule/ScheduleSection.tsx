import { useDataContext } from '../../context/DataContext'
import { MatchCard } from './MatchCard'

export function ScheduleSection() {
  const { matches } = useDataContext()

  if (matches.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-[#111] py-12">
        <p className="text-text-tertiary text-body">赛程待公布</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
