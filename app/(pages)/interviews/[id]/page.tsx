import { getMeeting } from "@/utils/daily/queries"
import  {MeetingPage}  from "@/components/Meetings/MeetingPage"
// import { MeetingCard } from "@/components/Meetings/MeetingCard";
interface InterviewPageProps {
    params: { id: string };
  }
  
  
  export default async function Page({ params }: InterviewPageProps) {
    const res = await getMeeting(params.id);
    console.log(res);


    return (
        <div>            
            <MeetingPage meeting={res} />
        </div>
    )
}