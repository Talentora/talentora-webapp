import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
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
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';

interface ApplicationsGraphProps {
  applicants?: ApplicantCandidate[];
  isLoading?: boolean;
  hideHeader?: boolean;
}

const ApplicationsGraph = ({ applicants = [], isLoading, hideHeader = false }: ApplicationsGraphProps) => {
  const [interval, setInterval] = useState('1 week');
  const [selectedJob, setSelectedJob] = useState('all'); // "all" means no filtering

  // Get unique job names for the filter dropdown
  const jobOptions = useMemo(() => {
    const uniqueJobs = new Set<string>();
    applicants.forEach(applicant => {
      uniqueJobs.add(applicant.job.name);
    });
    return Array.from(uniqueJobs);
  }, [applicants]);

  // Filter applicants based on selected job
  const filteredApplicants = useMemo(() => {
    return selectedJob === 'all' ? applicants : applicants.filter(app => app.job.name === selectedJob);
  }, [applicants, selectedJob]);

  // Process data for the chart
  const chartData = useMemo(() => {
    const now = new Date();
    const timeRangeInDays = 90; // Default time range to 3 months
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
      let displayDate = d.toLocaleString('default', { month: 'short', day: 'numeric' });

      if (interval === '1 month') {
        displayDate = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      }

      bins[binKey] = { date: binKey, displayDate };
    }

    // Fill bins with data
    filteredApplicants.forEach(applicant => {
      const createdAt = new Date(applicant.application.applied_at);
      if (createdAt >= startDate && createdAt <= now) {
        const binDate = new Date(createdAt);
        binDate.setHours(0, 0, 0, 0);
        const daysToSubtract = binDate.getDate() % intervalInDays;
        binDate.setDate(binDate.getDate() - daysToSubtract);
        const binKey = binDate.toISOString().split('T')[0];
        const jobId = applicant.job.id;

        if (!bins[binKey]) {
          let displayDate = binKey;
          if (interval === '1 month') {
            displayDate = binDate.toLocaleString('default', { month: 'short', year: 'numeric' });
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
  }, [filteredApplicants, interval]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    filteredApplicants.forEach(applicant => {
      const jobId = applicant.job.id;
      config[jobId] = {
        label: applicant.job.name || `Job ${jobId}`,
        color: '#5650F0',
      };
    });
    return config;
  }, [filteredApplicants]);

  return (
    <Card className="p-5 -mt-6 w-screen border-none">
      {!hideHeader && (
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl">Applicants Over Time</CardTitle>
            {/* Job Filter Dropdown */}
            <SelectGroup className="flex flex-row gap-2 items-center">
              <SelectLabel>Job:</SelectLabel>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger aria-label="Job">
                  <SelectValue placeholder="Select Job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobOptions.map((job) => (
                    <SelectItem key={job} value={job}>{job}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectGroup>
          </div>

          {/* Interval and Time Range Selectors */}
          <div className="flex gap-4">
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
            <div className="flex justify-center items-center h-full">
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <BarChart data={chartData} width={500} height={300}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="displayDate" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map(jobId => (
                <Bar key={jobId} dataKey={jobId} stackId="a" fill="#5650F0" radius={[0, 0, 4, 4]} />
              ))}
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ApplicationsGraph;
