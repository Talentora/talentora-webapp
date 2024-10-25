import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const CompletionStep: React.FC = () => {
  return (
    
    <div className="flex justify-between">
    <div className="text-center p-4">
      <h3 className="text-lg font-medium">You're All Set!</h3>
      <p><i>Congratulations! Your account is now ready to use.</i></p>
      <Link href="/dashboard" passHref>
        <Button className="mt-4">Get Started</Button>
      </Link>
    </div>      
    <div className="w-1/2 border border-gray-300">
      <img src="" alt="Empty Image" />
    </div>
  </div>
  );
};