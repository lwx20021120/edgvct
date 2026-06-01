import { motion } from 'framer-motion'
import { Crosshair, Swords } from 'lucide-react'
import { MVPMarker } from './MVPMarker'
import { HeroPoolDisplay } from './HeroPoolDisplay'
import type { Player } from '../../types'

interface PlayerCardProps {
  player: Player
  isEdg: boolean
}

const ROLE_LABELS: Record<string, string> = {
  Duelist: '决斗者',
  Initiator: '先锋',
  Controller: '控场者',
  Sentinel: '哨卫',
  Flex: '自由人',
}

export function PlayerCard({ player, isEdg }: PlayerCardProps) {
  const { stats } = player
  const bgPhotoUrl = player.id ? `/players-bg/${player.id}.jpg` : null

  return (
    <motion.div
      className={`relative rounded-xl p-3 md:p-4 transition-all duration-300 overflow-hidden
        backdrop-blur-sm border group ${
        player.isMVP
          ? 'shadow-[0_0_30px_rgba(212,168,83,0.1)] border-gold/20'
          : isEdg
            ? 'border-primary/[0.08]'
            : 'border-white/[0.05]'
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* 选手照片背景层 — z-0，极低不透明度 */}
      {bgPhotoUrl && (
        <div
          className="absolute inset-0 z-0 rounded-xl opacity-10 group-hover:opacity-[0.18] transition-opacity duration-500"
          style={{
            backgroundImage: `url(${bgPhotoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            filter: 'blur(1px) saturate(0.8)',
          }}
        />
      )}

      {/* 暗色遮罩层 — z-[1] 确保文字可读 */}
      <div
        className={`absolute inset-0 z-[1] rounded-xl ${
          player.isMVP
            ? 'bg-gradient-to-br from-[#1a0f00]/92 to-[#0d0d0d]/94'
            : isEdg
              ? 'bg-gradient-to-br from-[#1a0808]/88 to-[#0d0d0d]/90'
              : 'bg-gradient-to-br from-[#111]/90 to-[#0d0d0d]/92'
        }`}
      />

      {/* MVP 左边金色竖线 */}
      {player.isMVP && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold-light to-gold rounded-l-xl z-20" />
      )}

      {/* 原有内容 — z-[2] */}
      <div className="relative z-[2]">
        <MVPMarker active={player.isMVP} />

        {/* Header: Avatar + Name + Role */}
        <div className="flex items-center gap-3">
          <div className={`relative h-14 w-14 flex-shrink-0 rounded-full overflow-hidden ${
            player.isMVP
              ? 'ring-2 ring-gold/50 shadow-[0_0_15px_rgba(212,168,83,0.3)]'
              : isEdg
                ? 'ring-2 ring-primary/30 shadow-[0_0_15px_rgba(225,6,0,0.3)]'
                : 'ring-1 ring-white/10'
          }`}>
            <img
              src={player.avatar}
              alt={player.nickname}
              className="h-full w-full object-cover bg-bg-elevated"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
                const parent = (e.target as HTMLImageElement).parentElement
                if (parent) {
                  parent.classList.add('flex', 'items-center', 'justify-center', 'bg-bg-elevated')
                  parent.textContent = player.nickname.charAt(0).toUpperCase()
                }
              }}
            />
            {player.isMVP && (
              <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-gold shadow-[0_0_6px_rgba(212,168,83,0.5)]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-body font-semibold text-text-primary truncate">
                {player.nickname}
              </span>
              {player.isMVP && (
                <span className="inline-flex items-center rounded bg-gold/15 px-1.5 py-0.5 text-caption font-bold text-gold">
                  MVP
                </span>
              )}
            </div>
            <p className="text-caption text-text-tertiary">{player.realName}</p>
            <span className="inline-block mt-0.5 rounded bg-[#222] px-1.5 py-0.5 text-caption text-text-secondary">
              {ROLE_LABELS[player.role] || player.role}
            </span>
          </div>
        </div>

        {/* Stats — 无框，纯数字 */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatItem label="ACS" value={stats.acs} highlight />
          <StatItem label="K/D" value={stats.kd} isRatio />
          <StatItem label="KPR" value={stats.fkpr} isRatio />
        </div>

        <div className="mt-3 flex items-center justify-between text-caption text-text-tertiary">
          <div className="flex items-center gap-1">
            <Swords className="h-3 w-3" />
            <span>{stats.kills}/{stats.deaths}/{stats.assists}</span>
          </div>
          <div className="flex items-center gap-1">
            <Crosshair className="h-3 w-3" />
            <span>{stats.hsPercent}%</span>
          </div>
        </div>

        {/* Hero Pool */}
        {player.heroPool.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <p className="text-caption text-text-tertiary mb-2">常用英雄</p>
            <HeroPoolDisplay heroes={player.heroPool} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

function StatItem({
  label,
  value,
  highlight,
  isRatio,
}: {
  label: string
  value: number
  highlight?: boolean
  isRatio?: boolean
}) {
  const display = isRatio ? value.toFixed(2) : String(value)

  return (
    <div className="text-center">
      <p className={`font-number font-bold ${highlight ? 'text-2xl text-primary' : 'text-base text-text-primary'}`}>
        {display}
      </p>
      <p className="text-caption text-text-tertiary mt-0.5">{label}</p>
    </div>
  )
}
