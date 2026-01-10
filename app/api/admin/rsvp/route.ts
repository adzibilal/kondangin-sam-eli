import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { RSVPData } from '@/types'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const rsvpsRef = collection(db, 'rsvps')
    const q = query(rsvpsRef, orderBy('submittedAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const rsvps: RSVPData[] = []
    querySnapshot.forEach(doc => {
      rsvps.push({
        id: doc.id,
        ...doc.data(),
      } as RSVPData)
    })

    return NextResponse.json({ rsvps }, { status: 200 })
  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await deleteDoc(doc(db, 'rsvps', id))

    return NextResponse.json(
      { success: true, message: 'RSVP deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to delete RSVP' },
      { status: 500 }
    )
  }
}
