'use client';

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend
} from '@/components/ui/chart';
import { ApplicantCandidate } from '@/types/merge';

interface ApplicationsGraphProps {
  applicants?: ApplicantCandidate[];
}

const chartConfig = {
  applications: {
    label: 'Applications',
    color: 'blue'
  }
} satisfies ChartConfig;

export function ApplicationsGraph({ applicants = [] }: ApplicationsGraphProps) {
  const chartData = useMemo(() => {
    const monthlyData = new Map();
    
    applicants.forEach(applicant => {
      const date = new Date(applicant.created_at);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      
      const count = monthlyData.get(monthYear) || 0;
      monthlyData.set(monthYear, count + 1);
    });

    // Convert to array and sort by date
    return Array.from(monthlyData.entries())
      .map(([month, applications]) => ({
        month,
        applications
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Last 6 months
  }, [applicants]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications over Time</CardTitle>
        <CardDescription>
          Showing total applications for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <ChartLegend content={<ChartLegendContent />} />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="applications"
              type="natural"
              fill="var(--color-applications)"
              fillOpacity={0.4}
              stroke="var(--color-applications)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
