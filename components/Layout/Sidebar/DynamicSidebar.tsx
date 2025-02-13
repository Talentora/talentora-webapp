'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { useUser } from '@/hooks/useUser';

export default function DynamicSidebar() {
    const [isRecruiter, setIsRecruiter] = useState(false);

    const { user } = useUser();

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

    if (!isRecruiter) return null;
    return (
        <aside className="fixed top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
            <Sidebar />
        </aside>
    );
}


