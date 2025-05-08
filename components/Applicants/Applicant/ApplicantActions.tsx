'use client';

import { Button } from '@/components/ui/button';
import { CalendarClock, UserPlus } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface ApplicantActionsProps {
  portalProps: portalProps;
}

const ApplicantActions = ({ portalProps }: ApplicantActionsProps) => {
  const { AI_summary, application, status } = portalProps;

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMMM do, yyyy') : 'Unknown date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  // If there's an AI summary, show completion status
  if (AI_summary) {
    return (
      <div className="w-full space-y-2">
        <Button variant="outline" className="w-full" disabled>
          <CalendarClock className="mr-2 h-4 w-4" />
          🎉 Assessment Completed! 🎉
        </Button>
        <div className="text-sm text-gray-500">
          {AI_summary.created_at
            ? formatDate(AI_summary.created_at)
            : 'Assessment completed'}
        </div>
      </div>
    );
  }

  // If there's an application but no AI summary, show invitation status
  if (application && status === 'interview_completed') {
    return (
      <div className="w-full space-y-2">
        <Button variant="outline" className="w-full" disabled>
          <CalendarClock className="mr-2 h-4 w-4" />
          Invitation Sent
        </Button>
        <div className="text-center text-sm text-gray-500">
          {application.created_at
            ? formatDate(application.created_at)
            : 'Invitation sent'}
        </div>
      </div>
    );
  }

  // If there's no job interview config, show disabled button with tooltip
  // if (!mergeApplicant) {
  //   return (
  //     <TooltipProvider>
  //       <Tooltip>
  //         <TooltipTrigger asChild>
  //           <div className="w-full">
  //             <Button
  //               variant="default"
  //               className="w-full"
  //               disabled
  //             >
  //               <UserPlus className="mr-2 h-4 w-4" />
  //               Invite Candidate
  //             </Button>
  //           </div>
  //         </TooltipTrigger>
  //         <TooltipContent>
  //           <p>Interview configuration needs to be set up before inviting candidates</p>
  //         </TooltipContent>
  //       </Tooltip>
  //     </TooltipProvider>
  //   );
  // }

  // Default case: Can invite the candidate
  return (
    <div className="w-full">
      <Button variant="default" className="w-full">
        <UserPlus className="mr-2 h-4 w-4" />
        Invite Candidate
      </Button>
    </div>
  );
};

export default ApplicantActions;
