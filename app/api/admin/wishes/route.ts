import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { WishData } from '@/types'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

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

export async function DELETE(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await deleteDoc(doc(db, 'wishes', id))

    return NextResponse.json(
      { success: true, message: 'Wish deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting wish:', error)
    return NextResponse.json(
      { error: 'Failed to delete wish' },
      { status: 500 }
    )
  }
}
