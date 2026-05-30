export const SITE_NAME = 'EDG 无畏契约伦敦大师赛应援站'
export const SITE_DESCRIPTION = '为 EDward Gaming 加油！直播、赛中数据、选手信息、应援墙一站聚合。'
export const BASE_URL = '/'

export const LOCAL_STORAGE_KEYS = {
  dataOverrides: 'edg_vct_data_overrides',
  wallMessages: 'edg_vct_wall_messages',
  adminAuth: 'edg_vct_admin_auth',
} as const

export const MAX_MESSAGE_LENGTH = 500
export const MAX_NICKNAME_LENGTH = 20
export const MESSAGE_PAGE_SIZE = 50

export const EDG_TEAM: TeamData = {
  id: 'edg',
  name: 'EDward Gaming',
  shortName: 'EDG',
  logo: '/logos/edg.png',
  color: '#E10600',
}

interface TeamData {
  id: string
  name: string
  shortName: string
  logo: string
  color: string
}
