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
import { useBots } from '@/hooks/useBots';
import CreateBot from '@/components/BotLibrary/CreateBot';
import { updateJobInterviewConfig } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';

const BotSelect = ({ onCompletion }: BotSelectProps) => {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const { toast } = useToast();
  const { bots, loading } = useBots();
  const pathname = window.location.pathname;
  const mergedId = pathname.split('/')[2]; // Extract ID from /jobs/{id}/settings

  useEffect(() => {
    onCompletion(!!selectedBot);
  }, [selectedBot, onCompletion]);

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
    } else {
      toast({
        title: 'Success',
        description: 'Interview bot updated successfully.',
        variant: 'default'
      });
      onCompletion(true);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bot-select">Select Interviewer Bot</Label>
        <Select
          value={selectedBot?.id?.toString() || ''}
          onValueChange={(value) => {
            const bot = bots.find((b) => b.id.toString() === value);
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
                    <div className="flex items-center gap-2 ">
                      {/* {bot.icon} */}
                      <Bot />
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
            <CreateBot />
          )}
        </Select>
      </div>

      {selectedBot && (
        <div className="p-4 border rounded-lg relative">
          <div className="flex items-center gap-4 mb-4">
            {/* {selectedBot.icon} */}
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
          Save Bot Selection
        </Button>
      </div>
    </div>
  );
};

export default BotSelect;
