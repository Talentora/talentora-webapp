import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
interface InterviewSummaryProps {
  summary: string
}

export function InterviewSummary({ summary }: InterviewSummaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Interview Summary</CardTitle>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="ml-auto" />
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black">
              This is an AI summary of the assessment / interview
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </CardHeader>
      <CardContent>
        <p>{summary}</p>
      </CardContent>
    </Card>
  )
}
