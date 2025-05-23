'use client';

import {
  Bot,
  Code,
  Users,
  BarChart,
  Briefcase,
  GraduationCap,
  Stethoscope,
  MoreVertical,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScoutInfo } from '@/components/ScoutLibrary/ScoutInfo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { iconOptions } from '@/components/ScoutLibrary/CreateScout/ScoutDetails';

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
import { deletescout, updateScout } from '@/utils/supabase/queries';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
type scout = Tables<'bots'>;


interface ScoutSettingsProps {
  scout: scout;
  onscoutDeleted: (scoutId: number) => void;
  onscoutUpdated: (scout: scout | null) => void;
  onEditScout: (scout: scout) => void;
}

export default function ScoutSettings({ scout, onscoutDeleted, onscoutUpdated, onEditScout }: ScoutSettingsProps) {
  const handleDeletescout = async () => {
    try {
      await deletescout(scout.id);
      onscoutDeleted(scout.id);
      toast.success('Scout deleted successfully');
    } catch (error) {
      console.error('Failed to delete scout:', error);
      toast.error('Failed to delete scout');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditScout(scout);
  };

  return (
    <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-[#5650F0]/50 bg-card flex flex-row relative">
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background">
            <DropdownMenuItem onClick={handleEditClick}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeletescout}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardHeader className="w-1/3">
        <div className="w-full flex items-center justify-center mb-4 min-h-[100px]">
          {/* <scout className="h-10 w-10" /> */}
          {iconOptions[scout.icon as keyof typeof iconOptions]}
        </div>
      </CardHeader>
      <CardContent className="w-2/3 flex flex-col gap-2">
        <CardTitle className="text-center">{scout.name}</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-300">
          <strong>{scout.role}</strong>
        </CardDescription>
        <p className="text-center text-gray-600 dark:text-gray-300">
          {scout.description}
        </p>
      </CardContent>
    </Card>
  );
}
