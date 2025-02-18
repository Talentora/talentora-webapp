import { Metadata } from 'next';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import BreadcrumbsContainer from '@/components/Layout/BreadcrumbsContainer';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import Loading from '@/components/Layout/Loading';
import NextTopLoader from 'nextjs-toploader';
import { createClient } from '@/utils/supabase/server';
import ReactQueryProvider from '@/components/Providers/ReactQueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getUserRole } from '@/utils/supabase/queries';

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

  let isSidebarVisible = false;
  if (user) {
    const role = await getUserRole(supabase, user.id);
    isSidebarVisible = role === 'recruiter';
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen w-full bg-gradient-to-br from-purple-500/[0.15] via-background to-pink-500/[0.15]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextTopLoader />
          <ReactQueryProvider>
            <div className="flex min-h-screen relative">
              {isSidebarVisible && (
                <aside className="fixed lg:relative h-screen z-[100] w-64 lg:w-1/5 transition-all duration-300 ease-in-out">
                  <Sidebar />
                </aside>
              )}
              <main
                id="skip"
                className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out
                  ${isSidebarVisible ? 'lg:ml-0 ml-64' : ''} 
                  ${isSidebarVisible ? 'w-[calc(100%-16rem)] lg:w-4/5' : 'w-full'}
                `}
              >
                <Navbar visible={isSidebarVisible} />
                {isSidebarVisible && <BreadcrumbsContainer />}
                <div className="flex-grow p-4 sm:p-6 md:p-8">
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                </div>
              </main>
            </div>
            <Suspense>
              <Toaster />
            </Suspense>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
