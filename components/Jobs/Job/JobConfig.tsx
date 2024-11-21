// components/Jobs/Job/JobConfig.tsx
import { useEffect, useState } from 'react';
import { getBotById, getJobInterviewConfig } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';
import { Button } from '@/components/ui/button';
import InterviewSettings from './InterviewSettings'; // New component
import InterviewBot from './InterviewBot'; // New component
import InterviewStatus from './InterviewStatus'; // New component
import Link from 'next/link';
import { DialogHeader, DialogTitle, DialogDescription, DialogContent, Dialog } from '@/components/ui/dialog';
type InterviewConfig = Tables<'job_interview_config'>;
type Bot = Tables<'bots'>;

export default function JobConfig({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(true);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [botInfo, setBotInfo] = useState<Bot | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await getJobInterviewConfig(jobId);
        setInterviewConfig(config);
        
        if (config?.bot_id) {
          const botData = await getBotById(String(config.bot_id));
          setBotInfo(botData);
        } else {
          setShowSetupDialog(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  return (
    <>
      <div className="flex flex-row gap-4 h-full">
        <InterviewSettings loading={loading} interviewConfig={interviewConfig} setShowSetupDialog={setShowSetupDialog} jobId={jobId} />
        <InterviewBot loading={loading} botInfo={botInfo} jobId={jobId} interviewConfig={interviewConfig} />
        <InterviewStatus loading={loading} interviewConfig={interviewConfig} botInfo={botInfo} />
      </div>

      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Interview Setup Required</DialogTitle>
            <DialogDescription>
              This role hasn't been configured for AI interviews yet. Set up the interview process to start screening candidates automatically.
            </DialogDescription>
            <br />
            <DialogDescription>
              Currently, we've pulled relevant information from your job posting. If you'd like to setup Talentora's conversational AI assessment, click here
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Link href={`/jobs/${jobId}/settings`}>
              <Button>Configure AI Interview</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}