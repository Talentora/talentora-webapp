import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const CompletionStep: React.FC = () => {
  return (
    <div className="space-y-4 text-center p-4">
      <h3 className="text-lg font-medium">You're All Set!</h3>
      <p>Congratulations! Your account is now ready to use.</p>
      <Link href="/dashboard" passHref>
        <Button>Get Started</Button>
      </Link>
    </div>
  );
};