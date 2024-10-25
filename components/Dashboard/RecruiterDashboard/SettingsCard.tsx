import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsCard() {
  return (
    <Card className="p-5 border border-gray-300 mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Settings</CardTitle>
        <Settings className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Manage your account and preferences
        </p>
        <Link href="/settings">
          <Button className="w-full" variant="outline">
            Open Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}