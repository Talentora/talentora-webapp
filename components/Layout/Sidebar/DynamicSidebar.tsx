'use client';

import Sidebar from '@/components/Layout/Sidebar';


export default function DynamicSidebar() {

    return (
        <aside className="top-0 left-0 h-full w-64 min-w-[16rem] max-w-[20rem] z-[100]">
            <Sidebar />
        </aside>
    );
}
