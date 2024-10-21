import { Metadata } from 'next';
import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import Loading from '@/components/Layout/Loading';
import NextTopLoader from 'nextjs-toploader';
import { createClient } from '@/utils/supabase/server';

const title = 'Talentora';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="w-full bg-background p-0">
        <NextTopLoader />
        <Navbar />
        <div className="flex">
          {user && (
            <aside className="w-64 bg-gray-100 p-0">
              <Sidebar />
            </aside>
          )}
          <main
            id="skip"
            className={`flex-1 min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] p-6 ${
              user ? '' : 'w-full'
            }`}
          >
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
