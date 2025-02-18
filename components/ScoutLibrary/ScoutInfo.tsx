import { Button } from '@/components/ui/button';
import { Tables } from '@/types/types_db';
import { PolarAngleAxis, PolarGrid, Radar } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { RadarChart } from 'recharts';
type Bot = Tables<'bots'>;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { iconOptions } from '@/components/ScoutLibrary/CreateScout/ScoutDetails';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';
interface BotInfoProps {
  scout: Bot;
}

export const ScoutInfo: React.FC<BotInfoProps> = ({ scout }) => {
  const [jobInterviewConfigs, setJobInterviewConfigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobInterviewConfigs = async () => {
      try {
        const supabase = createClient();
        const { data: jobIds, error: jobIdsError } = await supabase
          .from('job_interview_config')
          .select('job_id')
          .eq('bot_id', scout.id);

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
  }, [scout.id]);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  if (!scout.emotion) return null;

  // emotion and voice are Json objects
  const emotion = scout.emotion as { [key: string]: number };
  const voice = scout.voice as { [key: string]: string };

  const chartData = [
    { emotion: 'speed', value: emotion.speed },
    { emotion: 'anger', value: emotion.anger },
    { emotion: 'curiosity', value: emotion.curiosity },
    { emotion: 'positivity', value: emotion.positivity },
    { emotion: 'sadness', value: emotion.sadness },
    { emotion: 'surprise', value: emotion.surprise }
  ];



  



  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-center gap-5 mb-4">
        {iconOptions[scout.icon as keyof typeof iconOptions]}
        <span className="text-lg font-semibold">{scout.name}</span>
      </div>
      
      <div className="space-y-6">
        {/* About Section */}
        <section>
          <h3 className="font-semibold mb-2">About this Bot:</h3>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
            {scout.description}
          </p>
        </section>

        {/* Role Section */}
        <section className="flex items-center gap-2">
          <h3 className="font-semibold">Role:</h3>
          <p className="text-gray-600 dark:text-gray-300 break-words">
            {scout.role}
          </p>
        </section>

        {/* Prompt Section */}
        <section>
          <h3 className="font-semibold mb-2">Prompt:</h3>
          <pre className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg overflow-x-hidden">
            {scout.prompt ? JSON.stringify(scout.prompt, null, 2) : 'No prompt available'}
          </pre>
        </section>

        {/* Jobs Section */}
        <section className="space-y-4">
          <h3 className="font-semibold mb-2">Jobs Using This Bot:</h3>
          <div className="overflow-x-auto">
            <div className="shadow rounded-lg border border-gray-200">
              <BotJobTable jobInterviewConfigs={jobInterviewConfigs} isLoading={isLoading} />
            </div>
          </div>
        </section>

        {/* Voice and Emotions Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Voice:</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {voice?.name || 'No voice selected'}
            </p>
          </div>
          
          {/* <Card>
            <CardHeader className="pb-4 border-none">
              <CardTitle className="text-lg font-semibold">Emotion Radar Chart</CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-md"
              >
                <RadarChart data={chartData}>
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
          </Card> */}
        </section>

      
      </div>
    </div>
  );
};

// Update the BotJobTable component to match the new styling
function BotJobTable({ jobInterviewConfigs, isLoading }: { jobInterviewConfigs: any[], isLoading: boolean }): JSX.Element {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }



  return (
    <div className="overflow-hidden">
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
            isLoading ? (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-900">
                  Loading...
                </td>
              </tr>
            ) : jobInterviewConfigs.map((job, index) => (
              <tr key={index} className="hover:bg-gray-100 cursor-pointer" onClick={() => {
                router.push(`/jobs/${job.id}`);
              }}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 break-words">{job.name}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    job.status === 'OPEN' 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {job.status === 'OPEN' ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-900">
                No jobs using this bot.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
