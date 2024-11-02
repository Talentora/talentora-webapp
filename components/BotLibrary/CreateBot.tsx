'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Users, Briefcase, GraduationCap, Stethoscope, Code, Plus, ChevronDown, Volume2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Textarea } from '../ui/textarea';
import { createBot } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';
import { useCompany } from '@/hooks/useCompany';
type Bot = Tables<'bots'>;


interface CreateBotProps {
  bots: Bot[];
}

const iconOptions = {
  Code: <Code className="h-12 w-12" />,
  Users: <Users className="h-12 w-12" />,
  BarChart: <BarChart className="h-12 w-12" />,
  Briefcase: <Briefcase className="h-12 w-12" />,
  GraduationCap: <GraduationCap className="h-12 w-12" />,
  Stethoscope: <Stethoscope className="h-12 w-12" />
};

export default function CreateBot({ bots }: CreateBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    role: '',
    icon: 'Code',
    prompt: ''
  });

  const { company } = useCompany();
  const companyId = company?.id;

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    // const id = Math.max(0, ...bots.map((bot) => bot.id)) + 1;
    try {
      await createBot({
          // id,
          name: newBot.name,
          role: newBot.role,
          description: newBot.description,
          // icon: iconOptions[newBot.icon as keyof typeof iconOptions],
          prompt: newBot.prompt,
          company_id: companyId
      });
      setNewBot({ name: '', description: '', role: '', icon: 'Code', prompt: '' });
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to create bot:', error);
    }
  
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen} >
        <DialogTrigger asChild>
          <Button className="w-full bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" /> Create New Bot
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[75vw]">
          <DialogHeader>
            <DialogTitle>Bot Configuration</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBot} className="space-y-4">
          <div>
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={newBot.name}
                placeholder="e.g Alice"
                onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                required
              />
            </div>
           
          
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={newBot.role}
                placeholder="e.g Technical Recruiter"
                onChange={(e) => setNewBot({ ...newBot, role: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newBot.description}
                placeholder="e.g Technical recruiter who specializes in hiring DevOps engineers"
                onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
                required
              />
            </div>

            {/* <div>
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
            </div> */}
             <div className="space-y-2">
              <Label htmlFor="prompt">Enter Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="e.g. You are an experienced DevOps recruiter. Focus on asking questions about CI/CD pipelines, infrastructure as code, containerization with Docker/Kubernetes, cloud platforms (AWS/Azure/GCP), monitoring/logging, and automation. Evaluate both technical skills and problem-solving approach. Be thorough but friendly. Ask for specific examples of projects and challenges they've overcome."
                className="min-h-[150px]"
                value={newBot.prompt}
                onChange={(e) => setNewBot({ ...newBot, prompt: e.target.value })}
                required
              />
              <div className="flex justify-between gap-2">
                <div>
                <Button 
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 bg-primary-dark text-white"
                  onClick={() => {/* Add speech logic */}}
                >
                  <Volume2 className="h-4 w-4" />
                  Listen
                </Button>
                </div>
                <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Choose Voice
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background">
                    <DropdownMenuItem>Male Voice 1</DropdownMenuItem>
                    <DropdownMenuItem>Male Voice 2</DropdownMenuItem>
                    <DropdownMenuItem>Female Voice 1</DropdownMenuItem>
                    <DropdownMenuItem>Female Voice 2</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline">Mix</Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Speed/Emotion
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background">
                    <DropdownMenuItem>Slow</DropdownMenuItem>
                    <DropdownMenuItem>Normal</DropdownMenuItem>
                    <DropdownMenuItem>Fast</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Happy</DropdownMenuItem>
                    <DropdownMenuItem>Neutral</DropdownMenuItem>
                    <DropdownMenuItem>Serious</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Create Bot</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}