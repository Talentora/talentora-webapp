import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useToast } from '@/components/Toasts/use-toast';
import { ToastAction } from '@/components/Toasts/toast';
import { inviteRecruiter } from '@/utils/supabase/queries';
import { Loader2 } from 'lucide-react';
import { Recruiter } from '@/types/merge';

export const TeamMembersStep = ({
  onCompletion
}: {
  onCompletion: (isComplete: boolean) => void;
}) => {
  const { toast } = useToast();

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<
    { name: string; email: string }[]
  >([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecruiters() {
      try {
        const response = await fetch('/api/recruiters');
        if (!response.ok) {
          throw new Error('Failed to fetch recruiters');
        }
        const data = await response.json();
        setRecruiters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch team members. Please try again.',
          action: <ToastAction altText="Try again">Try again</ToastAction>
        });
      }
    }
    fetchRecruiters();
  }, [toast]);

  const handleCheckboxChange = (recruiter: { name: string; email: string }) => {
    setSelectedTeamMembers((prev) => {
      if (prev.some((member) => member.email === recruiter.email)) {
        return prev.filter((member) => member.email !== recruiter.email);
      } else {
        return [...prev, recruiter];
      }
    });
  };

  const handleInviteTeammates = async () => {
    try {
      for (const recruiter of selectedTeamMembers) {
        const result = await inviteRecruiter(recruiter.name, recruiter.email);
        if (!result.success) {
          throw new Error(`Failed to invite ${recruiter.email}`);
        }
      }

      toast({
        title: 'Invites Sent!',
        description: 'Team members have been invited successfully.',
        duration: 5000
      });
    } catch (error) {
      console.error('Error inviting teammates:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to invite teammates. Please try again.',
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Invite Your Team</h3>
      <p>Select team members to invite them to your workspace.</p>

      <div className="grid w-full items-center gap-1.5">
        <div className="mt-2">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            recruiters.map((recruiter) => {
              const email = recruiter.email || `recruiter-${recruiter.id}`;
              return (
                <div key={recruiter.id} className="flex items-center mb-2 ">
                  <input
                    type="checkbox"
                    id={`checkbox-${recruiter.id}`}
                    checked={selectedTeamMembers.some(
                      (member) => member.email === email
                    )}
                    onChange={() =>
                      handleCheckboxChange({
                        name: `${recruiter.first_name} ${recruiter.last_name}`,
                        email
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor={`checkbox-${recruiter.id}`}>
                    {`${recruiter.first_name ? `${recruiter.first_name} ${recruiter.last_name}` : recruiter.email}`}
                  </label>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Button onClick={handleInviteTeammates}>Invite Teammates</Button>
    </div>
  );
};
