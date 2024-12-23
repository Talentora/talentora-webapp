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
const description = 'Talentora is a platform for creating and managing AI-powered interviews.';

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
  const isSidebarVisible = role === 'recruiter';

  return (
    <html lang="en">
      <body className="w-full bg-gradient-to-br from-purple-500/[0.1] via-white to-pink-500/[0.1] p-0">
        <NextTopLoader />

        <div className="flex">
          {isSidebarVisible && (
            <aside className=" fixed h-full">
              <Sidebar />
            </aside>
          )}
          <main
            id="skip"
            className={`flex-1 min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]${
              isSidebarVisible ? ' ml-64' : ' w-full' 
            }`}
          >
            {!isSidebarVisible && <Navbar />}
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
