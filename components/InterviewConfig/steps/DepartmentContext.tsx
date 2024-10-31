'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface DepartmentContextProps {
  onCompletion: (isComplete: boolean) => void;
}

export const DepartmentContext: React.FC<DepartmentContextProps> = ({
  onCompletion
}) => {
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [departmentCulture, setDepartmentCulture] = useState('');
  const [departmentGoals, setDepartmentGoals] = useState('');
  const [departmentHistory, setDepartmentHistory] = useState('');
  const [departmentProducts, setDepartmentProducts] = useState('');
  const [departmentCustomers, setDepartmentCustomers] = useState('');

  const handleChange = () => {
    // Mark as complete if all fields meet minimum length requirement
    const isComplete =
      departmentDescription.length >= 100 &&
      departmentCulture.length >= 100 &&
      departmentGoals.length >= 100 &&
      departmentHistory.length >= 100 &&
      departmentProducts.length >= 100 &&
      departmentCustomers.length >= 100;
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
            value={departmentDescription}
            onChange={(e) => {
              setDepartmentDescription(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${departmentDescription.length < 100 && departmentDescription.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {departmentDescription.length < 100 &&
            departmentDescription.length > 0 && (
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
            value={departmentCulture}
            onChange={(e) => {
              setDepartmentCulture(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${departmentCulture.length < 100 && departmentCulture.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {departmentCulture.length < 100 && departmentCulture.length > 0 && (
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
            value={departmentHistory}
            onChange={(e) => {
              setDepartmentHistory(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${departmentHistory.length < 100 && departmentHistory.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {departmentHistory.length < 100 && departmentHistory.length > 0 && (
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
            value={departmentGoals}
            onChange={(e) => {
              setDepartmentGoals(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${departmentGoals.length < 100 && departmentGoals.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {departmentGoals.length < 100 && departmentGoals.length > 0 && (
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
            value={departmentProducts}
            onChange={(e) => {
              setDepartmentProducts(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${departmentProducts.length < 100 && departmentProducts.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {departmentProducts.length < 100 && departmentProducts.length > 0 && (
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
            value={departmentCustomers}
            onChange={(e) => {
              setDepartmentCustomers(e.target.value);
              handleChange();
            }}
            className={`min-h-[100px] ${departmentCustomers.length < 100 && departmentCustomers.length > 0 ? 'border-red-500' : ''}`}
            required
          />
          {departmentCustomers.length < 100 &&
            departmentCustomers.length > 0 && (
              <p className="text-sm text-red-500">
                Please enter at least 100 characters
              </p>
            )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => {
            const departmentContext = {
              departmentGoals,
              departmentProducts,
              departmentCustomers,
              departmentDescription,
              departmentCulture,
              departmentHistory
            };
            // TODO: Add API call to save company context
            console.log('Saving department context:', departmentContext);

            onCompletion(true);
          }}
          className="bg-primary text-white hover:bg-primary/90"
          disabled={
            !(
              departmentDescription.length >= 100 &&
              departmentCulture.length >= 100 &&
              departmentGoals.length >= 100 &&
              departmentHistory.length >= 100 &&
              departmentProducts.length >= 100 &&
              departmentCustomers.length >= 100
            )
          }
        >
          Save Department Context
        </Button>
      </div>
    </div>
  );
};

export default DepartmentContext;
