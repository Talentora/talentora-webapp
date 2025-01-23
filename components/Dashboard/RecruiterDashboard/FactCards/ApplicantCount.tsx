import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicantCandidate } from '@/types/merge';
import Link from 'next/link';

const ApplicantCountCard = ({
  factWindow,
  isLoading,
  applicants,
}: {
  factWindow: number;
  isLoading: boolean;
  applicants: ApplicantCandidate[];
}) => {
  if (isLoading) {
    return (
      <Link href="/applicants">
        <Card className="p-3 bg-transparent rounded-2xl shadow-xl shadow-[#5650F0]/50 bg-card hover:shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <UsersIcon className="h-12 w-12 text-black mr-2" />
            <CardTitle className="text-sm font-large">
              Total Applicants This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24 mt-2" />
          </CardContent>
        </Card>
      </Link>
    );
  }

  const factWindowDaysAgo = new Date();
  factWindowDaysAgo.setDate(factWindowDaysAgo.getDate() - factWindow);

  const lastFactWindowDaysApplicants = applicants.filter((applicant) => {
    const appliedDate = new Date(applicant.application.applied_at);
    return appliedDate >= factWindowDaysAgo;
  }).length;

  const percentageChange = 0; // Placeholder for percentage calculation.

  return (
    <Link href="/applicants">
<Card className="p-5 border border-input rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/40 border border-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/40 bg-opacity-20 backdrop-blur-lg hover:shadow-[0_10px_15px_-3px_rgba(90,79,207,0.4),0_4px_6px_-4px_rgba(90,79,207,0.3)] hover:scale-[1.01] transition-transform max-h-40 overflow-auto">
  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="mr-4 flex items-center justify-center border-[#5650F0] rounded-full h-12 w-12">
        <UsersIcon className="h-6 w-6 text-black dark:text-white" />
        </div>
          <CardTitle className=" -mt-4 text-md font-medium">
            Total Applicants This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="-mt-8 ml-2 text-2xl font-medium">{lastFactWindowDaysApplicants}</div>
          <p className="text-md ml-2 text-muted-foreground">
            {percentageChange >= 0 ? '+' : ''}
            {percentageChange.toFixed(2)}% from last month
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ApplicantCountCard;
