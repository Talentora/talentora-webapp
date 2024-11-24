import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { UsersIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ApplicantCandidate } from '@/types/merge';
import { Skeleton } from '@/components/ui/skeleton';

const ApplicantCountCard = () => {
  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const applicationsResponse = await fetch(`/api/applications`);

      if (applicationsResponse.ok) {
        const applicantsData = await applicationsResponse.json();
        setApplicants(applicantsData);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="border p-5 border-gray-300 rounded-lg shadow-sm bg-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthApplicants = applicants.filter((applicant) => {
    const appliedDate = new Date(applicant.applied_at);
    return (
      appliedDate.getMonth() === currentMonth &&
      appliedDate.getFullYear() === currentYear
    );
  }).length;

  const lastMonthApplicants = applicants.filter((applicant) => {
    const appliedDate = new Date(applicant.applied_at);
    return (
      appliedDate.getMonth() === lastMonth &&
      appliedDate.getFullYear() === lastMonthYear
    );
  }).length;

  const percentageChange =
    lastMonthApplicants === 0
      ? currentMonthApplicants > 0
        ? 100
        : 0
      : ((currentMonthApplicants - lastMonthApplicants) / lastMonthApplicants) *
        100;

  return (
    <Card className="border p-5 border-gray-300 rounded-lg shadow-sm bg-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Applicants This Month
        </CardTitle>
        <Link href="/applicants">
          <UsersIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentMonthApplicants}</div>
        <p className="text-xs text-muted-foreground">
          {percentageChange >= 0 ? '+' : ''}
          {percentageChange.toFixed(2)}% from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default ApplicantCountCard;



