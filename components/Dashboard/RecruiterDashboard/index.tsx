'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareIcon, UserIcon, UsersIcon } from 'lucide-react';
import { Job, ApplicantCandidate } from '@/types/merge';
import { Loader2 } from 'lucide-react';

import ActiveJobsCard from './ActiveJobsCard';
import RecentApplicantsCard from './RecentApplicantsCard';
import SettingsCard from './SettingsCard';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs`);
      const jobsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs`
      );
      const applicationsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/applications`
      );

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData);
      }

      if (applicationsResponse.ok) {
        const applicantsData = await applicationsResponse.json();
        setApplicants(applicantsData);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex w-full">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Recruiting Dashboard</h1>

        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 ">
          {/* fact 1  */}
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
              {(() => {
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const lastMonthYear =
                  currentMonth === 0 ? currentYear - 1 : currentYear;

                const currentMonthApplicants = applicants.filter(
                  (applicant) => {
                    const appliedDate = new Date(applicant.applied_at);
                    return (
                      appliedDate.getMonth() === currentMonth &&
                      appliedDate.getFullYear() === currentYear
                    );
                  }
                ).length;

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
                    : ((currentMonthApplicants - lastMonthApplicants) /
                        lastMonthApplicants) *
                      100;

                return (
                  <>
                    <div className="text-2xl font-bold">
                      {currentMonthApplicants}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {percentageChange >= 0 ? '+' : ''}
                      {percentageChange.toFixed(2)}% from last month
                    </p>
                  </>
                );
              })()}
            </CardContent>
          </Card>

          {/* fact 2 */}
          <Card className="border bg-foreground p-5 border-gray-300 rounded-lg shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AI Interviews Completed
                <span className="text-xs text-red-500 ml-2">(Update)</span>
              </CardTitle>
              <Link href="/interviews">
                <UserIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
              <p className="text-xs text-muted-foreground">
                12 upcoming this week
              </p>
            </CardContent>
          </Card>

          <ActiveJobsCard />

          <RecentApplicantsCard />

          {/* bot */}
          <Card className="p-5 border border-gray-300 bg-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recruiting Bot
              </CardTitle>
              <Link href="/bot">
                <MessageSquareIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                AI-powered assistant for recruiting tasks
              </p>
              <Button className="w-full" variant="outline">
                Chat with Bot
              </Button>
            </CardContent>
          </Card>

          <SettingsCard />
        </div>
      </main>
    </div>
  );
}
