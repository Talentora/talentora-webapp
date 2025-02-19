// components/Jobs/Job/InterviewBot.tsx
import { Tables } from '@/types/types_db';
import Link from 'next/link';
import { Loader2, Bot, ChevronDown } from 'lucide-react';
import {
  Brain,
  Code,
  Cpu,
  Database,
  Globe,
  Laptop,
  MessageSquare,
  Monitor,
  Network,
  Server
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { updateJobInterviewConfig } from '@/utils/supabase/queries';
import { useRouter } from 'next/navigation';
import CreateScout from '@/components/ScoutLibrary/CreateScout';

function LucideIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'Bot':
      return <Bot />;
    case 'Brain':
      return <Brain />;
    case 'Code':
      return <Code />;
    case 'Cpu':
      return <Cpu />;
    case 'Database':
      return <Database />;
    case 'Globe':
      return <Globe />;
    case 'Laptop':
      return <Laptop />;
    case 'MessageSquare':
      return <MessageSquare />;
    case 'Monitor':
      return <Monitor />;
    case 'Network':
      return <Network />;
    case 'Server':
      return <Server />;
    default:
      return <Bot />;
  }
}

type Bot = Tables<'bots'>;

interface InterviewBotProps {
  loading: boolean;
  botInfo: Bot | null;
  jobId: string;
  interviewConfig: Tables<'job_interview_config'> | null;
}

const InterviewBot = ({
  loading,
  botInfo,
  jobId,
  interviewConfig
}: InterviewBotProps) => {
  const [availableBots, setAvailableBots] = useState<Bot[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [step, setStep] = useState<'select' | 'confirm'>();
  const supabase = createClient();

  const router = useRouter();

  useEffect(() => {
    async function fetchBots() {
      const { data: bots } = await supabase
        .from('bots')
        .select('*')
        .order('name');
      if (bots) setAvailableBots(bots);
    }
    fetchBots();
  }, [supabase]);

  const handleBotChange = async (bot: Bot) => {
    setSelectedBot(bot);
    setStep('confirm');
  };

  const confirmBotChange = async (bot: Bot) => {
    try {
      await updateJobInterviewConfig(jobId, { bot_id: bot.id });
      setShowDialog(false);
      setStep('select');
      window.location.reload();
    } catch (error) {
      console.error('Error updating bot:', error);
    }
  };

  const handleOpenDialog = () => {
    setStep('select');
    setShowDialog(true);
  };

  const removeBot = async () => {
    try {
      await updateJobInterviewConfig(jobId, { bot_id: null });
      setShowDialog(false);
      setStep('select');
      window.location.reload();
    } catch (error) {
      console.error('Error removing bot:', error);
    }
  };

  return (
    <div className="flex-1">
      <div className="p-5  shadow-3xl h-full">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl font-semibold">Ora Scout</CardTitle>
              <button
                className="px-3 py-1 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
                onClick={() => router.push(`/scout-test/${jobId}`)}
              >
                Test Bot
              </button>
            </div>
            <Bot className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : botInfo ? (
            <div className="space-y-4">
              <div
                className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 p-2 rounded-md"
                onClick={handleOpenDialog}
              >
                {botInfo.icon && (
                  <Link href={`/bot?jobId=${jobId}`}>
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
                      <LucideIcon icon={botInfo.icon} />
                    </div>
                  </Link>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {botInfo.name
                        ? botInfo.name.charAt(0).toUpperCase() +
                          botInfo.name.slice(1)
                        : 'Unnamed Scout'}
                    </h3>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {botInfo.role
                      ? botInfo.role.charAt(0).toUpperCase() +
                        botInfo.role.slice(1)
                      : 'No role set'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {botInfo.description || 'No description available'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <Bot className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                No bot configured yet.
                <br />
                Select a bot to begin interviews.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          {step === 'select' ? (
            <>
              <DialogHeader>
                <DialogTitle>Select Interview Bot</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {availableBots.map((bot) => (
                  <div
                    key={bot.id}
                    className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer rounded-md"
                    onClick={() => handleBotChange(bot)}
                  >
                    <LucideIcon icon={bot.icon || 'Bot'} />
                    <span>{bot.name}</span>
                    {bot.id === botInfo?.id && <span> (Current)</span>}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>
                  Warning: Active Interviews in Progress
                </DialogTitle>
                <DialogDescription>
                  This job posting currently has active interviews in progress.
                  Changing the interview bot may result in inconsistent
                  candidate experiences. Are you sure you want to proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedBot && confirmBotChange(selectedBot)}
                >
                  Yes, Change Bot
                </Button>
                {selectedBot?.id !== botInfo?.id && (
                  <Button variant="outline" onClick={removeBot}>
                    Remove Bot
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewBot;
