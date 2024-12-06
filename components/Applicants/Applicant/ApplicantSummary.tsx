import { useEffect, useState } from "react";
import { ApplicantCandidate } from "@/types/merge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAISummaryId, getEvaluation } from "@/utils/supabase/queries";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);


interface ApplicantSummaryProps {
  ApplicantCandidate: ApplicantCandidate;
}

export default function ApplicantSummary({ ApplicantCandidate }: ApplicantSummaryProps) {
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        const { candidate, job } = ApplicantCandidate;
        if (!candidate?.id || !job?.id) {
          console.error("Missing Candidate ID or Job ID");
          return;
        }
        // Fetch AISummaryId
        // const AISummaryId = await getAISummaryId(candidate.id, job.id);
        const AISummaryId = "";
        if (!AISummaryId) {
          console.error("No AI Summary ID found for given Candidate and Job");
          return;
        }

        const evaluation = await getEvaluation(AISummaryId);
        setEvaluationData(evaluation);
      } catch (error) {
        console.error("Error fetching evaluation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, [ApplicantCandidate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!evaluationData) {
    return <div>No evaluation data found.</div>;
  }

  const { emotion_eval, interview_summary, text_eval } = evaluationData;

  // Radar Chart Data for Minimum Qualification Scores
  const minQualRadarData = {
    labels: text_eval?.min_qual_scores?.map((score: any) => Object.keys(score)[0]) || [],
    datasets: [
      {
        label: "Minimum Qualification Scores",
        data: text_eval?.min_qual_scores?.map((score: any) => Object.values(score)[0]) || [],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Radar Chart Data for Preferred Qualification Scores
  const prefQualRadarData = {
    labels: text_eval?.pref_qual_scores?.map((score: any) => Object.keys(score)[0]) || [],
    datasets: [
      {
        label: "Preferred Qualification Scores",
        data: text_eval?.pref_qual_scores?.map((score: any) => Object.values(score)[0]) || [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        ticks: {
          display: false,
          beginAtZero: false,
          stepSize: 20,
        },
        grid: {
          display: true, // Show grid
          lineWidth: 0.8, // Set the grid line width (optional)
        },
        min: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,

      },
    },
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Interview Summary */}
      <Card className="flex-1 border border-gray-200 p-4 col-span-2">
        <CardHeader>
          <CardTitle>Interview Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {interview_summary ? (
            <pre className="whitespace-pre-wrap break-words">{interview_summary.content}</pre>
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
      {/* Combined Radar Charts */}
      <Card className="flex-1 border border-gray-200 p-4 col-span-2">
        <CardHeader>
          <CardTitle>Text Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Overall Score</h3>
              <p>{text_eval.overall_score}</p>
          </div>
          <div className="flex justify-center mb-4">
            
            {/* Minimum Qualification Scores Radar Chart */}
            <div className="w-full md:w-1/2 p-2">
              <h3 className="text-lg font-semibold mb-2 text-center">Minimum Qualification Scores</h3>
              {minQualRadarData.labels.length > 0 ? (
                <Radar data={minQualRadarData} options={radarOptions} />
              ) : (
                <p>No Minimum Qualification Scores Available</p>
              )}
            </div>
            {/* Preferred Qualification Scores Radar Chart */}
            <div className="w-full md:w-1/2 p-2">
              <h3 className="text-lg font-semibold mb-2 text-center">Preferred Qualification Scores</h3>
              {prefQualRadarData.labels.length > 0 ? (
                <Radar data={prefQualRadarData} options={radarOptions} />
              ) : (
                <p>No Preferred Qualification Scores Available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
