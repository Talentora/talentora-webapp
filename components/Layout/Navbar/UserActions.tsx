'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Profile from '@/components/Layout/Profile';
import { ThemeToggle } from '@/components/Layout/Sidebar/ThemeToggle';


interface UserActionsProps {
  user: any;
  role: string;
}

export function UserActions({ user, role }: UserActionsProps) {
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/signin">
          <Button variant="ghost" className="rounded-full px-8">Login</Button>
        </Link>
        <Link href="/signup">
          <Button className="rounded-full px-8">Sign Up</Button>
        </Link>
        <ThemeToggle />
      </div>
    );
  }

  return <Profile role={role} />;
  
} 