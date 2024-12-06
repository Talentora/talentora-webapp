import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SettingsCard = () => {
  return (
    <div>
    <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-primary-dark/50 bg-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Settings</CardTitle>
          <Link href="/settings">
            <Settings className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Configure your recruiting preferences and settings
          </p>
          <Link href="/settings">
            <Button className="w-full" variant="outline">
              Open Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsCard;
