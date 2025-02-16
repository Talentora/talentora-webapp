import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { UsersIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ApplicantCandidate } from '@/types/merge';
import { Skeleton } from '@/components/ui/skeleton';

const ApplicantCountCard = ({ factWindow, isLoading, applicants }: { factWindow: number, isLoading: boolean, applicants: ApplicantCandidate[] }) => {
  if (isLoading) {
    return (
      <Card className="max-h-[100px] group p-2 border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 transition duration-300 ease-in-out hover:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]">
        <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
          <CardTitle className="ml-4 pt-2 text-sm font-medium">
            Total Applicants
          </CardTitle>
          <Link href="/applicants">
            <UsersIcon className="h-6 w-6 text-muted-foreground cursor-pointer" />
          </Link>
        </CardHeader>
        <CardContent>
          <Skeleton className="-mt-6 h-8 w-16" />
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
      <div className="ml-4 -mt-6 text-lg sm:text-xl md:text-2xl font-bold">{lastFactWindowDaysApplicants}</div>
      <div className="absolute right-2 -mt-4 text-sm text-gray-500">
          {percentageChange >= 0 ? '' : ''}
          {percentageChange.toFixed(2)}%
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicantCountCard;
