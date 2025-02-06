'use client';

import { useUser } from '@/hooks/useUser';
import { BrandLogo } from './BrandLogo';
import { NavigationItems } from './NavigationItems';
import { UserActions } from './UserActions';
import { Skeleton } from '@/components/ui/skeleton';

export default function Navlinks({ visible }: { visible: boolean }) {
  const { user, recruiter, loading } = useUser();

  const role = visible ? 'recruiter' : 'applicant';

  if (loading) {
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
            <NavigationItems isUser={!!user} isRecruiter={!!recruiter} />
          </div>
          <div className="flex items-center space-x-4">
            <UserActions user={user} role={role} />
          </div>
        </div>
      </div>
    </div>
  );
}