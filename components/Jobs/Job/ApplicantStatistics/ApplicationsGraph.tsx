import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
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
import React, { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';

interface ApplicationsGraphProps {
  applicants?: ApplicantCandidate[];
  isLoading?: boolean;
  hideHeader?: boolean;
}

const ApplicationsGraph = ({ applicants = [], isLoading, hideHeader = false }: ApplicationsGraphProps) => {
  const [interval, setInterval] = useState('1 week');
  const [selectedJob, setSelectedJob] = useState('all'); // "all" means no filtering

  // Debug data to help troubleshoot
  useEffect(() => {
    console.log('ApplicationsGraph data:', { 
      applicantsCount: applicants?.length,
      isLoading, 
      firstApplicant: applicants?.[0]
    });
  }, [applicants, isLoading]);

  // Get unique job names for the filter dropdown
  const jobOptions = useMemo(() => {
    const uniqueJobs = new Set<string>();

    applicants?.forEach(applicant => {
      if (applicant?.job?.name) {
        uniqueJobs.add(applicant.job.name);
      }
    });
    return Array.from(uniqueJobs);
  }, [applicants]);

  // Filter applicants based on selected job
  const filteredApplicants = useMemo(() => {
    if (!applicants?.length) return [];
    return selectedJob === 'all' ? applicants : applicants.filter(app => app?.job?.name === selectedJob);
  }, [applicants, selectedJob]);

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!filteredApplicants?.length) return [];
    
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
      if (!applicant?.application?.created_at || !applicant?.job?.id) return;
      
      const createdAt = new Date(applicant.application.created_at);
      if (createdAt >= startDate && createdAt <= now) {
        const binDate = new Date(createdAt);
        binDate.setHours(0, 0, 0, 0);
        const daysToSubtract = binDate.getDate() % intervalInDays;
        binDate.setDate(binDate.getDate() - daysToSubtract);
        const binKey = binDate.toISOString().split('T')[0];
        const jobId = applicant.job.id;

        if (!bins[binKey]) {
          let displayDate = binDate.toLocaleString('default', { month: 'short', day: 'numeric' });
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
      if (!applicant?.job?.id) return;
      
      const jobId = applicant.job.id;
      if (!config[jobId]) {
        config[jobId] = {
          label: applicant.job.name || `Job ${jobId}`,
          color: '#5650F0',
        };
      }
    });
    return config;
  }, [filteredApplicants]);

  // Check if we have data to display
  const hasData = chartData.length > 0 && Object.keys(chartConfig).length > 0;

  // Debug output for chart data
  useEffect(() => {
    console.log('Chart data:', { 
      chartDataLength: chartData.length, 
      configKeys: Object.keys(chartConfig).length,
      hasData,
      chartConfig // Log the actual config object
    });
  }, [chartData, chartConfig, hasData]);

  // Use recharts directly if ChartContainer has issues
  const renderDirectChart = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="displayDate" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          {/* Use native recharts components instead of custom components */}
          <Tooltip />
          <Legend />
          {Object.keys(chartConfig).map(jobId => (
            <Bar 
              key={jobId} 
              dataKey={jobId} 
              name={String(chartConfig[jobId]?.label || jobId)}
              stackId="a" 
              fill={chartConfig[jobId]?.color || "#5650F0"} 
              radius={[4, 4, 0, 0]} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="p-5 w-full border border-transparent">
      {!hideHeader && (
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <CardTitle className="text-2xl">Applicants Over Time</CardTitle>
            {/* Job Filter Dropdown */}
            <SelectGroup className="flex flex-row gap-2 items-center">
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
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Skeleton className="w-full h-4/5" />
            </div>
          ) : !hasData ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              No application data available
            </div>
          ) : ( 
            // Display the direct implementation which should definitely work
            renderDirectChart()
            
            // ChartContainer approach is now commented out to ensure we get a working chart
            /*
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="displayDate" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {Object.keys(chartConfig).map(jobId => (
                    <Bar 
                      key={jobId} 
                      dataKey={jobId} 
                      stackId="a" 
                      fill={chartConfig[jobId]?.color || "#5650F0"} 
                      radius={[4, 4, 0, 0]} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            */
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsGraph;
