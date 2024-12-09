import { ApplicantCandidate } from '@/types/merge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CalendarDays, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
interface ApplicantInfoProps {
  ApplicantCandidate: ApplicantCandidate | null;
}

export default function ApplicantInfo({
  ApplicantCandidate
}: ApplicantInfoProps) {
  if (!ApplicantCandidate) {
    return null;
  }
  const candidateName = `${ApplicantCandidate.candidate.first_name} ${ApplicantCandidate.candidate.last_name}`;
  const avatarUrl = '/placeholder-avatar.jpg';
  const email =
    ApplicantCandidate.candidate.email_addresses?.[0]?.value ||
    'No email address';
  const phoneNumber =
    ApplicantCandidate.candidate.phone_numbers?.[0]?.value || 'No phone number';
  const jobName = ApplicantCandidate.job.name || 'No job specified';
  const appliedAt = ApplicantCandidate.application.created_at ? new Date(ApplicantCandidate.application.created_at).toLocaleDateString() : 'Unknown date';
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage alt={candidateName} src={avatarUrl} />
          <AvatarFallback>
            {candidateName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{candidateName}</CardTitle>
          <CardDescription>
            <Link href={`/jobs/${ApplicantCandidate.job.id}`} className="hover:underline">
              {jobName}
            </Link>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
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
            <span className="text-sm">
              Applied on{' '}
              {appliedAt}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium">Current Stage: </span>
            <span className="text-sm font-bold">
              {ApplicantCandidate.interviewStages.name}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
