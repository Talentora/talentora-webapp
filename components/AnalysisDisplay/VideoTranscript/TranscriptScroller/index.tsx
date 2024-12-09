import { ScrollArea } from "@/components/ui/scroll-area"

interface TranscriptEntry {
  speaker: string
  text: string
}

interface TranscriptViewerProps {
  transcript: TranscriptEntry[]
}


export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  // console.log('transcript', transcript)

  return (
    <ScrollArea className="h-[300px] w-full rounded-md p-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
      {transcript.map((entry, index) => (
        <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="min-w-[100px] font-medium text-sm text-gray-600">
              {entry.speaker}
            </div>
            <p className="text-gray-800 leading-relaxed">
              {entry.text}
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}

