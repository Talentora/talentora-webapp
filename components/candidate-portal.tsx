import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Download, Mail, Phone, Play, ThumbsDown, ThumbsUp } from "lucide-react"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <h1 className="text-lg font-semibold">Candidate Portal</h1>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage alt="Candidate" src="/placeholder-avatar.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Emily Johnson</CardTitle>
                    <CardDescription>Software Engineer</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">emily.johnson@example.com</span>
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
                    Emily is a highly skilled software engineer with 5 years of experience in full-stack development.
                    She has a strong background in React, Node.js, and cloud technologies. Emily has demonstrated
                    excellent problem-solving skills and a passion for creating efficient, scalable solutions.
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
                      <h3 className="font-semibold mb-2">Describe a challenging project you've worked on.</h3>
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
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Stage:</span>
                      <span className="text-sm">Technical Interview</span>
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
        </main>
      </div>
    </div>
  )
}