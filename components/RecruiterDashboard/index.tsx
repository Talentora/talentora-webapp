
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BriefcaseIcon,
  Ellipsis,
  Settings,
  Navigation,
  HomeIcon,
  MessageSquareIcon,
  UserIcon,
  UsersIcon,
  Plus
} from 'lucide-react';

import { Tables } from '@/types/types_db';
type Job = Tables<'jobs'>;

interface DashboardProps {
  jobs: Job[];
}
import { useState } from 'react';

export default function RecruiterDashboard({ jobs,applicants }: DashboardProps) {


export default function Dashboard({ jobs }: DashboardProps) {
  
  return (
<body>
  <div className="flex h-screen bg-primary-background text-black">
    <Sidebar />

    <div className="flex h-screen bg-primary-background text-black">
      <main className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="col-span-2 space-y-6">

            {/* Active Job Titles and AI Interviews Completed */}
            <Card className="border p-5 border-gray-300 rounded-lg shadow-sm bg-primary-background">
              <div className="flex justify-between">
                {/* Active Job Titles */}
                <div className="flex-1 pr-2">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex items-center mr-4">
                      <Link href="/interviews">
                        <UserIcon className="h-8 w-8 text-muted-foreground" />
                      </Link>
                    </div>
                    <div className="flex flex-col flex-1 ml-2">
                      <CardTitle className="text-sm font-medium">
                        Active Job Titles
                      </CardTitle>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">
                        +21% from last month
                      </p>
                    </div>
                  </CardHeader>
                </div>

                <div className="w-px bg-gray-300 mx-4"></div> {/* Vertical Divider */}

                {/* AI Interviews Completed */}
                <div className="flex-1 pl-2">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex items-center mr-4">
                      <Link href="/interviews">
                        <UserIcon className="h-8 w-8 text-muted-foreground" />
                      </Link>
                    </div>
                    <div className="flex flex-col flex-1 ml-2">
                      <CardTitle className="text-sm font-medium">
                        AI Interviews Completed
                      </CardTitle>
                      <div className="text-2xl font-bold">56</div>
                      <p className="text-xs text-muted-foreground">
                        12 upcoming this week
                      </p>
                    </div>
                  </CardHeader>
                </div>
              </div>
            </Card>

            {/* Active Job Titles - Second Card */}
            <Card className="p-5 border border-gray-300 rounded-lg shadow-sm relative bg-primary-background">
              <CardHeader>
                <CardTitle>Active Job Titles</CardTitle>
                <Link href="/jobs">
                  <Button className="bg-[#5650F0] text-white hover:bg-[#4a45d1] flex items-center absolute top-4 right-4" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> {/* Plus icon */}
                    Create a Job
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">No jobs available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {jobs.slice(0, 5).map((job, index) => (
                      <div key={index} className="bg-gray-200 p-4 rounded shadow-sm relative group">
                        <p className="font-medium">Job {job.id} - {job.title}</p>
                        <div
                          className={`w-1/4 px-2 py-1 rounded text-xs font-medium ${
                            job.department === 'Engineering'
                              ? 'bg-blue-100 text-blue-800'
                              : job.department === 'Marketing'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {job.department}
                        </div>
                        <Link href={`/jobs/${job.id}`}>
                          <Navigation className="h-4 w-4 text-muted-foreground cursor-pointer absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </div>
                    ))}
                    {jobs.length > 5 && (
                      <Link href="/jobs">
                        <div className="bg-gray-200 p-4 rounded shadow-sm flex relative group">
                          <Ellipsis className="text-muted-foreground cursor-pointer" />
                          <span className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                            Click here for all jobs
                          </span>
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Applicant Overview */}
            <Card className="p-5 border border-gray-300 rounded-lg shadow-sm bg-primary-background">
              <CardHeader>
                <CardTitle>Applicant Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', title: 'Software Engineer', score: 95, color: 'bg-green-100 text-green-800' },
                    { name: 'Jane Smith', title: 'Product Manager', score: 89, color: 'bg-blue-100 text-blue-800' },
                    { name: 'Michael Johnson', title: 'Data Analyst', score: 77, color: 'bg-yellow-100 text-yellow-800' },
                    { name: 'Emily Davis', title: 'UX Designer', score: 68, color: 'bg-red-100 text-red-800' },
                    { name: 'Chris Brown', title: 'DevOps Engineer', score: 91, color: 'bg-green-100 text-green-800' },
                    { name: 'Samantha Wilson', title: 'Business Analyst', score: 85, color: 'bg-blue-100 text-blue-800' },
                    { name: 'David Martinez', title: 'Full Stack Developer', score: 79, color: 'bg-yellow-100 text-yellow-800' },
                    { name: 'Olivia Thompson', title: 'Marketing Specialist', score: 93, color: 'bg-green-100 text-green-800' },
                    { name: 'Liam Anderson', title: 'QA Engineer', score: 87, color: 'bg-blue-100 text-blue-800' },
                    { name: 'Sophia Miller', title: 'Technical Writer', score: 74, color: 'bg-yellow-100 text-yellow-800' },
                  ].map((applicant, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{applicant.name}</p>
                        <p className="text-sm text-muted-foreground">{applicant.title}</p>
                      </div>
                      <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${applicant.color}`}>
                        Score: {applicant.score}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column */}
          <div className="col-span-1">
            {/* Upcoming AI Interviews */}
            <Card className="p-5 border border-gray-400 rounded-lg shadow-sm bg-primary-background">
              <CardHeader>
                <CardTitle>Upcoming AI Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  You have 12 upcoming AI interviews scheduled this week.
                </div>
                <Button className="mt-4 w-full border border-gray-400 text-black hover:bg-white hover:border-gray-500 hover:text-black" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
    </div>
    </body>
  );
}
