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




export default function RecruiterDashboard() {

  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const applicationsResponse = await fetch(
        `/api/applications`
      );

      const jobsResponse = await fetch(
        `/api/jobs`
      );

      if (applicationsResponse.ok) {
        const applicantsData = await applicationsResponse.json();
        console.log('applicantsData', applicantsData);
        setApplicants(applicantsData);
      }

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData);
      }
      setApplicantsLoading(false);
    };

    fetchData();
  }, []);

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
              { inviteModalOpen && <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
                <DialogContent>
                  <InvitePage jobs={jobs} isLoading={applicantsLoading} />
                </DialogContent>
              </Dialog> }

            </div>
            {/* <h1 className="text-lg font-medium">{factWindow} Day Facts</h1> */}
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
            <ActiveJobsCard jobs={jobs} isLoading={applicantsLoading} />

          </div>

          <div className="flex flex-row gap-6">
            
            <RecentApplicantsCard
              applicants={applicants}
              isLoading={applicantsLoading}
             />
          </div>

          {/* bot */}

          <div className="flex flex-row gap-6">
            <BotCard />
            <SettingsCard />

          </div>
        </div>
      </main>
    </div>
  );
}
