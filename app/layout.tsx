import Navbar from '@/components/Layout/Navbar';
import BreadcrumbsContainer from '@/components/Layout/BreadcrumbsContainer';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import '@/styles/main.css';
import Loading from '@/components/Layout/Loading';
import NextTopLoader from 'nextjs-toploader';
import ReactQueryProvider from '@/components/Providers/ReactQueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import DynamicSidebar from '@/components/Layout/Sidebar/DynamicSidebar';
import AuthListener from '@/components/AuthListener';
import { getUserSessionDetails } from '@/utils/auth-helpers/server';

const title = 'Talentora';
const description = 'Talentora is a platform for creating and managing AI-powered interviews.';

export default async function RootLayout({ children }: PropsWithChildren) {
  // Get user session details using the server action
  const { role, isSidebarVisible } = await getUserSessionDetails();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen w-full bg-gradient-to-br from-purple-500/[0.1] via-background to-pink-500/[0.1] p-0">
        {!isSidebarVisible && role !== 'applicant' && <AuthListener />}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextTopLoader />
          <ReactQueryProvider>
            <div className="flex min-h-screen">
              {isSidebarVisible && <DynamicSidebar/>}
              <main
                id="skip"
                className={`flex-1 min-h-screen`}
              >
                <div className="sticky top-0 z-40 w-full bg-background/95">
                  <Navbar visible={isSidebarVisible} />
                  {/* {isSidebarVisible && <BreadcrumbsContainer />} */}
                </div>
                <div className="mt-2">
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
