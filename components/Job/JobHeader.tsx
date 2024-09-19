import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  BriefcaseIcon,
  MapPinIcon,
  CircleDollarSign,
  Edit2,
  BuildingIcon,
  ClipboardListIcon,
  UserIcon
} from 'lucide-react'
import { Tables } from '@/types/types_db'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

type Job = Tables<'jobs'> & {
  description: string
  requirements: string
  qualifications: string
  company_description: string
}

interface JobHeaderProps {
  job: Job
}

export function JobHeader({ job }: JobHeaderProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
        <div className="flex flex-row justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <BriefcaseIcon className="mr-1 h-4 w-4" /> {job.department}
            </span>
            <span className="flex items-center">
              <MapPinIcon className="mr-1 h-4 w-4" /> {job.location}
            </span>
            <span className="flex items-center">
              <CircleDollarSign className="mr-1 h-4 w-4" /> {job.salary_range}
            </span>
          </div>
          <div>
            <Link href={`./${job.id}/edit`}>
              <Edit2 className="mr-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <ClipboardListIcon className="mr-2 h-5 w-5" /> Job Description
          </h3>
          <CardDescription>
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </CardDescription>
        </section>
        <section>
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <UserIcon className="mr-2 h-5 w-5" /> Requirements and Qualifications
          </h3>
          <CardDescription>
            <ReactMarkdown>{job.requirements}</ReactMarkdown>
            <ReactMarkdown>{job.qualifications}</ReactMarkdown>
          </CardDescription>
        </section>
        <section>
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <BuildingIcon className="mr-2 h-5 w-5" /> About the Company
          </h3>
          <CardDescription>
            <ReactMarkdown>{job.company_description}</ReactMarkdown>
          </CardDescription>
        </section>
      </CardContent>
    </>
  )
}