import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface AssessmentScoresProps {
    scores: AI_summary_applicant | null;
}

const Page = ({ scores }: AssessmentScoresProps) => {
    // Sample data
    const sampleScores = {
        technicalSkills: 85,
        communication: 92,
        problemSolving: 88
    };

    return (
        <div >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Assessment Scores</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex justify-evenly items-center">
                            <p className="text-gray-600">Technical Skills</p>
                            <div className="text-4xl font-bold text-blue-600">
                                {sampleScores.technicalSkills}%
                            </div>
                        </div>
                        <div className="flex justify-evenly items-center">
                            <p className="text-gray-600">Communication</p>
                            <div className="text-4xl font-bold text-green-600">
                                {sampleScores.communication}%
                            </div>
                        </div>
                        <div className="flex justify-evenly items-center">
                            <p className="text-gray-600">Problem Solving</p>
                            <div className="text-4xl font-bold text-purple-600">
                                {sampleScores.problemSolving}%
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page;