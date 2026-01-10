import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_USER_PASSWORD || 'sameli2026'
const AUTH_COOKIE_NAME = 'admin_authenticated'

export async function setAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export function isAuthenticated(request?: NextRequest): boolean {
  if (request) {
    return request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true'
  }
  return false
}

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function requireAuth(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
