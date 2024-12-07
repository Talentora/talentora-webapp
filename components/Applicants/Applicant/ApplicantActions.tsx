'use client';

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { getJobInterviewConfig } from "@/utils/supabase/queries";

interface ApplicantActionsProps {
    jobId: string;
    applicantId: string;
}

interface InterviewStatus {
    isInvited: boolean;
    inviteDate?: string;
    isCompleted: boolean;
    applicationId?: string;
}

interface SetupFlags {
    hasBotId: boolean;
    hasQuestions: boolean;
    hasInterviewName: boolean;
    hasDuration: boolean;
    isReady: "yes" | "no" | "almost";
}

const ApplicantActions = ({ jobId, applicantId }: ApplicantActionsProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [interviewStatus, setInterviewStatus] = useState<InterviewStatus | null>(null);
    const [setupFlags, setSetupFlags] = useState<SetupFlags>({
        hasBotId: false,
        hasQuestions: false,
        hasInterviewName: false,
        hasDuration: false,
        isReady: "no"
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkJobSetup = async () => {
            try {
                const config = await getJobInterviewConfig(jobId);
                
                if (!config) {
                    setSetupFlags({
                        hasBotId: false,
                        hasQuestions: false,
                        hasInterviewName: false,
                        hasDuration: false,
                        isReady: "no"
                    });
                    return;
                }

                const hasBotId = !!config.bot_id;
                const hasQuestions = !!config.interview_questions;
                const hasInterviewName = !!config.interview_name;
                const hasDuration = !!config.duration;

                const isReady = (hasBotId && hasQuestions && hasInterviewName && hasDuration) ? "yes" : 
                               (!hasBotId && !hasQuestions && !hasInterviewName && !hasDuration) ? "no" : "almost";

                setSetupFlags({
                    hasBotId,
                    hasQuestions,
                    hasInterviewName,
                    hasDuration,
                    isReady
                });
            } catch (error) {
                console.error('Error checking job setup:', error);
                setError('Error checking job configuration');
            }
        };

        const checkInterviewStatus = async () => {
            const supabase = createClient();
            
            // Check if applicant has been invited
            const { data: applicationData, error: applicationError } = await supabase
                .from('applications')
                .select('id, created_at')
                .eq('job_id', jobId)
                .eq('applicant_id', applicantId)
                .single();

            if (applicationError && applicationError.code !== 'PGRST116') {
                setError('Error checking application status');
                return;
            }

            if (!applicationData) {
                setInterviewStatus({ isInvited: false, isCompleted: false });
                return;
            }

            // Check if interview is completed
            const { data: aiSummaryData, error: aiSummaryError } = await supabase
                .from('AI_summary')
                .select('id')
                .eq('application_id', applicationData.id)
                .single();

            if (aiSummaryError && aiSummaryError.code !== 'PGRST116') {
                setError('Error checking interview completion status');
                return;
            }

            setInterviewStatus({
                isInvited: true,
                inviteDate: applicationData.created_at,
                isCompleted: !!aiSummaryData,
                applicationId: applicationData.id
            });
        };

        checkJobSetup();
        checkInterviewStatus();
    }, [jobId, applicantId]);

    const handleInvite = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('applications')
                .insert([
                    { job_id: jobId, applicant_id: applicantId }
                ])
                .select()
                .single();

            if (error) throw error;

            setInterviewStatus({
                isInvited: true,
                inviteDate: data.created_at,
                isCompleted: false,
                applicationId: data.id
            });

            router.refresh();
        } catch (error) {
            console.error('Error inviting applicant:', error);
            setError('Failed to invite applicant');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <Button variant="destructive" disabled>
                Error: {error}
            </Button>
        );
    }

    // State 1: Job not setup or not ready
    if (setupFlags.isReady !== "yes") {
        return (
            <Button disabled className="w-full">
                <CalendarClock className="mr-2 h-4 w-4" />
                {setupFlags.isReady === "almost" ? "Complete Job Setup First" : "Setup Job Interview First"}
            </Button>
        );
    }

    // Loading state
    if (loading) {
        return (
            <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invite...
            </Button>
        );
    }

    // State 2: Ready to invite
    if (!interviewStatus?.isInvited) {
        return (
            <Button onClick={handleInvite} className="w-full">
                <CalendarClock className="mr-2 h-4 w-4" />
                Schedule AI Interview
            </Button>
        );
    }

    // State 3: Already invited
    return (
        <div className="w-full space-y-2">
            <Button 
                variant="outline" 
                className="w-full" 
                disabled
            >
                <CalendarClock className="mr-2 h-4 w-4" />
                {interviewStatus.isCompleted ? 'Interview Completed' : 'Interview Scheduled'}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
                Invited on {format(new Date(interviewStatus.inviteDate!), 'MMM d, yyyy')}
                {interviewStatus.isCompleted && ' • Completed'}
            </div>
        </div>
    );
};

export default ApplicantActions;
