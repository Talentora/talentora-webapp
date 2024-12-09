import { ApplicantCandidate } from '@/types/merge';
import ApplicantInfo from '@/components/Applicants/Applicant/ApplicantInfo';
import ApplicantActions from '@/components/Applicants/Applicant/ApplicantActions';
import { portalProps } from '@/app/(pages)/applicants/[id]/page';
import AnalysisDisplay from '@/components/AnalysisDisplay';

interface ApplicantPortalProps {
  portalProps: portalProps;
}

export default function ApplicantPortal({
  portalProps
}: ApplicantPortalProps) {

  console.log("portalProps", portalProps);

  const {mergeApplicant, AI_summary, application, job_interview_config} = portalProps;

  if (!mergeApplicant) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h4 className="font-medium text-destructive">Error Fetching Data</h4>
                  <p className="text-muted-foreground">Unable to load applicant data from Merge API. Please try again later.</p>
                </div>
              </div>
            </div>
            <div className="filter blur-sm opacity-50">
              <ApplicantInfo ApplicantCandidate={null} />
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex flex-row gap-6">
              <div className="flex-1">
                <ApplicantInfo ApplicantCandidate={mergeApplicant} />
              </div>
              <div className="w-64">
                <ApplicantActions 
                  portalProps={portalProps}
                />
              </div>
            </div>

            {AI_summary ? (
              <AnalysisDisplay aiSummary={AI_summary} />
            ) : (
              <>
                {application ? (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-accent">AI Assessment Pending</h4>
                          <p className="text-muted-foreground">The candidate hasn't completed their AI interview assessment yet. Once completed, detailed insights will appear here.</p>
                        </div>
                      </div>
                    </div>
                   <div className="filter blur-sm opacity-50">
                   <div className="flex flex-col gap-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="rounded-lg bg-gray-200 h-48" /> {/* Assessment Summary */}
                       <div className="rounded-lg bg-gray-200 h-48" /> {/* Assessment Scores */}
                     </div>
                     <div className="rounded-lg bg-gray-200 h-64" /> {/* Emotional Analysis */}
                     <div className="rounded-lg bg-gray-200 h-64" /> {/* New Lexical Analysis */}
                     <div className="rounded-lg bg-gray-200 h-64" /> {/* Lexical Analysis */}
                     <div className="rounded-lg bg-gray-200 h-96" /> {/* Video Transcript */}
                   </div>
                 </div>
                 </div>
                ) : (
                  <div className="rounded-lg bg-accent/10 border border-accent/20 p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">📝</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-accent">Not Yet Invited</h4>
                        <p className="text-muted-foreground">This candidate hasn't been invited to complete an assessment yet. Send an invitation to begin the evaluation process.</p>
                      </div>
                    </div>
                  </div>
                )}
               
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
