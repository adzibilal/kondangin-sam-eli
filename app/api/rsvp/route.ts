import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore'
import { RSVPData } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guestSlug = searchParams.get('guestSlug')

    if (!guestSlug) {
      return NextResponse.json(
        { error: 'Guest slug is required' },
        { status: 400 }
      )
    }

    // Check if user already has RSVP
    const rsvpsRef = collection(db, 'rsvps')
    const q = query(rsvpsRef, where('guestSlug', '==', guestSlug))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const rsvpDoc = querySnapshot.docs[0]
      return NextResponse.json(
        {
          hasRSVP: true,
          rsvp: { id: rsvpDoc.id, ...rsvpDoc.data() } as RSVPData,
        },
        { status: 200 }
      )
    }

    return NextResponse.json({ hasRSVP: false }, { status: 200 })
  } catch (error) {
    console.error('Error checking RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to check RSVP' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, attendance, guestCount, guestParam, guestSlug } = body

    // Validate required fields
    if (!name || !attendance || !guestSlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already has RSVP
    const rsvpsRef = collection(db, 'rsvps')
    const q = query(rsvpsRef, where('guestSlug', '==', guestSlug))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: 'You have already submitted an RSVP' },
        { status: 409 }
      )
    }

    // Create RSVP document
    const rsvpData: Omit<RSVPData, 'id'> = {
      name,
      attendance,
      guestCount: Number.parseInt(guestCount.toString()) || 1,
      submittedAt: Timestamp.now(),
      guestParam: guestParam || '',
      guestSlug: guestSlug,
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
