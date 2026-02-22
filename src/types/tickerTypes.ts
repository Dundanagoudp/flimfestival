export interface TickerAnnouncement {
  _id: string
  text: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface TickerAnnouncementApiResponse {
  success: true
  data: TickerAnnouncement
}

export interface TickerAnnouncementListResponse {
  success: true
  data: TickerAnnouncement[]
}

export interface TickerAnnouncementCreatePayload {
  text: string
  order: number
}

export interface TickerAnnouncementUpdatePayload {
  text?: string
  order?: number
}
