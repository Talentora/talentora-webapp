"use client"
import Dashboard from './Dashboard';
import { Job } from '@/types/greenhouse';

interface DashboardPageProps {
  jobs: Job[];
}

export default function DashboardPage({ jobs }: DashboardPageProps) {
  return <Dashboard dashboardData={{ initialJobs: jobs }} />;
}

