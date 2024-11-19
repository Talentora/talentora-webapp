'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useApplicant } from '@/hooks/useApplicant';
import { useSearchParams } from 'next/navigation';

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
      <Card className="max-w-2xl w-full">
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
          <Image
              src="/success-interview.svg"
              alt="Interview Success"
              width={200}
              height={200}
              priority
              className="w-full border border-primary-dark rounded-lg"
            />
        </CardContent>
        <CardFooter className="flex gap-4 justify-center">
          <Link 
            href="/dashboard" 
            className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/" 
            className="px-6 py-2 bg-background text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}