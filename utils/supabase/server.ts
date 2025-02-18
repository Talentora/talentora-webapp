import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/types_db';

// Create a singleton instance for the server client
let serverClient: ReturnType<typeof createServerClient<Database>> | null = null;

const cookieOptions: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7 // 1 week
};

export const createClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('createClient should only be called on the server');
  }

  if (!serverClient) {
    const cookieStore = cookies();

    serverClient = createServerClient<Database>(
      // Pass Supabase URL and anonymous key from the environment to the client
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      // Define a cookies object with methods for interacting with the cookie store and pass it to the client
      {
        cookies: {
          // The get method is used to retrieve a cookie by its name
          get(name: string) {
            const cookie = cookieStore.get(name);
            console.log(`[Server] Getting cookie ${name}:`, cookie?.value);
            return cookie?.value;
          },
          // The set method is used to set a cookie with a given name, value, and options
          set(name: string, value: string, options: CookieOptions) {
            try {
              console.log(`[Server] Setting cookie ${name}:`, value);
              cookieStore.set({ 
                name, 
                value, 
                ...cookieOptions,
                ...options 
              });
            } catch (error) {
              console.error('Error setting cookie:', error);
              throw new Error(`Failed to set cookie: ${name}`);
            }
          },
          // The remove method is used to delete a cookie by its name
          remove(name: string, options: CookieOptions) {
            try {
              console.log(`[Server] Removing cookie ${name}`);
              cookieStore.delete({ 
                name,
                ...cookieOptions,
                ...options 
              });
            } catch (error) {
              console.error('Error removing cookie:', error);
              throw new Error(`Failed to remove cookie: ${name}`);
            }
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
