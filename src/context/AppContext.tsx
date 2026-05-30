import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AppContextValue {
  currentSection: string
  isDarkMode: true
  setSection: (section: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState('live')

  const setSection = useCallback((section: string) => {
    setCurrentSection(section)
  }, [])

  return (
    <AppContext.Provider value={{ currentSection, isDarkMode: true, setSection }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
