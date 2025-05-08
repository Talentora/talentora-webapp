import { AISummaryApplicant } from '@/types/analysis';
import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { text } from 'd3';

interface AssessmentSummaryProps {
  aiSummary: portalProps['AI_summary'] | null;
}

const LexicalAnalysisSkeleton = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Lexical Analysis</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div>
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    </div>
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

const NewLexicalAnalysis = ({ aiSummary }: AssessmentSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const typedSummary = aiSummary as any;
  const textEval = typedSummary?.text_eval;

  console.log(typedSummary, 'typedSummary');

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-2xl font-semibold">Lexical Analysis</h2>
        {isExpanded ? (
          <ChevronUp className="h-6 w-6" />
        ) : (
          <ChevronDown className="h-6 w-6" />
        )}
      </div>

      {isExpanded && (
        <div className={typedSummary ? 'p-4' : ''}>
          {!typedSummary ? (
            <div>No summary available</div>
          ) : (
            <div className="flex flex-row">
              {/* <div className="flex-[4]">
                <p className="text-gray-700">{textEval.explanation}</p>
              </div> */}

              <div className="flex-[4] pr-10">
                <h3 className="text-sm font-medium mb-2">Resume Assessment</h3>
                <div className="space-y-3">
                  <ScoreItem
                    label="Behavioral Score"
                    score={(textEval.behavioral as any)?.overall_score || 0}
                  />
                  <ScoreItem
                    label="Communication Score"
                    score={(textEval.communication as any)?.overall_score || 0}
                  />
                  <ScoreItem
                    label="Experience Score"
                    score={(textEval.experience as any)?.overall_score || 0}
                  />
                  <ScoreItem
                    label="Technical Score"
                    score={(textEval.technical as any)?.overall_score || 0}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="rounded-lg  p-6 shadow-sm">
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            textEval.overall_score < 50
                              ? 'rgb(255, 0, 0)'
                              : `hsl(${(textEval.overall_score - 50) * 2.4}, 100%, 45%)`,
                          boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div className="text-3xl font-bold text-white">
                          {textEval.overall_score}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NewLexicalAnalysis.Skeleton = LexicalAnalysisSkeleton;

export default NewLexicalAnalysis;
