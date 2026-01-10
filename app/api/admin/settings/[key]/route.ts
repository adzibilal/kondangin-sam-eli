import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

// GET - Fetch a specific setting by key
export async function GET(
  request: Request,
  context: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await context.params
    const settingRef = doc(db, 'settings', key)
    const settingDoc = await getDoc(settingRef)

    if (!settingDoc.exists()) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: settingDoc.id,
      ...settingDoc.data(),
    })
  } catch (error) {
    console.error('Error fetching setting:', error)
    return NextResponse.json(
      { error: 'Failed to fetch setting' },
      { status: 500 }
    )
  }
}
