import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { RSVPData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, attendance, guestCount, guestParam } = body

    // Validate required fields
    if (!name || !attendance) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create RSVP document
    const rsvpData: Omit<RSVPData, 'id'> = {
      name,
      attendance,
      guestCount: parseInt(guestCount) || 1,
      submittedAt: Timestamp.now(),
      guestParam: guestParam || '',
    }

    const docRef = await addDoc(collection(db, 'rsvps'), rsvpData)

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: 'RSVP submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    )
  }
}
