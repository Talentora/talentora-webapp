'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Profile from '@/components/Layout/Profile';
import { ThemeToggle } from '@/components/Layout/Sidebar/ThemeToggle';
import { type Database } from '@/types/types_db';
type Company = Database['public']['Tables']['companies']['Row'];

interface UserActionsProps {
  user: any;
  role: string;
  company: Company | null;
}

export function UserActions({ user, role, company }: UserActionsProps) {
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/signin">
          <Button variant="ghost" className="rounded-full px-8">Login</Button>
        </Link>
        <Link href="/contact#demo">
          <Button className="rounded-full px-8">Request Demo</Button>
        </Link>
        <ThemeToggle />
      </div>
    );
  }

  return <Profile user={user} role={role} company={company} />;
  
} 