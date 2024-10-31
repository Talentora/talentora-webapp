'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Users, Briefcase, GraduationCap, Stethoscope, Code, Plus } from 'lucide-react';

interface Bot {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface CreateBotProps {
  bots: Bot[];
  setBots: React.Dispatch<React.SetStateAction<Bot[]>>;
}

const iconOptions = {
  Code: <Code className="h-12 w-12" />,
  Users: <Users className="h-12 w-12" />,
  BarChart: <BarChart className="h-12 w-12" />,
  Briefcase: <Briefcase className="h-12 w-12" />,
  GraduationCap: <GraduationCap className="h-12 w-12" />,
  Stethoscope: <Stethoscope className="h-12 w-12" />
};

export default function CreateBot({ bots, setBots }: CreateBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    role: '',
    icon: 'Code'
  });

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.max(0, ...bots.map((bot) => bot.id)) + 1;
    setBots([
      ...bots,
      {
        id,
        name: newBot.name,
        description: newBot.description,
        icon: iconOptions[newBot.icon as keyof typeof iconOptions]
      }
    ]);
    setNewBot({ name: '', description: '', role: '', icon: 'Code' });
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" /> Create New Bot
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New AI Interviewer Bot</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBot} className="space-y-4">
            <div>
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={newBot.name}
                onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newBot.description}
                onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={newBot.icon}
                onValueChange={(value) => setNewBot({ ...newBot, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(iconOptions).map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Create Bot</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}