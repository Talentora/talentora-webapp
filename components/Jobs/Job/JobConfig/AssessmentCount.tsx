import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AssessmentCountProps {
  loading: boolean;
  interviewConfig: any | null;
  jobId: string;
}

const AssessmentCount = ({ loading, interviewConfig, jobId }: AssessmentCountProps) => {
  const [completedInterviews, setCompletedInterviews] = useState<number>(0);
  const [loadingInterviews, setLoadingInterviews] = useState(true);

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
        
        setCompletedInterviews(interviewData?.length || 0);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingInterviews(false);
      }
    };

    fetchData();
  }, [jobId]);

  return (
    <Card className="hover:bg-accent/50 transition-colors p-5 border border-border shadow-3xl h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-5">
          <CardTitle className="text-xl font-semibold">Assessment Count</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {loadingInterviews ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
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
  );
};

export default AssessmentCount;

