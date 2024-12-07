import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Graph1 from "./Graph1";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmotionAverages from "./EmotionAverages";

interface EmotionalAnalysisProps {
    analysis: AI_summary_applicant | null;
}

const Page = ({ analysis }: EmotionalAnalysisProps) => {
    const emotionalAnalysis = analysis?.emotion_eval;

    return (
        <div className="p-4 border border-gray-300">
            <Card>
                <CardHeader>
                    <CardTitle>Emotional Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <p className="mb-6">We leverage the Hume AI expression analysis service to analyze the applicant's emotional state through facial expressions, voice, and language.</p>
                    
                    <Tabs defaultValue="timeline" className="w-full">
                        <TabsList>
                            <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
                            <TabsTrigger value="averages">Emotional Averages</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="timeline">
                            <Graph1 timeline={emotionalAnalysis?.timeline} />
                        </TabsContent>
                        
                        <TabsContent value="averages">
                            <EmotionAverages averages={emotionalAnalysis?.averages} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page;