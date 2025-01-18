'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, CircleDot } from 'lucide-react'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApplicant } from '@/hooks/useApplicant'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Skeleton } from "@/components/ui/skeleton"
import { memo, useMemo } from 'react'

interface Application {
  id: string;
  name: string;
  status: string;
  created_at: string;
  description: string | null;
  company: {
    billing_address: string | null;
    company_context: string | null;
    description: string | null;
    email_extension: string | null;
    id: string;
    industry: string | null;
    location: string | null;
    name: string;
    website_url: string | null;
  } | null;
  application_data: {
    id: string;
  };
}

interface ApplicationCardProps {
  application: Application;
}

// Memoized application card component with proper typing
const ApplicationCard = memo<ApplicationCardProps>(({ application }) => {
  // Memoize the formatted date to prevent recalculation
  const formattedDate = useMemo(() => {
    return new Date(application.created_at).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit', 
      year: '2-digit'
    });
  }, [application.created_at]);

  // Memoize the status class to prevent recalculation
  const statusClass = useMemo(() => {
    return application.status === 'complete' 
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-red-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
  }, [application.status]);

  return (
    <Card className="border bg-foreground p-5 border-border shadow-sm relative">
      <div className="absolute top-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Company Information</h4>
                <p className="text-sm text-muted-foreground">{application.company?.name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Job Description</h4>
                <div className="max-h-[200px] overflow-y-auto prose prose-sm">
                  <div 
                    dangerouslySetInnerHTML={{__html: application.description || 'No description available'}} 
                    className="text-sm text-muted-foreground whitespace-pre-wrap" 
                  />
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Status</h4>
                <p className="text-sm text-muted-foreground">{application.status}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{application.name}</CardTitle>
        <div className="flex flex-row gap-1">
          <p className="text-sm text-muted-foreground">
            {application.company?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Posted: {formattedDate}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          Application Status: 
          <span className={statusClass}>
            {application.status}
          </span>
        </div>
        <div className="flex gap-3">
          <Link href={`/assessment/${application.application_data.id}`}>
            <Button 
              className="bg-[#6366f1] hover:bg-[#5558e6]"
              disabled={application.status === 'complete'}
            >
              Start Interview
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

// Loading skeleton component
const LoadingSkeleton = memo(() => (
  <div className="min-h-screen">
    <header className="text-primary py-8 px-6">
      <div className="container mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-64" />
      </div>
    </header>

    <main className="container px-4">
      <div className="grid gap-6 md:grid-cols-2 px-10">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border bg-foreground p-5 border-border shadow-sm relative">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default function JobPortal() {
  const router = useRouter()
  const {user} = useUser()
  const { applications, enrichedApplications, applicant, isLoading, error } = useApplicant()

  // Memoize sorted applications
  const sortedApplications = useMemo(() => {
    if (!enrichedApplications) return [];
    return [...enrichedApplications].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [enrichedApplications]);

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Error: {error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }
  
  return (
    <div className="min-h-screen">
      <header className="text-primary py-8 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Applicant Dashboard</h1>
          <p className="text-lg opacity-90">
            Welcome, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>
      </header>

      <main className="container px-4">
        <div className="grid gap-6 md:grid-cols-2 px-10">
          {sortedApplications?.length === 0 ? (
            <Card className="border bg-foreground p-5 border-border shadow-sm relative">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Welcome to Talentora!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Thanks for checking out Talentora. You have no interview applications currently!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <Link href="/about" className="text-primary-dark hover:underline">Click here to learn more about our platform</Link>
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedApplications?.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}