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
      <body className="w-full bg-gradient-to-br from-purple-500/[0.1] via-background to-pink-500/[0.1] p-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextTopLoader />
          <ReactQueryProvider>
            <div className="flex">
              {isSidebarVisible && (
                <aside className="fixed h-full z-[100] w-1/6">
                  <Sidebar />
                </aside>
              )}
              <main
                id="skip"
                className={`flex-1 min-h-[calc(100dvh-15rem)] md:min-h-[calc(100dvh-16rem)] ${
                  isSidebarVisible ? 'ml-[16.666667%]' : ''
                } ${
                  isSidebarVisible ? 'w-[83.333333%]' : 'w-full'
                }`}
              >
                <Navbar visible={isSidebarVisible} />
                {isSidebarVisible && <BreadcrumbsContainer />}
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
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
