import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Calendar } from "lucide-react"
import { MeetingCard } from "./MeetingCard"

interface Meeting {
  id: string
  room: string
  start_time: number
  duration: number
  ongoing: boolean
  max_participants: number
  participants: string[] // Assuming participants are represented by strings (e.g., user IDs)
}

interface MeetingGalleryProps {
  meetings: Meeting[]
}



export default function MeetingList({ meetings }: MeetingGalleryProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Meetings Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {meetings.length>0 ?
        meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))
        : <p>No meetings found</p>
    }
      </div>
    </div>
  )
}