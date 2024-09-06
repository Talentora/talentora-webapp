import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface RoboRecruiterConfigProps {
  toggleSection: (section: string) => void;
  visible: boolean;
}

import Link from 'next/link';

export function RoboRecruiterConfig({
  toggleSection,
  visible
}: RoboRecruiterConfigProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="text-xl font-semibold">
            RoboRecruiter Settings
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Link
            href="/InterviewConfig"
            className="w-full bg-primary-400 p-5 rounded-2xl"
          >
            Customize Your RoboRecruiter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
