'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FinishedIcon from './FinishedIcon';
import { Button } from '@/components/ui/button';

export default function ConclusionPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={500}
      />
      <Card className="max-w-2xl w-full p-3 bg-background">
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            Thank You!
          </CardTitle>
          <CardDescription className="text-center">
            Your interview with Talentora has been completed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-600 flex flex-row justify-center items-center m-5">
          <ul className="list-disc text-left pl-6 space-y-4">
            <li>
              Thank you for your time. We will review your interview soon.
            </li>
            <li>
              Our AI will analyze your responses. This helps us evaluate your fit for the role.
            </li>
            <li>
              We'll respond in 2-3 business days. Check your dashboard for updates.
            </li>
          </ul>
          <div className="ml-8">
            <FinishedIcon />
            {/* <Image src="/finished-icon.svg" alt="Finished icon" width={200} height={200} /> */}
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 justify-between ">
          <Button asChild>
            <Link 
              href="/dashboard" 
            >
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link 
              href="/" 
            >
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}






