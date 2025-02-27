import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/types_db';

// Create a single supabase client for the entire application
export const createClient = () => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
