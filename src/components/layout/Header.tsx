import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { Container } from './Container'

const NAV_ITEMS = [
  { id: 'video', label: '视频' },
  { id: 'players', label: '选手' },
  { id: 'schedule', label: '赛程' },
  { id: 'wall', label: '应援' },
]

export function Header() {
  const { currentSection, setSection } = useAppContext()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleNav(id: string) {
    setSection(id)
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    function onScroll() {
      const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean)
      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i]!.getBoundingClientRect()
        if (rect.top <= 120) {
          setSection(NAV_ITEMS[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [setSection])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-bg-primary/85 backdrop-blur-lg">
      <Container className="flex h-14 items-center justify-between md:h-16">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <div className="relative">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center
              shadow-[0_0_15px_rgba(225,6,0,0.3)]">
              <span className="text-lg font-black text-white tracking-tighter">E</span>
            </div>
            <div className="absolute -inset-0.5 rounded-lg bg-primary/20 blur-sm -z-10" />
          </div>
          <div className="hidden sm:block">
            <span className="text-body font-black tracking-wide text-text-primary">EDG</span>
            <span className="text-caption text-text-tertiary ml-2">VCT London</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`rounded-md px-3 py-2 text-body-sm font-medium transition-colors ${
                currentSection === item.id
                  ? 'text-primary relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-5 after:rounded-full after:bg-primary after:shadow-[0_0_6px_rgba(225,6,0,0.6)]'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden rounded-md p-2 text-text-secondary hover:text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {/* Header 底部红色渐变分割线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="border-t border-white/[0.06] bg-bg-primary md:hidden">
          <Container className="py-2 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full rounded-md px-3 py-3 text-left text-body font-medium transition-colors ${
                  currentSection === item.id
                    ? 'bg-primary/15 text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </Container>
        </nav>
      )}
    </header>
  )
}
