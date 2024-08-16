"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, MapPinIcon, UsersIcon, RobotIcon } from "lucide-react"

export default function Component() {
  const [visibleSections, setVisibleSections] = useState({
    jobDetails: true,
    applicantStats: true,
    recentApplicants: true,
    roboRecruiterConfig: true,
  })

  const toggleSection = (section) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Senior Frontend Developer</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toggleSection('jobDetails')}>
              {visibleSections.jobDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
          <CardDescription>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center"><BriefcaseIcon className="mr-1 h-4 w-4" /> Full-time</span>
              <span className="flex items-center"><MapPinIcon className="mr-1 h-4 w-4" /> Remote</span>
              <span className="flex items-center"><CurrencyDollarIcon className="mr-1 h-4 w-4" /> $80k - $120k</span>
              <span className="flex items-center"><CalendarIcon className="mr-1 h-4 w-4" /> Posted 2 weeks ago</span>
            </div>
          </CardDescription>
        </CardHeader>
        {visibleSections.jobDetails && (
          <>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Job Description</h3>
              <p className="text-muted-foreground mb-4">
                We are seeking an experienced Frontend Developer to join our dynamic team. The ideal candidate will have a strong background in React, TypeScript, and modern web technologies.
              </p>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="list-disc list-inside text-muted-foreground mb-4">
                <li>5+ years of experience in frontend development</li>
                <li>Proficiency in React, TypeScript, and state management libraries</li>
                <li>Experience with responsive design and cross-browser compatibility</li>
                <li>Strong problem-solving skills and attention to detail</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button>Apply Now</Button>
            </CardFooter>
          </>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Applicant Statistics</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toggleSection('applicantStats')}>
              {visibleSections.applicantStats ? 'Hide' : 'Show'} Statistics
            </Button>
          </div>
        </CardHeader>
        {visibleSections.applicantStats && (
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">+30% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Qualified Candidates</CardTitle>
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64</div>
                <p className="text-xs text-muted-foreground">50% of total applicants</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">25% of total applicants</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Days Open</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14</div>
                <p className="text-xs text-muted-foreground">2 weeks since posting</p>
              </CardContent>
            </Card>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Recent Applicants</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toggleSection('recentApplicants')}>
              {visibleSections.recentApplicants ? 'Hide' : 'Show'} Applicants
            </Button>
          </div>
        </CardHeader>
        {visibleSections.recentApplicants && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Sarah Johnson</TableCell>
                  <TableCell>2023-06-01</TableCell>
                  <TableCell>6 years</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Interviewing
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Michael Chen</TableCell>
                  <TableCell>2023-05-30</TableCell>
                  <TableCell>4 years</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Under Review
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Emily Rodriguez</TableCell>
                  <TableCell>2023-05-28</TableCell>
                  <TableCell>7 years</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Interviewing
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">David Kim</TableCell>
                  <TableCell>2023-05-25</TableCell>
                  <TableCell>3 years</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Rejected
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lisa Patel</TableCell>
                  <TableCell>2023-05-22</TableCell>
                  <TableCell>5 years</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Offer Extended
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">RoboRecruiter Config</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toggleSection('roboRecruiterConfig')}>
              {visibleSections.roboRecruiterConfig ? 'Hide' : 'Show'} Config
            </Button>
          </div>
        </CardHeader>
        {visibleSections.roboRecruiterConfig && (
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="voice">RoboRecruiter Voice</Label>
                <Select>
                  <SelectTrigger id="voice">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-model">AI Model</Label>
                <Select>
                  <SelectTrigger id="ai-model">
                    <SelectValue placeholder="Select an AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3">GPT-3</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="custom">Custom Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full">
                  <RobotIcon className="mr-2 h-4 w-4" />
                  Customize Interview Questions
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}