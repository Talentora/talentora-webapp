import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { useCompany } from '@/hooks/useCompany';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMergeLink } from "@mergeapi/react-merge-link";
import { MergeClient, Merge } from '@mergeapi/merge-node-client';
import { createClient } from '@/utils/supabase/client';
import { link } from 'fs';

// New component to handle the merge link
const MergeLinkHandler: React.FC<{ linkToken: string; onSuccess: (public_token: string) => void }> = ({ linkToken, onSuccess }) => {
  const { open, isReady, error } = useMergeLink({
      linkToken: linkToken,
      onSuccess,
      
  });

  useEffect(() => {
      console.log("MergeLinkHandler - isReady:", isReady);
  }, [isReady]);

  if (error) {
      console.error("MergeLinkHandler error:", error);
      return <div>Error loading Merge Link. Please try again later.</div>; // Display error message
  }

  return (
      <div>
          <p>Ready: {isReady ? 'Yes' : 'No'}</p>
          <p>Link Token: {linkToken}</p>
          <Button disabled={!isReady} onClick={open}>
              Open Merge Link
          </Button>
      </div>
  );
};

interface MergeLinkProps {
  onCompletion: (isComplete: boolean) => void; // Add onCompletion prop
}

const MergeLink: React.FC<MergeLinkProps> = ({ onCompletion }) => {
  const { user, loading: userLoading } = useUser();
  const { company, loading: companyLoading } = useCompany();
    const [linkToken, setLinkToken] = useState<string | null>(null);
  
    const createMergeLinkToken = async () => {
        if (!user || !company) {
          console.error("User or company information is missing.");
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
              categories: ['hris', 'ats', 'filestorage'],
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to create link token');
          }
    
          const data = await response.json();
          setLinkToken(data.link_token);
          console.log("Link token created:", data.link_token);
        } catch (error) {
          console.error("Error creating link token:", error);
        }
      };
  
      useEffect(() => {
        if (!userLoading && !companyLoading) {
          createMergeLinkToken();
        }
      }, [userLoading, companyLoading]);
  
    const onSuccess = useCallback(async (public_token: string) => {
        const mergeApiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
        if (!mergeApiKey) {
            throw new Error('Merge API key is not set');
        }
        const merge = new MergeClient({apiKey: mergeApiKey});
        const accountTokenResponse = await merge.ats.accountToken.retrieve(public_token);
        console.log("Account token response:", accountTokenResponse);

        // store the account token in the database
        const supabase = createClient();
        

        // store the account token in the database
        // const { data, error } = await supabase
        //     .from('company_onboarding')
        //     .update({ merge_account_token: accountTokenResponse.data.account_token })
        //     .eq('id', company.id);

        onCompletion(true);
    }, []);
  
    if (!linkToken) {
      return <Loader2 className="animate-spin" />;
    } else {
      return (
        <MergeLinkHandler linkToken={linkToken} onSuccess={onSuccess} />
      );
    }
  };
  
  export default MergeLink;


