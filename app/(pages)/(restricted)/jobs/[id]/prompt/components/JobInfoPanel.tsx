import { useState, Suspense } from 'react';
import { Job } from '@/types/merge';
import dynamic from 'next/dynamic';

const Markdown = dynamic(() => import('react-markdown'), {
  ssr: false,
});

interface JobInfoPanelProps {
  job: Job | null;
}

export default function JobInfoPanel({ job }: JobInfoPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderDescription = () => {
    if (job?.description) {
      if (job.description.startsWith('```markdown')) {
        return <Markdown>{job.description}</Markdown>;
      } else {
        return <div dangerouslySetInnerHTML={{ __html: job.description }} />;
      }
    }
    return <p>No description available.</p>;
  };

  return (
    <div className="bg-white shadow-md">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h1 className="text-2xl font-bold">{job?.name || 'Job Details'}</h1>
        <button className="text-gray-500">
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">ID: {job?.id}</p>
              <p className="text-gray-600">Status: {job?.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Created: {job?.created_at && new Date(job.created_at).toLocaleString()}</p>
              <p className="text-gray-600">Updated: {job?.modified_at && new Date(job.modified_at).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            {renderDescription()}
          </div>
        </div>
      )}
    </div>
  );
} 