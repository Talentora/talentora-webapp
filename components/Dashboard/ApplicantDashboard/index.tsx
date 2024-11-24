'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleDot } from 'lucide-react'
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

export default function JobPortal() {
  const router = useRouter()
  const {user} = useUser()
  const { applications, enrichedApplications, applicant, isLoading,error } = useApplicant()

  console.log('applications',applications)
  console.log("enrichedApplications",enrichedApplications)
  console.log("applicantId",applicant?.id)

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Error: {error.message}</p>
      </div>
    )
  }


  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen">
      <header className=" text-primary py-8 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Applicant Dashboard</h1>
          <p className="text-lg opacity-90">
            Welcome, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>
      </header>

      <main className="container px-4">
        <div className="grid gap-6 md:grid-cols-2 px-10 ">
          {enrichedApplications?.length === 0 ? (
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
            enrichedApplications?.map((application) => (
              <Card key={application.id} className="border bg-foreground p-5 border-border shadow-sm relative">
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
                            <div dangerouslySetInnerHTML={{__html: application.description || 'No description available'}} className="text-sm text-muted-foreground whitespace-pre-wrap" />
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
                    Posted: {new Date(application.created_at).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit', 
                      year: '2-digit'
                    })}
                  </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <CircleDot className="h-4 w-4 text-blue-500" />
                    {application.status}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">Practice</Button>
                    <Link href={`/assessment/${application.application_data.id}`}>
                      <Button 
                        className="bg-[#6366f1] hover:bg-[#5558e6]"
                      >
                        Start Interview
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}