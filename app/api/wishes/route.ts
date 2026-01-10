import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { WishData } from '@/types'

export async function GET() {
  try {
    const wishesRef = collection(db, 'wishes')
    const q = query(wishesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const wishes: WishData[] = []
    querySnapshot.forEach(doc => {
      wishes.push({
        id: doc.id,
        ...doc.data(),
      } as WishData)
    })

    return NextResponse.json({ wishes }, { status: 200 })
  } catch (error) {
    console.error('Error fetching wishes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, audioUrl, duration, guestParam, guestSlug } = body

    // Validate required fields
    if (!name || !audioUrl || !duration || !guestSlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create wish document (multiple wishes allowed per guest)
    const wishData: Omit<WishData, 'id'> = {
      name,
      audioUrl,
      duration,
      createdAt: Timestamp.now(),
      guestParam: guestParam || '',
      guestSlug: guestSlug,
    }

    const docRef = await addDoc(collection(db, 'wishes'), wishData)

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: 'Wish submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting wish:', error)
    return NextResponse.json(
      { error: 'Failed to submit wish' },
      { status: 500 }
    )
  }
}
