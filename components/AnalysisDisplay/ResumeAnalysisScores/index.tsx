import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ResumeAnalysisScoresProps {
  portalProps: any;
}

const ScoreCircle = ({ score }: { score: number | null }) => {
  if (score === null) return <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-400 text-white">N/A</div>;
  
  let backgroundColor = "bg-gray-400"; // Default color
  if (score >= 80) backgroundColor = "bg-green-500"; // Success
  else if (score >= 60) backgroundColor = "bg-yellow-500"; // Warning
  else backgroundColor = "bg-red-500"; // Destructive
  
  return <div className={`w-12 h-12 flex items-center justify-center rounded-full ${backgroundColor} text-white`}>{score}</div>;
};

export default function ResumeAnalysisScores({ portalProps }: ResumeAnalysisScoresProps) {
  const { AI_summary } = portalProps;
  
  if (!AI_summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resume Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Extract resume analysis data
  const resumeAnalysis = AI_summary.resume_analysis || {};
  console.log(resumeAnalysis, "resumeAnalysis");
  
  // Get scores with fallbacks
  const resumeScore = resumeAnalysis.resumeScore || null;
  const communicationScore = resumeAnalysis.communicationScore || null;
  const technicalScore = resumeAnalysis.technicalScore || null;
  const cultureFitScore = resumeAnalysis.cultureFitScore || null;
  
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Resume Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium mb-2">Overall</h3>
            <ScoreCircle score={resumeScore} />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium mb-2">Communication</h3>
            <ScoreCircle score={communicationScore} />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium mb-2">Technical</h3>
            <ScoreCircle score={technicalScore} />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium mb-2">Culture Fit</h3>
            <ScoreCircle score={cultureFitScore} />
          </div>
        </div>
        
        {resumeAnalysis.summary && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Resume Summary</h3>
            <p className="text-sm text-gray-700">{resumeAnalysis.summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 