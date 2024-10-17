"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SignIn() {
  const [selectedType, setSelectedType] = useState<'recruiter' | 'applicant' | null>(null);
  const router = useRouter();

  const handleUserTypeSelection = (type: 'recruiter' | 'applicant') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/signin/passwordSignin?role=${selectedType}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Choose Your Role</h1>
      <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-3xl">
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg bg-white shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === 'recruiter' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => handleUserTypeSelection('recruiter')}
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">Recruiter</h2>
          <p className="text-center text-gray-600">I'm looking to hire talent</p>
        </div>
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg bg-white shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === 'applicant' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => handleUserTypeSelection('applicant')}
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">Applicant</h2>
          <p className="text-center text-gray-600">I'm looking for job opportunities</p>
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