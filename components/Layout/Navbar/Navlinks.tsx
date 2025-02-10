'use client';

import { useUser } from '@/hooks/useUser';
import { BrandLogo } from './BrandLogo';
import { NavigationItems } from './NavigationItems';
import { UserActions } from './UserActions';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@supabase/supabase-js';

export default function Navlinks({ visible }: { visible: boolean }) {
  const { user, company } = useUser();
  const userData = user.data;
  const companyData = company.data;
  
  console.log("this is userdata", userData);

  const isRecruiter = userData?.user_metadata?.role === "applicant" ? false : true;

  const role = isRecruiter? "recruiter" : "applicant";
  // visible ? 'recruiter' : 'applicant';

  if (user.loading) {
    return (
      <div className="sticky top-0 z-40 w-full bg-transparent">
        <div className="container px-4 mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              {!visible && <BrandLogo />}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
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
            <NavigationItems isUser={!!userData} isRecruiter={isRecruiter} />
          </div>
          <div className="flex items-center space-x-4">
            <UserActions user={userData} role={role} company={companyData} />
          </div>
        </div>
      </div>
    </div>
  );
}