'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { Label } from '../ui/label';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const pathname = usePathname();

  const links = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/account', label: 'Account', requiresAuth: true },
  ];

  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6 sticky top-0 bg-background z-40 transition-all duration-150 h-16 md:h-20">
      <div className="flex items-center flex-1">
        <Link
          href="/"
          className="cursor-pointer rounded-full transform duration-100 ease-in-out"
          aria-label="Logo"
        >
          <Logo />
        </Link>
        <nav className="ml-6 space-x-2 lg:block">
          {links.map((link) =>
            (!link.requiresAuth || user) && (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-primary rounded-md p-1 hover:text-primary-light focus:outline-none focus:text-primary-light focus:ring-2 focus:ring-accent focus:ring-opacity-50"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-primary rounded-md p-1 hover:text-primary-light focus:outline-none focus:text-primary-light focus:ring-2 focus:ring-accent focus:ring-opacity-50">
              <User className="h-6 w-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
            >
              <DropdownMenuItem>
                <Label className="text-lg font-semibold text-primary">
                  Hello,{' '}
                  {user.full_name ? (
                    <strong>{user.full_name}</strong>
                  ) : (
                    <strong>{user.email}</strong>
                  )}
                </Label>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRequest(e, SignOut, router);
                  }}
                >
                  <input type="hidden" name="pathName" value={pathname} />
                  <button
                    type="submit"
                    className="w-full text-left inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-primary rounded-md p-1 hover:text-primary-light focus:outline-none focus:text-primary-light focus:ring-2 focus:ring-accent focus:ring-opacity-50"
                  >
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/signin"
            className="inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-primary rounded-md p-1 hover:text-primary-light focus:outline-none focus:text-primary-light focus:ring-2 focus:ring-accent focus:ring-opacity-50"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
