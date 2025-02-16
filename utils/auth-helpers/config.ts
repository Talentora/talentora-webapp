export const getAuthConfig = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentora.io';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce' as const,
      redirectTo: `${siteUrl}/auth/callback`
    },
    site: {
      url: siteUrl,
      baseUrl: siteUrl
    }
  };
};
