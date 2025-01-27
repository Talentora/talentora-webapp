// components/Jobs/Job/InterviewStatus.tsx
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
      <Card className="p-5 border-border shadow-3xl h-full">
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
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Overall Status</h3>
                  <Badge 
                    variant={isReady === "yes" ? "success" : isReady === "almost" ? "warning" : "failure"} 
                    className={`text-base px-4 py-1 ${
                      isReady === "yes" ? "bg-green-700" : 
                      isReady === "almost" ? "bg-orange-700" : "bg-red-700"
                    }`}
                  >
                    {isReady === "yes" ? "Ready" : isReady === "almost" ? "Almost Ready" : "Setup Required"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewStatus;