import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCompany, updateCompany } from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';
import { ToastAction } from '@/components/Toasts/toast';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

/**
 * CompanyInfoStep Component
 *
 * This component handles the collection and submission of company information
 * during the onboarding process.
 *
 * @component
 * @returns {JSX.Element} The rendered CompanyInfoStep component
 */
export const CompanyInfoStep: React.FC<{
  onCompletion: (isComplete: boolean) => void;
}> = ({ onCompletion }) => {
  const { recruiter, user, company } = useUser();
  const hasCompany = recruiter.data && 'company_id' in recruiter.data && recruiter.data.company_id ? true : false;

  useEffect(() => {
    onCompletion(hasCompany);
  }, [hasCompany, onCompletion]);

  const [headquarters, setHeadquarters] = useState('');
  const [industry, setIndustry] = useState('');
  const [companyName, setCompanyName] = useState('');

  const { toast } = useToast();

  /**
   * Handles the form submission for company information
   *
   * @param {React.FormEvent} event - The form submission event
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const companyData = {
      name: companyName,
      location: headquarters,
      industry,
      description: null,
      email_extension: null,
      subscription_id: null,
      website_url: null,
      merge_account_token: null,
      billing_address: null,
      payment_method: null
    };

    try {
      if (!user.data?.id) {
        throw new Error('User not found');
      }

      await createCompany(companyData, user.data.id);

      toast({
        title: 'Success',
        description: 'Company information saved successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save company information',
      });
    }
  };

  if (recruiter.loading) {
    return <Loader2 />; // Loading icon
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium">Company Information</h3>
      {hasCompany && (
        <p className="text-sm text-gray-500">
          <i>
            You are already associated with a company. If you need to update
            your company information, please contact support.
          </i>
        </p>
      )}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="company">Company Name</Label>
        <Input
          type="text"
          id="company"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder={company?.name || 'Enter your company name'}
          required
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="headquarters">Headquarters Location</Label>
        <Input
          type="text"
          id="headquarters"
          value={headquarters}
          onChange={(e) => setHeadquarters(e.target.value)}
          placeholder={
            company?.location || 'Enter your company headquarters location'
          }
          required
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="industry">Industry</Label>
        <Input
          type="text"
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder={company?.industry || 'Enter your company industry'}
          required
        />
      </div>
      <Button type="submit">
        {hasCompany ? 'Update Company Info' : 'Submit Company Info'}
      </Button>
    </form>
  );
};
