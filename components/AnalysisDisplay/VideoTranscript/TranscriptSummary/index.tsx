import { Info } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Sparkles } from "lucide-react"
interface InterviewSummaryProps {
  summary: string
}

export function InterviewSummary({ summary }: InterviewSummaryProps) {
  return (
    <div>
      <div className="flex flex-row items-center justify-between py-6">
        <h2 className="text-2xl font-semibold">Interview Summary</h2>
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
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>AI Generated Summary</span>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {summary}
          </p>
        </div>
      </div>
    </div>
  )
}
