'use client';

import { useState } from 'react';

interface CompanyContextProps {
  onCompletion: (isComplete: boolean) => void;
}

export const CompanyContext: React.FC<CompanyContextProps> = ({
  onCompletion
}) => {
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyCulture, setCompanyCulture] = useState('');
  const [companyGoals, setCompanyGoals] = useState('');
  const [companyHistory, setCompanyHistory] = useState('');
  const [companyProducts, setCompanyProducts] = useState('');
  const [companyCustomers, setCompanyCustomers] = useState('');

  const handleChange = () => {
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
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Company Context</h2>

        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            Providing detailed company context is crucial for our AI recruiter
            to effectively represent your organization to potential candidates.
            This information helps create more meaningful conversations and
            ensures candidates receive accurate, engaging information about your
            company. Here's what we'll need from you:
          </p>

          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Company Description:</strong> Your mission, vision, and
              core activities that define what you do
            </li>
            <li>
              <strong>Culture and Values:</strong> What makes your workplace
              unique and what principles guide your team
            </li>
            <li>
              <strong>Company History:</strong> Your origin story and key
              milestones that shaped your organization
            </li>
            <li>
              <strong>Vision and Goals:</strong> Where you're headed and what
              you aim to achieve
            </li>
            <li>
              <strong>Products and Services:</strong> What you offer and how it
              creates value
            </li>
            <li>
              <strong>Target Audience:</strong> Who you serve and how you meet
              their needs
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyContext;
