'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { useUser } from '@/hooks/useUser';

export default function DynamicSidebar() {
    const [isRecruiter, setIsRecruiter] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        async function fetchRole() {
            if (!user?.data?.id || user?.data?.user_metadata.role === "applicant") {
              setIsRecruiter(false);
              return;
            }

            try {
                const res = await fetch(`/api/users/getUserRole?userId=${user.data.id}`);
                const data = await res.json();
                
                setIsRecruiter(data.role === 'recruiter');
            } catch (error) {
                console.error("Error fetching user role:", error);
                setIsRecruiter(false);
            }
        }


        fetchRole();
    }, [user]);

    if (!isRecruiter) return null;

    return (
        <aside className="top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
            <Sidebar />
        </aside>
    );
}
