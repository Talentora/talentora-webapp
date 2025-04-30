import ApplicantInfo from '@/components/Applicants/Applicant/ApplicantInfo';
import ApplicantActions from '@/components/Applicants/Applicant/ApplicantActions';
import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import ResumeViewer from '@/components/AnalysisDisplay/ResumeViewer';
import ApplicationTimeline from './ApplicationTimeline';

interface ApplicantPortalProps {
  portalProps: portalProps;
}

const ApplicantInfoSkeleton = () => (
  <div className="space-y-4">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-2">Applicant Information</h2>
        <Skeleton className="h-[200px] w-full" />
      </div>
      <div className="w-64">
        <h2 className="text-lg font-semibold mb-2">Actions</h2>
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  </div>
);

const PlaceholderAnalysis = () => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Assessment Summary</h2>
        <Skeleton className="h-48 w-full" />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Assessment Scores</h2>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
    <div>
      <h2 className="text-lg font-semibold mb-2">Video Transcript</h2>
      <Skeleton className="h-64 w-full" />
    </div>

    <div>
      <h2 className="text-lg font-semibold mb-2">Emotional Analysis</h2>
      <Skeleton className="h-64 w-full" />
    </div>
    <div>
      <h2 className="text-lg font-semibold mb-2">Lexical Analysis</h2>
      <Skeleton className="h-96 w-full" />
    </div>
  </div>
);

export default function ApplicantPortal({ portalProps }: ApplicantPortalProps) {
  const { mergeApplicant, AI_summary, application, status } = portalProps;
  console.log(AI_summary, 'AI_summary');

  if (!mergeApplicant || !mergeApplicant.candidate) {
    return (
      <div className="space-y-4">
        <Alert intent="danger" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Error</AlertTitle>
          <AlertDescription>
            Unable to load applicant data. The applicant may have been removed
            or there might be an issue with the data source.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <ApplicantInfoSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Check if we have partial data (e.g., candidate info but missing job info)
  const hasPartialData =
    mergeApplicant.candidate &&
    (!mergeApplicant.job || !mergeApplicant.application);

  return (
    <div className="space-y-4">
      {hasPartialData && (
        <Alert intent="danger" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incomplete Data</AlertTitle>
          <AlertDescription>
            Some applicant information may be missing or incomplete. This could
            affect the display of certain features.
          </AlertDescription>
        </Alert>
      )}

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

            {mergeApplicant.job && mergeApplicant.application && (
              <div className="mt-6 bg-card rounded-lg">
                <ApplicationTimeline portalProps={portalProps} />
              </div>
            )}

            {mergeApplicant.job && <ResumeViewer portalProps={portalProps} />}

            {AI_summary ? (
              <div>
                <AnalysisDisplay portalProps={portalProps} />
              </div>
            ) : (
              <>
                {status === 'invited_incomplete' ? (
                  <div className="flex flex-col gap-4">
                    <Alert intent="info" title="AI Assessment Pending">
                      <AlertDescription>
                        The candidate hasn't completed their AI interview
                        assessment yet. Once completed, detailed insights will
                        appear here.
                      </AlertDescription>
                    </Alert>
                    <PlaceholderAnalysis />
                  </div>
                ) : status === 'not_invited' ? (
                  <Alert intent="info" title="Not Yet Invited">
                    <AlertDescription>
                      This candidate hasn't been invited to complete an
                      assessment yet. Send an invitation to begin the evaluation
                      process.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert intent="info" title="No Assessment Data">
                    <AlertDescription>
                      No assessment data available for this candidate.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
