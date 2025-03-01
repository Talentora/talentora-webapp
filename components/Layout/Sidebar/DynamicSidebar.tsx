'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { useUser } from '@/hooks/useUser';


export default function DynamicSidebar() {
    const [isRecruiter, setIsRecruiter] = useState(false);

    return (
        <aside className="top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
            <Sidebar />
        </aside>
    );
}