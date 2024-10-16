'use client';

import { createClient } from '@/utils/supabase/client';
import { type Provider } from '@supabase/supabase-js';
import { getURL } from '@/utils/helpers';
import { redirectToPath } from './server';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function handleRequest(
  e: React.FormEvent<HTMLFormElement>,
  requestFunc: (formData: FormData, role: string) => Promise<string>,
  router: AppRouterInstance | null = null,
  role: string
): Promise<boolean | void> {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  formData.append('role', role); // Add role to formData

  const redirectUrl: string = await requestFunc(formData, role);

  if (router) {
    return router.push(redirectUrl);
  } else {
    return await redirectToPath(`${redirectUrl}${redirectUrl.includes('?') ? '&' : '?'}role=${role}`);
  }
}

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
  // Prevent default form submission refresh
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const provider = String(formData.get('provider')).trim() as Provider;

  // Create client-side supabase client and call signInWithOAuth
  const supabase = createClient();
  const redirectURL = getURL('/auth/callback');
  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: redirectURL
    }
  });
}
