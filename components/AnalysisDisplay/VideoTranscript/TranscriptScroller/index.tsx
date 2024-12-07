import { ScrollArea } from "@/components/ui/scroll-area"

interface TranscriptEntry {
  speaker: string
  text: string
}

interface TranscriptViewerProps {
  transcript: TranscriptEntry[]
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  return (
    <ScrollArea className="h-[200px] w-full rounded-md p-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
      {transcript.map((entry, index) => (
        <div key={index} className="mb-4">
          <strong className="text-primary">{entry.speaker}:</strong>
          <p className="mt-1">{entry.text}</p>
        </div>
      ))}
    </ScrollArea>
  )
}

