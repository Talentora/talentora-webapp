import { Metadata } from 'next';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import '@/styles/main.css';
import Loading from '@/components/Layout/Loading';
import NextTopLoader from 'nextjs-toploader'; // Import NextTopLoader
import Head from 'next/head';

const title = 'Talentora';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  // openGraph: {
  //   title: title,
  //   description: description,
  // },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      {/* <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
        ></script>
      </Head> */}
      <body className="w-full bg-background p-0">
        <NextTopLoader />
        <Navbar/>
        {/* Use flexbox for sidebar and content alignment */}
        <div className="flex">
          {/* Sidebar aligned to the left */}
          <aside className="w-200 bg-gray-100 p-0">
           
          </aside>
          
          {/* Main content on the right in another column */}
          <main
            id="skip"
            className="flex-1 min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] p-6"
          >
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
        </div>
        {/* <Footer /> */}
        <Suspense>
          <Toaster />
        </Suspense>

    
        {/* Use flexbox for sidebar and content alignment */}
   
      </body>
    </html>
  );
}
