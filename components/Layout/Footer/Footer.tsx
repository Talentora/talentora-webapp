import Link from 'next/link';
import Image from 'next/image';

import Logo from '@/components/ui/icons/Logo';
import GitHub from '@/components/ui/icons/GitHub';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-background">
      <div className="grid grid-cols-1 gap-8 py-12 text-foreground transition-colors duration-150 border-b lg:grid-cols-12 border-border">
        <div className="col-span-1 lg:col-span-2">
          <Link
            href="/"
            className="flex items-center flex-initial font-bold md:mr-24"
          >
            <span className="mr-2 border rounded-full border-zinc-700">
              <Logo />
            </span>
            <span>ACME</span>
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-foreground transition duration-150 ease-in-out hover:text-muted-foreground"
              >
                Home
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-foreground transition duration-150 ease-in-out hover:text-muted-foreground"
              >
                About
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-foreground transition duration-150 ease-in-out hover:text-muted-foreground"
              >
                Careers
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-foreground transition duration-150 ease-in-out hover:text-muted-foreground"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="font-bold text-foreground transition duration-150 ease-in-out hover:text-muted-foreground">
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-foreground transition duration-150 ease-in-out hover:text-muted-foreground"
              >
                Privacy Policy
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-foreground transition duration-150 ease-in-out hover:text-muted-foreground"
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-start col-span-1 text-foreground lg:col-span-6 lg:justify-end">
          <div className="flex items-center h-10 space-x-6">
            <a
              aria-label="Github Repository"
              href="https://github.com/vercel/nextjs-subscription-payments"
            >
              <GitHub />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between py-12 space-y-4 md:flex-row bg-background border-t border-border">
        <div className="text-foreground">
          <span>&copy; {new Date().getFullYear()} ACME, Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center text-foreground">
          <span>Crafted by</span>
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <Image
              src="/vercel.svg"
              alt="Vercel.com Logo"
              width={72}
              height={16}
              className="inline-block ml-4"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
