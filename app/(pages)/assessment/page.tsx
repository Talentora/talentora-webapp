'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AssessmentPage() {
  const router = useRouter();

  const jobId = '603f7917-aa68-429c-8889-2945fc348b04';
  const applicantId = 'b061d90c-7bf9-4f08-8080-43aa20b34474';

  return (
    <div className="flex items-center flex-col justify-center min-h-screen">
      <h1>Assessment Page</h1>
      <Button
        onClick={() =>
          router.push(`/assessment/${jobId}/${applicantId}`)
        }
      >
        Go to Assessment for {jobId} and {applicantId}
      </Button>
    </div>
  );
}

