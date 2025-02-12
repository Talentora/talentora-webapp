'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // client-side Supabase client
import { getUserRole } from '@/utils/supabase/queries';
import Sidebar from '@/components/Layout/Sidebar';
import { useUser } from '@/hooks/useUser';

export default function DynamicSidebar() {
  const [isRecruiter, setIsRecruiter] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const { user } = useUser();
  
  
    async function fetchUserRole() {
      if (user) {
        const isRecruiter = user?.data?.user_metadata?.role === "applicant" ? false : true;

        setIsRecruiter(isRecruiter);
      } else {
        setIsRecruiter(false);
      }
    }

    // Check role on mount
    fetchUserRole();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Only render the sidebar if the user is a recruiter
  if (!isRecruiter) return null;
  return (
    <aside className="fixed top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
      <Sidebar />
    </aside>
  );
}
