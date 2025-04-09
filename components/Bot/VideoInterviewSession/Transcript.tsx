import useCombinedTranscriptions from "@/hooks/useCombinedTransactions";
import * as React from "react";

interface TranscriptionSegment {
  id: string;
  role: string;
  text: string;
  firstReceivedTime: number;
}

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions();
  const containerRef = React.useRef<HTMLDivElement>(null);

 

  return (
    <div 
      ref={containerRef}
      className="h-full flex flex-col gap-4 p-4 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 200px)' }} // Adjust this value based on your layout
    >
      {combinedTranscriptions.map((segment: TranscriptionSegment) => (
        <div
          id={segment.id}
          key={segment.id}
          className={`flex flex-col gap-1 ${
            segment.role === "assistant" ? "items-start" : "items-end"
          }`}
        >
          <div className="text-xs text-gray-500">
            {segment.role === "assistant" ? "Interviewer" : "Interviewee"}
          </div>
          <div
            className={`max-w-[80%] rounded-lg p-3 break-words ${
              segment.role === "assistant"
                ? "bg-gray-100 text-gray-900"
                : "bg-primary text-white"
            }`}
          >
            {segment.text}
          </div>
        </div>
      ))}
    </div>
  );
}