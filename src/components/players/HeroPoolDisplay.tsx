import type { Hero } from '../../types'

interface HeroPoolDisplayProps {
  heroes: Hero[]
}

export function HeroPoolDisplay({ heroes }: HeroPoolDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      {heroes.slice(0, 5).map((hero) => (
        <div
          key={hero.name}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-tertiary ring-1 ring-white/[0.06] overflow-hidden"
          title={hero.name}
        >
          <img
            src={hero.icon}
            alt={hero.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
              const parent = (e.target as HTMLImageElement).parentElement
              if (parent) parent.textContent = hero.name.charAt(0)
            }}
          />
        </div>
      ))}
    </div>
  )
}
