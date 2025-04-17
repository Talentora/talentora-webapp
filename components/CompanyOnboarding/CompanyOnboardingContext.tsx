import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the company data interface
interface CompanyData {
  companyName?: string;
  location?: string;
  industry?: string;
  // Add other company data fields as needed
}

// Define the context interface
interface CompanyOnboardingContextType {
  companyData: CompanyData;
  updateCompanyData: (data: Partial<CompanyData>) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

// Create the context with default values
const CompanyOnboardingContext = createContext<CompanyOnboardingContextType>({
  companyData: {},
  updateCompanyData: () => {},
  currentStep: 1,
  nextStep: () => {},
  prevStep: () => {},
  setStep: () => {},
});

// Create the provider component
interface CompanyOnboardingProviderProps {
  children: ReactNode;
}

export const CompanyOnboardingProvider: React.FC<CompanyOnboardingProviderProps> = ({ children }) => {
  const [companyData, setCompanyData] = useState<CompanyData>({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateCompanyData = (data: Partial<CompanyData>) => {
    setCompanyData(prevData => ({ ...prevData, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const setStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <CompanyOnboardingContext.Provider 
      value={{ 
        companyData, 
        updateCompanyData, 
        currentStep, 
        nextStep, 
        prevStep, 
        setStep 
      }}
    >
      {children}
    </CompanyOnboardingContext.Provider>
  );
};

// Create a custom hook for using this context
export const useCompanyOnboarding = () => useContext(CompanyOnboardingContext); 