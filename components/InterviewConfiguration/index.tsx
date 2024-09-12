import InterviewConfiguration from './InterviewConfiguration';
import { useParams } from 'next/navigation';


const page = () => {
  const { id } = useParams();

  return <InterviewConfiguration job={} />;
};

export default page;