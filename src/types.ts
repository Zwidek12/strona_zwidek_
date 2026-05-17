export type HttpMethod = 'GET' | 'POST'

export type ActivityType =
  | 'Kawa'
  | 'Rush_B_CSGO'
  | 'Duo_Bot_LoL'
  | 'Wspólny_Trening'

export interface ApiResponse {
  status: number
  statusText: string
  body: Record<string, unknown>
}

export interface DuoRequestBody {
  activityType: ActivityType
  preferredDay: string
  isPlayerTwoReady: boolean
}

export interface LoginRequestBody {
  role: string
}
