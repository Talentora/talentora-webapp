import { AISummaryApplicant } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimelineGraph from "./TimelineGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmotionAverages from "./EmotionAverages";
import { portalProps } from "@/app/(pages)/applicants/[id]/page";
interface EmotionalAnalysisProps {
    aiSummary: portalProps['AI_summary'] | null;
}

const Page = ({ aiSummary }: EmotionalAnalysisProps) => {
    const typedSummary = aiSummary as unknown as AISummaryApplicant;
    const emotionalAnalysis = typedSummary?.emotion_eval;

    return (
        <div >
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
                            <TimelineGraph timeline={emotionalAnalysis?.timeline} />
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