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
    <Card className="p-5 rounded-2xl bg-background shadow-md shadow-[#5650F0]/20 dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]">
      <CardHeader className="ml-5 pt-6 pb-2 flex flex-row justify-between">
        <CardTitle>Recent Applicants</CardTitle>
        <Link href="/applicants">
          <Button
            className="bg-[#5650F0] -mt-4 text-background flex items-center "
            variant="secondary"
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
          <ApplicantTable applicants={applicants} title={''} />
        )}
      </CardContent>
    </Card>
  );
}
