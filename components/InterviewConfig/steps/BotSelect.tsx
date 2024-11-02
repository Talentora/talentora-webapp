import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot } from '@/components/BotLibrary/CreateBot';
import { BarChart, Code, Settings, Users,ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
interface BotSelectProps {
  onCompletion: (isComplete: boolean) => void;
}

const BotSelect = ({ onCompletion }: BotSelectProps) => {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [bots, setBots] = useState<Bot[]>([
    {
      id: 1,
      name: "Alice",
      role: "Technical Recruiter",
      description: "Experienced technical recruiter specializing in software engineering roles. Focuses on both technical skills and cultural fit.",
      icon: <Code className="h-6 w-6" />,
      prompt: "You are an experienced technical recruiter..."
    },
    {
      id: 2, 
      name: "Bob",
      role: "HR Manager",
      description: "Senior HR professional with expertise in evaluating soft skills and leadership potential.",
      icon: <Users className="h-6 w-6" />,
      prompt: "You are a seasoned HR manager..."
    },
    {
      id: 3,
      name: "Carol",
      role: "Data Science Specialist",
      description: "Data science recruiter with deep knowledge of machine learning, statistics, and analytics.",
      icon: <BarChart className="h-6 w-6" />,
      prompt: "You are a data science recruitment specialist..."
    }
  ]);

  useEffect(() => {
    onCompletion(!!selectedBot);
  }, [selectedBot]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bot-select">Select Interviewer Bot</Label>
        <Select
          value={selectedBot?.id?.toString() || ''}
          onValueChange={(value) => {
            const bot = bots.find(b => b.id.toString() === value);
            setSelectedBot(bot || null);
          }}
        >
          {bots.length > 0 ? (
            <>
              <SelectTrigger>
                <SelectValue placeholder="Choose an interviewer bot" />
              </SelectTrigger>
              <SelectContent>
                {bots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id.toString()}>
                    <div className="flex items-center gap-2">
                      {bot.icon}
                      <div>
                        <div>{bot.name}</div>
                        <div className="text-sm text-gray-500">{bot.role}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </>
          ) : (
            <Link href="/bots/create" className="w-full">
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create your first bot
              </Button>
            </Link>
          )}
        </Select>
      </div>

      {selectedBot && (
        <div className="p-4 border rounded-lg relative">
          <div className="flex items-center gap-4 mb-4">
            {selectedBot.icon}
            <div>
              <h3 className="font-semibold">{selectedBot.name}</h3>
              <p className="text-gray-500">{selectedBot.role}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{selectedBot.description}</p>
          <div className="absolute top-2 right-2">
            <Link href={`/bots/${selectedBot.id}`}>
              <ArrowUpRight 
                className="text-primary hover:text-primary-dark"
                data-tooltip="Click here to modify your bot"
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotSelect