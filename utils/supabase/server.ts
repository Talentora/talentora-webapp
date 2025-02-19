import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/types_db';

let serverClient: ReturnType<typeof createServerClient<Database>> | null = null;

export const createClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('createClient should only be called on the server');
  }

  // Reset client on each request to prevent memory leaks
  serverClient = null;

  const cookieStore = cookies();

  const cookieDefaults: Partial<CookieOptions> = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    path: '/'
  };

  serverClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({
              name,
              ...cookieDefaults,
              ...options,
            });
          } catch (error) {
            console.error(`Error removing cookie ${name}:`, error);
          }
        }
      },
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
      }
    }
  );

  return serverClient;
};
