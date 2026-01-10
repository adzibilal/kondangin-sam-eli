import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

// GET - Fetch all settings
export async function GET() {
  try {
    const settingsRef = collection(db, 'settings')
    const snapshot = await getDocs(settingsRef)
    
    const settings: any[] = []
    snapshot.forEach(doc => {
      settings.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST - Update settings
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { key, value, description } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const settingRef = doc(db, 'settings', key)
    
    await setDoc(settingRef, {
      key,
      value,
      description: description || '',
      updatedAt: serverTimestamp(),
    }, { merge: true })

    return NextResponse.json({ 
      message: 'Setting updated successfully',
      key,
      value 
    })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}
