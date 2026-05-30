import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { CountdownTimer } from './CountdownTimer'
import type { Match } from '../../types'

interface MatchCardProps {
  match: Match
}

const STATUS_CONFIG = {
  upcoming: { label: '即将开始', gradient: 'from-blue-500/10 to-blue-500/5', text: 'text-blue-400', dot: 'bg-blue-400' },
  live: { label: '进行中', gradient: 'from-red-500/10 to-red-500/5', text: 'text-red-400', dot: 'bg-red-400' },
  finished: { label: '已结束', gradient: 'from-gray-500/10 to-gray-500/5', text: 'text-gray-400', dot: 'bg-gray-400' },
}

function toBeijingTime(iso: string): string {
  const date = new Date(iso)
  const opts: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Shanghai',
  }
  return new Intl.DateTimeFormat('zh-CN', opts).format(date)
}

export function MatchCard({ match }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[match.status]
  const isLive = match.status === 'live'

  return (
    <div
      className="rounded-xl bg-[#111] overflow-hidden shadow-lg transition-all duration-500"
      style={isLive ? { animation: 'pulse-glow 2s infinite' } : undefined}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-3 bg-gradient-to-r ${status.gradient}`}>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium ${status.text} bg-black/20`}>
            {isLive && (
              <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse`} />
            )}
            {status.label}
          </span>
          <span className="text-caption text-text-tertiary">{match.stage}</span>
        </div>
        <span className="text-caption text-text-tertiary font-mono">{match.format}</span>
      </div>

      {/* Main */}
      <div className="px-5 py-6">
        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-4">
          {/* EDG */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center
              shadow-[0_0_20px_rgba(225,6,0,0.2)] ring-1 ring-primary/30">
              <span className="text-lg font-black text-primary">EDG</span>
            </div>
            <span className="text-body-sm font-semibold text-text-primary">EDG</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <span className="text-[42px] font-black text-text-primary tabular-nums tracking-tight leading-none">
                {match.score.edg}
              </span>
              <span className="text-body-sm font-bold text-text-tertiary px-2 py-0.5 rounded bg-white/[0.04] uppercase tracking-wider">
                VS
              </span>
              <span className="text-[42px] font-black text-text-primary tabular-nums tracking-tight leading-none">
                {match.score.opponent}
              </span>
            </div>
            <div className="mt-2">
              <CountdownTimer targetTime={match.startTime} />
            </div>
          </div>

          {/* Opponent */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-16 w-16 rounded-full bg-[#1a1a1a] flex items-center justify-center ring-1 ring-white/10">
              <span className="text-sm font-bold text-text-tertiary">
                {match.opponentTeam.shortName}
              </span>
            </div>
            <span className="text-body-sm font-semibold text-text-primary">
              {match.opponentTeam.name === 'TBD' ? '待定' : match.opponentTeam.shortName}
            </span>
          </div>
        </div>

        {/* Time */}
        <p className="mt-5 text-center text-caption text-text-tertiary">
          {toBeijingTime(match.startTime)}（北京时间）
        </p>

        {/* Expand maps */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 mx-auto flex items-center gap-1 text-caption text-text-tertiary hover:text-text-secondary transition-colors"
        >
          地图详情
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-1.5 pt-4 border-t border-white/[0.06]">
                {match.maps.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-[#0d0d0d] px-3 py-2.5 text-body-sm"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-text-tertiary" />
                      <span className="text-text-primary font-medium">{m.mapName}</span>
                      <span className="text-caption text-text-tertiary">
                        {m.status === 'live' ? '进行中' : m.status === 'finished' ? '已结束' : '未开始'}
                      </span>
                    </div>
                    <span className="font-mono text-text-secondary tabular-nums">
                      {m.edgScore} : {m.opponentScore}
                    </span>
                  </div>
                ))}
              </div>
              {match.casters && match.casters.length > 0 && (
                <p className="mt-2 text-caption text-text-tertiary">
                  解说：{match.casters.join('、')}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
