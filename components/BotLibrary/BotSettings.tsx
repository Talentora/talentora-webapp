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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { iconOptions } from './CreateBot/BotDetails';

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
import { deleteBot, updateBot } from '@/utils/supabase/queries';
import CreateBot from './CreateBot';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
type Bot = Tables<'bots'>;


interface BotSettingsProps {
  bot: Bot;
  onBotDeleted: (botId: number) => void;
  onBotUpdated: (bot: Bot) => void;
}

export default function BotSettings({ bot, onBotDeleted, onBotUpdated }: BotSettingsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDeleteBot = async () => {
    try {
      await deleteBot(bot.id);
      onBotDeleted(bot.id);
      toast.success('Bot deleted successfully');
    } catch (error) {
      console.error('Failed to delete bot:', error);
      toast.error('Failed to delete bot');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowEditDialog(true);
  };

  return (
    <>
      <Dialog>
        {/* Dialog Trigger */}
        <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-[#5650F0]/50 bg-card flex flex-row relative">
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background">
                <DropdownMenuItem onClick={handleDeleteBot}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardHeader className="w-1/3">
            <div className="w-full flex items-center justify-center mb-4 min-h-[100px]">
              {/* <Bot className="h-10 w-10" /> */}
              {iconOptions[bot.icon as keyof typeof iconOptions]}
            </div>
          </CardHeader>
          <DialogTrigger asChild>

          <CardContent className="w-2/3 flex flex-col gap-2">
            <CardTitle className="text-center">{bot.name}</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              <strong>{bot.role}</strong>
            </CardDescription>
            <p className="text-center text-gray-600 dark:text-gray-300">
              {bot.description}
            </p>
          </CardContent>
          </DialogTrigger>

        </Card>

      {/* Dialog Content */}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <BotInfo bot={bot} /> 
      </DialogContent>
      </Dialog>

      {/* Edit Bot Dialog */}
      {showEditDialog && (
        <CreateBot 
          isEdit={true}
          existingBot={bot}
          onClose={() => setShowEditDialog(false)}
          onBotUpdated={onBotUpdated}
        />
      )}
    </>
  );
}
