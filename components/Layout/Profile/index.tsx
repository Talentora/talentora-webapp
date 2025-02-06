'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { getUserRole } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';

const Profile = ({ role }: { role: string }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { user, company } = useUser();
  const router = useRouter();

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (getRedirectMethod() === 'client') {
      // Clear all React Query cache before signing out
      queryClient.clear();
      await handleRequest(e, SignOut, router);
    }
  };

  return (
    <div className="relative" ref={userMenuRef}>
      <Button
        variant="ghost"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="w-full justify-start gap-3 text-foreground hover:bg-accent/10"
      >
        <User className="h-5 w-5 text-foreground" />
        <span className="font-medium truncate text-foreground">{user?.user_metadata.full_name || user?.email}</span>
      </Button>

      {isUserMenuOpen && (
        <div className=" border absolute top-full right-0 mb-2 rounded-lg bg-background p-5 shadow-xl w-[18rem]">
          <div className="space-y-[0.75em]">
            <div>
              <h4 className="font-medium text-foreground text-[1em]">
                {user?.user_metadata.full_name || user?.email}
              </h4>
              <div className="flex items-center gap-[0.5em] mt-[0.25em]">
                <Link href="/settings?tab=account" className="inline-flex items-center rounded-full bg-primary px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-accent-foreground capitalize hover:bg-accent/80">
                  {role || 'Error'}
                </Link>
                {company?.name && (
                  <Link href="/settings?tab=company" className="inline-flex items-center rounded-full bg-secondary px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-accent-foreground capitalize hover:bg-accent/80">
                    {company.name}
                  </Link>
                )}
              </div>
            </div>
            
            <div className="h-[1px] bg-border" />
            
            <form onSubmit={handleSignOut}>
              <input type="hidden" name="pathName" value={pathname} />
              <Button 
                type="submit" 
                variant="ghost" 
                size="sm"
                className="w-full justify-start text-[0.875em] text-foreground hover:text-foreground hover:bg-accent"
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