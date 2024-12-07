import { ApplicantCandidate } from '@/types/merge';
import ApplicantInfo from '@/components/Applicants/Applicant/ApplicantInfo';
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
  const jobId = ApplicantCandidate.job.id;
  const applicantId = ApplicantCandidate.candidate.id;
  const isJobSetup = Boolean(ApplicantCandidate.job.interview_questions?.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex flex-row gap-6">
              <div className="flex-1">
                <ApplicantInfo ApplicantCandidate={ApplicantCandidate} />
              </div>
              <div className="w-64">
                <ApplicantActions 
                    jobId={jobId}
                    applicantId={applicantId}
                    isJobSetup={isJobSetup}
                />
              </div>
            </div>

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
      </div>
    </div>
  );
}
