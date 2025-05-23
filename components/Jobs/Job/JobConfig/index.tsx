'use client';
import { useEffect, useState, useCallback } from 'react';
import { getscoutById, getJobInterviewConfig } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';
import { Button } from '@/components/ui/button';
import InterviewSettings from './InterviewSettings';
import InterviewBot from './InterviewBot';
import InterviewStatus from './InterviewStatus';
import Link from 'next/link';
import { DialogHeader, DialogTitle, DialogDescription, DialogContent, Dialog } from '@/components/ui/dialog';
import InterviewQuestions from './InterviewQuestions';
import { ApplicantCandidate, Job } from '@/types/merge';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { fetchJobById } from '@/server/jobs';

type InterviewConfig = Tables<'job_interview_config'>;
type Bot = Tables<'bots'>;

type CombinedJob = {
  mergeJob: Job;
  supabaseJob?: Tables<'jobs'>;
};

interface SetupFlags {
  hasBotId: boolean;
  hasQuestions: boolean;
  hasInterviewName: boolean;
  hasDuration: boolean;
  isReady: "yes" | "no" | "almost";
}


export default function JobConfig({ 
  // jobId, 
  job, 
  applicants, 
  isLoading,
}: { 
  // jobId: string, 
  job: Job, 
  applicants: ApplicantCandidate[], 
  isLoading: boolean,
}) {
  const [loading, setLoading] = useState(true);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [botInfo, setBotInfo] = useState<Bot | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [needsConfiguration, setNeedsConfiguration] = useState(false);
  const [setupFlags, setSetupFlags] = useState<SetupFlags>({
    hasBotId: false,
    hasQuestions: false,
    hasInterviewName: false,
    hasDuration: false,
    isReady: "no"
  });

  const [combinedJob, setCombinedJob] = useState<CombinedJob | null>(null);

  const jobId = job.id;

  const updateSetupFlags = useCallback((config: InterviewConfig | null) => {
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
    const hasQuestions = !!config.prompt_graph;
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await getJobInterviewConfig(jobId);
        setInterviewConfig(config);
        updateSetupFlags(config);
        
        if (config?.bot_id) {
          const botData = await getscoutById(String(config.bot_id));
          setBotInfo(botData);
          setNeedsConfiguration(false);
        } else {
          setNeedsConfiguration(true);
          setShowSetupDialog(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setNeedsConfiguration(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, updateSetupFlags]);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const mergeJob = await fetchJobById(jobId);

        const supabase = createClient();
        const { data: supabaseJob } = await supabase
          .from('jobs')
          .select('*')
          .eq('merge_id', jobId)
          .single();

        setCombinedJob({
          mergeJob,
          supabaseJob: supabaseJob || undefined
        });
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobData();
  }, [jobId]);

  return (
    <Card className="rounded-lg hover:bg-accent/50 transition-colors dark:bg-transparent border border-border">
      <CardContent className="space-y-6">
        {needsConfiguration && (
          <div className="mb-6 p-4 border rounded-lg border-yellow-200 relative">
            <div className="flex flex-col space-y-3">
              <h3 className="text-lg font-semibold text-yellow-800">
                Interview Configuration Required
              </h3>
              <p className="text-yellow-700">
                You haven't configured the AI interview settings for this job yet. Configure your interview settings to start interviewing candidates.
              </p>
              <Button
                asChild
                className="w-fit"
              >
                <Link href={`/jobs/${jobId}/settings`}>
                  Configure Interview Settings
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className={` ${needsConfiguration ? 'opacity-50 pointer-events-none filter blur-sm' : ''}`}>
          {/* {setupFlags.isReady === "yes" && ( */}
            <div className="flex flex-col col-span-1 mb-4">
              <InterviewStatus 
                jobId={jobId}
                loading={loading} 
                interviewConfig={interviewConfig} 
                botInfo={botInfo}
                setupFlags={setupFlags}
                combinedJob={combinedJob}
                applicants={applicants}
              />
            </div>
          {/* )} */}

          <div className="grid grid-cols-1 gap-4 h-full">
            <InterviewQuestions 
              loading={loading} 
              interviewConfig={interviewConfig} 
              jobId={jobId}
            />

            <InterviewSettings 
              loading={loading} 
              interviewConfig={interviewConfig} 
              setShowSetupDialog={setShowSetupDialog} 
              jobId={jobId} 
            />
          </div>
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
      </CardContent>
    </Card>
  );
}
