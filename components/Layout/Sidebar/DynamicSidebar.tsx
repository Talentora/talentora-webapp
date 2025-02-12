'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUserRole } from '@/utils/supabase/queries';
import Sidebar from '@/components/Layout/Sidebar';

export default function DynamicSidebar() {
  const [isRecruiter, setIsRecruiter] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUserRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log(user, "user in dynamic sidebar");
        if (user) {
            const role = await getUserRole(supabase, user.id);
            console.log("role in dynamic sidebar", role);
            setIsRecruiter(role === 'recruiter');
        } else {
            console.log("meoowww")
            setIsRecruiter(false);
        }
        
      } catch (error) {
        console.error("Error fetching user role:", error);
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

  if (!isRecruiter) return null;
  return (
    <aside className="fixed top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
      <Sidebar />
    </aside>
  );
}
