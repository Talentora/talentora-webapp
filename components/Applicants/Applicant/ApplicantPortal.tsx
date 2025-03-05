import ApplicantInfo from '@/components/Applicants/Applicant/ApplicantInfo';
import ApplicantActions from '@/components/Applicants/Applicant/ApplicantActions';
import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import ResumeViewer from '@/components/AnalysisDisplay/ResumeViewer';
import ApplicationTimeline from './ApplicationTimeline';
import AssessmentScore from '@/components/AnalysisDisplay/AssessmentScore';
import AssessmentSummary from '@/components/AnalysisDisplay/AssessmentSummary';
import CandidateNotes from './CandidateNotes';
import SkillBadges from './SkillBadges';

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

const ResumeAndInfoSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
    <div className="lg:col-span-2">
      <Skeleton className="h-[600px] w-full" />
    </div>
    <div className="lg:col-span-1 space-y-6">
      <Skeleton className="h-[280px] w-full" />
      <Skeleton className="h-[280px] w-full" />
    </div>
  </div>
);

const AnalysisSkeleton = () => (
  <div className="mt-6">
    <Skeleton className="h-[400px] w-full" />
  </div>
);

const PlaceholderAnalysis = () => (
  <div className="space-y-4 mt-4">
    <div className="rounded-lg p-4 bg-muted">
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground text-center">
          AI assessment insights will appear here after the candidate completes their interview.
        </p>
      </div>
    </div>
  </div>
);

export default function ApplicantPortal({ portalProps }: ApplicantPortalProps) {
  const { mergeApplicant, AI_summary, application } = portalProps;
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
            <ResumeAndInfoSkeleton />
            <AnalysisSkeleton />
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
    <div className="space-y-6">
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

      {/* TOP ROW - Applicant Info and Application Actions */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5">
          <ApplicantInfo
            ApplicantCandidate={mergeApplicant}
            portalProps={portalProps}
          />
        </div>
        <div className="lg:w-2/5">
          <AssessmentScore portalProps={portalProps} />
        </div>
      </div>
      <div>
      {mergeApplicant.job && mergeApplicant.application && (
          <div className="mb-6 bg-card rounded-lg">
            <ApplicationTimeline portalProps={portalProps} />
          </div>
        )}
      </div>

      {/* MIDDLE ROW - Resume on the left and Notes/Skills on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left column - Resume */}
        <div className="lg:col-span-2">
          {mergeApplicant.job && (
            <ResumeViewer portalProps={portalProps} />
          )}
        </div>
        
        {/* Right column - Notes and Skills */}
        <div className="lg:col-span-1 space-y-6">
          {mergeApplicant?.candidate?.id && (
            <CandidateNotes candidateId={mergeApplicant.candidate.id} />
          )}
          {mergeApplicant?.candidate?.id && (
            <SkillBadges candidateId={mergeApplicant.candidate.id} />
          )}
        </div>
      </div>

      {/* BOTTOM ROW - Application Timeline and Analysis Display (Video, Transcript, etc.) */}
      <div className="mt-6">
        

        {/* Assessment Summary */}
        {AI_summary && (
          <div className="mb-6">
            <AssessmentSummary portalProps={portalProps} />
          </div>
        )}

        {/* Video, Transcript and other Analysis */}
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
                    The candidate hasn't completed their AI interview
                    assessment yet. Once completed, detailed insights
                    will appear here.
                  </AlertDescription>
                </Alert>
                <PlaceholderAnalysis />
              </div>
            ) : (
              <Alert intent="info" title="Not Yet Invited">
                <AlertDescription>
                  This candidate hasn't been invited to complete an
                  assessment yet. Send an invitation to begin the
                  evaluation process.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
    </div>
  );
}
