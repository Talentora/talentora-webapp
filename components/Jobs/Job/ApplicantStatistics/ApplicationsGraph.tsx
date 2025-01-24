'use client';

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ApplicantCandidate } from '@/types/merge';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useMemo } from 'react';

interface ApplicationsGraphProps {
  applicants?: ApplicantCandidate[];
  isLoading?: boolean;
  hideHeader?: boolean;
}

const ApplicationsGraph = ({ applicants = [], isLoading, hideHeader = false }: ApplicationsGraphProps) => {
  const [timeRange, setTimeRange] = useState('3 months');
  const [interval, setInterval] = useState('1 week');

  const chartData = React.useMemo(() => {
    const now = new Date();
    const timeRangeInDays = {
      '1 month': 30,
      '3 months': 90,
      '6 months': 180,
      '1 year': 365
    }[timeRange] || 90;
    

    const intervalInDays = {
      '1 day': 1,
      '1 week': 7,
      '1 month': 30
    }[interval] || 7;

    
    const startDate = new Date(now.getTime() - (timeRangeInDays * 24 * 60 * 60 * 1000));
    const bins: { [key: string]: { date: string; displayDate: string; [key: string]: number | string } } = {};

    // Create empty bins
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + intervalInDays)) {
      const binKey = d.toISOString().split('T')[0];
      let displayDate = binKey;
      
      // Format display date based on interval
      if (interval === '1 month') {
        displayDate = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      } else if (interval === '1 week') {
        displayDate = d.toLocaleString('default', { month: 'short', day: 'numeric' });
      } else {
        displayDate = d.toLocaleString('default', { month: 'short', day: 'numeric' });
      }
      
      bins[binKey] = { date: binKey, displayDate };
    }

    // Fill bins with data
    applicants.forEach(applicant => {
      const createdAt = new Date(applicant.application.applied_at);
      if (createdAt >= startDate && createdAt <= now) {
        // Find the appropriate bin
        const binDate = new Date(createdAt);
        binDate.setHours(0, 0, 0, 0);
        // Round down to nearest interval
        const daysToSubtract = binDate.getDate() % intervalInDays;
        binDate.setDate(binDate.getDate() - daysToSubtract);
        
        const binKey = binDate.toISOString().split('T')[0];
        const jobId = applicant.job.id;

        if (!bins[binKey]) {
          let displayDate = binKey;
          if (interval === '1 month') {
            displayDate = binDate.toLocaleString('default', { month: 'short', year: 'numeric' });
          } else if (interval === '1 week') {
            displayDate = binDate.toLocaleString('default', { month: 'short', day: 'numeric' });
          } else {
            displayDate = binDate.toLocaleString('default', { month: 'short', day: 'numeric' });
          }
          bins[binKey] = { date: binKey, displayDate };
        }
        
        if (!bins[binKey][jobId]) {
          bins[binKey][jobId] = 0;
        }
        (bins[binKey][jobId] as number) += 1;
      }
    });

    return Object.values(bins).sort((a, b) => a.date.localeCompare(b.date));
  }, [applicants, timeRange, interval]);

  console.log("chartData", chartData);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    applicants.forEach(applicant => {
      const jobId = applicant.job.id;
      if (!config[jobId]) {
        // Get last 3 digits of job ID and convert to number between 0-360
        const lastDigits = parseInt(jobId.slice(-3)) || 0;
        const hue = (lastDigits % 360);
        config[jobId] = {
          label: applicant.job.name || `Job ${jobId}`,
          color: `rgba(90,79,207)`,
        };
      }
    });
    return config;
  }, [applicants]);

  return (
    <Card className="rounded-lg hover:bg-accent/50 transition-colors p-5 bg-white dark:bg-transparent shadow-[0_4px_6px_-1px_rgba(90,79,207,0.3),0_2px_4px_-2px_rgba(90,79,207,0.2)] bg-card hover:shadow-[0_10px_15px_-3px_rgba(90,79,207,0.4),0_4px_6px_-4px_rgba(90,79,207,0.3)] hover:scale-[1.01] transition-transform cursor-pointer border border-border shadow-3xl h-full">
      {!hideHeader && (
        <CardHeader>
          
          <CardTitle>Applicants Over Time</CardTitle>
          {/* <CardDescription>Stacked Bar Chart</CardDescription> */}
          <div className="flex justify-between items-center">
            <SelectGroup className="flex flex-row gap-2 items-center">
              <SelectLabel>Time Range:</SelectLabel>
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value)}>
                <SelectTrigger aria-label="Time Range">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 year">1 Year</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="3 months">3 Months</SelectItem>
                  <SelectItem value="1 month">1 Month</SelectItem>
                </SelectContent>
              </Select>
            </SelectGroup>
            <SelectGroup className="flex flex-row gap-2 items-center">
              <SelectLabel>Interval:</SelectLabel>
              <Select value={interval} onValueChange={(value) => setInterval(value)}>
                <SelectTrigger aria-label="Interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 day">1 Day</SelectItem>
                  <SelectItem value="1 week">1 Week</SelectItem>
                  <SelectItem value="1 month">1 Month</SelectItem>
                </SelectContent>
              </Select>
            </SelectGroup>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <ChartContainer config={chartConfig}>
          {isLoading ? (
            <div className="ml-2flex justify-center items-center h-full">
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <BarChart data={chartData} width={500} height={300}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map(jobId => (
                <Bar
                  key={jobId}
                  dataKey={jobId}
                  stackId="a"
                  fill={chartConfig[jobId].color}
                  radius={[0, 0, 4, 4]}
                />
              ))}
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ApplicationsGraph;