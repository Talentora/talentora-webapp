'use client';
import { createClient } from '@/utils/supabase/client';
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
import {
  getCompany,
  getBotById,
  getJobInterviewConfig,
  getJob,
  getCompanyContext
} from '@/utils/supabase/queries';



type BotProps = {
  bot: BotConfig;
  jobInterviewConfig: JobInterviewConfig;
  companyContext: CompanyContext;
  job: Job;
  company: Company;
  mergeJob: MergeJob;
  applicationData: MergeCandidate;
}




export default function Assessment({
  params
}: {
  params: { jobId: string; applicantId: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const jobId = params.applicantId;
  const applicantId = params.jobId;
  const [isVisible, setIsVisible] = useState(false);


  const [botProps, setBotProps] = useState<BotProps | null>(null);


  const fetchApplicationData = async (applicantId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/applications/${applicantId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch application data from API');
    }
    const data = await response.json();
    return data;
  };

  const fetchJob = async (jobId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs/${jobId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch job data from API');
    }
    const job: MergeJob = await response.json();
    return job;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const config = await getJobInterviewConfig(jobId);
        const job = await getJob(config.job_id);
        const company = await getCompany(job.company_id);
        const bot = await getBotById(config.bot_id.toString());
        const companyContext = await getCompanyContext(job.company_id);
        const mergeJob = await fetchJob(jobId);
        const applicationData = await fetchApplicationData(applicantId);


        if (config && job && company && bot && companyContext && mergeJob && applicationData) {
          setBotProps({
            jobInterviewConfig: config,
            job,
            company,
            bot,
            companyContext,
            mergeJob,
            applicationData
          });
        }
        
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [jobId, applicantId]);

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
          {botProps && <Bot {...botProps} />}

          <div className="space-y-6 w-full max-w-4xl p-6">
            {/* show hide button  */}
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded fixed bottom-4 left-4"
            >
              {isVisible ? 'Hide' : 'Show'} Payload Data
            </button>


            {/* bot context data  */}
            {isVisible && botProps && 
              [
                { title: 'Job Interview Configuration', data: botProps.jobInterviewConfig },
                { title: 'Bot Configuration', data: botProps.bot },
                { title: 'Company Information', data: botProps.company },
                { title: 'Job Details', data: botProps.job },
                { title: 'Company Context', data: botProps.companyContext },
                { title: 'Merge Job', data: botProps.mergeJob },
                { title: 'Application Data', data: botProps.applicationData }
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
