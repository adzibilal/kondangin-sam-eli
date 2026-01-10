import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    const docRef = doc(db, 'guests', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    return NextResponse.json(
      { guest: { id: docSnap.id, ...docSnap.data() } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching guest:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guest' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()
    const { name, session, totalGuest, whatsapp } = body

    // Validate required fields
    if (!name || !session || !totalGuest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const docRef = doc(db, 'guests', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    // Update guest document (preserve slug)
    await updateDoc(docRef, {
      name,
      session: Number.parseInt(session.toString()),
      totalGuest: Number.parseInt(totalGuest.toString()),
      whatsapp: whatsapp || '',
      updatedAt: Timestamp.now(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Guest updated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating guest:', error)
    return NextResponse.json(
      { error: 'Failed to update guest' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    const docRef = doc(db, 'guests', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    await deleteDoc(docRef)

    return NextResponse.json(
      {
        success: true,
        message: 'Guest deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting guest:', error)
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    )
  }
}
