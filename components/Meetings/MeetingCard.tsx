import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Calendar } from "lucide-react"

interface Meeting {
    id: string
    room: string
    start_time: number
    duration: number
    ongoing: boolean
    max_participants: number
    participants: string[] // Assuming participants are represented by strings (e.g., user IDs)
}

export function MeetingCard({ meeting }: { meeting: Meeting }) {
    const startDate = new Date(meeting.start_time * 1000)
    const formattedDate = startDate.toLocaleString()

    return (
      <Link href={`/interview/${meeting.id}`}>
        {/* Make the card clickable by wrapping with Link */}
        <Card className="w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="truncate">{meeting.room}</span>
              <Badge variant={meeting.ongoing ? "default" : "secondary"}>
                {meeting.ongoing ? "Ongoing" : "Completed"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                <span>{meeting.duration} minutes</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4" />
                <span>
                  {meeting.participants.length} / {meeting.max_participants}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
}
