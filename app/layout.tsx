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
import DynamicSidebar from '@/components/Layout/Sidebar/DynamicSidebar';

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
  } else {
    isSidebarVisible = false;
  }
  console.log(user, "user in layout.tsx")
  console.log("issidebarvisible??", isSidebarVisible);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen w-full bg-gradient-to-br from-purple-500/[0.1] via-background to-pink-500/[0.1] p-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextTopLoader />
          <ReactQueryProvider>
            <div className="flex min-h-screen">
         
               {/* Render the dynamic sidebar */}
              <DynamicSidebar/>
              <main
                id="skip"
                className={`flex-1 min-h-screen ${
                  isSidebarVisible ? 'ml-64' : ''
                }`}
              >
                <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur">
                  <Navbar visible={isSidebarVisible} />
                  {isSidebarVisible && <BreadcrumbsContainer />}
                </div>
                <div >
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
