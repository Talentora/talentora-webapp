import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Confetti from 'react-confetti';
import Image from 'next/image';
export const CompletionStep: React.FC<{ jobId: string }> = ({ jobId }) => {
  return (
    <div className="flex justify-between relative">
      <Confetti />
      <div className="text-center p-4">
        <h3 className="text-lg font-medium">You're All Set!</h3>
        <p>
          <i>Congratulations! You may now begin interviewing candidates!</i>
        </p>
        <Link href={`/jobs/${jobId}`} passHref>
          <Button className="mt-4">Get Started</Button>
        </Link>
      </div>
      <div className="w-1/2 border border-gray-300">
        <Image src="" alt="Empty Image" />
      </div>
    </div>
  );
};
