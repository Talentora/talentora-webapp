'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SignUp from '@/components/AuthForms/Signup';
import { getAuthTypes, getRedirectMethod } from '@/utils/auth-helpers/settings';

export default function SignUpPage() {
  const [selectedType, setSelectedType] = useState<
    'recruiter' | 'applicant' | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const { allowEmail } = getAuthTypes();
  const redirectMethod = getRedirectMethod();

  useEffect(() => {
    // Handle role param from URL
    if (roleParam === 'applicant' || roleParam === 'recruiter') {
      setSelectedType(roleParam);
      setShowForm(true);
    }
  }, [roleParam, router]);

  const handleUserTypeSelection = (type: 'recruiter' | 'applicant') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      // Show signup form for both recruiters and applicants
      setShowForm(true);
      // Update URL to include role without page reload
      const url = new URL(window.location.href);
      url.searchParams.set('role', selectedType);
      window.history.pushState({}, '', url);
    }
  };

  if (showForm && selectedType) {
    return (
      <div className="flex flex-col min-h-screen justify-center mx-auto">
        <div className="flex justify-center flex-1">
          <div className="flex flex-col justify-between max-w-5xl p-3 m-auto w-full">
            <Card className="w-full border-none">
              <CardContent className="text-foreground">
                <SignUp
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  role={selectedType}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Sign Up</h1>
      <h1 className="text-3xl font-bold mb-8 text-gray-600">
        Choose Your Role
      </h1>
      <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-3xl">
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg bg-background shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === 'recruiter'
              ? 'ring-2 ring-primary bg-primary/10 text-foreground'
              : 'text-muted-foreground'
          }`}
          onClick={() => handleUserTypeSelection('recruiter')}
        >
          <h2 className="text-2xl font-semibold mb-2">Recruiter</h2>
          <p className="text-center text-gray-600">
            I'm looking to hire talent
          </p>
          <span className="text-xs text-primary mt-2">Create recruiting account</span>
        </div>
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg bg-background shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === 'applicant'
              ? 'ring-2 ring-primary bg-primary/10 text-foreground'
              : 'text-muted-foreground'
          }`}
          onClick={() => handleUserTypeSelection('applicant')}
        >
          <h2 className="text-2xl font-semibold mb-2 ">Applicant</h2>
          <p className="text-center text-gray-600">
            I'm looking for job opportunities
          </p>
          <span className="text-xs text-primary mt-2">Create account</span>
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
