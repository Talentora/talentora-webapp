import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { UsersIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ApplicantCandidate } from '@/types/merge';
import { Skeleton } from '@/components/ui/skeleton';
import { getApplicationCount } from '@/utils/supabase/queries';

const ApplicantCountCard = ({
  factWindow,
}: {
  factWindow: number;
}) => {
  const [applicationCount, setApplicationCount] = useState<number>(0);

  useEffect(() => {
    const fetchApplicationCount = async () => {
      const count = await getApplicationCount();
      setApplicationCount(count);
    };
    fetchApplicationCount();
  }, []);

  // if (!applicationCount) {
  //   return (
  //     <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-primary-dark/50 bg-card">
  //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //         <CardTitle className="text-sm font-medium">
  //           Total Applicants This Month
  //         </CardTitle>
  //         <Link href="/applicants">
  //           <UsersIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
  //         </Link>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="text-2xl font-bold">0</div>
  //         {/* <p className="text-xs text-muted-foreground">No applicants yet</p> */}
  //       </CardContent>
  //     </Card>
  //   );
  // }

  const factWindowDaysAgo = new Date();
  factWindowDaysAgo.setDate(factWindowDaysAgo.getDate() - factWindow);

  // Calculate applicants in current period (last factWindow days)
  const currentPeriodApplicants = applicationCount;
  // Array.isArray(applicants)
  //   ? applicants.filter((applicant) => {
  //       const appliedDate = new Date(applicant.application?.created_at);
  //       console.log(appliedDate, factWindowDaysAgo);
  //       return appliedDate >= factWindowDaysAgo;
  //     }).length
  //   : 0;

  const previousPeriodStart = new Date();
  previousPeriodStart.setDate(previousPeriodStart.getDate() - (factWindow * 2));
  
  // const previousPeriodApplicants = Array.isArray(applicants)
  //   ? applicants.filter((applicant) => {
  //       const appliedDate = new Date(applicant.application?.created_at);
  //       return appliedDate >= previousPeriodStart && appliedDate < factWindowDaysAgo;
  //     }).length
  //   : 0;

  // Calculate percentage change
  // const percentageChange = previousPeriodApplicants === 0
  //   ? (currentPeriodApplicants > 0 ? 100 : 0)
  //   : ((currentPeriodApplicants - previousPeriodApplicants) / previousPeriodApplicants) * 100;

  return (
    <Card className="max-h-[100px] group p-2 border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 transition duration-300 ease-in-out hover:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="ml-4 pt-2 text-sm font-medium">
          Total Applicants
        </CardTitle>
        <Link href="/applicants">
          <button className="group p-2 bg-input rounded-md transition duration-300 ease-in-out group-hover:bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <UsersIcon className="h-6 w-6 text-indigo-500 cursor-pointer group-hover:text-indigo-500" />
          </button>
        </Link>
      </CardHeader>
      <CardContent className="relative">
        <div className="ml-4 -mt-6 text-lg sm:text-xl md:text-2xl font-bold">
          {currentPeriodApplicants}
        </div>
        {/* <div className="absolute right-2 -mt-4 text-sm text-gray-500">
          {percentageChange >= 0 ? '↑ ' : '↓ '}
          {Math.abs(percentageChange).toFixed(2)}%
        </div> */}
      </CardContent>
    </Card>
  );
};

export default ApplicantCountCard;
