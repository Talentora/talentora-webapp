import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BarChart } from 'lucide-react';
import { Tables } from '@/types/types_db';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { updateJobInterviewConfig } from '@/utils/supabase/queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

type InterviewConfig = Tables<'job_interview_config'>;
type Bot = Tables<'bots'>;

interface SetupFlags {
  hasBotId: boolean;
  hasQuestions: boolean;
  hasInterviewName: boolean;
  hasDuration: boolean;
  isReady: "yes" | "no" | "almost";
}

interface InterviewStatusProps {
  loading: boolean;
  interviewConfig: InterviewConfig | null;
  botInfo: Bot | null;
  setupFlags: SetupFlags;
  jobId: string;
}

const InterviewStatus = ({ loading, interviewConfig, botInfo, setupFlags, jobId }: InterviewStatusProps) => {
  const { hasBotId, hasQuestions, hasInterviewName, hasDuration, isReady } = setupFlags;
  const [availableBots, setAvailableBots] = useState<Bot[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [step, setStep] = useState<'select' | 'confirm'>();
  const supabase = createClient();

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
      await updateJobInterviewConfig(jobId, {
        bot_id: bot.id
      });
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
      await updateJobInterviewConfig(jobId, {
        bot_id: null
      });
      setShowDialog(false);
      setStep('select');
      window.location.reload();
    } catch (error) {
      console.error('Error removing bot:', error);
    }
  };

  return (
    <div className="flex-1">
      <Card className="p-5 border-border shadow-3xl h-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-5">
            <CardTitle className="text-xl font-semibold">Interview Status</CardTitle>
            <BarChart className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                {/* Bot Info or Placeholder */}
                <div className="space-y-2">
                  {botInfo ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 p-2 rounded-md" onClick={handleOpenDialog}>
                        <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                        </div>
                        <div className="flex-1">
                          <div className=" items-center gap-2">
                            <h3 className="font-medium">{botInfo.name || 'Unnamed Scout'}</h3>
                            
                            <span className="text-sm text-muted-foreground">{botInfo.description || 'No description available'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                        <span>No Bot</span>
                      </div>
                      <p className="text-muted-foreground text-center">
                        No bot configured yet.<br />
                        Select a bot to begin interviews.
                      </p>
                      <Button variant="outline" onClick={handleOpenDialog}>Select a Bot</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Setup Flags */}
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>AI Bot Connected</span>
                    <Badge variant={hasBotId ? "success" : "failure"}>{hasBotId ? "Yes" : "No"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Interview Questions</span>
                    <Badge variant={hasQuestions ? "success" : "failure"}>{hasQuestions ? "Yes" : "No"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Interview Name</span>
                    <Badge variant={hasInterviewName ? "success" : "failure"}>{hasInterviewName ? "Yes" : "No"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Duration Set</span>
                    <Badge variant={hasDuration ? "success" : "failure"}>{hasDuration ? "Yes" : "No"}</Badge>
                  </div>
                </div>
              </div>

              {/* Overall Status */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Overall Status</h3>
                  <Badge 
                    variant={isReady === "yes" ? "success" : isReady === "almost" ? "warning" : "failure"} 
                    className={`text-base px-4 py-1 ${
                      isReady === "yes" ? "bg-green-700" : 
                      isReady === "almost" ? "bg-orange-700" : "bg-red-700"
                    }`}
                  >
                    {isReady === "yes" ? "Ready" : isReady === "almost" ? "Almost Ready" : "Setup Required"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bot Selector Dialog */}
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
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 text-white">
                    </div>
                    <span>{bot.name}</span>
                    <span className="text-sm text-muted-foreground">{bot.description || 'No description available'}</span>
                    {bot.id === botInfo?.id && <span> (Current)</span>}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Warning: Active Interviews in Progress</DialogTitle>
                <DialogDescription>
                  This job posting currently has active interviews in progress. Changing the interview bot
                  may result in inconsistent candidate experiences. Are you sure you want to proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => selectedBot && confirmBotChange(selectedBot)}>
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

export default InterviewStatus;
