import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-8 md:py-12 ${className}`}>
      {title && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-text-tertiary">{subtitle}</p>}
          <div className="mt-3 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      )}
      {children}
    </section>
  )
}
