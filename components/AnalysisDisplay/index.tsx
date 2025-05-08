import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import VideoTranscript, { VideoTranscriptSkeleton } from './VideoTranscript';
import NewLexicalAnalysis from './NewLexicalAnalysis';
import EmotionalAnalysis from './EmotionalAnalysis';
import AssessmentScore from './AssessmentScore';
import AssessmentSummary from './AssessmentSummary';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface AnalysisDisplayProps {
  portalProps: portalProps;
}

const AnalysisSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Assessment Summary and Scores */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <AssessmentSummary.Skeleton />
        </div>
        <div className="col-span-1">
          <AssessmentScore.Skeleton />
        </div>
      </div>

      <VideoTranscriptSkeleton />
      <EmotionalAnalysis.Skeleton />
      <NewLexicalAnalysis.Skeleton />
    </div>
  );
};

const Page = ({ portalProps }: AnalysisDisplayProps) => {
  const { AI_summary } = portalProps;

  // If no AI summaries are available, show the skeleton loader
  if (!AI_summary) return <AnalysisSkeleton />;

  return (
    <div className="space-y-8 mt-8">
      <VideoTranscript portalProps={portalProps} />

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Assessment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AssessmentSummary portalProps={portalProps} />
          </div>
          <div className="md:col-span-1">
            <AssessmentScore portalProps={portalProps} />
          </div>
        </div>
      </div>

      <Separator />

      <EmotionalAnalysis aiSummary={AI_summary} />

      <Separator />

      <NewLexicalAnalysis aiSummary={AI_summary} />

      <Separator />
    </div>
  );
};

export default Page;
