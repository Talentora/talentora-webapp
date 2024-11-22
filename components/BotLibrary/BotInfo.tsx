import { Button } from '@/components/ui/button';
import { Tables } from '@/types/types_db';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PolarAngleAxis, PolarGrid, Radar } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { RadarChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
type Bot = Tables<'bots'>;
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
interface BotInfoProps {
  bot: Bot;
}

import { iconOptions } from './CreateBot/BotDetails'
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import { useState } from 'react';
import { Table } from '../ui/table';
import { updateBot } from '@/utils/supabase/queries';
import { Skeleton } from '../ui/skeleton';

export const BotInfo: React.FC<BotInfoProps> = ({ bot }) => {

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const chartData = [
    { emotion: 'speed', value: bot.emotion.speed },
    { emotion: 'anger', value: bot.emotion.anger },
    { emotion: 'curiosity', value: bot.emotion.curiosity },
    { emotion: 'positivity', value: bot.emotion.positivity },
    { emotion: 'sadness', value: bot.emotion.sadness },
    { emotion: 'surprise', value: bot.emotion.surprise }
  ];

  const [jobInterviewConfigs, setJobInterviewConfigs] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobInterviewConfigs = async () => {
      try {
        const supabase = createClient();
        const { data: jobIds, error: jobIdsError } = await supabase
          .from('job_interview_config')
          .select('job_id')
          .eq('bot_id', bot.id);

        if (jobIdsError) {
          console.error('Error fetching job interview configurations:', jobIdsError);
          return;
        }
        console.log("jobIds", jobIds)
        const jobData = await Promise.all(jobIds.map(async (jobId) => {
          const jobResponse = await fetch(`/api/jobs/${jobId.job_id}`);
          if (!jobResponse.ok) {
            console.error(`Failed to fetch job with id ${jobId}`);
            return null;
          }
          return jobResponse.json();
        }));

        console.log("jobData", jobData)
        setJobInterviewConfigs(jobData);
        setIsLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching job interview configurations:', err);
      }
    };

    fetchJobInterviewConfigs();
  }, [bot.id]);

  console.log(chartData)
  
  const handleEditBot = async (updatedBot: Bot) => {
    try {
      await updateBot(updatedBot);
    } catch (error) {
      console.error('Failed to update bot:', error);
    }
  };

  return (
    <div className="gap-5">
      <div className="flex items-center gap-5 mb-4">
        {iconOptions[bot.icon as keyof typeof iconOptions]}
        <span className="text-lg font-semibold">{bot.name}</span>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">About this Bot:</h3>
          <p className="text-gray-600 dark:text-gray-300">{bot.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold mb-2">Role:</h3>
          <p className="text-gray-600 dark:text-gray-300">{bot.role}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Prompt:</h3>
          <pre className="text-gray-600 dark:text-gray-300">{JSON.stringify(bot.prompt ? bot.prompt : 'No prompt available')}</pre>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2">Jobs Using This Bot:</h3>
          <div className="overflow-x-auto">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <BotJobTable jobInterviewConfigs={jobInterviewConfigs} isLoading={isLoading} />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold mb-2">Voice:</h3>
            <p className="text-gray-600 dark:text-gray-300">{bot.voice?.name}</p>
          </div>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Emotion Radar Chart</CardTitle>
             
            </CardHeader>
            <CardContent className="pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square "
              >
                <RadarChart data={chartData} scale={{ type: 'linear', min: 1, max: 5 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <PolarAngleAxis dataKey="emotion" />
                  <PolarGrid />
                  <Radar
                    dataKey="value"
                    fill="var(--color-speed)"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div>
          <Button onClick={() => handleEditBot(bot)}>Edit Bot</Button>
        </div>
      </div>
    </div>
  );
};



function BotJobTable({ jobInterviewConfigs, isLoading }: { jobInterviewConfigs: any[], isLoading: boolean }): JSX.Element {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Is Active
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {jobInterviewConfigs.length > 0 ? (
          jobInterviewConfigs.map((job, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{job.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={job.status === 'OPEN' ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"}>
                  {job.status === 'OPEN' ? 'Yes' : 'No'}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
              No jobs using this bot.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
