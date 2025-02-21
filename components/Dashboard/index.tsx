'use client';

import RecruiterDashboard from '@/components/Dashboard/RecruiterDashboard';
import ApplicantDashboard from '@/components/Dashboard/ApplicantDashboard';
import { useUser } from '@/hooks/useUser';

interface DashboardPageProps {
  serverRole: string | null;
}

const DashboardPage = ({ serverRole }: DashboardPageProps) => {
  const { user } = useUser();
  // Use server role as primary source, fallback to client-side metadata
  const role = serverRole || user?.data?.user_metadata?.role;

  return (
    <div>
      {role === 'recruiter' && (
        <div className="flex flex-row">
          <div>
            <RecruiterDashboard />
          </div>
        </div>
      )}

      {role === 'applicant' && <ApplicantDashboard />}
    </div>
  );
};

export default DashboardPage;
