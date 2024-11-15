'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  BarChart,
  Users,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Code,
  Plus,
  ChevronDown,
  Volume2,
  Bot,
  Brain,
  Cpu,
  Database,
  Globe,
  Laptop,
  MessageSquare,
  Monitor,
  Network,
  Server
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Textarea } from '../ui/textarea';
import { createBot } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';
import { useCompany } from '@/hooks/useCompany';
import { useToast } from '@/components/Toasts/use-toast';
type Bot = Tables<'bots'>;

interface CreateBotProps {
  bots: Bot[];
}

const iconOptions = {
  Bot: <Bot className="h-12 w-12" />,
  Brain: <Brain className="h-12 w-12" />,
  Code: <Code className="h-12 w-12" />,
  Cpu: <Cpu className="h-12 w-12" />,
  Database: <Database className="h-12 w-12" />,
  Globe: <Globe className="h-12 w-12" />,
  Laptop: <Laptop className="h-12 w-12" />,
  MessageSquare: <MessageSquare className="h-12 w-12" />,
  Monitor: <Monitor className="h-12 w-12" />,
  Network: <Network className="h-12 w-12" />,
  Server: <Server className="h-12 w-12" />
};

const voiceOptions = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'female' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'female' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', gender: 'male' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', gender: 'female' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', gender: 'male' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', gender: 'male' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', gender: 'male' }
];

export default function CreateBot() {
// { bots }: CreateBotProps
  const [isOpen, setIsOpen] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    role: '',
    icon: 'Bot',
    prompt: '',
    voiceId: voiceOptions[0].id
  });

  const { company } = useCompany();
  const companyId = company?.id;
  const { toast } = useToast();

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBot({
        name: newBot.name,
        role: newBot.role,
        description: newBot.description,
        prompt: newBot.prompt,
        company_id: companyId,
        voice_id: newBot.voiceId,
        icon: newBot.icon
      });
      setNewBot({
        name: '',
        description: '',
        role: '',
        icon: 'Bot',
        prompt: '',
        voiceId: voiceOptions[0].id
      });
      setIsOpen(false);
      toast({
        title: 'Success',
        description: 'Bot created successfully'
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to create bot:', error);
      toast({
        title: 'Error',
        description: 'Failed to create bot',
        variant: 'destructive'
      });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                onChange={(e) =>
                  setNewBot({ ...newBot, description: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="voice">Voice</Label>
              <Select
                value={newBot.voiceId}
                onValueChange={(value) =>
                  setNewBot({ ...newBot, voiceId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.gender})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      <div className="flex items-center gap-2">
                        {iconOptions[icon as keyof typeof iconOptions]}
                        <span>{icon}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Enter Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="e.g. You are an experienced DevOps recruiter. Focus on asking questions about CI/CD pipelines, infrastructure as code, containerization with Docker/Kubernetes, cloud platforms (AWS/Azure/GCP), monitoring/logging, and automation. Evaluate both technical skills and problem-solving approach. Be thorough but friendly. Ask for specific examples of projects and challenges they've overcome."
                className="min-h-[150px]"
                value={newBot.prompt}
                onChange={(e) =>
                  setNewBot({ ...newBot, prompt: e.target.value })
                }
                required
              />
              <div className="flex justify-between gap-2">
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 bg-primary-dark text-white"
                    onClick={() => {
                      /* Add speech logic */
                    }}
                  >
                    <Volume2 className="h-4 w-4" />
                    Listen
                  </Button>
                </div>
                <div className="flex items-center gap-2">
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
