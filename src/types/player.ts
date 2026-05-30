export type PlayerRole = 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel' | 'Flex'

export interface Team {
  id: string
  name: string
  shortName: string
  logo: string
  color: string
}

export interface Hero {
  name: string
  icon: string
  role: string
}

export interface PlayerStats {
  acs: number
  kd: number
  kills: number
  deaths: number
  assists: number
  hsPercent: number
  fkpr: number
}

export interface Player {
  id: string
  nickname: string
  realName: string
  role: PlayerRole
  teamId: string
  avatar: string
  heroPool: Hero[]
  stats: PlayerStats
  isMVP: boolean
}
