import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Check } from 'lucide-react';
import { useToast } from '@/components/Toasts/use-toast';
import { ToastAction } from '@/components/Toasts/toast';

export const TeamMembersStep = () => {
  const { toast } = useToast();

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  useEffect(() => {
    async function fetchRecruiters() {
      try {
        const response = await fetch('/api/recruiters');
        if (!response.ok) {
          throw new Error('Failed to fetch recruiters');
        }
        const data = await response.json();
        setRecruiters(data);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch team members. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
    fetchRecruiters();
  }, [toast]);

  const handleInviteTeammates = async () => {
    const emails = selectedTeamMembers;

    try {
      const response = await fetch('/api/invite-teammates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invites');
      }
      
      toast({
        title: "Invites Sent!",
        description: "Team members have been invited successfully.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error inviting teammates:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to invite teammates. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Invite Your Team</h3>
      <p>
        Select team members to invite them to your workspace.
      </p>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="team-members">Team Members</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select team members" />
          </SelectTrigger>
          <SelectContent>
            {recruiters.map((recruiter) => (
              <SelectItem 
                key={recruiter.id} 
                value={recruiter.primary_email_address || `recruiter-${recruiter.id}`}
                onClick={() => toggleTeamMember(recruiter.primary_email_address || `recruiter-${recruiter.id}`)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{recruiter.name}</span>
                  {selectedTeamMembers.includes(recruiter.primary_email_address || `recruiter-${recruiter.id}`) && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleInviteTeammates}>
        Invite Teammates
      </Button>
    </div>
  );
};
