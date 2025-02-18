import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/types_db';

// Custom error for environment variables
class EnvironmentError extends Error {
  constructor(variable: string) {
    super(`Missing environment variable: ${variable}`);
    this.name = 'EnvironmentError';
  }
}

// Create a singleton instance for the server client
let serverClient: ReturnType<typeof createServerClient<Database>> | null = null;

export const createClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('This method should only be called on the server');
  }

  if (!serverClient) {
    const cookieStore = cookies();
    
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) throw new EnvironmentError('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) throw new EnvironmentError('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    serverClient = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error('Error setting cookie:', error);
              throw new Error(`Failed to set cookie: ${name}`);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.delete({ name, ...options });
            } catch (error) {
              console.error('Error removing cookie:', error);
              throw new Error(`Failed to remove cookie: ${name}`);
            }
          }
        }
      }
    );
  }

  return serverClient;
};
