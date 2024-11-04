'use client';

import {
  Bot,
  Code,
  Users,
  BarChart,
  Briefcase,
  GraduationCap,
  Stethoscope,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BotInfo } from './BotInfo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { Tables } from '@/types/types_db';
import { deleteBot } from '@/utils/supabase/queries';
type Bot = Tables<'bots'>;

const iconOptions = {
  Code,
  Users,
  BarChart,
  Briefcase,
  GraduationCap,
  Stethoscope
};

export default function BotSettings({ bot }: { bot: Bot }) {

  const handleDeleteBot = async () => {
    await deleteBot(bot.id);
  };


  return (

    
    <Dialog>
        {/* Dialog Trigger */}
      <DialogTrigger asChild>
        <Card className="flex flex-row cursor-pointer hover:shadow-lg transition-shadow bg-foreground border border-gray-200 rounded-lg p-5 relative">
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background">
                <DropdownMenuItem onClick={async () => {
                  await handleDeleteBot();
                  window.location.reload();
                }}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardHeader className="w-1/3">
            <div className="w-full flex items-center justify-center mb-4 min-h-[100px]">
              <Bot className="h-10 w-10" />
            </div>
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
        <BotInfo bot={bot} />
      </DialogContent>
    </Dialog>
  );
}
