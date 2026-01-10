import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { requireAuth } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { guests } = body

    if (!Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json(
        { error: 'Invalid guests data' },
        { status: 400 }
      )
    }

    const results = {
      success: [] as string[],
      failed: [] as { name: string; error: string }[],
    }

    // Process each guest
    for (const guest of guests) {
      try {
        // Validate required fields
        if (!guest.name || !guest.session || !guest.totalGuest) {
          results.failed.push({
            name: guest.name || 'Unknown',
            error: 'Missing required fields',
          })
          continue
        }

        // Generate UUID slug
        const slug = uuidv4()

        // Create guest document
        const guestData = {
          slug,
          name: guest.name.trim(),
          session: Number.parseInt(guest.session.toString()),
          totalGuest: Number.parseInt(guest.totalGuest.toString()),
          whatsapp: guest.whatsapp?.trim() || '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }

        await addDoc(collection(db, 'guests'), guestData)
        results.success.push(guest.name)
      } catch (error) {
        console.error('Error creating guest:', guest.name, error)
        results.failed.push({
          name: guest.name || 'Unknown',
          error: 'Failed to create guest',
        })
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Imported ${results.success.length} guests successfully`,
        results,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error importing guests:', error)
    return NextResponse.json(
      { error: 'Failed to import guests' },
      { status: 500 }
    )
  }
}
