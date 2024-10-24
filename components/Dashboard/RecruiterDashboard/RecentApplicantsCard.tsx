import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import ApplicantTable from '../../Applicants/ApplicantTable';
import { ApplicantCandidate } from '@/types/greenhouse';

export default function RecentApplicantsCard({ applicants }: { applicants: ApplicantCandidate[] }) {
  return (
    <Card className="p-5 border border-gray-400 rounded-lg shadow-sm bg-primary-background col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>Recent Applicants</CardTitle>
        <Link href="/applicants">
          <Button className="bg-[#5650F0] text-white hover:bg-[#4a45d1] flex items-center absolute top-4 right-4" variant="outline">
            <Navigation className="mr-2 h-4 w-4" />
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-4">
        <ApplicantTable applicants={applicants} />
      </CardContent>
    </Card>
  );
}