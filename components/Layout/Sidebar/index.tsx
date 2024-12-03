'use client';
import Link from 'next/link';
import {
  BriefcaseIcon,
  Users,
  User,
  Bot,
  ClipboardListIcon,
  SettingsIcon,
  FastForwardIcon,
  Sparkles,
  HomeIcon,
  LogOut
} from 'lucide-react';
import Logo from '@/components/ui/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';

const Page = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const currentPage = usePathname();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const unprotectedRoutes = [
    /^\/$/, // Matches '/'
    /^\/signin(\/.*)?$/, // Matches '/signin' and any subpath like '/signin/*'
    /^\/about$/, // Matches '/about'
    /^\/pricing$/, // Matches '/pricing'
    /^\/api\/auth\/callback$/ // Matches '/api/auth/callback'
  ];

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (getRedirectMethod() === 'client') {
      await handleRequest(e, SignOut, router);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isUnprotectedRoute = unprotectedRoutes.some((route) =>
    route.test(currentPage)
  );

  if (isUnprotectedRoute) {
    return <div className="hidden bg-transparent w-0"></div>;
  } else {
    return (
      <div className="h-screen">
        {/* Sidebar */}
        <div className="bg-gradient-to-b from-primary-dark to-primary-dark p-4 w-50 h-full">
          <nav className="space-y-2 flex flex-col justify-between h-[calc(100vh-8rem)]">
           
           
            <div className="flex flex-col">
            <Link href="/" className="flex flex-row items-center gap-2" aria-label="Logo">
              <Logo className="h-10 w-10" />
              <h1 className="text-foreground text-2xl font-bold">
                Talent
                <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent [text-shadow:_0_0_1px_rgba(255,255,255,0.1)]">
                  ora
                </span>
              </h1>
            </Link>
            </div>

            
            <div>
            <Link
              className="flex items-center space-x-2 text-gray-100 hover:bg-accent hover:text-gray-900 px-4 py-2 rounded"
              href="/dashboard"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              className="flex items-center space-x-2 text-gray-100 hover:bg-accent hover:text-gray-900 px-4 py-2 rounded"
              href="/jobs"
            >
              <BriefcaseIcon className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            <Link
              className="flex items-center space-x-2 text-gray-100 hover:bg-accent  hover:text-gray-900 px-4 py-2 rounded"
              href="/bot"
            >
              <Sparkles className="h-5 w-5" />
              <span>Ora Scouts</span>
            </Link>
            <Link
              className="flex items-center space-x-2 text-gray-100 hover:bg-accent  hover:text-gray-900 px-4 py-2 rounded"
              href="/applicants"
            >
              <Users className="h-5 w-5" />
              <span>Applicants</span>
            </Link>
            <Link
              className="flex items-center space-x-2 text-gray-100 hover:bg-accent  hover:text-gray-900 px-4 py-2 rounded"
              href="/settings"
            >
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            </div>


            <div className="items-center justify-center relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User menu"
                className="relative z-0 text-white hover:bg-accent hover:text-gray-900 px-4 rounded w-full flex items-center justify-start"
              >
                <User className="h-5 w-5 mr-2" />
                <span>Profile</span>
              </Button>
              {isUserMenuOpen && (
                <div className="absolute bottom-full left-0 w-48 bg-background border border-border rounded-md shadow-lg p-2 z-10">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-bold truncate">{user?.user_metadata.full_name || user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.user_metadata?.role}</p>
                  </div>
                  <div className="border-t border-border my-2"></div>
                  <form onSubmit={handleSignOut}>
                    <input type="hidden" name="pathName" value={pathname} />
                    <Button type="submit" variant="ghost" className="w-full justify-start text-sm text-primary">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    );
  }
};

export default Page;
