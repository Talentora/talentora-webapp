'use client';

import * as React from 'react';
import { Bar, BarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ApplicantCandidate } from '@/types/merge';

interface ApplicationsGraphProps {
  applicants?: ApplicantCandidate[];
}

const chartConfig = {
  views: {
    label: 'Applications',
  },
  applications: {
    label: 'Applications',
    color: 'hsl(var(--chart-1))',
  }
} satisfies ChartConfig;

export function ApplicationsGraph({ applicants = [] }: ApplicationsGraphProps) {
  const chartData = React.useMemo(() => {
    const dailyData = new Map();
    
    applicants.forEach(applicant => {
      // Handle potential invalid dates by checking if created_at exists
      if (!applicant.created_at) return;

      // Parse date and validate
      const timestamp = Date.parse(applicant.created_at);
      if (isNaN(timestamp)) return;
      
      const date = new Date(timestamp);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = dailyData.get(dateStr) || 0;
      dailyData.set(dateStr, count + 1);
    });

    // Convert to array and sort by date
    return Array.from(dailyData.entries())
      .map(([date, applications]) => ({
        date,
        applications
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-90); // Last 90 days
  }, [applicants]);

  const total = React.useMemo(
    () => ({
      applications: chartData.reduce((acc, curr) => acc + curr.applications, 0)
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Applications over Time</CardTitle>
          <CardDescription>
            Showing total applications for the last 90 days
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              Total Applications
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.applications.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            index="date"
            categories={['applications']}
            colors={['blue']}
            valueFormatter={(value: number) => value.toString()}
            showLegend={false}
            yAxisWidth={48}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
