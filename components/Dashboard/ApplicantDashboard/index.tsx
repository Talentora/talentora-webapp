'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleDot } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Assessment from "@/app/(pages)/assessment/[jobId]/[applicantId]/page"

export default function JobPortal() {
  const router = useRouter()

  const handleStartInterview = (jobTitle: string) => {
    router.push(`/assessment/${jobId}/${applicantId}`)
  }

  return (
    <div className="min-h-screen bg-[#f8f6ff]">
      <header className="border-b bg-white">
      </header>
      <main className="container px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Financial Analyst Intern – SAP</CardTitle>
              <p className="text-sm text-muted-foreground">Due October 31, 2024 at 11:59 PM</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CircleDot className="h-4 w-4 text-blue-500" />
                Virtual Interview
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Practice</Button>
                <Button 
                  className="bg-[#6366f1] hover:bg-[#5558e6]"
                  onClick={() => handleStartInterview("Financial Analyst Intern – SAP")}
                >
                  Start Interview
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">SWE Intern – Google</CardTitle>
              <p className="text-sm text-muted-foreground">Due October 31, 2024 at 11:59 PM</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CircleDot className="h-4 w-4 text-blue-500" />
                Virtual Interview
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Practice</Button>
                <Button 
                  className="bg-[#6366f1] hover:bg-[#5558e6]"
                  onClick={() => handleStartInterview("SWE Intern – Google")}
                >
                  Start Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}