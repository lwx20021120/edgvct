export interface Score {
  edg: number
  opponent: number
}

import type { Team } from './player'

export interface Score {
  edg: number
  opponent: number
}

export interface MapResult {
  mapName: string
  edgScore: number
  opponentScore: number
  winner: 'edg' | 'opponent' | null
  status: 'upcoming' | 'live' | 'finished'
  vodLink?: string
}

export type MatchStatus = 'upcoming' | 'live' | 'finished'

export interface Match {
  id: string
  edgTeam: Team
  opponentTeam: Team
  stage: string
  startTime: string
  status: MatchStatus
  score: Score
  maps: MapResult[]
  format: string
  casters?: string[]
}
