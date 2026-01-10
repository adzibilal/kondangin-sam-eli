import { Timestamp } from 'firebase/firestore'

export interface RSVPData {
  id?: string
  name: string
  attendance: 'yes' | 'no'
  guestCount: number
  submittedAt: Timestamp | Date
  guestParam: string
}

export interface WishData {
  id?: string
  name: string
  audioUrl: string
  duration: string
  createdAt: Timestamp | Date
  guestParam: string
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
