import { useEffect, useState } from 'react';
import { ApplicantCandidate } from '@/types/merge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAISummaryId,getEvaluation } from '@/utils/supabase/queries';

interface ApplicantSummaryProps {
  ApplicantCandidate: ApplicantCandidate;
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function ApplicantSummary({ ApplicantCandidate }: ApplicantSummaryProps) {
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        const { candidate, job } = ApplicantCandidate;
        if (!candidate?.id || !job?.id) {
          console.error('Missing Candidate ID or Job ID');
          return;
        }
        // Fetch AISummaryId
        const AISummaryId = await getAISummaryId(candidate.id, job.id);
        if (!AISummaryId) {
          console.error('No AI Summary ID found for given Candidate and Job');
          return;
        }

        const evaluation = await getEvaluation(AISummaryId);
        setEvaluationData(evaluation);
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, [ApplicantCandidate]);

  if (!evaluationData) {
    return <div>Loading...</div>;
  }

  if (!evaluationData) {
    return <div>No evaluation data found.</div>;
  }
  

  const { emotion_eval, interview_summary, text_eval } = evaluationData;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Interview Summary */}
            <Card className="flex-1 border border-gray-200 p-4 col-span-2">
        <CardHeader>
          <CardTitle>Interview Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {interview_summary ? (
            <pre className="whitespace-pre-wrap break-words">{interview_summary.summary_text}</pre>
          ) : (
            <p>No Interview Summary Available</p>
          )}
        </CardContent>
      </Card>
      {/* Emotion Evaluation */}
      <Card className="flex-1 border border-gray-200 p-4">
        <CardHeader>
          <CardTitle>Emotion Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          {emotion_eval ? (
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(emotion_eval, null, 2)}</pre>
          ) : (
            <p>No Emotion Evaluation Data Available</p>
          )}
        </CardContent>
      </Card>

      {/* Text Evaluation */}
      <Card className="flex-1 border border-gray-200 p-4">
        <CardHeader>
          <CardTitle>Text Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          {text_eval ? (
            <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Overall Score</h3>
              <p>{text_eval.overall_score}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Minimum Average Score</h3>
              <p>{text_eval.min_avg_score}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Preferred Average Score</h3>
              <p>{text_eval.pref_avg_score}</p>
            </div>
            <div className="mb-4">
          <h3 className="text-lg font-semibold">Minimum Qualification Scores</h3>
          <ul className="list-disc ml-5">
            {text_eval.min_qual_scores.map((score: number, index: number) => (
              <li key={index}>{score}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Preferred Qualification Scores</h3>
          <ul className="list-disc ml-5">
            {text_eval.pref_qual_scores.map((score, index) => (
              <li key={index}>{score}</li>
            ))}
          </ul>
        </div>
          </>
          ) : (
            <p>No Text Evaluation Data Available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
