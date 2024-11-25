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

export default function RecruiterDashboard() {

  const [applicants, setApplicants] = useState<ApplicantCandidate[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const applicationsResponse = await fetch(
        `/api/applications`
      );

      if (applicationsResponse.ok) {
        const applicantsData = await applicationsResponse.json();
        console.log('applicantsData', applicantsData);
        setApplicants(applicantsData);
      }
      setApplicantsLoading(false);
    };

    fetchData();
  }, []);

  const factWindow = 90;


  return (
    <div className="flex w-full">
      <main className="flex-1 p-8 mb-6">
        <h1 className="text-2xl font-bold">Recruiting Dashboard</h1>

        

        <div className="flex flex-col gap-6 ">

          <div className="flex flex-col">
            <div>

            </div>
            <h1 className="text-lg font-medium">{factWindow} Day Facts</h1>
            <div className="flex flex-row gap-6">
              <ApplicantCountCard factWindow={factWindow} />
              <InvitedCandidatesCard factWindow={factWindow} />
              <CompletedAssessmentsCard factWindow={factWindow} />
              <BotCountCard />

            </div>
          </div>

          <div className="flex flex-row gap-6">
          <Card className="border border-border  rounded-lg p-4 bg-foreground">
              <CardTitle>Applications Over Time</CardTitle>
              <CardContent>
                <ApplicationsGraph 
                applicants={applicants} 
                isLoading={applicantsLoading} 
                hideHeader={true} 
                />
              </CardContent>
            </Card>
            <ActiveJobsCard />

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
