import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InviteApplicantsTable from '@/components/Applicants/InviteApplicantsTable';
import { Button } from '@/components/ui/button';
import ApplicationsGraph from './ApplicantStatistics/ApplicationsGraph';
import { ApplicantCandidate, Job } from '@/types/merge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InviteApplicants from '@/components/Jobs/Job/JobConfig/InviteApplicants';
import { Tables } from '@/types/types_db';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/utils/cn';

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

  const hasApplicants = applicants && applicants.length > 0;

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
          <div className='p-2'>
          <Alert intent="danger">
            <AlertTitle>No Recent Applicants</AlertTitle>
            <AlertDescription>
              There are no recent applicants for this job posting yet.
            </AlertDescription>
          </Alert>
          </div>
          <Card className={cn(
            "p-5 border-none shadow-3xl h-full",
            "blur-sm pointer-events-none"
          )}>
            <ApplicationsGraph applicants={applicants} />
            <div className="mt-6">
              <InviteApplicantsTable applicants={applicants} jobs={jobs} />
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