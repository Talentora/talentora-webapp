'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquareIcon,
  UserIcon,
  UsersIcon,
  Loader2,
  BarChart3,
  UserPlus
} from 'lucide-react';
import { Job, ApplicantCandidate } from '@/types/merge';
import ActiveJobsCard from './ActiveJobsCard';
import RecentApplicantsCard from './RecentApplicantsCard';
import SettingsCard from './SettingsCard';
import ApplicantCountCard from './FactCards/ApplicantCount';
import CompletedAssessmentsCard from './FactCards/CompletedAssessments';
import BotCard from './BotCard';
import TimeRangeSelector from '@/components/Jobs/Job/ApplicantStatistics/TimeRangeSelector';
import ApplicationsGraph from '@/components/Jobs/Job/ApplicantStatistics/ApplicationsGraph';
import BotCountCard from './FactCards/BotCountCard';
import InvitedCandidatesCard from './FactCards/InvitedCandidates';
import SearchBar from '@/components/Applicants/Searchbar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InviteApplicants from '@/components/Jobs/Job/JobConfig/InviteApplicants';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchApplicationsData } from '@/server/applications';
import { fetchJobsData } from '@/server/jobs';

export default function RecruiterDashboard() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: applicants = [], isLoading: applicantsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplicationsData,
    staleTime: 5 * 60 * 1000
  });

  const { data: mergeJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobsData,
    staleTime: 5 * 60 * 1000
  });

  const factWindow = 90;

  return (
    <div className="w-full mx-auto overflow-x-hidden">
      <main className="w-full flex p-8">
        <div className="flex flex-col gap-6 w-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 w-full p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-xl relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-75 rounded-lg"></div>
                <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Recruiting Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Team</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {applicantsLoading ? (
                <Skeleton className="h-10 w-64" />
              ) : (
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  applicants={applicants}
                />
              )}
              <Button
                className="bg-primary text-white"
                onClick={() => setInviteModalOpen(true)}
                disabled={jobsLoading || applicantsLoading}
              >
                {jobsLoading || applicantsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Invite Candidates'
                )}
              </Button>
              {inviteModalOpen && (
                <Dialog
                  open={inviteModalOpen}
                  onOpenChange={setInviteModalOpen}
                >
                  <DialogContent>
                    <InviteApplicants
                      jobs={mergeJobs}
                      singleJobFlag={false}
                      applicants={applicants}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Fact Cards - Full width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
            <ApplicantCountCard
              factWindow={factWindow}
              isLoading={applicantsLoading}
              applicants={applicants}
            />
            <InvitedCandidatesCard factWindow={factWindow} />
            <CompletedAssessmentsCard factWindow={factWindow} />
            <BotCountCard />
          </div>

          {/* Main Layout - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Left Column: Graph + Recent Applicants */}
            <div className="flex flex-col gap-6 w-full col-span-2">
              {/* Graph */}
              <Card className="max-h-[500px] mb-4 dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] p-5 border border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 w-full">
                <CardContent>
                  <ApplicationsGraph
                    applicants={applicants}
                    isLoading={applicantsLoading}
                    hideHeader={false}
                  />
                </CardContent>
              </Card>

              {/* Recent Applicants */}
              <RecentApplicantsCard
                applicants={applicants}
                isLoading={applicantsLoading}
              />
            </div>

            {/* Right Column: Active Jobs + ChatBot + Settings */}
            <div className="flex flex-col gap-6 w-full">
              <ActiveJobsCard jobs={mergeJobs} isLoading={jobsLoading} />
              <BotCard />
              <SettingsCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



