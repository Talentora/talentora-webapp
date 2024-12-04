'use client';
import { useState, useEffect } from 'react';
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

export default function RecruiterDashboard() {
  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [mergeJobs, setMergeJobs] = useState<Job[]>([]);
  const [supabaseJobs, setSupabaseJobs] = useState<Tables<'jobs'>[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Fetch from API routes
      const [applicationsResponse, jobsResponse] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/jobs')
      ]);

      // Fetch from Supabase
      const { data: supabaseJobsData } = await supabase
        .from('jobs')
        .select('*');

      if (applicationsResponse.ok) {
        const applicantsData = await applicationsResponse.json();
        setApplicants(applicantsData);
      }

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setMergeJobs(jobsData);
      }

      if (supabaseJobsData) {
        setSupabaseJobs(supabaseJobsData);
      }

      setApplicantsLoading(false);
    };

    fetchData();
  }, []);

  // Combine Merge and Supabase job data
  const combinedJobs = mergeJobs.map(mergeJob => {
    const supabaseJob = supabaseJobs.find(sJob => sJob.merge_id === mergeJob.id);
    return {
      mergeJob,
      supabaseJob
    };
  });

  const factWindow = 90;

  return (
    <div className="flex w-full">
      <main className="flex-1 p-8 mb-6 ">
        <div className="flex flex-col gap-6 ">
          <h1 className="text-2xl text-primary-dark font-bold">Recruiting Dashboard</h1>

          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-6">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                applicants={applicants}
              />
              <Button className="bg-primary-dark text-white" onClick={() => setInviteModalOpen(true)}>
                Invite Candidates
              </Button>
              { inviteModalOpen && (
                <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
                  <DialogContent>
                    <InviteApplicants jobs={combinedJobs} singleJobFlag={false} applicants={applicants} />
                  </DialogContent>
                </Dialog>
              )}

            </div>
            <div className="flex flex-row gap-6">
              <ApplicantCountCard factWindow={factWindow} isLoading={applicantsLoading} applicants={applicants} />
              <InvitedCandidatesCard factWindow={factWindow} />
              <CompletedAssessmentsCard factWindow={factWindow} />
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
            <ActiveJobsCard jobs={mergeJobs} isLoading={applicantsLoading} />
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
