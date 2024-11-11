import { ApplicantCandidate } from '@/types/merge';
import { Button } from '@/components/ui/button';
import ApplicantInfo from '@/components/Applicants/Applicant/ApplicantInfo';
import ApplicantSummary from '@/components/Applicants/Applicant/ApplicantSummary';
import InterviewResponses from '@/components/Applicants/Applicant/InterviewResponses';
import ApplicantCandidateStatus from '@/components/Applicants/Applicant/ApplicantStatus';
import ApplicantActions from '@/components/Applicants/Applicant/ApplicantActions';

interface ApplicantPortalProps {
  ApplicantCandidate: ApplicantCandidate;
}

export default function ApplicantPortal({
  ApplicantCandidate
}: ApplicantPortalProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <ApplicantInfo ApplicantCandidate={ApplicantCandidate} />
            <ApplicantSummary ApplicantCandidate={ApplicantCandidate} />
            <InterviewResponses />
          </div>
        </div>
        <div className="w-full lg:w-64 space-y-6">
          <ApplicantActions ApplicantCandidate={ApplicantCandidate} />
        </div>
      </div>
    </div>
  );
}
