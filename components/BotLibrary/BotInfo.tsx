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

  console.log(chartData)
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
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
      </div>
    </div>
  );
};



