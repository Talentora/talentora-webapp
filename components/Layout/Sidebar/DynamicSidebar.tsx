'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';

export default function DynamicSidebar() {
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Assume you have a way to get the user ID (e.g., a custom hook or context)
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/user/getUserRole'); // or wherever you get the user info
      const data = await res.json();
      if (data?.user?.id) setUserId(data.user.id);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function fetchRole() {
      try {
        const res = await fetch(`/api/getUserRole?userId=${userId}`);
        const data = await res.json();
        console.log("role in dynamic sidebar", data.role);
        setIsRecruiter(data.role === 'recruiter');
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsRecruiter(false);
      }
    }
    fetchRole();
  }, [userId]);

  if (!isRecruiter) return null;
  return (
    <aside className="fixed top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
      <Sidebar />
    </aside>
  );
}
