import { motion } from 'framer-motion'

interface DataBadgeProps {
  label: string
  value: string
  className?: string
  /** Animation delay in seconds */
  delay?: number
  /** Color variant */
  variant?: 'green' | 'gold' | 'primary'
}

const variantClasses = {
  green: 'text-success',
  gold: 'text-gold',
  primary: 'text-primary',
}

export function DataBadge({ label, value, className = '', delay = 0, variant = 'green' }: DataBadgeProps) {
  return (
    <motion.div
      className={`rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5
        shadow-lg hover:border-white/[0.14] hover:bg-white/[0.06] transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ animation: `float-slow ${4 + delay}s ease-in-out infinite` }}
    >
      <p className="text-caption text-text-tertiary tracking-wide whitespace-nowrap">
        {label}
      </p>
      <p className={`font-mono text-sm sm:text-base font-bold tabular-nums ${variantClasses[variant]}`}>
        {value}
      </p>
    </motion.div>
  )
}
