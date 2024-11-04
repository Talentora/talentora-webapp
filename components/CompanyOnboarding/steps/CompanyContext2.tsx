'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CompanyContextProps {
  onCompletion: (isComplete: boolean) => void;
}

export const CompanyContext2: React.FC<CompanyContextProps> = ({
  onCompletion
}) => {
  const [companyDescription, setCompanyDescription] = useState(
    'Talentora is a pioneering AI recruitment platform that is revolutionizing the hiring process through advanced artificial intelligence. Our platform specializes in conducting first-round interviews, making the recruitment process more efficient and effective for both companies and candidates.'
  );
  const [companyCulture, setCompanyCulture] = useState(
    'At Talentora, we foster a culture of innovation, inclusivity, and continuous learning. We believe in pushing the boundaries of what\'s possible in recruitment technology while maintaining a human-centric approach. Our team values collaboration, creative problem-solving, and maintaining a healthy work-life balance. We celebrate diversity and encourage open communication at all levels.'
  );
  const [companyGoals, setCompanyGoals] = useState(
    'Our vision is to become the global leader in AI-powered recruitment solutions. We aim to transform the hiring landscape by making first-round interviews more efficient, consistent, and bias-free. Our strategic goals include expanding our AI capabilities, enhancing candidate experience, and helping companies build stronger, more diverse teams through better hiring practices.'
  );
  const [companyHistory, setCompanyHistory] = useState(
    'Talentora was founded in 2023 by a team of AI experts and HR professionals who recognized the need for innovation in the recruitment process. What started as a solution for streamlining first-round interviews has evolved into a comprehensive AI recruitment platform. We\'ve successfully helped numerous companies optimize their hiring processes and have continuously refined our AI technology based on real-world feedback.'
  );
  const [companyProducts, setCompanyProducts] = useState(
    'Our flagship product is an AI-powered interview platform that conducts intelligent first-round interviews. The system uses advanced natural language processing to engage candidates in meaningful conversations, assess their qualifications, and provide detailed insights to hiring managers. Additional features include customizable interview frameworks, multilingual support, and comprehensive analytics for better hiring decisions.'
  );
  const [companyCustomers, setCompanyCustomers] = useState(
    'We serve a diverse range of businesses, from fast-growing startups to established enterprises, who are looking to modernize their recruitment process. Our platform is particularly valuable for companies with high-volume hiring needs, those seeking to reduce bias in their hiring process, and organizations looking to improve their candidate experience. We\'ve helped customers across technology, healthcare, finance, and retail sectors.'
  );

  

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Company Context</h2>
        <p className="text-gray-500">
          This is a sample company context created by Talentora. Scroll down to bottom, select next, and edit your company's company context.
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
            }}
            className={`min-h-[100px] ${companyDescription.length < 100 && companyDescription.length > 0 ? 'border-red-500' : ''}`}
            required
            disabled
          />
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
            }}
            className={`min-h-[100px] ${companyCulture.length < 100 && companyCulture.length > 0 ? 'border-red-500' : ''}`}
            required
            disabled
          />
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
            }}
            className={`min-h-[100px] ${companyHistory.length < 100 && companyHistory.length > 0 ? 'border-red-500' : ''}`}
            required
            disabled
          />
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
            }}
            className={`min-h-[100px] ${companyGoals.length < 100 && companyGoals.length > 0 ? 'border-red-500' : ''}`}
            required
            disabled
          />
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
            }}
            className={`min-h-[100px] ${companyProducts.length < 100 && companyProducts.length > 0 ? 'border-red-500' : ''}`}
            required
            disabled
          />
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
            }}
            className={`min-h-[100px] ${companyCustomers.length < 100 && companyCustomers.length > 0 ? 'border-red-500' : ''}`}
            required
            disabled
          />
        </div>
      </div>

      
    </div>
  );
};
