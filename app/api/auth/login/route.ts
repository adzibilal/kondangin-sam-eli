import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    await setAuthCookie()

    return NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
