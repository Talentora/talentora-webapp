import { Application } from "@/types/greenhouse"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ApplicationStatusProps {
  application: Application;
}

export default function ApplicationStatus({ application }: ApplicationStatusProps) {
  const progress = 75 // This should be calculated based on the application status

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Stage:</span>
            <span className="text-sm">{application.status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}