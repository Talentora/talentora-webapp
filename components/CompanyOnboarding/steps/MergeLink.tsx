import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMergeLink } from '@mergeapi/react-merge-link';
import { updateCompany } from '@/utils/supabase/queries';
import { toast } from '@/components/Toasts/use-toast';

interface MergeLinkProps {
  onCompletion: (isComplete: boolean) => void;
}

const MergeLink: React.FC<MergeLinkProps> = ({ onCompletion }) => {
  const { user, company } = useUser();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  // Flag to track if we've already tried to create a token
  const [tokenRequested, setTokenRequested] = useState(false);

  // Memoize these values to prevent recreating them on every render
  const userId = user.data?.id;
  const userEmail = user.data?.email;
  const companyName = company.data?.name;
  const companyId = company.data?.id;
  const hasMergeApiKey = company.data?.merge_account_token ? true : false;

  const createMergeLinkToken = useCallback(async () => {
    if (!userId || !companyName || !userEmail || tokenRequested) {
      return;
    }

    setTokenRequested(true);

    try {
      const response = await fetch('/api/merge/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          end_user_origin_id: userId,
          end_user_organization_name: companyName,
          end_user_email_address: userEmail,
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
      // Reset flag to allow retrying
      setTokenRequested(false);
    }
  }, [userId, userEmail, companyName, tokenRequested]);

  // Only run once when data is available and token hasn't been requested yet
  useEffect(() => {
    if (!linkToken && !user.loading && !company.loading && !tokenRequested) {
      createMergeLinkToken();
    }
  }, [createMergeLinkToken, linkToken, user.loading, company.loading, tokenRequested]);


  // Completion effect
  useEffect(() => {
    // Only mark as complete if we have a Merge API key
    if (hasMergeApiKey) {
      onCompletion(true);
    }
  }, [hasMergeApiKey, onCompletion]);



  const onSuccess = useCallback(
    async (public_token: string) => {
      if (!companyId) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Company ID is missing.'
        });
        return;
      }

      try {
        const accountTokenResponse = await fetch(`/api/merge/exchange/${public_token}/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!accountTokenResponse.ok) {
          throw new Error('Failed to exchange token');
        }

        const data = await accountTokenResponse.json();
        const accountToken = data.account_token;
        const linkedAccountId = data.linked_account_id;

        
        const updatedCompany = await updateCompany(
          companyId, {
          merge_account_token: accountToken,
          merge_linked_account_id: linkedAccountId
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
    [companyId, onCompletion, userId]
  );

  // Memoize the Merge Link config
  const mergeLinkConfig = useMemo(() => ({
    linkToken: linkToken || '',
    onSuccess
  }), [linkToken, onSuccess]);

  const { open, isReady } = useMergeLink(mergeLinkConfig);

  if (user.loading || company.loading || !linkToken || !isReady) {
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
