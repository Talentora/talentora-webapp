import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon } from 'lucide-react';

export default function StatisticsCard() {
  return (
    <Card className="border p-5 border-gray-300 rounded-lg shadow-sm bg-primary-background">
      <div className="flex justify-between">
        {/* Active Job Titles */}
        <StatItem
          icon={<UserIcon className="h-8 w-8 text-muted-foreground" />}
          title="Active Job Titles"
          value="1,234"
          subtext="+21% from last month"
        />

        <div className="w-px bg-gray-300 mx-4"></div>

        {/* AI Interviews Completed */}
        <StatItem
          icon={<UserIcon className="h-8 w-8 text-muted-foreground" />}
          title="AI Interviews Completed"
          value="56"
          subtext="12 upcoming this week"
        />
      </div>
    </Card>
  );
}

function StatItem({ icon, title, value, subtext }: { icon: React.ReactNode; title: string; value: string; subtext: string }) {
  return (
    <div className="flex-1">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center mr-4">
          <Link href="/interviews">{icon}</Link>
        </div>
        <div className="flex flex-col flex-1 ml-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{subtext}</p>
        </div>
      </CardHeader>
    </div>
  );
}