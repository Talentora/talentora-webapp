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
import ReactQueryProvider from '@/components/Providers/ReactQueryProvider';

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
    <html lang="en" className="light dark:bg-gradient-dark light:bg-gradient-light">
      <body className="w-full p-0 text-foreground">
        <NextTopLoader />
        <ReactQueryProvider>
          <div className="flex relative">
            {/* Sidebar is moved down so it is not covered by the navbar */}
            {isSidebarVisible && (
              <aside className="fixed left-0 top-[4rem] h-full z-20">
                <Sidebar />
              </aside>
            )}

            <div className="flex-1">
              {/* Navbar stays above the sidebar, not being covered */}
              <Navbar visible={isSidebarVisible} />
              <main
                id="skip"
                className={`min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] ${
                  isSidebarVisible ? 'ml-80 mr-20' : 'w-full'
                }`}
              >
                <Suspense fallback={<Loading />} >{children}</Suspense>
              </main>
            </div>
          </div>
          <Suspense>
            <Toaster />
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
