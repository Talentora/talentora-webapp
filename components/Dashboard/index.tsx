import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BriefcaseIcon, Ellipsis,Settings,Navigation, HomeIcon, MessageSquareIcon, UserIcon, UsersIcon } from "lucide-react"

import { Tables } from "@/types/types_db"
type Job = Tables<'jobs'>
type Applicant = Tables<'applicants'>

interface DashboardProps {
        jobs:Job[]
        // applicants:Applicant[]
    }

export default function Dashboard(
    {jobs}: DashboardProps
) {

    
    return (
        <div className="flex h-screen bg-primary-background">
       

            <main className="flex-1 p-8 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Recruiting Dashboard</h1>
                <div className="grid grid-cols-2 gap-6">
                    {/* fact 1  */}
                    <Card className="border p-5 border-gray-300 rounded-lg shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                            <Link href="/applicants">
                                <UsersIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">+21% from last month</p>
                        </CardContent>
                    </Card>
                    
                    {/* fact 2 */}
                    <Card className="border p-5 border-gray-300 rounded-lg shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">AI Interviews Completed</CardTitle>
                            <Link href="/interviews">
                                <UserIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">56</div>
                            <p className="text-xs text-muted-foreground">12 upcoming this week</p>
                        </CardContent>
                    </Card>

                    {/* active jobs */}
                    <Card className="col-span-2 p-5 border border-gray-300 rounded-lg shadow-sm">
                        <CardHeader>
                            <CardTitle>Active Job Titles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {jobs.length === 0 ? (
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-4">No jobs available.</p>
                                    <Link href="/jobs">
                                        <Button variant="outline">Create a Job</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {jobs.slice(0, 5).map((job, index) => (
                                        <div key={index} className="bg-gray-200 p-4 rounded shadow-sm relative group">
                                            <p className="font-medium">Job {job.id} - {job.title}</p>
                                            <div className={`w-1/4 px-2 py-1 rounded text-xs font-medium ${job.department === 'Engineering' ? 'bg-blue-100 text-blue-800' : job.department === 'Marketing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
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

                    {/* applicant overview */}
                    <Card className="col-span-2 p-5 row-span-2 border border-gray-300 rounded-lg shadow-sm">
                        <CardHeader>
                            <CardTitle>Applicant Overview</CardTitle>
                            {/* <Navigate className="h-4 w-4 text-muted-foreground cursor-pointer" /> */}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">John Doe</p>
                                        <p className="text-sm text-muted-foreground">Software Engineer</p>
                                    </div>
                                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        Score: 95
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Jane Smith</p>
                                        <p className="text-sm text-muted-foreground">Product Manager</p>
                                    </div>
                                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        Score: 92
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Mike Johnson</p>
                                        <p className="text-sm text-muted-foreground">UX Designer</p>
                                    </div>
                                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        Score: 78
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Emily Brown</p>
                                        <p className="text-sm text-muted-foreground">Data Scientist</p>
                                    </div>
                                    <div className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        Score: 65
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Alex Lee</p>
                                        <p className="text-sm text-muted-foreground">Frontend Developer</p>
                                    </div>
                                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        Score: 88
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Sarah Wilson</p>
                                        <p className="text-sm text-muted-foreground">Marketing Specialist</p>
                                    </div>
                                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        Score: 76
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* bot */}
                    <Card className="p-5 border border-gray-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recruiting Bot</CardTitle>
                            <Link href="/bot">
                                <MessageSquareIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm mb-4">AI-powered assistant for recruiting tasks</p>
                                <Button className="w-full" variant="outline">
                                    Chat with Bot
                                </Button>
                        </CardContent>
                    </Card>
                    
                    {/* settings */}
                    <Card className="p-5 border border-gray-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Settings</CardTitle>
                                <Settings className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm mb-4">Manage your account and preferences</p>
                            <Link href="/dashboard/settings">
                                <Button className="w-full" variant="outline">
                                    Open Settings
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}