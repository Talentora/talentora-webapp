import Link from 'next/link';
import {
  BriefcaseIcon,
  HomeIcon,
  UserIcon,
  UsersIcon,
  Bot,
  ClipboardListIcon,
  SettingsIcon
} from 'lucide-react';

const Page = () => {
  return (
    <div className="p-4">
      <nav className="space-y-2">
        <Link
          className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
          href="#"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
          href="/interviews"
        >
          <UserIcon className="h-5 w-5" />
          <span>Interviews</span>
        </Link>
        <Link
          className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
          href="/jobs"
        >
          <BriefcaseIcon className="h-5 w-5" />
          <span>Jobs</span>
        </Link>
        <Link
          className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
          href="/bot"
        >
          <Bot className="h-5 w-5" />
          <span>Bot</span>
        </Link>
        <Link
          className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
          href="/onboarding"
        >
          <ClipboardListIcon className="h-5 w-5" />
          <span>Onboarding</span>
        </Link>
        <Link
          className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
          href="dashboard/settings"
        >
          <SettingsIcon className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Page;
