'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  createCompanyContext,
  getCompanyContext,
  updateCompanyContext,
  updateCompany
} from '@/utils/supabase/queries';
import { useToast } from '@/components/Toasts/use-toast';
import { useUser } from '@/hooks/useUser';

interface CompanyContextProps {
  onCompletion: (isComplete: boolean) => void;
}

export const CompanyContext3: React.FC<CompanyContextProps> = ({ onCompletion }) => {
  const { toast } = useToast();
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyCulture, setCompanyCulture] = useState('');
  const [companyGoals, setCompanyGoals] = useState('');
  const [companyHistory, setCompanyHistory] = useState('');
  const [companyProducts, setCompanyProducts] = useState('');
  const [companyCustomers, setCompanyCustomers] = useState('');
  const [companyContextExists, setCompanyContextExists] = useState(false);
  const companyData = useUser().company;
  
  
  // Fetch company context when company data is available
  useEffect(() => {
    const checkCompanyContext = async () => {
      if (companyData?.data?.id) {
        const context = await getCompanyContext(companyData.data.id);
        if (context) {
          setCompanyDescription(context.description || '');
          setCompanyCulture(context.culture || '');
          setCompanyGoals(context.goals || '');
          setCompanyHistory(context.history || '');
          setCompanyProducts(context.products || '');
          setCompanyCustomers(context.customers || '');
          setCompanyContextExists(true);
        }
      }
    };

    checkCompanyContext();
  }, [companyData.data?.id]);

  const handleChange = () => {
    // Mark as complete if all fields meet minimum length requirement
    const isComplete =
      companyDescription.length >= 100 &&
      companyCulture.length >= 100 &&
      companyGoals.length >= 100 &&
      companyHistory.length >= 100 &&
      companyProducts.length >= 100 &&
      companyCustomers.length >= 100;
    onCompletion(isComplete);
  };

  const handleSave = async () => {
    // Check if company context exists and decide whether to create or update
    const companyContext = {
      goals: companyGoals,
      products: companyProducts,
      customers: companyCustomers,
      description: companyDescription,
      culture: companyCulture,
      history: companyHistory,
      id: companyData?.data?.id
    };

    try {
      if (companyContextExists) {
        if (!companyData?.data?.id) {
          throw new Error('Company ID is required');
        }
        const updatedCompanyContext = await updateCompanyContext(
          companyData.data.id,
          companyContext
        );
        console.log('Updating company context:', updatedCompanyContext);
        
        // Link company to company_context
        if (companyData?.data?.id) {
          await updateCompany(companyData.data.id, {
            company_context: companyData.data.id
          });
        }
        
        toast({
          title: 'Company Context',
          description: 'Company context updated successfully!',
          variant: 'default' // Changed from 'success' to 'default' to match the expected type
        });
      } else {
        const createdCompanyContext =
          await createCompanyContext(companyContext);
        console.log('Saving company context:', createdCompanyContext);
        
        // Link company to company_context
        if (companyData?.data?.id) {
          await updateCompany(companyData.data.id, {
            company_context: companyData.data.id
          });
        }
        
        toast({
          title: 'Company Context',
          description: 'Company context saved successfully!',
          variant: 'default' // Changed from 'success' to 'default' to match the expected type
        });
      }
      onCompletion(true);
    } catch (error) {
      console.error('Error saving company context:', error);
      toast({
        title: 'Company Context',
        description: 'Failed to save company context. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Company Context</h2>
        <p className="text-gray-500">
          Help our AI recruiter understand your company better to effectively
          communicate with candidates.
        </p>
      </div>

      <div className="bg-primary/10 border-2 border-primary p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-primary">Why this matters</h3>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          This information helps our AI recruiter provide candidates with
          accurate and engaging information about your company, creating more
          meaningful conversations and better candidate matches.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-description">
            Company Description <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="company-description"
            placeholder="Describe your company's mission, vision and core business activities..."
            value={companyDescription}
            onChange={(e) => {
              setCompanyDescription(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${companyDescription.length < 100 && companyDescription.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {companyDescription.length < 100 && companyDescription.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-culture">
            Company Culture and Values <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="company-culture"
            placeholder="Describe your company's culture, values, and what makes it unique..."
            value={companyCulture}
            onChange={(e) => {
              setCompanyCulture(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${companyCulture.length < 100 && companyCulture.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {companyCulture.length < 100 && companyCulture.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-history">
            Company History <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="company-history"
            placeholder="Share your company's founding story, key milestones, and how it has evolved over time..."
            value={companyHistory}
            onChange={(e) => {
              setCompanyHistory(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${companyHistory.length < 100 && companyHistory.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {companyHistory.length < 100 && companyHistory.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-goals">
            Company Vision and Goals <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="company-goals"
            placeholder="Share your company's long-term vision and strategic goals..."
            value={companyGoals}
            onChange={(e) => {
              setCompanyGoals(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${companyGoals.length < 100 && companyGoals.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {companyGoals.length < 100 && companyGoals.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-products">
            Products and Services <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="company-products"
            placeholder="Describe your company's main products and services, and how they provide value to customers..."
            value={companyProducts}
            onChange={(e) => {
              setCompanyProducts(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${companyProducts.length < 100 && companyProducts.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {companyProducts.length < 100 && companyProducts.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-customers">
            Customer Base and Services <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-1">
              (minimum 100 characters)
            </span>
          </Label>
          <Textarea
            id="company-customers"
            placeholder="Describe your target customers and how your services address their needs..."
            value={companyCustomers}
            onChange={(e) => {
              setCompanyCustomers(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${companyCustomers.length < 100 && companyCustomers.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {companyCustomers.length < 100 && companyCustomers.length > 0 && (
            <p className="text-sm text-red-500">
              Please enter at least 100 characters
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            handleSave();
          }}
          className="bg-primary text-white hover:bg-primary/90"
          disabled={
            !(
              companyDescription.length >= 100 &&
              companyCulture.length >= 100 &&
              companyGoals.length >= 100 &&
              companyHistory.length >= 100 &&
              companyProducts.length >= 100 &&
              companyCustomers.length >= 100
            )
          }
        >
          {companyContextExists
            ? 'Update Company Context'
            : 'Save Company Context'}
        </Button>
      </div>
    </div>
  );
};
