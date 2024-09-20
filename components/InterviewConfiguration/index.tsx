import InterviewConfiguration from './InterviewConfiguration';
import { useParams } from 'next/navigation';
import { Tables } from '@/types/types_db';
type Job = Tables<'jobs'>;

interface InterviewConfigurationProps {
  job: Job;
}

const page = ({ job }: InterviewConfigurationProps) => {
  return <InterviewConfiguration job={job} />;
};

export default page;
