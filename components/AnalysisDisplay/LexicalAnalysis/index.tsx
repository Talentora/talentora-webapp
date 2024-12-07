import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import RadarChart1 from "@/components/AnalysisDisplay/LexicalAnalysis/RadarChart1";
import RadarChart2 from "@/components/AnalysisDisplay/LexicalAnalysis/RadarChart2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface LexicalAnalysisProps {
    analysis: AI_summary_applicant
}

const mockTextEval = {
    overall_score: 80,
    min_qual_scores: [
      { "teamwork": 90 },
      { "descriptive answer": 95 },
      { "solved technical problem": 90 },
      { "coherency": 85 },
      { "technical skills": 90 },
    ],
    pref_qual_scores: [
      { "project management experience": 65 },
      { "willingness to learn": 75 },
      { "communication skills": 70 },
      { "test-driven development": 70 },
      { "startup experience": 70 },
    ],
  };



const Page = ({ analysis }: LexicalAnalysisProps) => {
    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Text Evaluation</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-full md:w-1/2">
                            <RadarChart1 data={mockTextEval} />
                        </div>
                        <div className="w-full md:w-1/2">
                            <RadarChart2 data={mockTextEval} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page;