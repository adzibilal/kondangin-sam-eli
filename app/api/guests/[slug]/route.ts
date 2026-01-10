import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { GuestData } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const guestsRef = collection(db, 'guests')
    const q = query(guestsRef, where('slug', '==', slug))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    const guestDoc = querySnapshot.docs[0]
    const guestData: GuestData = {
      id: guestDoc.id,
      ...guestDoc.data(),
    } as GuestData

    // Return only necessary data for public use
    return NextResponse.json(
      {
        guest: {
          name: guestData.name,
          session: guestData.session,
          totalGuest: guestData.totalGuest,
          slug: guestData.slug,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching guest by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guest' },
      { status: 500 }
    )
  }
}
