'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/dashboard', label: 'Dashboard', requiresAuth: true }
  ];

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (getRedirectMethod() === 'client') {
      await handleRequest(e, SignOut, router);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 w-full ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 md:py-6">
          <div className="flex items-center">
            <Link href="/" className="mr-6" aria-label="Logo">
              <Logo />
            </Link>
            <nav className="hidden md:flex space-x-4">
              {links.map(
                (link) =>
                  (!link.requiresAuth || user) && (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="User menu"
                  className="relative z-20"
                >
                  <User className="h-5 w-5" />
                </Button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg p-2 z-10">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold truncate">
                        {user.full_name || user.email}
                      </p>
                    </div>
                    <div className="border-t border-border my-2"></div>
                    <form onSubmit={handleSignOut}>
                      <input type="hidden" name="pathName" value={pathname} />
                      <Button
                        type="submit"
                        variant="ghost"
                        className="w-full justify-start text-sm"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <nav className="md:hidden border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between py-2">
            {links.map(
              (link) =>
                (!link.requiresAuth || user) && (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                )
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
