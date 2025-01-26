import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import ApplicantTable from '../../Applicants/ApplicantTableDashboard';
import { ApplicantCandidate } from '@/types/merge';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import { Dialog, DialogContent } from '@/components/ui/dialog';
import InviteApplicants from '@/components/Jobs/Job/JobConfig/InviteApplicants';
import { Job } from '@/types/merge';

export default function RecentApplicantsDash({ applicants, isLoading, jobs }: { applicants: ApplicantCandidate[], isLoading: boolean, jobs: Job[] }) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <Card className="p-5 bg-white rounded-2xl bg-card">
      <CardHeader className="-mt-20 pb-2 flex flex-row justify-between items-center">
        <CardTitle>Recent Applicants</CardTitle>

        {/* Invite Candidates Button */}
        <Button
          className="flex items-center bg-black text-white dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700"
          onClick={() => setInviteModalOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Invite Candidates'}
        </Button>

        <Link href="/applicants">
          <Button
            className="flex items-center bg-white text-black dark:bg-input dark:text-white border border-gray-300 dark:border-gray-700"
            variant="outline"
          >
            View All
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-2 w-24" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-2 w-24" />
          </div>
        ) : (
          <ApplicantTable applicants={applicants} />
        )}
      </CardContent>

      {/* Invite Applicants Modal */}
      {inviteModalOpen && (
        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogContent>
            <InviteApplicants applicants={applicants} />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}