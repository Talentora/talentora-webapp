'use client';

import { useUser } from '@/hooks/useUser';
import { BrandLogo } from './BrandLogo';
import { NavigationItems } from './NavigationItems';
import { UserActions } from './UserActions';

export default function Navlinks({ visible }: { visible: boolean }) {
  const { user, recruiter } = useUser();

  return (
    <div className="sticky top-0 z-40 w-full bg-transparent">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {!visible && <BrandLogo />}
            <NavigationItems isUser={!!user} isRecruiter={!!recruiter} />
          </div>
          <div className="flex items-center space-x-4">
            <UserActions user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}