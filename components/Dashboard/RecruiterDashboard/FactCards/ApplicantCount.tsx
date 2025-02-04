import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { UsersIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ApplicantCandidate } from '@/types/merge';
import { Skeleton } from '@/components/ui/skeleton';

const ApplicantCountCard = ({ factWindow,isLoading ,applicants}: { factWindow: number, isLoading: boolean, applicants: ApplicantCandidate[] }) => {
  // const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const applicationsResponse = await fetch(`/api/applications`);

  //     if (applicationsResponse.ok) {
  //       const applicantsData = await applicationsResponse.json();
  //       setApplicants(applicantsData);
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchData();
  // }, [factWindow]);

  if (isLoading) {
    return (
      <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-[#5650F0]/50 bg-card">
        <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applicants This Month
          </CardTitle>
          <Link href="/applicants">
            <UsersIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </Link>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-24 mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (!applicants || applicants.length === 0) {
    return (
      <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-primary-dark/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applicants This Month
          </CardTitle>
          <Link href="/applicants">
            <UsersIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            No applicants yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentMonth = new Date().getMonth();
  const factWindowDaysAgo = new Date();
  factWindowDaysAgo.setDate(factWindowDaysAgo.getDate() - factWindow);

  const lastFactWindowDaysApplicants = applicants.filter((applicant) => {
    const appliedDate = new Date(applicant.application.applied_at);
    return appliedDate >= factWindowDaysAgo;
  }).length;

  const percentageChange = 0; // Since we're only looking at the last fact window days, there's no previous period to compare to.

  return (
    <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-primary-dark/50 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Applicants This Month
        </CardTitle>
        <Link href="/applicants">
          <UsersIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{lastFactWindowDaysApplicants}</div>
        <p className="text-xs text-muted-foreground">
          {percentageChange >= 0 ? '+' : ''}
          {percentageChange.toFixed(2)}% from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default ApplicantCountCard;
