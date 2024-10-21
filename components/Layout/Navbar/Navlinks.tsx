'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/ui/icons/Logo';
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
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/dashboard', label: 'Dashboard', requiresAuth: true }
  ];

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (getRedirectMethod() === 'client') {
      await handleRequest(e, SignOut, router,'');
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
    <div className="sticky top-0 z-40 w-full mx-0">
      <div className="container mx-0 px-1">
        <div className="flex items-center justify-between w-full py-4 md:py-6">
          <div className="flex items-center">
            <Link href="/" className="mr-6" aria-label="Logo">
              <Logo />
            </Link>
            <nav className="hidden md:flex space-x-4 text-white">
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
                  className="relative z-0"
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
                        {user.user_metadata.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.user_metadata?.role}
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
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                <Button className="border border-white text-white bg-transparent rounded-full px-8 py-2">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-primary-dark hover:bg-gray-200 rounded-full px-8 py-2" variant="ghost" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Removed the duplicate nav element here */}
    </div>
  );
}
