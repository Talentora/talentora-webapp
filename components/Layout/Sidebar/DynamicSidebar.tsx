'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { useUser } from '@/hooks/useUser';

export default function DynamicSidebar() {
    const [isRecruiter, setIsRecruiter] = useState(false);

    const { user } = useUser();

    async function fetchRole(userId: string) {
        try {
            const res = await fetch(`/api/users/getUserRole?userId=${userId}`);
            const data = await res.json();
            console.log("role in dynamic sidebar", data);
            
            setIsRecruiter(data.role === 'recruiter');
        } catch (error) {
            console.error("Error fetching user role:", error);
            setIsRecruiter(false);
        }
    }

    useEffect(() => {
        if (user.data?.id) {
            fetchRole(user.data.id);
        } else {
            setIsRecruiter(false);
        }
    }, [user]);

    return (
        <aside className={`fixed top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100] ${isRecruiter ? '' : 'hidden'}`}>
            <Sidebar />
        </aside>
    );
}


