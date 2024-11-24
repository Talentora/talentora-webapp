import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { UserIcon } from 'lucide-react';

const CompletedAssessmentsCard = () => {
  return (
    <Card className="border bg-foreground p-5 border-gray-300 rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          AI Interviews Completed
          <span className="text-xs text-red-500 ml-2">(Update)</span>
        </CardTitle>
        <Link href="/interviews">
          <UserIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">56</div>
        <p className="text-xs text-muted-foreground">
          12 upcoming this week
        </p>
      </CardContent>
    </Card>
  );
};

export default CompletedAssessmentsCard;