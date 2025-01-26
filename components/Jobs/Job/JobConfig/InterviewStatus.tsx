import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BarChart } from 'lucide-react';
import { Tables } from '@/types/types_db';
import { Badge } from '@/components/ui/badge';

type InterviewConfig = Tables<'job_interview_config'>;
type Bot = Tables<'bots'>;

interface SetupFlags {
  hasBotId: boolean;
  hasQuestions: boolean;
  hasInterviewName: boolean;
  hasDuration: boolean;
  isReady: "yes" | "no" | "almost";
}

interface InterviewStatusProps {
  loading: boolean;
  interviewConfig: InterviewConfig | null;
  botInfo: Bot | null;
  setupFlags: SetupFlags;
}

const InterviewStatus = ({ loading, interviewConfig, botInfo, setupFlags }: InterviewStatusProps) => {
  const { hasBotId, hasQuestions, hasInterviewName, hasDuration, isReady } = setupFlags;

  return (
    <div className="flex-1">
    <Card className="rounded-lg hover:bg-accent/50 transition-colors p-5 bg-white dark:bg-transparent shadow-[0_4px_6px_-1px_rgba(90,79,207,0.3),0_2px_4px_-2px_rgba(90,79,207,0.2)] bg-card hover:shadow-[0_10px_15px_-3px_rgba(90,79,207,0.4),0_4px_6px_-4px_rgba(90,79,207,0.3)] hover:scale-[1.01] transition-transform cursor-pointer border border-border shadow-3xl h-full">
        {/* AI Bot Connection Status Badge */}
        <Badge
  variant="outline"
  className={`absolute top-4 right-4 text-xs py-1 px-2 border-2 ${
    hasBotId
      ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
      : 'border-red-600 text-red-600 dark:border-red-400 dark:text-red-400'
  }`}
>
  {hasBotId ? 'Bot Connected' : 'No Bot'}
</Badge>


        <CardHeader>

        <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-semibold">Interview Status</CardTitle>

          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
            {/* Interview Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Interview Name</p>
                <p className="font-medium">{hasInterviewName ? 'Behavioral' : 'Not Set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{hasDuration ? '10 minutes' : 'Not Set'}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Interview Questions</h3>
                <div className="space-y-2">
                {hasQuestions ? (
                    <ul className="list-disc pl-5">
                      <li className="text-sm">Tell me about yourself</li>
                      <li className="text-sm">What is your biggest strength?</li>
                      <li className="text-sm">Where do you see yourself in 5 years?</li>
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No questions set.</p>
                  )}
                </div>
              </div>


              {/* Overall Status */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Overall Status</h3>
                  <Badge
                    variant={isReady === 'yes' ? 'success' : isReady === 'almost' ? 'warning' : 'failure'}
                    className={`text-xs px-3 py-1 ${
                      isReady === 'yes'
                        ? 'bg-green-600 text-white'
                        : isReady === 'almost'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                      {isReady === 'yes'
                      ? 'Ready'
                      : isReady === 'almost'
                      ? 'Almost Ready'
                      : 'Setup Required'}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewStatus;