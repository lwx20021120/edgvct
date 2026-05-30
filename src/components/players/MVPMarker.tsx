import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface MVPMarkerProps {
  active: boolean
}

export function MVPMarker({ active }: MVPMarkerProps) {
  if (!active) return null

  return (
    <motion.div
      className="absolute -top-2 -right-2 z-10"
      initial={{ scale: 0, rotate: -30 }}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold shadow-glow-gold">
        <Star className="h-4 w-4 text-bg-primary fill-bg-primary" />
      </div>
    </motion.div>
  )
}
