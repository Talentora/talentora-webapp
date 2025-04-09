import React from 'react';
import Transcript from './Transcript';

export default function TranscriptContainer() {
  return (
    <div className="flex-1 border rounded-lg bg-white shadow-sm overflow-hidden" style={{ maxHeight: "305h" }}>
      {/* Container div for sticky header and scrollable content */}
      <div className="h-full flex flex-col">
        <h3 className="text-sm font-medium text-gray-500 p-4 border-b sticky top-0 bg-white z-10">Transcript</h3>
        <div className="flex-1 overflow-y-auto">
          <Transcript />
        </div>
      </div>
    </div>
  );
} 