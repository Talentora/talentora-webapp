import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Brain, Cpu, Database, Globe, Laptop, MessageSquare, Monitor, Network, Server } from 'lucide-react';

export const iconOptions = {
  Bot: <Bot className="h-12 w-12" />,
  Brain: <Brain className="h-12 w-12" />,
  Cpu: <Cpu className="h-12 w-12" />,
  Database: <Database className="h-12 w-12" />,
  Globe: <Globe className="h-12 w-12" />,
  Laptop: <Laptop className="h-12 w-12" />,
  MessageSquare: <MessageSquare className="h-12 w-12" />,
  Monitor: <Monitor className="h-12 w-12" />,
  Network: <Network className="h-12 w-12" />,
  Server: <Server className="h-12 w-12" />
};

interface BotDetailsProps {
  newBot: any;
  setNewBot: (bot: any) => void;
  onNext: () => void;
}

export function BotDetails({ newBot, setNewBot, onNext }: BotDetailsProps) {
  return (
    <div>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ora Scout Name</Label>
          <Input
            id="name"
            value={newBot.name}
            placeholder="e.g. Bob"
            onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            placeholder="e.g Technical Recruiter"
            value={newBot.role}
            onChange={(e) => setNewBot({ ...newBot, role: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="e.g. I am a technical recruiter..."
            value={newBot.description}
            onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
            required
          />
        </div>
    
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select
            value={newBot.icon}
            onValueChange={(value) => setNewBot({ ...newBot, icon: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(iconOptions).map(([name, icon]) => (
                <SelectItem key={name} value={name}>
                  <div className="flex items-center">
                    {icon}
                    <span className="ml-2">{name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={onNext}
            className="bg-primary-dark text-white"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
} 