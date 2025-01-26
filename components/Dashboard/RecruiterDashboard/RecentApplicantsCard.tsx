import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import ApplicantTable from '../../Applicants/ApplicantTable';
import { ApplicantCandidate } from '@/types/merge';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

export default function RecentApplicantsCard({ applicants, isLoading }: { applicants: ApplicantCandidate[], isLoading: boolean }) {
  // const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const applicationsResponse = await fetch(
  //       `/api/applications`
  //     );

  //     if (applicationsResponse.ok) {
  //       const applicantsData = await applicationsResponse.json();
  //       setApplicants(applicantsData);
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchData();
  // }, []);

  return (
    <Card className="p-5 bg-white rounded-2xl bg-card">
      <CardHeader className="mt-2 pb-2 flex flex-row justify-between">
        <CardTitle>Recent Applicants</CardTitle>
        <Link href="/applicants">
        <Button
          className="flex items-center bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700"
          variant="outline"
        >
          View All
        </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-2 w-24" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-2 w-24" />
          </div>
        ) : (
          <ApplicantTable applicants={applicants} />
        )}
      </CardContent>
    </Card>
  );
}
