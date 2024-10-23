import Link from 'next/link';
import {
  BriefcaseIcon,
  Users,
  UserIcon,
  Bot,
  ClipboardListIcon,
  SettingsIcon,
} from 'lucide-react';

const Page = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="bg-[#1E1768] p-4 w-64 min-h-screen">
        <nav className="space-y-2">
          
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
            href="/onboarding"
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

      {/* Main content */}
      <div className="flex-1 p-4">
        {/* Add your main content here */}
      </div>
    </div>
  );
};

export default Page;
