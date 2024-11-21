import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Settings } from 'lucide-react';
import { Job } from '@/types/merge';
import Link from 'next/link';
import { Tables } from '@/types/types_db';
import { useEffect, useState } from 'react';
import { getBotById, getJobInterviewConfig } from '@/utils/supabase/queries';
import { Loader2 } from 'lucide-react';

interface BotConfigProps {
  job: Job;
}

export function BotConfig({ job }: BotConfigProps) {
  const [loading, setLoading] = useState(true);
  const [botInfo, setBotInfo] = useState<Tables<'bots'> | null>(null);
  const [interviewConfig, setInterviewConfig] = useState<Tables<'job_interview_config'> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await getJobInterviewConfig(job.id);
        setInterviewConfig(config);
        
        if (config?.bot_id) {
          const botData = await getBotById(String(config.bot_id));
          setBotInfo(botData);
        }
      } catch (error) {
        console.error('Error fetching bot data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [job.id]);

  return (
    <Link href={`/jobs/${job.id}/settings`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Interview Bot</CardTitle>
            <Bot className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : botInfo ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {botInfo.icon && (
                  <img 
                    src={botInfo.icon} 
                    alt={botInfo.name || 'Bot icon'} 
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-medium">{botInfo.name || 'Unnamed Bot'}</h3>
                  <p className="text-sm text-muted-foreground">{botInfo.role || 'No role set'}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {botInfo.description || 'No description available'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <Bot className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                No bot configured yet.<br />
                Click to set up your interview bot.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
