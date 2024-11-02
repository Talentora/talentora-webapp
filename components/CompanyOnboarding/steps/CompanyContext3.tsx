'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CompanyContextProps {
  onCompletion: (isComplete: boolean) => void;
}

export const CompanyContext3: React.FC<CompanyContextProps> = ({
  onCompletion
}) => {
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyCulture, setCompanyCulture] = useState('');
  const [companyGoals, setCompanyGoals] = useState('');
  const [companyHistory, setCompanyHistory] = useState('');
  const [companyProducts, setCompanyProducts] = useState('');
  const [companyCustomers, setCompanyCustomers] = useState('');

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
            const companyContext = {
              companyGoals,
              companyProducts,
              companyCustomers,
              companyDescription,
              companyCulture,
              companyHistory
            };
            // TODO: Add API call to save company context
            console.log('Saving company context:', companyContext);

            onCompletion(true);
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
          Save Company Context
        </Button>
      </div>
    </div>
  );
};

