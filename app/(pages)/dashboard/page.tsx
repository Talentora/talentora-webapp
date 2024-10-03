import Dashboard from '@/components/Dashboard';
import { getJobs } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import Sidebar from '@/components/Sidebar';

const DashboardPage: React.FC = async () => {
  const supabase = createClient();

  const jobs = await getJobs(supabase);

  return (
    <div className="flex flex-row">
      <div className="w-1/6 py-5">
        <Sidebar />
      </div>
      <div className="w-5/6">
        <Dashboard jobs={jobs} />
      </div>
    </div>
  );
};

export default DashboardPage;
