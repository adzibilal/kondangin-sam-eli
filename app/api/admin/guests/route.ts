import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { GuestData } from '@/types'
import { requireAuth } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const guestsRef = collection(db, 'guests')
    const q = query(guestsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const guests: GuestData[] = []
    querySnapshot.forEach(doc => {
      guests.push({
        id: doc.id,
        ...doc.data(),
      } as GuestData)
    })

    return NextResponse.json({ guests }, { status: 200 })
  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, session, totalGuest, whatsapp } = body

    // Validate required fields
    if (!name || !session || !totalGuest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate UUID slug
    const slug = uuidv4()

    // Create guest document
    const guestData: Omit<GuestData, 'id'> = {
      slug,
      name,
      session: Number.parseInt(session.toString()),
      totalGuest: Number.parseInt(totalGuest.toString()),
      whatsapp: whatsapp || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, 'guests'), guestData)

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        guest: { id: docRef.id, ...guestData },
        message: 'Guest created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating guest:', error)
    return NextResponse.json(
      { error: 'Failed to create guest' },
      { status: 500 }
    )
  }
}
