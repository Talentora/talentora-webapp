'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/types_db';

export const createClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('createClient should only be called on the server');
  }

  const cookieStore = cookies();

  const cookieDefaults: Partial<CookieOptions> = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    path: '/'
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...cookieDefaults,
              ...options,
            });
          } catch (error) {
            console.error(`Error setting cookie ${name}:`, error);
          }
        },
        // remove(name: string, options: CookieOptions) {
        //   try {
        //     cookieStore.delete({
        //       name,
        //       ...cookieDefaults,
        //       ...options,
        //     });
        //   } catch (error) {
        //     console.error(`Error removing cookie ${name}:`, error);
        //   }
        // }
      }
    }
  );
};

// Create auth client that uses anon key (compatible with middleware)
export const createAuthClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('createAuthClient should only be called on the server');
  }

  const cookieStore = cookies();

  const cookieDefaults: Partial<CookieOptions> = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    path: '/'
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use anon key for auth
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...cookieDefaults,
              ...options,
            });
          } catch (error) {
            console.error(`Error setting cookie ${name}:`, error);
          }
        },
        // remove(name: string, options: CookieOptions) {
        //   try {
        //     cookieStore.delete({
        //       name,
        //       ...cookieDefaults,
        //       ...options,
        //     });
        //   } catch (error) {
        //     console.error(`Error removing cookie ${name}:`, error);
        //   }
        // }
      }
    }
  );
};