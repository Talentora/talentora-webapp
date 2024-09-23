import Link from 'next/link';
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Account</h1>
      <div className="flex flex-col">
        <Link href="/account/settings" className="text-blue-500 hover:underline">
          Settings
        </Link>
        <Link href="/bot" className="text-blue-500 hover:underline">
          Bot
        </Link>
        <Link href="/jobs" className="text-blue-500 hover:underline">
          Jobs
        </Link>
        <Link href="/interviews" className="text-blue-500 hover:underline">
          Interviews
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
