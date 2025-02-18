'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { type Database } from '@/types/types_db';
type Company = Database['public']['Tables']['companies']['Row'];
const Profile = ({
  user,
  role,
  company
}: {
  user: any;
  role: string;
  company: Company | null;
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const supabase = createClient();
  const companyData = company;

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    queryClient.clear();

    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Sign out response:', response);

      if (response.ok) {
        const redirectUrl = response.headers.get('location') || '/';
        router.push(redirectUrl);
        router.refresh();
      } else {
        console.error('Sign out failed');
      }
    } catch (error) {
      console.error('Sign out error:', error);
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
        <span className="font-medium truncate text-foreground">
          {user?.user_metadata.full_name || user?.email}
        </span>
      </Button>

      {isUserMenuOpen && (
        <div className=" border absolute top-full right-0 mb-2 rounded-lg bg-background p-5 shadow-xl w-[18rem]">
          <div className="space-y-[0.75em]">
            <div>
              <h4 className="font-medium text-foreground text-[1em]">
                {user?.user_metadata.full_name || user?.email || 'Error'}
              </h4>
              <div className="flex items-center gap-[0.5em] mt-[0.25em]">
                <Link
                  href="/settings?tab=account"
                  className="inline-flex items-center rounded-full bg-primary px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-accent-foreground capitalize hover:bg-accent/80"
                >
                  {role || 'Error'}
                </Link>
                {companyData?.name && (
                  <Link
                    href="/settings?tab=company"
                    className="inline-flex items-center rounded-full bg-secondary px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-accent-foreground capitalize hover:bg-accent/80"
                  >
                    {companyData.name || 'Error'}
                  </Link>
                )}
              </div>
            </div>

            <div className="h-[1px] bg-border" />

            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-[0.875em] text-foreground hover:text-foreground hover:bg-accent"
            >
              <LogOut className="mr-[0.5em] h-[1em] w-[1em]" />
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
