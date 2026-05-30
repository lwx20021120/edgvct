import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  targetTime: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function CountdownTimer({ targetTime }: CountdownTimerProps) {
  const [time, setTime] = useState(() => calcTimeLeft(targetTime))

  useEffect(() => {
    const tick = () => setTime(calcTimeLeft(targetTime))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetTime])

  if (time.isPast) {
    return (
      <div className="flex items-center gap-1.5 text-text-tertiary">
        <Clock className="h-4 w-4" />
        <span className="text-caption font-mono">比赛进行中...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-text-secondary font-mono text-caption">
      <Clock className="h-4 w-4" />
      {time.days > 0 && (
        <>
          <span>{time.days}天</span>
          <span className="text-text-tertiary">:</span>
        </>
      )}
      <span>{pad(time.hours)}</span>
      <span className="text-text-tertiary">:</span>
      <span>{pad(time.minutes)}</span>
      <span className="text-text-tertiary">:</span>
      <span>{pad(time.seconds)}</span>
    </div>
  )
}
