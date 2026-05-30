import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react'
import type { Match, Player, Score, MapResult, MatchStatus } from '../types'
import type { DataOverride } from '../types/admin'
import scheduleData from '../../data/schedule.json'
import playersData from '../../data/players.json'
import { apiGet } from '../config/api'

interface DataContextValue {
  matches: Match[]
  edgPlayers: Player[]
  opponentPlayers: Player[]
  overrides: DataOverride
  applyOverride: (override: Partial<DataOverride>) => void
  resetOverrides: () => void
  getMatch: (id: string) => Match | undefined
}

const DataContext = createContext<DataContextValue | null>(null)

const OVERRIDES_KEY = 'edg_vct_data_overrides'

function loadOverrides(): DataOverride {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { mvpOverrides: {}, scoreOverrides: {}, statusOverrides: {} }
}

function saveOverrides(overrides: DataOverride) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
}

function mergeData(
  baseMatches: Match[],
  baseEdgPlayers: Player[],
  baseOpponentPlayers: Player[],
  overrides: DataOverride,
): { matches: Match[]; edgPlayers: Player[]; opponentPlayers: Player[] } {
  const matches = baseMatches.map((m) => {
    const scoreOverride = overrides.scoreOverrides[m.id]
    const statusOverride = overrides.statusOverrides[m.id]
    return {
      ...m,
      status: statusOverride ?? m.status,
      score: scoreOverride ? scoreOverride.score : m.score,
      maps: scoreOverride ? scoreOverride.maps : m.maps,
    }
  })

  const applyMVP = (players: Player[]) =>
    players.map((p) => ({
      ...p,
      isMVP: overrides.mvpOverrides[p.id] ?? p.isMVP,
    }))

  return {
    matches,
    edgPlayers: applyMVP(baseEdgPlayers),
    opponentPlayers: applyMVP(baseOpponentPlayers),
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<DataOverride>(loadOverrides)

  const baseMatches = scheduleData.matches as unknown as Match[]
  const baseEdgPlayers = playersData.edg as unknown as Player[]
  const baseOpponentPlayers = playersData.opponent as unknown as Player[]

  const { matches, edgPlayers, opponentPlayers } = useMemo(
    () => mergeData(baseMatches, baseEdgPlayers, baseOpponentPlayers, overrides),
    [overrides],
  )

  const fetchOverrides = useCallback(async () => {
    try {
      const data = await apiGet('/rest/v1/data_overrides?select=id,payload')
      if (!data?.length) return
      const remote: DataOverride = { mvpOverrides: {}, scoreOverrides: {}, statusOverrides: {} }
      for (const row of data) {
        if (row.id === 'mvp') remote.mvpOverrides = row.payload as Record<string, boolean>
        else if (row.id === 'score') remote.scoreOverrides = row.payload as Record<string, { score: Score; maps: MapResult[] }>
        else if (row.id === 'status') remote.statusOverrides = row.payload as Record<string, MatchStatus>
      }
      setOverrides((prev) => ({ ...prev, ...remote }))
    } catch { /* silent fail */ }
  }, [])

  useEffect(() => {
    fetchOverrides()
    const interval = setInterval(fetchOverrides, 10000)
    return () => clearInterval(interval)
  }, [fetchOverrides])

  const applyOverride = useCallback((partial: Partial<DataOverride>) => {
    setOverrides((prev) => {
      const next = {
        mvpOverrides: { ...prev.mvpOverrides, ...partial.mvpOverrides },
        scoreOverrides: { ...prev.scoreOverrides, ...partial.scoreOverrides },
        statusOverrides: { ...prev.statusOverrides, ...partial.statusOverrides },
      }
      saveOverrides(next)
      return next
    })
  }, [])

  const resetOverrides = useCallback(() => {
    const empty: DataOverride = { mvpOverrides: {}, scoreOverrides: {}, statusOverrides: {} }
    saveOverrides(empty)
    setOverrides(empty)
  }, [])

  const getMatch = useCallback(
    (id: string) => matches.find((m) => m.id === id),
    [matches],
  )

  return (
    <DataContext.Provider value={{ matches, edgPlayers, opponentPlayers, overrides, applyOverride, resetOverrides, getMatch }}>
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useDataContext must be used within DataProvider')
  return ctx
}
