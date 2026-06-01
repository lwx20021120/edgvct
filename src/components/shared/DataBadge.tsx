import { motion } from 'framer-motion'

interface DataBadgeProps {
  /** 选手名/昵称 */
  name: string
  /** 趣味简介 */
  tagline: string
  className?: string
  delay?: number
  variant?: 'primary' | 'gold' | 'green'
}

const variantClasses = {
  primary: 'text-primary border-primary/20 bg-primary/[0.06]',
  gold: 'text-gold border-gold/20 bg-gold/[0.06]',
  green: 'text-success border-success/20 bg-success/[0.06]',
}

const dotClasses = {
  primary: 'bg-primary',
  gold: 'bg-gold',
  green: 'bg-success',
}

export function DataBadge({ name, tagline, className = '', delay = 0, variant = 'primary' }: DataBadgeProps) {
  return (
    <motion.div
      className={`rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5
        shadow-lg hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-300 cursor-default ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{ animation: `float-slow ${4 + delay}s ease-in-out infinite` }}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotClasses[variant]}`} />
        <p className="text-caption text-text-tertiary tracking-wide whitespace-nowrap">
          {name}
        </p>
      </div>
      <p className={`text-sm sm:text-base font-bold ${variantClasses[variant]}`}>
        {tagline}
      </p>
    </motion.div>
  )
}
