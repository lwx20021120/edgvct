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
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {matches.map((match) => (
        <div key={match.id} className="w-full lg:w-[calc(50%-0.75rem)] min-w-[300px] max-w-[600px]">
          <MatchCard match={match} />
        </div>
      ))}
    </div>
  )
}
