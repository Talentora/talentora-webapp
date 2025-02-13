'use client';

import { useState, useEffect } from 'react';
import RecruiterDashboard from '@/components/Dashboard/RecruiterDashboard';
import ApplicantDashboard from '@/components/Dashboard/ApplicantDashboard';
import { useUser } from '@/hooks/useUser';

interface DashboardPageProps {
  serverRole: string | null;
}

const DashboardPage = ({ serverRole }: DashboardPageProps) => {
  const { user } = useUser();
  const [role, setRole] = useState<string | null>(serverRole);

  useEffect(() => {
    if (!serverRole && user?.data?.user_metadata?.role) {
      setRole(user.data.user_metadata.role);
    }
  }, [serverRole, user]);

  setRole(user?.data?.user_metadata.role);

  if (!role) {
    return <div>Loading...</div>; // or a loading spinner
  }

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