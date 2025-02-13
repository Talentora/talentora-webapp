'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { useUser } from '@/hooks/useUser';

interface DynamicSidebarProps {
    user_id?: string; // Optional, or use `user_id: string` if you know it'll always be provided
}

export default function DynamicSidebar( user_id: DynamicSidebarProps ) {
    const [isRecruiter, setIsRecruiter] = useState(false);

  // Assume you have a way to get the user ID (e.g., a custom hook or context)
//   useEffect(() => {
//     async function fetchUser() {
//       const res = await fetch(`/api/users/getUserRole/`); // or wherever you get the user info
//       const data = await res.json();
//       if (data?.user?.id) setUserId(data.user.id);
//     }
//     fetchUser();
//   }, []);

    const { user } = useUser();
    console.log("user in dynamicsidebar", user);
    useEffect(() => {
    if (!user_id) return;
    async function fetchRole() {
        try {
        const res = await fetch(`/api/users/getUserRole?userId=${user.data?.id}`);
        const data = await res.json();
        console.log("role in dynamic sidebar", data);
        
        setIsRecruiter(data.role === 'recruiter');
        } catch (error) {
        console.error("Error fetching user role:", error);
        setIsRecruiter(false);
        }
    }
    fetchRole();
    }, []);

  if (!isRecruiter) return null;
  return (
    <aside className="fixed top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
      <Sidebar />
    </aside>
  );
}
