import { useEffect, useState } from 'react';
import { getBotById, getJobInterviewConfig } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
type InterviewConfig = Tables<'job_interview_config'>;
export default function JobConfig({ jobId }: { jobId: string }) {
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [botId, setBotId] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState<Bot | null>(null);

  useEffect(() => {
    const fetchInterviewConfig = async () => {
      const config: InterviewConfig | null = await getJobInterviewConfig(jobId);
      setBotId(String(config?.bot_id));
      setInterviewConfig(config);
    };
    fetchInterviewConfig();
  }, [jobId]);
  



  useEffect(() => {
    const fetchBotInfo = async () => {
      const botData = await getBotById(String(botId));
      setBotInfo(botData);
    };
    fetchBotInfo();
  }, [botId]);
  if (!interviewConfig) return null;


  return (
    <div className="flex flex-row gap-4">
      {interviewConfig && (
        <div className="flex flex-row gap-4">
          {interviewConfig && (
            <Card className="shadow-lg rounded-lg p-4 bg-white">
              <CardHeader className="border-b border-gray-200 mb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">Interview Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">Name: {interviewConfig.interview_name}</CardDescription>
                <CardDescription className="text-gray-600">Type: {interviewConfig.type}</CardDescription>
                <CardDescription className="text-gray-600">Duration: {interviewConfig.duration}</CardDescription>
              </CardContent>
            </Card>
          )}
          {botInfo && (
            <Card className="shadow-lg rounded-lg p-4 bg-white">
              <CardHeader className="border-b border-gray-200 mb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">Bot Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">Name: {botInfo.name}</CardDescription>
                <CardDescription className="text-gray-600">Description: {botInfo.description}</CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
