import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface ResumeViewerProps {
    portalProps: portalProps;
}

const Page = ({ portalProps }: ResumeViewerProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [displayUrl, setDisplayUrl] = useState<string | null>(null);
    const { mergeApplicant } = portalProps;

    // Get all attachments from candidate
    const candidateAttachments = mergeApplicant?.candidate?.attachments || [];

    // Find resume attachments if they exist
    const resumeAttachments = candidateAttachments.filter(attachmentId => {
        return attachmentId;
    });

    // Use first resume attachment if available
    const resumeAttachment = resumeAttachments[0];

    const { data: resumeData, isLoading: isResumeLoading } = useQuery({
        queryKey: ['resume', resumeAttachment],
        queryFn: async () => {
            if (!resumeAttachment) return null;
            const response = await fetch(`/api/merge/resume?attachmentId=${resumeAttachment}`);
            if (!response.ok) throw new Error('Failed to fetch resume');
            return response.json();
        },
        enabled: !!resumeAttachment,
    });

    const { data: pdfBlob, isLoading: isPdfLoading } = useQuery({
        queryKey: ['resumePdf', resumeData?.file_url],
        queryFn: async () => {
            if (!resumeData?.file_url) return null;
            const encodedUrl = encodeURIComponent(resumeData.file_url);
            const response = await fetch(`/api/merge/resume/pdf?fileUrl=${encodedUrl}`);
            if (!response.ok) throw new Error('Failed to fetch PDF');
            return response.blob();
        },
        enabled: !!resumeData?.file_url,
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
            <div className="space-y-4">
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    if (!resumeData) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Resume</h2>
                </div>
                <Alert intent="danger" title="No Resume Available">
                    <AlertDescription>
                        No resume was found for this applicant.
                    </AlertDescription>
                </Alert>
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

    return (
        <div>
            <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-2xl font-semibold">Resume</h2>
                {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </div>
            
            {isExpanded && (
                <div className="rounded-lg p-4">
                    <div className="w-full h-[600px]">
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
                                    <p className="text-muted-foreground mb-2">Unable to display PDF inline.</p>
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
                                    <p className="text-muted-foreground mb-2">Failed to load PDF preview</p>
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
                </div>
            )}
        </div>
    );
};

export default Page;
