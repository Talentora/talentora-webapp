import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/types_db';

// Create a singleton instance for the server client
let serverClient: ReturnType<typeof createServerClient<Database>> | null = null;

export const createClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('This method should only be called on the server');
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
            return cookieStore.get(name)?.value;
          },
          // The set method is used to set a cookie with a given name, value, and options
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Handle cookie errors
            }
          },
          // The remove method is used to delete a cookie by its name
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.delete({ name, ...options });
            } catch (error) {
              // Handle cookie errors
            }
          }
        }
      }
    );
  }

  return serverClient;
};
