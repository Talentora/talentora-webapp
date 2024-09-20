import { getMeeting } from "@/utils/daily/queries"
import { MeetingCard } from "@/components/Meetings/MeetingCard";
import { createClient } from "@/utils/supabase/server";

interface InterviewPageProps {
    params: { id: string };
  }
  
  export default async function Page({ params }: InterviewPageProps) {
    const res = await getMeeting(params.id);
    const meeting = res.data;


    return (
        <div>
            <MeetingCard meeting={meeting} />
        </div>
    )
}