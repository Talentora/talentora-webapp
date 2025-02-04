'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareIcon, UserIcon, UsersIcon, Loader2, BarChart3, UserPlus } from 'lucide-react';
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
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

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

interface CombinedJob {
  mergeJob: Job;
  supabaseJob: Tables<'jobs'> | undefined;
}

export default function RecruiterDashboard() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: applicants = [], isLoading: applicantsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    staleTime: 5 * 60 * 1000,
  });

  const { data: mergeJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 5 * 60 * 1000,
  });

  const { data: supabaseJobs = [], isLoading: supabaseJobsLoading } = useQuery({
    queryKey: ['supabaseJobs'],
    queryFn: fetchSupabaseJobs,
    staleTime: 5 * 60 * 1000,
  });

  const combinedJobs = useMemo(() => {
    return mergeJobs.map((mergeJob) => {
      const supabaseJob = supabaseJobs.find((sJob) => sJob.merge_id === mergeJob.id);
      return { mergeJob, supabaseJob };
    });
  }, [mergeJobs, supabaseJobs]);

  const factWindow = 90;

  return (
    <div className="w-full mx-auto">
  <main className="max-w-7xl p-8 mb-6">
<div className="flex flex-col gap-6 w-full">
<div className="flex items-center justify-between gap-4 w-full bg-background p-4 rounded-lg">
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
    {applicantsLoading ? <Skeleton className="h-10 w-64" /> : <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} applicants={applicants} />}
    <Button className="bg-primary text-white relative overflow-hidden rounded-lg shadow-xl w-48"
      onClick={() => setInviteModalOpen(true)} disabled={jobsLoading || applicantsLoading}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 blur-md opacity-75 rounded-lg"></div>
      <div className="relative flex items-center justify-center w-full h-full z-10">
        {(jobsLoading || applicantsLoading) ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4 mr-2" /> Invite Candidates</>}
      </div>
    </Button>
  </div>
</div>

          <TimeRangeSelector></TimeRangeSelector>
          <div className="grid grid-cols-1 md:grid-cols-4 -mt-14 gap-6 w-full">
            <ApplicantCountCard factWindow={factWindow} isLoading={applicantsLoading} applicants={applicants} />
            <InvitedCandidatesCard factWindow={factWindow} />
            <CompletedAssessmentsCard factWindow={factWindow} />
            <BotCountCard />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Card className="p-5 bg-background rounded-2xl shadow-md shadow-[#5650F0]/50 w-full md:col-span-2">
            <CardContent>
              <ApplicationsGraph applicants={applicants} isLoading={applicantsLoading} hideHeader={false} />
            </CardContent>
          </Card>
          <ActiveJobsCard jobs={mergeJobs} isLoading={jobsLoading} />
        </div>
        <RecentApplicantsCard applicants={applicants} isLoading={applicantsLoading} />
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 w-full">
          <BotCard />
          <SettingsCard />
        </div>

        </div>
      </main>
    </div>
  );
}
