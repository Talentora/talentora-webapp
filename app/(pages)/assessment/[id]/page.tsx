'use client';
import { useEffect, useState } from 'react';
import Bot from '@/components/Bot';
import { Tables } from '@/types/types_db';
type Application = Tables<'applications'>;
type JobInterviewConfig = Tables<'job_interview_config'>;
type BotConfig = Tables<'bots'>;
type Job = Tables<'jobs'>;
type Company = Tables<'companies'>;
type CompanyContext = Tables<'company_context'>;
import { Job as MergeJob, Candidate as MergeCandidate } from '@/types/merge';
import { getAccountTokenFromApplication } from '@/utils/supabase/queries';
import {
  getCompany,
  getBotById,
  getJobInterviewConfig,
  getJob,
  getCompanyContext,
  getApplication,
} from '@/utils/supabase/queries';
import { fetchJobDetails, fetchApplicationData, useApplicant } from '@/hooks/useApplicant';

type BotProps = {
  bot: BotConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
  application: Application;
}

export default function Assessment({
  params
}: {
  params: { id: string };
}) {
  const applicationId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [botProps, setBotProps] = useState<BotProps | null>(null);

  const { applicant } = useApplicant();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!applicationId) {
        setError('Application ID is required');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch initial application and token
        const { token: account_token, company: tokenCompany } = await getAccountTokenFromApplication(applicationId);
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
          fetchJobDetails(jobId, account_token)
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
        const bot = await getBotById(config.bot_id.toString());
        if (!bot) {
          throw new Error('Failed to fetch bot data');
        }

        setBotProps({
          jobInterviewConfig: config,
          job,
          company,
          bot,
          companyContext,
          mergeJob,
          application
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
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2">Fetching your data...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">
          <p>Error: {error}</p>
          <p className="mt-2">Please try again later</p>
        </div>
      ) : (
        <>
          {/* {botProps && <Bot {...botProps} />} */}

          <div className="space-y-6 w-full max-w-4xl p-6">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded fixed bottom-4 left-4"
            >
              {isVisible ? 'Hide' : 'Show'} Payload Data
            </button>

            {isVisible && botProps && 
              [
                { title: 'Job Interview Configuration', data: botProps.jobInterviewConfig },
                { title: 'Bot Configuration', data: botProps.bot },
                { title: 'Company Information', data: botProps.company },
                { title: 'Job Details', data: botProps.job },
                { title: 'Company Context', data: botProps.companyContext },
                { title: 'Merge Job', data: botProps.mergeJob },
              ].map(({ title, data }) => (
                <div key={title} className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">{title}</h2>
                  <pre className="bg-gray-50 p-4 rounded overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}