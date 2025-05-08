import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface AssessmentSummaryProps {
  portalProps: portalProps;
}

const Page = ({ portalProps }: AssessmentSummaryProps) => {
  const { AI_summary } = portalProps;

  if (!AI_summary) return <AssessmentSummarySkeleton />;

  // Extract the overall summary explanation
  let explanation = '';

  try {
    // Try to parse the overall_summary if it's a string
    if (typeof AI_summary.overall_summary === 'string') {
      try {
        const parsed = JSON.parse(AI_summary.overall_summary);
        explanation = parsed.explanation || '';
      } catch (e) {
        console.error('Error parsing overall_summary JSON:', e);
        explanation = AI_summary.overall_summary || '';
      }
    } else if (
      AI_summary.overall_summary &&
      typeof AI_summary.overall_summary === 'object'
    ) {
      // If it's already an object, access directly
      explanation = (AI_summary.overall_summary as any).explanation || '';
    }
  } catch (e) {
    console.error('Error extracting explanation:', e);
    explanation = 'Unable to load summary data.';
  }

  // Extract resume scores if available
  const resumeAnalysis = AI_summary.resume_analysis || null;
  const hasResumeScores = !!resumeAnalysis;

  return (
    <Card className="p-4 border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Candidate Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-base mb-4">
          {explanation ? (
            <p className="whitespace-pre-line">{explanation}</p>
          ) : (
            <p className="text-muted-foreground">No summary available</p>
          )}
        </div>

        {/* {hasResumeScores && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium mb-2">Resume Assessment</h3>

            <div className="space-y-3">
              <ScoreItem
                label="Overall Resume Score"
                score={(resumeAnalysis as any)?.resumeScore || 0}
              />
              <ScoreItem
                label="Technical Skills"
                score={(resumeAnalysis as any)?.technicalScore || 0}
              />
              <ScoreItem
                label="Culture Fit"
                score={(resumeAnalysis as any)?.cultureFitScore || 0}
              />
              <ScoreItem
                label="Communication"
                score={(resumeAnalysis as any)?.communicationScore || 0}
              />
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

// Helper component for displaying scores with progress bars
function ScoreItem({ label, score }: { label: string; score: number }) {
  // Convert score to percentage (assuming scores are on a 0-10 scale)
  const percentage = (score / 10) * 100;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'bg-green-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{score}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 h-full rounded-full ${getScoreColor(score)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Add Skeleton component for loading state
function AssessmentSummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Assessment Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}

Page.Skeleton = AssessmentSummarySkeleton;

export default Page;
