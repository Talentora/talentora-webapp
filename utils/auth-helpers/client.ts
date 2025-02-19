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


  const redirectUrl: string = await requestFunc(
    formData
  );
  
  if (router) {
    router.push(redirectUrl);
    router.refresh();
    console.log("meowww")
    return true;
  } else {
    return await redirectToPath(
      `${redirectUrl}${redirectUrl.includes('?') ? '&' : '?'}role=${role}`
    );
  }
}

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const provider = String(formData.get('provider')).trim() as Provider;
  
  const supabase = createClient();

  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL; 
  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: redirectUrl,
    }
  });
}