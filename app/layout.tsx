import Navbar from '@/components/Layout/Navbar';
import BreadcrumbsContainer from '@/components/Layout/BreadcrumbsContainer';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import '@/styles/main.css';
import Loading from '@/components/Layout/Loading';
import NextTopLoader from 'nextjs-toploader';
import { createClient } from '@/utils/supabase/server';
import ReactQueryProvider from '@/components/Providers/ReactQueryProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import DynamicSidebar from '@/components/Layout/Sidebar/DynamicSidebar';
import AuthListener from '@/components/AuthListener';

const title = 'Talentora';
const description = 'Talentora is a platform for creating and managing AI-powered interviews.';

export default async function RootLayout({ children }: PropsWithChildren) {
  let role = null;
  let isSidebarVisible = false;

  try {
    // Create the Supabase client
    const supabase = await createClient();
    
    // Get the session
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      role = user.user_metadata.role;
      isSidebarVisible = role === 'recruiter';
    }

   
  } catch (error) {
    console.error("Error in layout:", error);
  }

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
                  {isSidebarVisible && <BreadcrumbsContainer />}
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
