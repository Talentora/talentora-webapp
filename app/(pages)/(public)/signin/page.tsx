'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SignIn() {
  const [selectedType, setSelectedType] = useState<
    'recruiter' | 'applicant' | null
  >(null);
  const router = useRouter();

  const handleUserTypeSelection = (type: 'recruiter' | 'applicant') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      if (selectedType === 'recruiter') {
        router.push(`/signin/password_signin?role=${selectedType}`);
      } else {
        router.push(`/signin/password_signin?role=${selectedType}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4 text-foreground">Sign In</h1>
      <h1 className="text-3xl font-bold mb-8 text-foreground">
        Choose Your Role
      </h1>
      <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-3xl">
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg border shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === 'recruiter'
              ? 'border-2 border-primary'
              : 'border-border'
          }`}
          onClick={() => handleUserTypeSelection('recruiter')}
        >
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Recruiter
          </h2>
          <p className="text-center text-muted-foreground mb-4">
            I'm looking to hire talent
          </p>
          <span className="text-sm text-primary">Sign in with SSO</span>
        </div>
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg border shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === 'applicant'
              ? 'border-2 border-primary'
              : 'border-border'
          }`}
          onClick={() => handleUserTypeSelection('applicant')}
        >
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Applicant
          </h2>
          <p className="text-center text-muted-foreground">
            I'm looking for job opportunities
          </p>
        </div>
      </div>
      {selectedType && (
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => setSelectedType(null)}>
            Back
          </Button>
          <Button onClick={handleContinue}>Continue</Button>
        </div>
      )}
    </div>
  );
}
