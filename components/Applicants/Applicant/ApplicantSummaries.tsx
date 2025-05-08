import React, { useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import VideoTranscript, {
  VideoTranscriptSkeleton
} from 'components/AnalysisDisplay/VideoTranscript/index';
import { InterviewFeedbackComponent } from 'app/(pages)/(restricted)/reports/components/interview/interviewFeedback';
import { interviewFeedback } from 'app/(pages)/(restricted)/reports/data/interview-feedback';
import ResumeViewer from '@/components/AnalysisDisplay/ResumeViewer';

interface ProgressBarProps {
  label: string;
  value: number; // out of 10
}

interface AnalysisDisplayProps {
  portalProps: portalProps;
}

function ProgressBar({ label, value }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / 10) * 100, 0), 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-700">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="h-2 rounded-full bg-red-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ApplicantSummaries({ portalProps }: AnalysisDisplayProps) {
  const { AI_summary } = portalProps;

  const [tab, setTab] = useState<'overall' | 'emotional' | 'textEval'>(
    'overall'
  );

  // Extract the overall summary explanation
  let explanation = '';
  if (AI_summary) {
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
  }

  // Extract emotional analysis if available
  const emotionalAnalysis = AI_summary?.emotion_eval;

  return (
    <div>
      {/* Section title */}
      <h2 className="text-2xl font-semibold mb-5">Summaries</h2>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Tabs + View Resume button */}
        <Tabs.Root
          defaultValue="overall"
          onValueChange={(value) =>
            setTab(value as 'overall' | 'emotional' | 'textEval')
          }
        >
          <div className="flex items-center justify-between mb-6">
            <Tabs.List className="flex space-x-24 pb-2">
              {['overall', 'emotional', 'textEval'].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="
                    text-gray-600 pb-1 text-md
                    data-[state=active]:border-b-2
                    data-[state=active]:border-purple-500
                    data-[state=active]:text-gray-900
                  "
                >
                  {tab === 'textEval'
                    ? 'Text Evaluation'
                    : tab[0].toUpperCase() + tab.slice(1)}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm">
                  View Resume
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
                <Dialog.Content className="fixed inset-0 m-auto max-w-4xl w-[90vw] h-[80vh] bg-white rounded-2xl p-6 flex overflow-hidden z-50">
                  <div className="flex-1">
                    <ResumeViewer portalProps={portalProps} />
                  </div>
                  <Dialog.Close asChild>
                    <button className="absolute top-4 right-4">
                      <Cross2Icon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root> */}
          </div>

          <div className={tab === 'textEval' ? 'hidden' : 'mt-3 mb-6'}>
            <VideoTranscript portalProps={portalProps} />
          </div>

          {/* Tab panes */}
          <Tabs.Content value="overall" className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Candidate Summary</h4>
              <p className="text-gray-500">{explanation}</p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="emotional" className="space-y-6">
            {/* Replace with your emotional summary content */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Emotional Summary</h4>
              {!emotionalAnalysis ? (
                <div>No emotional analysis available</div>
              ) : (
                <>
                  <div className="flex flex-row mb-6">
                    <div className="flex-[4]">
                      <p className="text-gray-700 mb-4">
                        {typeof emotionalAnalysis === 'object' &&
                        emotionalAnalysis !== null &&
                        !Array.isArray(emotionalAnalysis) &&
                        'explanation' in emotionalAnalysis
                          ? typeof emotionalAnalysis.explanation === 'string'
                            ? emotionalAnalysis.explanation
                            : "We leverage AI to analyze the applicant's emotional state through facial expressions, voice, and language patterns throughout the interview."
                          : "We leverage AI to analyze the applicant's emotional state through facial expressions, voice, and language patterns throughout the interview."}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Tabs.Content>

          <Tabs.Content value="textEval">
            {/* Replace with your text evaluation content */}
            <InterviewFeedbackComponent feedback={interviewFeedback} />
          </Tabs.Content>
        </Tabs.Root>
        <div className="flex items-center justify-between mb-6"></div>
      </div>
    </div>
  );
}

export default ApplicantSummaries;
