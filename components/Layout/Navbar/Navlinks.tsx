'use client';

import { useUser } from '@/hooks/useUser';
import { BrandLogo } from './BrandLogo';
import { NavigationItems } from './NavigationItems';
import { UserActions } from './UserActions';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { type Database } from '@/types/types_db';

type Company = Database['public']['Tables']['companies']['Row'];

interface NavbarProps {
  visible: boolean;
  user?: User | null;
  role?: string | null;
  company?: Company | null;
}

export default function Navlinks({
  visible,
  user,
  role,
  company
}: NavbarProps) {
  const { user: client_user, company: client_company } = useUser({
    initialUser: user,
    initialCompany: company
  });

  // If fail to fetch user data, use server-side fetched user and company
  const userData = client_user.data || user;
  const companyData = client_company.data || company || null;
  const pathname = usePathname();

  // Check if current page is a signup/[id] page
  const isSignupIdPage =
    pathname?.startsWith('/signup/') && pathname !== '/signup';

  const isRecruiter =
    userData?.user_metadata?.role === 'applicant' ? false : true;

  const client_role = isRecruiter ? 'recruiter' : 'applicant';
  // visible ? 'recruiter' : 'applicant';

  // only display loading navbar if both client and server user data are loading
  if (client_user.loading && !user) {
    return (
      <div className="sticky top-0 z-40 w-full bg-transparent">
        <div className="container px-4 mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              {!visible && <BrandLogo />}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-24 bg-gray-300" />
                <Skeleton className="h-8 w-24 bg-gray-300" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-transparent">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {!visible && <BrandLogo />}
            {!isSignupIdPage && (
              <NavigationItems isUser={!!userData} isRecruiter={isRecruiter} />
            )}
          </div>
          <div className="flex items-center space-x-4">
            {!isSignupIdPage && (
              <UserActions
                user={userData}
                role={client_role}
                company={companyData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
