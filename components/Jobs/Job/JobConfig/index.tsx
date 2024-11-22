// components/Jobs/Job/JobConfig.tsx
import { useEffect, useState } from 'react';
import { getBotById, getJobInterviewConfig } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';
import { Button } from '@/components/ui/button';
import InterviewSettings from './InterviewSettings';
import InterviewBot from './InterviewBot';
import InterviewStatus from './InterviewStatus';
import Link from 'next/link';
import { DialogHeader, DialogTitle, DialogDescription, DialogContent, Dialog } from '@/components/ui/dialog';
import InterviewQuestions from './InterviewQuestions';
import AssessmentCount from './AssessmentCount';
import InviteApplicants from './InviteApplicants';

type InterviewConfig = Tables<'job_interview_config'>;
type Bot = Tables<'bots'>;

interface SetupFlags {
  hasBotId: boolean;
  hasQuestions: boolean;
  hasInterviewName: boolean;
  hasDuration: boolean;
  isReady: "yes" | "no" | "almost";
}

export default function JobConfig({ jobId, applicants }: { jobId: string, applicants: Tables<'applicants'>[] }) {
  const [loading, setLoading] = useState(true);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [botInfo, setBotInfo] = useState<Bot | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [setupFlags, setSetupFlags] = useState<SetupFlags>({
    hasBotId: false,
    hasQuestions: false,
    hasInterviewName: false,
    hasDuration: false,
    isReady: "no"
  });

  const updateSetupFlags = (config: InterviewConfig | null) => {
    if (!config) {
      setSetupFlags({
        hasBotId: false,
        hasQuestions: false,
        hasInterviewName: false,
        hasDuration: false,
        isReady: "no"
      });
      return;
    }

    const hasBotId = !!config.bot_id;
    const hasQuestions = !!config.interview_questions;
    const hasInterviewName = !!config.interview_name;
    const hasDuration = !!config.duration;

    const isReady = (hasBotId && hasQuestions && hasInterviewName && hasDuration) ? "yes" : 
                    (!hasBotId && !hasQuestions && !hasInterviewName && !hasDuration) ? "no" : "almost";

    setSetupFlags({
      hasBotId,
      hasQuestions,
      hasInterviewName,
      hasDuration,
      isReady
    });
  };

  const fetchData = async () => {
    try {
      const config = await getJobInterviewConfig(jobId);
      setInterviewConfig(config);
      updateSetupFlags(config);
      
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

  useEffect(() => {
    fetchData();
  }, [jobId]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 h-full">
        <InterviewSettings 
          loading={loading} 
          interviewConfig={interviewConfig} 
          setShowSetupDialog={setShowSetupDialog} 
          jobId={jobId} 
        />
        <InterviewBot 
          loading={loading} 
          botInfo={botInfo} 
          jobId={jobId} 
          interviewConfig={interviewConfig} 
        />
        <InterviewStatus 
          loading={loading} 
          interviewConfig={interviewConfig} 
          botInfo={botInfo}
          setupFlags={setupFlags}
        />
        <InterviewQuestions 
          loading={loading} 
          interviewConfig={interviewConfig} 
          jobId={jobId}
        />
        </div>
        {setupFlags.isReady === "yes" && (
          <div className="gap-5 grid grid-cols-2">
            <div className="flex flex-col col-span-1">
            <AssessmentCount 
              loading={loading} 
              interviewConfig={interviewConfig} 
              jobId={jobId}

            />
            </div>
            <div className="flex flex-col col-span-1">
              <InviteApplicants 
                jobId={jobId}
              applicants={applicants}
              />
            </div>
          </div>
        )}
      

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