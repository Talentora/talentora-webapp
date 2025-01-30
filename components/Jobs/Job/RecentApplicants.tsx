import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApplicantTable from '@/components/Applicants/ApplicantTable';
import { Button } from '@/components/ui/button';
import ApplicationsGraph from './ApplicantStatistics/ApplicationsGraph';
import { ApplicantCandidate, Job } from '@/types/merge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InviteApplicants from '@/components/Jobs/Job/JobConfig/InviteApplicants';
import { Tables } from '@/types/types_db';
import { ChevronDown, Loader2 } from 'lucide-react';

interface CombinedJob {
  mergeJob: Job;
  supabaseJob: Tables<'jobs'> | undefined;
}

interface RecentApplicantsProps {
  applicants: ApplicantCandidate[];
  jobs: CombinedJob[];
  isLoading?: boolean;
}

export function RecentApplicants({ applicants, jobs, isLoading }: RecentApplicantsProps) {
  const [visible, setVisible] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <Card>
      <CardHeader>
        <div className="p-4 flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Recent Applicants
          </CardTitle>
          <div className="flex gap-2">
            <ChevronDown onClick={toggleVisibility} className={`h-4 w-4 transition-transform ${visible ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </CardHeader>
      {visible && (
        <CardContent>
          <Card className="p-5 border-none shadow-3xl h-full">
            <ApplicationsGraph applicants={applicants} />
            <div className="mt-6">
              <ApplicantTable applicants={applicants} disablePortal={true} title={''} />
            </div>
          </Card>
        </CardContent>
      )}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <InviteApplicants 
            jobs={jobs} 
            singleJobFlag={false} 
            applicants={applicants} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}