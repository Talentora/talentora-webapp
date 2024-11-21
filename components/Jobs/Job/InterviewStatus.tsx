// components/Jobs/Job/InterviewStatus.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BarChart } from 'lucide-react';
import { Tables } from '@/types/types_db';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

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

  const jobId = interviewConfig?.job_id;

  useEffect(() => {
    const fetchCompletedInterviews = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', jobId || '')
          .not('ai_summary', 'is', null);

        if (error) {
          console.error('Error fetching completed interviews:', error);
          return;
        }

        setCompletedInterviews(data?.length || 0);
      } catch (err) {
        console.error('Unexpected error fetching completed interviews:', err);
      } finally {
        setLoadingInterviews(false);
      }
    };

    if (jobId) {
      fetchCompletedInterviews();
    }
  }, [jobId]);

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
                <h3 className="font-medium mb-2">Setup Status</h3>
                <div className={`text-sm px-3 py-1 rounded-full inline-block ${interviewConfig && botInfo ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {interviewConfig && botInfo ? 'Ready' : 'Setup Required'}
                </div>
              </div>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewStatus;