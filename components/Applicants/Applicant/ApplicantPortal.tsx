import { ApplicantCandidate } from '@/types/merge';
import ApplicantInfo from '@/components/Applicants/Applicant/ApplicantInfo';
import ApplicantActions from '@/components/Applicants/Applicant/ApplicantActions';
import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
interface ApplicantPortalProps {
  portalProps: portalProps;
}

const ApplicantInfoSkeleton = () => (
  <div className="space-y-4">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <Skeleton className="h-[200px] w-full" />
      </div>
      <div className="w-64">
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  </div>
);

const PlaceholderAnalysis = () => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-96 w-full" />
  </div>
);

export default function ApplicantPortal({
  portalProps
}: ApplicantPortalProps) {
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
            <ApplicantInfoSkeleton />
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
                <ApplicantActions portalProps={portalProps} />
              </div>
            </div>

            {AI_summary ? (
              <div>
             
              <AnalysisDisplay portalProps={portalProps} />
              </div>
            ) : (
              <>
                {application ? (
                  <div className="flex flex-col gap-4">
                    <Alert intent="info" title="AI Assessment Pending">
                      <AlertDescription>
                        The candidate hasn't completed their AI interview assessment yet. Once completed, detailed insights will appear here.
                      </AlertDescription>
                    </Alert>
                    <PlaceholderAnalysis />
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
