import { Application } from "@/types/greenhouse"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Mail, Phone } from "lucide-react"

interface ApplicantInfoProps {
  application: Application;
}

export default function ApplicantInfo({ application }: ApplicantInfoProps) {
  const candidateName = `${application.candidate.first_name} ${application.candidate.last_name}`;
  const avatarUrl = application.candidate.avatar_url || "/placeholder-avatar.jpg";
  const email = application.candidate.email_addresses[0]?.value || 'No email address';
  const phoneNumber = application.candidate.phone_numbers[0]?.value || 'No phone number';
  const jobName = application.jobs[0]?.name || 'No job specified';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage alt={candidateName} src={avatarUrl} />
          <AvatarFallback>{candidateName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{candidateName}</CardTitle>
          <CardDescription>{jobName}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm">Applied on {new Date(application.applied_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}