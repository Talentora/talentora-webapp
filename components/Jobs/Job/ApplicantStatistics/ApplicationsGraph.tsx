'use client';

import * as React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationsGraphProps {
  applicants?: ApplicantCandidate[];
  isLoading?: boolean;
  hideHeader?: boolean;
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

const DATE_RANGES = {
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '1y': 365,
} as const;

const BUCKET_SIZES = {
  '1d': 1,
  '7d': 7,
  '30d': 30,
} as const;

export function ApplicationsGraph({ applicants = [], isLoading,hideHeader = false }: ApplicationsGraphProps) {
  const [dateRange, setDateRange] = React.useState<keyof typeof DATE_RANGES>('90d');
  const [bucketSize, setBucketSize] = React.useState<keyof typeof BUCKET_SIZES>('1d');

  console.log('isLoading', isLoading);
  console.log('applicants', applicants);

  const chartData = React.useMemo(() => {
    const dailyData = new Map();
    const days = DATE_RANGES[dateRange];
    const bucket = BUCKET_SIZES[bucketSize];
    
    // Initialize all buckets with 0
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + bucket)) {
      dailyData.set(d.toISOString().split('T')[0], 0);
    }
    
    applicants.forEach(applicant => {
      const createdAt = applicant.created_at;
      if (!createdAt) {
        console.error(`No created_at for applicant: ${applicant.id}`);
        return;
      }

      const timestamp = Date.parse(createdAt);
      if (isNaN(timestamp)) {
        console.error(`Invalid date for applicant: ${createdAt}`);
        return;
      }
      
      const date = new Date(timestamp);
      if (date < startDate || date > endDate) {
        console.warn(`Date out of range: ${date}`);
        return;
      }
      
      // Find the bucket this date belongs to
      const bucketDate = new Date(date);
      bucketDate.setDate(bucketDate.getDate() - (bucketDate.getDate() % bucket));
      const dateStr = bucketDate.toISOString().split('T')[0];
      
      const count = dailyData.get(dateStr) || 0;
      dailyData.set(dateStr, count + 1);
    });

    // Log the dailyData to see the processed data
    console.log('Daily Data:', Array.from(dailyData.entries()));

    return Array.from(dailyData.entries())
      .map(([date, applications]) => ({
        date,
        applications
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [applicants, dateRange, bucketSize]);

  // Log the final chartData to see what is being passed to the chart
  console.log('Chart Data:', chartData);

  const total = React.useMemo(
    () => ({
      applications: applicants.length
    }),
    [applicants]
  );

  return (
    <Card>
      {!hideHeader && (
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Applications over Time</CardTitle>
          <CardDescription className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as keyof typeof DATE_RANGES)}>
              <SelectTrigger className="w-32 bg-background border-muted-foreground/20 hover:bg-accent hover:text-accent-foreground">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d" className="hover:bg-accent">
                  <span className="font-medium">30 days</span>
                </SelectItem>
                <SelectItem value="90d" className="hover:bg-accent">
                  <span className="font-medium">90 days</span>
                </SelectItem>
                <SelectItem value="180d" className="hover:bg-accent">
                  <span className="font-medium">180 days</span>
                </SelectItem>
                <SelectItem value="1y" className="hover:bg-accent">
                  <span className="font-medium">1 year</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">Grouped by</span>
            <Select value={bucketSize} onValueChange={(v) => setBucketSize(v as keyof typeof BUCKET_SIZES)}>
              <SelectTrigger className="w-32 bg-background border-muted-foreground/20 hover:bg-accent hover:text-accent-foreground">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d" className="hover:bg-accent">
                  <span className="font-medium">Day</span>
                </SelectItem>
                <SelectItem value="7d" className="hover:bg-accent">
                  <span className="font-medium">Week</span>
                </SelectItem>
                <SelectItem value="30d" className="hover:bg-accent">
                  <span className="font-medium">Month</span>
                </SelectItem>
              </SelectContent>
            </Select>
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
      )}
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto"
        >
          <ResponsiveContainer >
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <BarChart data={chartData} layout="horizontal" stackOffset="sign">
                <XAxis type="category" dataKey="date" />
                <YAxis type="number" />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="applications"
                  fill="hsl(var(--chart-1))"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
