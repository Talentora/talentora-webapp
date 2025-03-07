import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import { createClient } from './utils/supabase/server';

// List of unprotected routes as regular expressions
export const unprotectedRoutes = [
  /^\/$/, // Matches '/'
  /^\/signin(\/.*)?$/, // Matches '/signin' and any subpath like '/signin/*'
  /^\/signup(\/.*)?$/,
  /^\/about$/, // Matches '/about'
  /^\/pricing$/, // Matches '/pricing'
  /^\/api\/auth\/callback$/, // Matches '/api/auth/callback'
  /^\/demo$/
];

// Add the applicant route to the unprotected routes
const applicantRoutes = [
  /^\/assessment(\/.*)?$/, // Matches '/bot' and any subpath like '/bot/*'
  /^\/mock(\/.*)?$/, //Matches 'bot' and any subpath like '/bot/*
  /^\/api(\/.*)?$/ // Matches '/api' and any subpath like '/api/*'
];

// Combine unprotected and applicant routes
const allUnprotectedRoutes = [...unprotectedRoutes, ...applicantRoutes];


export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
