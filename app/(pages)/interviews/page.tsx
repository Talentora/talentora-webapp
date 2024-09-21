import { getAllMeetings } from 'utils/daily/queries';
import MeetingsList from '@/components/Meetings/MeetingsList';
const Page =async () => {

  const res = await getAllMeetings();
  const meetings = res.data;
  const meetingCount = res.total_count;
  console.log(res);


  return (
    <div>
      <MeetingsList meetings={meetings} />
    </div>
  );
};

export default Page;
