import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, Loader2 } from 'lucide-react';
import ApplicantTable from '../../Applicants/ApplicantTable';
import { ApplicantCandidate } from '@/types/merge';
import { useState, useEffect } from 'react';

export default function RecentApplicantsCard() {
  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const applicationsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/applications`
      );

      if (applicationsResponse.ok) {
        const applicantsData = await applicationsResponse.json();
        setApplicants(applicantsData);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Card className="p-5 border border-gray-400 rounded-lg shadow-sm bg-foreground col-span-2">
      <CardHeader className="pb-2 flex flex-row justify-between">
        <CardTitle>Recent Applicants</CardTitle>
        <Link href="/applicants">
          <Button
            className="bg-[#5650F0] text-white hover:bg-[#4a45d1] flex items-center "
            variant="outline"
          >
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ApplicantTable applicants={applicants} />
        )}
      </CardContent>
    </Card>
  );
}
