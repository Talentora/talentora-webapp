'use client';

import { redirectToPath } from './server';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function handleRequest(
  e: React.FormEvent<HTMLFormElement> | FormData,
  requestFunc: (formData: FormData) => Promise<string>,
  router: AppRouterInstance | null = null
): Promise<boolean | void> {
  let formData: FormData;
  
  if (e instanceof FormData) {
    formData = e;
  } else {
    e.preventDefault();
    formData = new FormData(e.currentTarget);
  }
  
  const role = formData.get('role') || 'applicant'; // Default to applicant
  const redirectUrl: string = await requestFunc(formData);

  if (router) {
    console.log('Redirecting browser to:', redirectUrl);
    router.push(redirectUrl);
    router.refresh();

    return true;
  } else {
    return await redirectToPath(
      `${redirectUrl}${redirectUrl.includes('?') ? '&' : '?'}role=${role}`
    );
  }
}
