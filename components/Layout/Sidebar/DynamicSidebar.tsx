'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUserRole } from '@/utils/supabase/queries';
import { useUser } from '@/hooks/useUser'; // Assuming this is your custom hook
import Sidebar from '@/components/Layout/Sidebar';

export default function DynamicSidebar() {
  const [isRecruiter, setIsRecruiter] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const supabase = createClient();

    async function fetchUserRole() {
      if (user) {
        const recruiterStatus = user?.data?.user_metadata?.role === 'applicant' ? false : true;
        setIsRecruiter(recruiterStatus);
      } else {
        setIsRecruiter(false);
      }
    }

    fetchUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user]);

  if (!isRecruiter) return null;
  return (
    <aside className="fixed top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
      <Sidebar />
    </aside>
  );
}
