import { Metadata } from 'next';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import Loading from '@/components/Layout/Loading';
import NextTopLoader from 'nextjs-toploader';
import { createClient } from '@/utils/supabase/server';
import Script from 'next/script';

const title = 'Talentora';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role;
  const isSidebarVisible = role === 'recruiter'; // Determine if the sidebar should be visible

  return (
    <html lang="en">
    
      <body className="w-full bg-gradient-to-br from-purple-500/[0.2] via-white to-pink-500/[0.2] p-0">
        <NextTopLoader />

        <div className="flex">
          {isSidebarVisible && (
            <aside className="w-1/7 bg-gray-100">
              <Sidebar />
            </aside>
          )}
          <main
            id="skip"
            className={`flex-1 min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]${
              isSidebarVisible ? '' : ' w-full' // Apply full width if sidebar is hidden
            }`}
          >
            <Navbar />
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
        </div>
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
