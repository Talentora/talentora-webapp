'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';

const Profile = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { user, company } = useUser();
  const router = useRouter();

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (getRedirectMethod() === 'client') {
      await handleRequest(e, SignOut, router);
    }
  };

  return (
    <div className="relative" ref={userMenuRef}>
      <Button
        variant="ghost"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="w-full justify-start gap-3 text-white hover:bg-primary-dark/10"
      >
        <User className="h-5 w-5 text-primary" />
        <span className="font-medium truncate text-primary">{user?.user_metadata.full_name || user?.email}</span>
      </Button>

      {isUserMenuOpen && (
        <div className="absolute top-full right-0 mb-2 rounded-lg bg-foreground p-5 shadow-xl w-[18rem]">
          <div className="space-y-[0.75em]">
            <div>
              <h4 className="font-medium text-gray-900 text-[1em]">
                {user?.user_metadata.full_name || user?.email}
              </h4>
              <div className="flex items-center gap-[0.5em] mt-[0.25em]">
                <Link href="/settings?tab=account" className="inline-flex items-center rounded-full bg-purple-100 px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-purple-800 capitalize hover:bg-purple-200">
                  {user?.user_metadata?.role || 'User'}
                </Link>
                {company?.name && (
                  <Link href="/settings?tab=company" className="inline-flex items-center rounded-full bg-blue-100 px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-blue-800 hover:bg-blue-200">
                    {company.name}
                  </Link>
                )}
              </div>
            </div>
            
            <div className="h-[1px] bg-gray-200" />
            
            <form onSubmit={handleSignOut}>
              <input type="hidden" name="pathName" value={pathname} />
              <Button 
                type="submit" 
                variant="ghost" 
                size="sm"
                className="w-full justify-start text-[0.875em] text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="mr-[0.5em] h-[1em] w-[1em]" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;