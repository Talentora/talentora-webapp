'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/types_db';

export const createClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('createClient should only be called on the server');
  }

  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error(`Error setting cookies:`, error);
          }
        },
      }
    }
  );
};

// Create auth client that uses anon key (compatible with middleware)
export const createAuthClient = () => {
  console.log('[AUTH CLIENT] createAuthClient called');
  console.log('[AUTH CLIENT] Environment check:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'MISSING',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'MISSING',
    nodeEnv: process.env.NODE_ENV,
    actualUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    actualAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
  });

  if (typeof window !== 'undefined') {
    throw new Error('createAuthClient should only be called on the server');
  }

  const cookieStore = cookies();

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use anon key for auth
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error(`Error setting cookies:`, error);
          }
        },
      }
    }
  );

  console.log('[AUTH CLIENT] Client created:', {
    hasAuth: !!client.auth,
    hasSignInWithPassword: !!client.auth?.signInWithPassword,
    hasGetUser: !!client.auth?.getUser,
    authKeys: client.auth ? Object.keys(client.auth) : 'no auth'
  });

  // Final verification before returning
  if (!client.auth) {
    console.error('[AUTH CLIENT] CRITICAL ERROR: Client has no auth property before return');
    throw new Error('Critical error: Supabase client created without auth property');
  }

  console.log('[AUTH CLIENT] Final verification passed, returning client');
  return client;
};