import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SettingsCard = () => {
  return (
    <div>
    <Card className="p-5 border border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="ml-4 pt-2 text-xl font-semibold">Settings</CardTitle>
          <Link href="/settings">
            <Settings className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </Link>
        </CardHeader>
        <CardContent>
          <p className="ml-4 text-sm -mt-4 mb-8">
            Configure your recruiting preferences and settings
          </p>
          <Link href="/settings">
            <Button className="w-full">
              Open Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsCard;
