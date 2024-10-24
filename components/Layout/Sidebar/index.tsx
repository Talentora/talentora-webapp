import Link from 'next/link';
import {
  BriefcaseIcon,
  Users,
  UserIcon,
  Bot,
  ClipboardListIcon,
  SettingsIcon,
  HomeIcon
} from 'lucide-react';

const Page = () => {
  return (
    <div className="flex min-h-screen sticky top-0">
      {/* Sidebar */}
      <div className="bg-gradient-to-b from-accent to-primary-dark p-4 w-full min-h-screen">
        <nav className="space-y-2 mt-10">
          
          <Link
            className="flex items-center space-x-2 text-gray-100 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded"
            href="/dashboard"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            className="flex items-center space-x-2 text-gray-100 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded"
            href="/applicants"
          >
            <UserIcon className="h-5 w-5" />
            <span>Applicants</span>
          </Link>
          <Link
            className="flex items-center space-x-2 text-gray-100 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded"
            href="/jobs"
          >
            <BriefcaseIcon className="h-5 w-5" />
            <span>Jobs</span>
          </Link>
          <Link
            className="flex items-center space-x-2 text-gray-100 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded"
            href="/bot"
          >
            <Bot className="h-5 w-5" />
            <span>Bot</span>
          </Link>
          <Link
            className="flex items-center space-x-2 text-gray-100 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded"
            href="/applicants"
          >
            <Users className="h-5 w-5" />
            <span>Applicants</span>
          </Link>
          <Link
            className="flex items-center space-x-2 text-gray-100 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded"
            href="settings/onboarding"
          >
            <ClipboardListIcon className="h-5 w-5" />
            <span>Onboarding</span>
          </Link>
          <Link
            className="flex items-center space-x-2 text-gray-100 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded"
            href="/settings"
          >
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      
    </div>
  );
};

export default Page;
