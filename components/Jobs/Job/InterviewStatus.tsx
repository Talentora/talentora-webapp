// components/Jobs/Job/InterviewStatus.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BarChart } from 'lucide-react';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

type InterviewConfig = Tables<'job_interview_config'>;
type Bot = Tables<'bots'>;

interface InterviewStatusProps {
  loading: boolean;
  interviewConfig: InterviewConfig | null;
  botInfo: Bot | null;
}

const InterviewStatus = ({ loading, interviewConfig, botInfo }: InterviewStatusProps) => {
  const [completedInterviews, setCompletedInterviews] = useState<number>(0);
  const [loadingInterviews, setLoadingInterviews] = useState(true);
  const [questions, setQuestions] = useState<number>(0);

  const jobId = interviewConfig?.job_id;

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;

      try {
        const supabase = createClient();
        
        // Fetch completed interviews
        const { data: interviewData, error: interviewError } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', jobId)
          .not('ai_summary', 'is', null);

        if (interviewError) throw interviewError;
        
        // Fetch question count
        const { count: questionCount, error: questionError } = await supabase
          .from('interview_questions')
          .select('*', { count: 'exact' })
          .eq('job_id', jobId);

        if (questionError) throw questionError;

        setCompletedInterviews(interviewData?.length || 0);
        setQuestions(questionCount || 0);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingInterviews(false);
      }
    };

    fetchData();
  }, [jobId]);

  const hasBotId = !!interviewConfig?.bot_id;
  const hasQuestions = questions > 0;
  const hasInterviewName = !!interviewConfig?.interview_name;
  const hasDuration = !!interviewConfig?.duration;
  const isReady = (hasBotId && hasQuestions && hasInterviewName && hasDuration) ? "yes" : 
                  (!hasBotId && !hasQuestions && !hasInterviewName && !hasDuration) ? "no" : "almost";


  console.log("isReady", isReady);
  console.log("hasBotId", hasBotId, "hasQuestions", hasQuestions, "hasInterviewName", hasInterviewName, "hasDuration", hasDuration);
  return (
    <div className="flex-1">
      <Card className="p-5 bg-foreground border border-border shadow-3xl h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
            <CardTitle className="text-xl font-semibold">Interview Status</CardTitle>
            <BarChart className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Setup Requirements</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>AI Bot Connected</span>
                    <Badge variant={hasBotId ? "success" : "failure"}>
                      {hasBotId ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Interview Questions</span>
                    <Badge variant={hasQuestions ? "success" : "failure"}>
                      {hasQuestions ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Interview Name</span>
                    <Badge variant={hasInterviewName ? "success" : "failure"}>
                      {hasInterviewName ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Duration Set</span>
                    <Badge variant={hasDuration ? "success" : "failure"}>
                      {hasDuration ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Overall Status</h3>
                  <Badge 
                    variant={isReady === "yes" ? "success" : isReady === "almost" ? "warning" : "failure"} 
                    className={`text-base px-4 py-1 ${
                      isReady === "yes" ? "bg-green-500" : 
                      isReady === "almost" ? "bg-orange-500" : "bg-red-500"
                    }`}
                  >
                    {isReady === "yes" ? "Ready" : isReady === "almost" ? "Almost Ready" : "Setup Required"}
                  </Badge>
                </div>

                {isReady === "yes" && (
                  <div>
                    <h3 className="font-medium mb-2">AI Interviews Completed</h3>
                    {loadingInterviews ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-primary">{completedInterviews}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {completedInterviews === 0 ? 'No interviews completed yet' : `${completedInterviews} interview${completedInterviews === 1 ? '' : 's'} completed`}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewStatus;