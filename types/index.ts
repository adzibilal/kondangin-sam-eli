import { Timestamp } from 'firebase/firestore'

export interface GuestData {
  id?: string
  slug: string // UUID v4
  name: string
  session: number // 1 or 2
  totalGuest: number
  whatsapp: string
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface RSVPData {
  id?: string
  name: string
  attendance: 'yes' | 'no'
  guestCount: number
  submittedAt: Timestamp | Date
  guestParam: string
  guestSlug?: string // Link to guest UUID
}

export interface WishData {
  id?: string
  name: string
  audioUrl: string
  duration: string
  createdAt: Timestamp | Date
  guestParam: string
  guestSlug?: string // Link to guest UUID
}

export interface RSVPFormData {
  attendance: 'yes' | 'no'
  guests: string
  name: string
}

export interface WishFormData {
  name: string
  audioBlob: Blob | null
  duration: string
}

export interface SettingsData {
  id?: string
  key: string
  value: string
  description?: string
  updatedAt?: Timestamp | Date
}

export interface InvitationMessageSettings {
  whatsappMessage: string
}
