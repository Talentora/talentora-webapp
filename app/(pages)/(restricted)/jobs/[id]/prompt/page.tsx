import { getJob, getJobInterviewConfig } from '@/utils/supabase/queries';
import PromptFlowClient from '@/components/FlowsPrompt/PromptFlowClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PromptFlowPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const job = await getJob(id);
  
  if (!job) {
    notFound();
  }

  const config = await getJobInterviewConfig(id);

  return (
    <PromptFlowClient 
      job={job} 
      initialConfig={config} 
    />
  );
}
