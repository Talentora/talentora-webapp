'use client';

import ApplicantDashboard from '@/components/Dashboard/ApplicantDashboard';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardPageProps {
  serverRole: string | null;
}

const DashboardPage = () => {
  const { user   } = useUser();
  const router = useRouter();
  // Use server role as primary source, fallback to client-side metadata
  const role = user?.data?.user_metadata?.role;

  useEffect(() => {
    if (role === 'recruiter') {
      router.push('/applicants');
    }
  }, [role, router]);

  return (
    <div>
      {role === 'applicant' && <ApplicantDashboard />}
    </div>
  );
};

export default DashboardPage;
