import { ApplicantCandidate } from '@/types/merge';
import { Button } from '@/components/ui/button';
import ApplicantInfo from '@/components/Applicants/Applicant/ApplicantInfo';
import ApplicantSummary from '@/components/Applicants/Applicant/ApplicantSummary';
import InterviewResponses from '@/components/Applicants/Applicant/InterviewResponses';
import ApplicantCandidateStatus from '@/components/Applicants/Applicant/ApplicantStatus';
import ApplicantActions from '@/components/Applicants/Applicant/ApplicantActions';
import { AI_summary_applicant } from '@/app/(pages)/applicants/[id]/page';
import AnalysisDisplay from '@/components/AnalysisDisplay';
interface ApplicantPortalProps {
  ApplicantCandidate: ApplicantCandidate;
  aiSummary: AI_summary_applicant | null;
}

export default function ApplicantPortal({
  ApplicantCandidate,
  aiSummary
}: ApplicantPortalProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <ApplicantInfo ApplicantCandidate={ApplicantCandidate} />
            {/* <InterviewResponses /> */}
            {aiSummary ? (
              <AnalysisDisplay aiSummary={aiSummary} />
            ) : (
              <>
                <div className="alert alert-warning">
                  This applicant hasn't completed their AI assessment yet.
                </div>
                <div className="filter blur-sm">
                  <AnalysisDisplay aiSummary={null} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-full lg:w-64 space-y-6">
          <ApplicantActions ApplicantCandidate={ApplicantCandidate} />
        </div>
      </div>
    </div>
  );
}
