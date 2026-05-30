import type { Score, MapResult, MatchStatus } from './schedule'

export interface AdminState {
  isAuthenticated: boolean
  adminPassword: string
}

export interface DataOverride {
  mvpOverrides: Record<string, boolean>
  scoreOverrides: Record<string, { score: Score; maps: MapResult[] }>
  statusOverrides: Record<string, MatchStatus>
}
