import { Metadata } from 'next';
import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
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
  openGraph: {
    title: title,
    description: description
  }
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
      <body className="bg-background p-10">
        <NextTopLoader />
        <Navbar />
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
        {/* <Footer /> */}
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
