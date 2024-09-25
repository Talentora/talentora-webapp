import Dashboard from './Dashboard';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

interface DashboardPageProps {
  jobs: Job[];
}

export default function DashboardPage({
  jobs,
}: DashboardPageProps) {
  return <Dashboard dashboardData={{ initialJobs: jobs }}/>;
}
