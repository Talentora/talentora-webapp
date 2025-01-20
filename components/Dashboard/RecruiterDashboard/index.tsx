'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareIcon, UserIcon, UsersIcon, Loader2 } from 'lucide-react';
import { Job, ApplicantCandidate } from '@/types/merge';
import ActiveJobsCard from './ActiveJobsCard';
import RecentApplicantsCard from './RecentApplicantsCard';
import SettingsCard from './SettingsCard';
import ApplicantCountCard from './FactCards/ApplicantCount';
import CompletedAssessmentsCard from './FactCards/CompletedAssessments';
import BotCard from './BotCard';
import ApplicationsGraph from '@/components/Jobs/Job/ApplicantStatistics/ApplicationsGraph';
import BotCountCard from './FactCards/BotCountCard';
import InvitedCandidatesCard from './FactCards/InvitedCandidates';
import SearchBar from '@/components/Applicants/Searchbar';
import InvitePage from '@/components/Invite';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InviteApplicants from '@/components/Jobs/Job/JobConfig/InviteApplicants';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Fetch functions with proper typing
const fetchApplications = async (): Promise<ApplicantCandidate[]> => {
  const response = await fetch('/api/applications');
  if (!response.ok) throw new Error('Failed to fetch applications');
  return response.json();
};

const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch('/api/jobs');
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
};

const fetchSupabaseJobs = async (): Promise<Tables<'jobs'>[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from('jobs').select('*');
  if (error) throw error;
  return data || [];
};

// Type for combined jobs
interface CombinedJob {
  mergeJob: Job;
  supabaseJob: Tables<'jobs'> | undefined;
}

export default function RecruiterDashboard() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Use React Query for data fetching with caching
  const { data: applicants = [], isLoading: applicantsLoading } = useQuery<ApplicantCandidate[]>({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    staleTime: 5 * 60 * 1000,
  });

  const { data: mergeJobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 5 * 60 * 1000,
  });

  const { data: supabaseJobs = [], isLoading: supabaseJobsLoading } = useQuery<Tables<'jobs'>[]>({
    queryKey: ['supabaseJobs'],
    queryFn: fetchSupabaseJobs,
    staleTime: 5 * 60 * 1000,
  });

  // Memoize combined jobs to prevent unnecessary recalculations
  const combinedJobs = useMemo<CombinedJob[]>(() => {
    return mergeJobs.map((mergeJob: Job) => {
      const supabaseJob = supabaseJobs.find(sJob => sJob.merge_id === mergeJob.id);
      return {
        mergeJob,
        supabaseJob
      };
    });
  }, [mergeJobs, supabaseJobs]);

  const factWindow = 90;

  return (
    <div className="flex w-full">
      <main className="flex-1 p-8 mb-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl text-primary-dark font-bold">Recruiting Dashboard</h1>

          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-6">
              {applicantsLoading ? (
                <Skeleton className="h-10 flex-1" />
              ) : (
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  applicants={applicants}
                />
              )}
              <Button 
                className="bg-primary-dark text-white" 
                onClick={() => setInviteModalOpen(true)}
                disabled={jobsLoading || applicantsLoading}
              >
                {(jobsLoading || applicantsLoading) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Invite Candidates'
                )}
              </Button>
              {inviteModalOpen && (
                <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
                  <DialogContent>
                    <InviteApplicants jobs={combinedJobs} singleJobFlag={false} applicants={applicants} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex flex-row gap-6">
              <ApplicantCountCard 
                factWindow={factWindow} 
                isLoading={applicantsLoading} 
                applicants={applicants} 
              />
              <InvitedCandidatesCard 
                factWindow={factWindow}
              />
              <CompletedAssessmentsCard 
                factWindow={factWindow}
              />
              <BotCountCard />
            </div>
          </div>

          <div className="flex flex-row gap-6">
            <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-[#5650F0]/50 bg-card">
              <CardTitle>Applications Over Time</CardTitle>
              <CardContent>
                <ApplicationsGraph 
                  applicants={applicants} 
                  isLoading={applicantsLoading} 
                  hideHeader={true} 
                />
              </CardContent>
            </Card>
            <ActiveJobsCard 
              jobs={mergeJobs} 
              isLoading={jobsLoading} 
            />
          </div>

          <div className="flex flex-row gap-6">
            <RecentApplicantsCard
              applicants={applicants}
              isLoading={applicantsLoading}
            />
          </div>

          <div className="flex flex-row gap-6">
            <BotCard />
            <SettingsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
