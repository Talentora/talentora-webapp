import Link from 'next/link';
import React from 'react';

const DashboardPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Account</h1>
            <div className='flex flex-col'>
                <Link href="/settings" className="text-blue-500 hover:underline">
                    Settings
                </Link>
                <Link href="/app" className="text-blue-500 hover:underline">
                    App
                </Link>
                <Link href="/dashboard" className="text-blue-500 hover:underline">
                  Dashboard
                </Link>
            </div>
            
        </div>
    );
};

export default DashboardPage;