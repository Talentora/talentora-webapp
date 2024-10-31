'use client';

import {
  Bot,
  Code,
  Users,
  BarChart,
  Briefcase,
  GraduationCap,
  Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

interface Bot {
  id: number;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

const iconOptions = {
  Code,
  Users,
  BarChart,
  Briefcase,
  GraduationCap,
  Stethoscope
};

export default function BotSettings({ bot }: { bot: Bot }) {
  return (

    
    <Dialog>
        {/* Dialog Trigger */}
      <DialogTrigger asChild>
        <Card className="flex flex-row cursor-pointer hover:shadow-lg transition-shadow bg-foreground border border-gray-200 rounded-lg p-5">
          <CardHeader className="w-1/3">
            <div className="w-full flex items-center justify-center mb-4 min-h-[100px]">{bot.icon}</div>
          </CardHeader>

          <CardContent className="w-2/3 flex flex-col gap-2">
            <CardTitle className="text-center">{bot.name}</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              <strong>{bot.role}</strong>
            </CardDescription>
            <p className="text-center text-gray-600 dark:text-gray-300">
              {bot.description}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {bot.icon}
            <span>{bot.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">About this Bot</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {bot.description}
            </p>
          </div>
          <div className="flex justify-end">
            <Button>Join a sample call and meet your interviewer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
