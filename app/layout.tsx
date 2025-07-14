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
import { Metadata } from 'next';

// Force dynamic rendering to prevent static generation errors with cookies
export const dynamic = 'force-dynamic';

const title = 'Talentora';
const description =
  'Talentora is a platform for creating and managing AI-powered interviews.';

export const metadata: Metadata = {
  metadataBase: new URL('https://talentora.net'),
  title: {
    default: title,
    template: `%s | ${title}`
  },
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: title,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  // Get user session details using the server action to avoid fetching on client side
  const { user, role, isSidebarVisible, company } =
    await getUserSessionDetails();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen w-full bg-gradient-to-br from-purple-500/[0.1] via-background to-pink-500/[0.1] p-0" suppressHydrationWarning>
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
              {isSidebarVisible && <DynamicSidebar />}
              <main id="skip" className={`flex-1 min-h-screen`}>
                <div className="sticky top-0 z-40 w-full bg-background/95">
                  <Navbar
                    visible={isSidebarVisible}
                    user={user}
                    role={role}
                    company={company}
                  />
                  {/* {isSidebarVisible && <BreadcrumbsContainer />} */}
                </div>
                <div className="mt-2">
                  <Suspense fallback={<Loading />}>{children}</Suspense>
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
