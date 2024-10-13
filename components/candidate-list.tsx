"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Download, Mail, Phone, Play, Search, ThumbsDown, ThumbsUp } from "lucide-react"

type Candidate = {
  id: number
  name: string
  role: string
  status: string
  progress: number
}

const candidates: Candidate[] = [
  { id: 1, name: "Emily Johnson", role: "Software Engineer", status: "Technical Interview", progress: 75 },
  { id: 2, name: "Michael Chen", role: "Product Manager", status: "First Round", progress: 25 },
  { id: 3, name: "Sarah Davis", role: "UX Designer", status: "Final Interview", progress: 90 },
  { id: 4, name: "Alex Rodriguez", role: "Data Scientist", status: "Phone Screening", progress: 10 },
  { id: 5, name: "Lisa Thompson", role: "Marketing Specialist", status: "Offer Stage", progress: 95 },
]

export default function CandidateList() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <h1 className="text-lg font-semibold">Candidate Management System</h1>
      </header>
      <main className="flex-1 p-4 lg:p-6">
        {selectedCandidate ? (
          <CandidatePortal candidate={selectedCandidate} onBack={() => setSelectedCandidate(null)} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Link href="/applicants/invite">
                <Button className="bg-primary text-foreground" variant="outline">Invite Candidates</Button>
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.role}</TableCell>
                    <TableCell>{candidate.status}</TableCell>
                    <TableCell>
                      <Progress value={candidate.progress} className="w-[60%]" />
                    </TableCell>
                    <TableCell>
                      <Button variant="link" onClick={() => setSelectedCandidate(candidate)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}

type CandidatePortalProps = {
  candidate: Candidate
  onBack: () => void
}

function CandidatePortal({ candidate, onBack }: CandidatePortalProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onBack} variant="link">
        &larr; Back to Candidate List
      </Button>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage alt={candidate.name} src="/placeholder-avatar.jpg" />
                <AvatarFallback>{candidate.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{candidate.name}</CardTitle>
                <CardDescription>{candidate.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{candidate.name.toLowerCase().replace(" ", ".")}@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm">Applied on May 15, 2023</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Candidate Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {candidate.name} is a highly skilled {candidate.role.toLowerCase()} with 5 years of experience in the field.
                They have demonstrated excellent problem-solving skills and a passion for creating innovative solutions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interview Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="question1">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="question1">Question 1</TabsTrigger>
                  <TabsTrigger value="question2">Question 2</TabsTrigger>
                  <TabsTrigger value="question3">Question 3</TabsTrigger>
                </TabsList>
                <TabsContent value="question1" className="mt-4">
                  <h3 className="font-semibold mb-2">Describe a challenging project you&apos;ve worked on.</h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground" />
                  </div>
                </TabsContent>
                <TabsContent value="question2" className="mt-4">
                  <h3 className="font-semibold mb-2">How do you approach problem-solving?</h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground" />
                  </div>
                </TabsContent>
                <TabsContent value="question3" className="mt-4">
                  <h3 className="font-semibold mb-2">What are your career goals?</h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-64 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{candidate.progress}%</span>
                  </div>
                  <Progress value={candidate.progress} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Stage:</span>
                  <span className="text-sm">{candidate.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">Schedule Interview</Button>
              <Button className="w-full" variant="outline">
                Send Message
              </Button>
              <div className="flex gap-2">
                <Button className="flex-1" size="icon" variant="outline">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="sr-only">Approve</span>
                </Button>
                <Button className="flex-1" size="icon" variant="outline">
                  <ThumbsDown className="w-4 h-4" />
                  <span className="sr-only">Reject</span>
                </Button>
              </div>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}