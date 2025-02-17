'use client';

import { createClient } from '@/utils/supabase/client';
import { type Provider } from '@supabase/supabase-js';
import { getURL } from '@/utils/helpers';
import { redirectToPath } from './server';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function handleRequest(
  e: React.FormEvent<HTMLFormElement>,
  requestFunc: (formData: FormData) => Promise<string>,
  router: AppRouterInstance | null = null
): Promise<boolean | void> {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const role = formData.get('role') || 'applicant'; // Default to applicant

  try {
    const redirectUrl: string = await requestFunc(formData);
    
    // Add role to redirect URL
    const finalRedirectUrl = `${redirectUrl}${
      redirectUrl.includes('?') ? '&' : '?'
    }role=${role}`;

    if (router) {
      return router.push(finalRedirectUrl);
    } else {
      return await redirectToPath(finalRedirectUrl);
    }
  } catch (error) {
    console.error('Auth error:', error);
    return false;
  }
}

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const provider = String(formData.get('provider')).trim() as Provider;
  const role = formData.get('role') || 'applicant';
  
  const supabase = createClient();
  const redirectTo = 'https://talentora.io/auth/callback';

  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo,
      queryParams: {
        redirect_to: 'https://talentora.io/dashboard',
        role: role as string
      }
    }
  });
}

// Add a new function to check authentication state
export async function checkAuthState() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth state check error:', error);
    return null;
  }
  
  return session;
}
