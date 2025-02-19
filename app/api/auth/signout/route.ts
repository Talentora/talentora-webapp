
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = createClient();

  // Sign out the user with global scope to clear all sessions
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Clear all auth-related cookies
  const cookieStore = cookies()
  const authCookies = [
    'sb-access-token',
    'sb-refresh-token',
    'sb-auth-token',
    'supabase-auth-token',
    'sb-provider-token',
    'sb-session',
  ]

  // Clear specific auth cookies first
  authCookies.forEach(name => {
    cookieStore.delete(name)
  })

  // Clear any remaining session cookies
  cookieStore.getAll().forEach(cookie => {
    if (cookie.name.startsWith('sb-') || 
        cookie.name.includes('auth') || 
        cookie.name.includes('session')) {
      cookieStore.delete(cookie.name)
    }
  })

  const response = NextResponse.json(
    { message: 'Signed out successfully' },
    { status: 200 }
  )
  
  // Set cache control headers to prevent caching
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('location', '/')
  
  return response

}
