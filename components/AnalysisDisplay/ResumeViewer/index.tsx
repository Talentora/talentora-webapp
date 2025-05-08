import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface ResumeViewerProps {
  portalProps: portalProps;
}

const ResumeViewerSkeleton = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Resume</h2>
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
};

const ResumeViewer = ({ portalProps }: ResumeViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const { mergeApplicant, AI_summary } = portalProps;

  const resumeAnalysis = AI_summary?.resume_analysis || null;
  const hasResumeScores = !!resumeAnalysis;

  // Get all attachments from candidate
  const candidateAttachments = mergeApplicant?.candidate?.attachments || [];

  // Find resume attachments if they exist
  interface Attachment {
    id: string;
    file_type?: string;
    name?: string;
  }

  const resumeAttachments: string[] = candidateAttachments.filter(
    (attachmentId: string) => {
      return attachmentId;
    }
  );

  // Use first resume attachment if available
  const resumeAttachment = resumeAttachments[0];

  const { data: resumeData, isLoading: isResumeLoading } = useQuery({
    queryKey: ['resume', resumeAttachment],
    queryFn: async () => {
      if (!resumeAttachment) return null;
      const response = await fetch(
        `/api/merge/resume?attachmentId=${resumeAttachment}`
      );
      if (!response.ok) throw new Error('Failed to fetch resume');
      return response.json();
    },
    enabled: !!resumeAttachment
  });

  const { data: pdfBlob, isLoading: isPdfLoading } = useQuery({
    queryKey: ['resumePdf', resumeData?.file_url],
    queryFn: async () => {
      if (!resumeData?.file_url) return null;
      const encodedUrl = encodeURIComponent(resumeData.file_url);
      const response = await fetch(
        `/api/merge/resume/pdf?fileUrl=${encodedUrl}`
      );
      if (!response.ok) throw new Error('Failed to fetch PDF');
      return response.blob();
    },
    enabled: !!resumeData?.file_url
  });

  useEffect(() => {
    if (pdfBlob) {
      const blobUrl = URL.createObjectURL(pdfBlob);
      setDisplayUrl(blobUrl);
    }
  }, [pdfBlob]);

  // Cleanup function for blob URL
  useEffect(() => {
    return () => {
      if (displayUrl) {
        URL.revokeObjectURL(displayUrl);
      }
    };
  }, [displayUrl]);

  const isLoading = isResumeLoading || isPdfLoading;

  if (isLoading) {
    return (
      <div className="space-y-4 pd-4">
        <h2 className="text-2xl font-semibold">Loading resume...</h2>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="container mx-auto">
        <div className="space-y-4 mb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Resume</h2>
          </div>
          <Alert intent="info" title="No Resume Available">
            <AlertDescription>
              No resume was found for this applicant.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (displayUrl) {
      window.open(displayUrl, '_blank');
    } else if (resumeData?.file_url) {
      window.open(resumeData.file_url, '_blank');
    }
  };

  // Helper component for displaying scores with progress bars
  function ScoreItem({ label, score }: { label: string; score: number }) {
    // Convert score to percentage (assuming scores are on a 0-10 scale)
    const percentage = (score / 10) * 100;

    // Determine color based on score
    const getScoreColor = (score: number) => {
      if (score >= 7) return 'bg-green-500';
      if (score >= 4) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="font-medium">{score}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
          <div
            className={`absolute top-0 right-0 h-full rounded-full ${getScoreColor(score)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-2xl font-semibold mb-5">Resume</h2>
        {isExpanded ? (
          <ChevronUp className="h-6 w-6" />
        ) : (
          <ChevronDown className="h-6 w-6" />
        )}
      </div>

      {isExpanded && (
        <div className="rounded-lg pb-4">
          <div className="flex gap-6">
            <div className="w-3/5 h-[600px]">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : displayUrl ? (
                <object
                  data={displayUrl}
                  type="application/pdf"
                  className="w-full h-full border rounded-lg"
                  aria-label="PDF Document"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-muted-foreground mb-2">
                      Unable to display PDF inline.
                    </p>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </object>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">
                      Failed to load PDF preview
                    </p>
                    {resumeData?.file_url && (
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-2/5 h-[600px]">
              {hasResumeScores ? (
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-2">
                    Resume Assessment
                  </h3>
                  <div className="space-y-3">
                    <ScoreItem
                      label="Overall Resume Score"
                      score={(resumeAnalysis as any)?.resumeScore || 0}
                    />
                    <ScoreItem
                      label="Technical Skills"
                      score={(resumeAnalysis as any)?.technicalScore || 0}
                    />
                    <ScoreItem
                      label="Culture Fit"
                      score={(resumeAnalysis as any)?.cultureFitScore || 0}
                    />
                    <ScoreItem
                      label="Communication"
                      score={(resumeAnalysis as any)?.communicationScore || 0}
                    />
                  </div>
                </div>
              ) : (
                <Alert
                  intent="info"
                  title="Candidate resume evaluation not available"
                >
                  <AlertDescription>
                    The resume evaluation for this candidate is not available
                    yet. Please check back later.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      )}

      {/* <div className="rounded-lg pb-4">
        <div className="flex gap-6">
          <div className="w-3/5 h-[600px]">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : displayUrl ? (
              <object
                data={displayUrl}
                type="application/pdf"
                className="w-full h-full border rounded-lg"
                aria-label="PDF Document"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-muted-foreground mb-2">
                    Unable to display PDF inline.
                  </p>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </object>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    Failed to load PDF preview
                  </p>
                  {resumeData?.file_url && (
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-2/5 h-[600px]">
            {hasResumeScores ? (
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Resume Assessment</h3>
                <div className="space-y-3">
                  <ScoreItem
                    label="Overall Resume Score"
                    score={(resumeAnalysis as any)?.resumeScore || 0}
                  />
                  <ScoreItem
                    label="Technical Skills"
                    score={(resumeAnalysis as any)?.technicalScore || 0}
                  />
                  <ScoreItem
                    label="Culture Fit"
                    score={(resumeAnalysis as any)?.cultureFitScore || 0}
                  />
                  <ScoreItem
                    label="Communication"
                    score={(resumeAnalysis as any)?.communicationScore || 0}
                  />
                </div>
              </div>
            ) : (
              <Alert
                intent="info"
                title="Candidate Resume Evaluation Not Available"
              >
                <AlertDescription>
                  The resume evaluation for this candidate is not available yet.
                  Please check back later.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
};

ResumeViewer.Skeleton = ResumeViewerSkeleton;

export default ResumeViewer;
