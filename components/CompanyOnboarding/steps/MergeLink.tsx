import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { useCompany } from '@/hooks/useCompany';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMergeLink } from '@mergeapi/react-merge-link';
import { updateCompany } from '@/utils/supabase/queries';
import { toast } from '@/components/Toasts/use-toast';

interface MergeLinkProps {
  onCompletion: (isComplete: boolean) => void;
}

const MergeLink: React.FC<MergeLinkProps> = ({ onCompletion }) => {
  const { user, loading: userLoading } = useUser();
  const { company, loading: companyLoading } = useCompany();
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const hasMergeApiKey = company?.merge_account_token ? true : false;

  const createMergeLinkToken = async () => {
    if (!user || !company) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User or company information is missing.'
      });
      return;
    }

    try {
      const response = await fetch('/api/merge/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          end_user_origin_id: user.id,
          end_user_organization_name: company.name,
          end_user_email_address: user.email,
          categories: ['ats']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create link token');
      }

      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error creating link token. Please try again.'
      });
      console.error('Error creating link token:', err);
    }
  };

  useEffect(() => {
    onCompletion(hasMergeApiKey);
  }, [hasMergeApiKey]);

  const onSuccess = useCallback(
    async (public_token: string) => {
      try {
        const response = await fetch(`/api/merge/exchange/${public_token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to exchange token');
        }

        const data = await response.json();
        const accountToken = data.account_token;

        if (!company) {
          throw new Error('Company not found');
        }

        const updatedCompany = await updateCompany(company.id, {
          ...company,
          merge_account_token: accountToken
        });

        if (!updatedCompany) {
          throw new Error('Failed to update company with Merge token');
        }

        onCompletion(true);
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error connecting to ATS. Please try again.'
        });
        console.error('Error in token exchange:', err);
      }
    },
    [company, onCompletion]
  );

  useEffect(() => {
    if (!userLoading && !companyLoading && !linkToken) {
      createMergeLinkToken();
    }
  }, [userLoading, companyLoading, linkToken]);

  const { open, isReady } = useMergeLink({
    linkToken: linkToken || '',
    onSuccess
  });

  if (userLoading || companyLoading || !linkToken || !isReady) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">
        {hasMergeApiKey ? 'Modify ATS Integration' : 'Connect Your ATS'}
      </h2>
      <p className="mb-6">
        {hasMergeApiKey
          ? 'Update your Applicant Tracking System integration'
          : 'Connect your Applicant Tracking System to get started'}
      </p>
      <Button onClick={open} className="mx-auto">
        {hasMergeApiKey ? 'Update ATS Connection' : 'Connect ATS'}
      </Button>
    </div>
  );
};

export default MergeLink;
