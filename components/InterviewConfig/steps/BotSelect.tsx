import { useState, useEffect } from 'react';
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
  Bot,
  Code,
  Settings,
  Users,
  ArrowUpRight,
  Plus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
interface BotSelectProps {
  onCompletion: (isComplete: boolean) => void;
}
import { Tables } from '@/types/types_db';
type Bot = Tables<'bots'>;
import { useScouts } from '@/hooks/useScouts';
import CreateBot from '@/components/ScoutLibrary/CreateScout';
import { updateJobInterviewConfig } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';
import { getScouts } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';

const BotSelect = ({ onCompletion }: BotSelectProps) => {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = window.location.pathname;
  const mergedId = pathname.split('/')[2];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch bots
        const botsData = await getScouts();
        setBots(botsData || []);

        // Fetch existing configuration
        const supabase = createClient();
        const { data: config, error } = await supabase
          .from('job_interview_config')
          .select('bot_id')
          .eq('job_id', mergedId)
          .single();

        if (error) throw error;

        // If there's a configured bot, set it as selected
        if (config?.bot_id) {
          const existingBot = botsData?.find(bot => bot.id === config.bot_id);
          if (existingBot) {
            setSelectedBot(existingBot);
            setIsSaved(true);
            onCompletion(true);
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load existing configuration.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [mergedId, onCompletion]);

  const handleBotSelection = (value: string | null) => {
    if (!value) {
      setSelectedBot(null);
      setIsSaved(false);
      onCompletion(false);
      return;
    }
    
    const bot = bots.find((b) => b.id.toString() === value);
    setSelectedBot(bot || null);
    setIsSaved(false);
    onCompletion(false);
  };

  const clearSelection = () => {
    setSelectedBot(null);
    setIsSaved(false);
    onCompletion(false);
  };

  if (loading)
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  async function updateJobConfig(botId: string) {
    const { data, error } = await updateJobInterviewConfig(mergedId, {
      bot_id: Number(botId),
      interview_name: null,
      type: null,
      duration: null
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update interview bot. Please try again.',
        variant: 'destructive'
      });
      setIsSaved(false);
      onCompletion(false);
    } else {
      toast({
        title: 'Success',
        description: 'Interview bot updated successfully.',
        variant: 'default'
      });
      setIsSaved(true);
      onCompletion(true);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
       
      
        {bots.length > 0 ? (
          <>
           <div className="flex justify-between items-center">
          <Label htmlFor="bot-select">Select Interviewer Bot</Label>
          {selectedBot && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearSelection}
              className="text-gray-500 hover:text-red-500"
            >
              Clear Selection
            </Button>
            )}
          </div>
          <Select
            value={selectedBot?.id?.toString() || ''}
              onValueChange={handleBotSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an interviewer bot" />
              </SelectTrigger>
              <SelectContent>
                {bots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id.toString()}>
                    <div className="flex items-center gap-2 ">
                      <Bot />
                      <div>
                        <div>{bot.name}</div>
                        <div className="text-sm text-gray-500">{bot.role}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-semibold">No Ora Scouts found</h1>
            <Link href="/bot">
              <Button>Create your first Ora Scout</Button>
            </Link>
          </div>
        )}
      </div>

      {selectedBot && (
        <div className="p-4 border rounded-lg relative">
          <div className="flex items-center gap-4 mb-4">
            <Bot />
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

      <div className="flex justify-end">
        <Button
          className="w-40"
          onClick={() => updateJobConfig(selectedBot?.id?.toString() || '')}
          disabled={!selectedBot}
        >
          {isSaved ? 'Bot Saved' : 'Save Bot Selection'}
        </Button>
      </div>
    </div>
  );
};

export default BotSelect;
