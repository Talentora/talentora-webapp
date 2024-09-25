import Dashboard from './Dashboard';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

interface DashboardPageProps {
  jobs: Job[];
  onDeleteJob: (jobId: number) => Promise<void>;
}

export default function DashboardPage({
  jobs,
  onDeleteJob
}: DashboardPageProps) {
  return <Dashboard dashboardData={{ initialJobs: jobs, onDeleteJob }}/>;
}
