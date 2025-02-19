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
import {
  getCompany,
  getscoutById,
  getCompanyContext
} from '@/utils/supabase/queries';
import { useApplicant } from '@/hooks/useApplicant';

type ScoutProps = {
  scout: any;
  jobInterviewConfig: any;
  companyContext: any;
  job: any;
  company: any;
  mergeJob: any;
  application: any;
  enableRecording: boolean;
  demo: boolean;
  scoutTest: boolean;
};

export default function Demo({ params }: { params: { id: string } }) {
  //   const applicationId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scoutProps, setScoutProps] = useState<ScoutProps | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      //   if (!applicationId) {
      //     setError('Application ID is required');
      //     setIsLoading(false);
      //     return;
      //   }

      try {
        // Fetch company related data
        const [company, companyContext] = [
          {
            billing_address: null,
            company_context: 'f7422242-7580-4b7f-85c7-bde123c5187c',
            description: null,
            email_extension: null,
            id: '45b85594-26b9-4d3e-8576-b6ab7f1bd41e',
            industry: null,
            location: null,
            merge_account_token: null,
            name: 'Talentora',
            payment_method: null,
            subscription_id: null,
            website_url: null
          },
          {
            created_at: '2024-11-04T19:37:04.346289+00:00',
            culture:
              'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.',
            customers:
              'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.',
            description:
              'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.',
            goals:
              'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.',
            history:
              'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.',
            id: 'f7422242-7580-4b7f-85c7-bde123c5187c',
            products:
              'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.'
          }
        ];

        // Fetch bot data
        const scout = {
          company_id: '45b85594-26b9-4d3e-8576-b6ab7f1bd41e',
          created_at: '2025-02-01T02:05:37.000+00:00',
          description:
            'Finds applicants who can describe their resume experiences in detail and filter out applicants who are lying on their resume.',
          emotion: {
            anger: 1,
            speed: 1,
            sadness: 1,
            surprise: 1,
            curiosity: 1,
            positivity: 1
          },
          icon: null,
          id: 11,
          name: 'Jay',
          prompt:
            'Look for applicants who are describe their experiences in a detailed, coherent manner',
          role: 'Demo recruiter',
          voice: {
            id: 'e00d0e4c-a5c8-443f-a8a3-473eb9a62355',
            name: 'Friendly Sidekick',
            gender: 'masculine',
            language: 'en',
            embedding: [
              0.09410483, 0.079974554, 0.017645799, 0.08417164, -0.10961525,
              0.12855752, 0.013430084, -0.024581663, -0.06879434, 0.05381381,
              0.0012353595, 0.006085976, 0.11572997, -0.08568523, -0.029579738,
              -0.016710911, -0.0077498793, -0.0060466095, -0.081591874,
              -0.061875466, 0.08634007, -0.05264619, -0.030400697, 0.11478822,
              0.0032257885, 0.058713783, -0.032484237, -0.06665902, 0.08931387,
              0.014517364, -0.007451265, -0.10102731, 0.040464353, -0.087438084,
              -0.066848084, 0.13268761, -0.051638633, 0.070519134, 0.14037907,
              0.04629169, -0.041434992, 0.0146058705, 0.101506524, -0.042280655,
              0.14933878, -0.15545006, -0.18533674, -0.1110814, 0.06458473,
              0.021453138, 0.124971025, 0.009236553, 0.014778951, 0.021626875,
              -0.05187841, 0.07250377, -0.013432403, -0.018996226,
              -0.0037040845, -0.1066524, 0.05902565, -0.042337548,
              0.00036641955, 0.097329296, 0.027311655, -0.000675976, 0.04342329,
              -0.0056270114, -0.01008038, -0.0070532397, 0.06818358, -0.1366029,
              0.13772509, 0.10922787, 0.00959963, 0.009556445, -0.06415278,
              -0.06870479, -0.07492951, -0.025629368, 0.07534357, -0.12146816,
              -0.005361332, -0.004572155, -0.037973963, -0.023060132,
              -0.0038664239, -0.050002955, -0.050662458, 0.064065896,
              0.06830593, -0.010503624, 0.084139496, -0.02510241, 0.10361288,
              0.21173185, -0.05299685, 0.05865421, 0.0191851, -0.03529296,
              0.07514327, 0.0073672025, -0.12818779, -0.14449452, -0.10292752,
              -0.13601914, 0.053031713, -0.10029877, 0.049517713, 0.004904805,
              -0.0031694756, 0.13744617, -0.009426843, -0.094415076, 0.02631338,
              0.031187622, -0.113471426, 0.0462735, 0.16793488, -0.04361045,
              -0.088441975, -0.09287519, 0.06536801, 0.065927416, -0.11591995,
              -0.07661975, -0.008013515, 0.013970656, 0.023860326, -0.07416654,
              -0.05390443, -0.03227111, 0.14392842, -0.0015517174, 0.04260603,
              -0.10756845, -0.111385114, -0.08160864, 0.05239747, -0.089399315,
              -0.09101242, 0.04932216, 0.003117642, -0.13629505, 0.041228,
              -0.049632464, 0.0366001, -0.0046930057, -0.018072644, -0.06100545,
              0.0818714, 0.007694119, -0.0008900023, -0.0374466, 0.028906198,
              -0.07169407, 0.078779995, 0.032826856, 0.10436137, -0.06768776,
              0.017248776, 0.063937016, 0.014764318, 0.034505066, 0.08854115,
              0.07734331, 0.04022845, 0.048509147, 0.09736956, -0.052125588,
              -0.017641636, -0.02687417, -0.09649839, 0.05494908, -0.04422508,
              0.0077187256, 0.03566544, 0.12929288, 0.034641482, -0.006942245,
              0.044290192, 0.04098064, 0.04387537, -0.008305046, 0.013910318,
              -0.029980347, 0.084455855, 0.02610862, 0.013888957, 0.09597405,
              -0.0135880625, 0.04001869
            ],
            is_public: true,
            api_status: 'unlocked',
            created_at: '2024-07-02T12:10:46.176846-07:00',
            description:
              'This voice is friendly and supportive, designed for voicing characters in games and videos'
          }
        };

        var jobInterviewConfig = {
          interview_questions: 'Tell me about your past experiences',
          sample_response: 'a great answer should sound genuine and show detail'
        };

        setScoutProps({
          jobInterviewConfig: jobInterviewConfig,
          job: null,
          company,
          scout,
          companyContext,
          mergeJob: null,
          application: null,
          enableRecording: false,
          demo: true,
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
  }, []);

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
