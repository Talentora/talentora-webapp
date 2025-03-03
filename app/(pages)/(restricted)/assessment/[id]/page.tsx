'use client';
import { useEffect, useState } from 'react';
import Bot from '@/components/Bot';
import { Tables } from '@/types/types_db';
type Application = Tables<'applications'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type ScoutConfig = Tables<'bots'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
type CompanyContext = Tables<'company_context'>;
import { Job as MergeJob, Candidate as MergeCandidate } from '@/types/merge';
import { getAccountTokenFromApplication } from '@/utils/supabase/queries';
import {
  getCompany,
  getscoutById,
  getJobInterviewConfig,
  getJob,
  getCompanyContext,
  getApplication
} from '@/utils/supabase/queries';
import { useApplicant } from '@/hooks/useApplicant';
import { fetchJobById } from '@/server/jobs';

type ScoutProps = {
  scout: ScoutConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
  application: Application;
  enableRecording: boolean;
  demo: boolean;
  scoutTest: boolean;
};

export default function Assessment({ params }: { params: { id: string } }) {
  const applicationId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scoutProps, setScoutProps] = useState<ScoutProps | null>(null);

  // const { applicant } = useApplicant();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!applicationId) {
        setError('Application ID is required');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch initial application and token
        const { token: account_token, company: tokenCompany } =
          await getAccountTokenFromApplication(applicationId);
        if (!account_token) {
          throw new Error('Failed to get account token');
        }

        const application = await getApplication(applicationId);
        if (!application) {
          throw new Error('Application not found');
        }

        // Fetch job related data
        const jobId = application.job_id;
        if (!jobId) {
          throw new Error('Job ID not found in application');
        }

        const [config, job, mergeJob] = await Promise.all([
          getJobInterviewConfig(jobId),
          getJob(jobId),
          fetchJobById(jobId)
        ]);

        if (!config || !job || !mergeJob) {
          throw new Error('Failed to fetch job related data');
        }

        // Fetch company related data
        const [company, companyContext] = await Promise.all([
          getCompany(job.company_id),
          getCompanyContext(job.company_id)
        ]);

        if (!company || !companyContext) {
          throw new Error('Failed to fetch company related data');
        }

        // Fetch bot data
        const scout = await getscoutById(config.bot_id.toString());
        if (!scout) {
          throw new Error('Failed to fetch scout data');
        }

        setScoutProps({
          jobInterviewConfig: config,
          job,
          company,
          scout,
          companyContext,
          mergeJob,
          application,
          enableRecording: true,
          demo: false,
          scoutTest: false
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchAllData();
  }, [applicationId]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <div className="animate-fade-in">
            <p className="text-xl font-medium text-primary-700 text-center animate-pulse">
              {
                [
                  'Warming up the interview bot...',
                  'Practicing firm handshakes...',
                  'Ironing the virtual suit...',
                  'Rehearsing professional small talk...',
                  'Brewing coffee for the interviewer...',
                  'Polishing tough questions...',
                  'Adjusting the virtual tie...',
                  'Setting up the perfect lighting...'
                ][Math.floor((Date.now() / 2000) % 8)]
              }
            </p>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Please wait while we prepare your interview
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">
          <p>Error: {error}</p>
          <p className="mt-2">Please try again later</p>
        </div>
      ) : (
        <>{scoutProps && <Bot {...scoutProps} />}</>
      )}
    </div>
  );
}
