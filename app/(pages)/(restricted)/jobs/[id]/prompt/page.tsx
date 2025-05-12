import { getJob, getJobInterviewConfig } from '@/utils/supabase/queries';
import PromptFlowClient from '@/components/FlowsPrompt/PromptFlowClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function JobPromptPage({ params }: PageProps) {
  const job = await getJob(params.id);
  
  if (!job) {
    notFound();
  }

  const config = await getJobInterviewConfig(params.id);

  return (
    <PromptFlowClient 
      job={job} 
      initialConfig={config} 
    />
  );
}
