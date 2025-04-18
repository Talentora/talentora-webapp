'use client';

import { Button } from '@/components/ui/button';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { getCompany } from '@/utils/supabase/queries';
import { CheckCircle, XCircle } from 'lucide-react';

interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
  role: string;
  prefilledEmail?: string;
  candidateId?: string;
  jobId?: string;
}

export default function SignUp({
  allowEmail,
  redirectMethod,
  role,
  prefilledEmail,
  candidateId,
  jobId
}: SignUpProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(prefilledEmail || '');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [validatingCompany, setValidatingCompany] = useState(false);
  
  // Password validation states
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [hasCapital, setHasCapital] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);


  // Check password validity on change
  useEffect(() => {
    // Check for capital letter
    setHasCapital(/[A-Z]/.test(password));
    
    // Check for number
    setHasNumber(/[0-9]/.test(password));
    
    // Check for symbol
    setHasSymbol(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password));
    
    // Check if passwords match
    setPasswordsMatch(password === confirmPassword && password !== '');
    
    // Check overall validity
    setIsPasswordValid(
      hasCapital && 
      hasNumber && 
      hasSymbol && 
      passwordsMatch && 
      password.length >= 8
    );
  }, [password, confirmPassword, hasCapital, hasNumber, hasSymbol, passwordsMatch]);


  const validateCompanyId = async (id: string) => {
    if (!id || role !== 'recruiter') return true;
    
    setValidatingCompany(true);
    setCompanyError('');
    
    try {
      const company = await getCompany(id);

      if (!company) {
        setCompanyError('Company not found. Please check the Company ID.');
        return false;
      }
      
      if (company.Configured) {
        setCompanyError('This company already has recruiter accounts. Please contact your administrator.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating company:', error);
      setCompanyError('Error validating company ID. Please try again.');
      return false;
    } finally {
      setValidatingCompany(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate password requirements
    if (!isPasswordValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Always validate company ID for recruiters on submit
    if (role === 'recruiter') {
      const isValid = await validateCompanyId(companyId);
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }
    }
    
    // Create FormData object directly instead of using the form element
    const formData = new FormData();
    
    // Add form fields manually
    formData.set('email', email);
    formData.set('full_name', fullName);
    formData.set('password', password);
    formData.set('role', role);
    
    // Add companyId for recruiters
    if (role === 'recruiter' && companyId) {
      formData.set('companyId', companyId);
    }
    
    // Add candidateId and jobId if available
    if (candidateId && role === 'applicant') {
      formData.set('candidateId', candidateId);
    }
    
    if (jobId && role === 'applicant') {
      formData.set('jobId', jobId);
    }

    await handleRequest(formData, signUp, router);
    setIsSubmitting(false);
  };

  // Render validation requirement with check or X
  const ValidationItem = ({ isValid, text }: { isValid: boolean, text: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {isValid ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className={isValid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              placeholder="John Doe"
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoCapitalize="words"
              className="w-full p-3 bg-background text-foreground rounded-md border border-input"
              required
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!!prefilledEmail}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className={`w-full p-3 rounded-md border ${
                prefilledEmail ? 'bg-muted' : 'bg-background'
              } text-foreground border-input`}
              required
            />
            
            {role === 'recruiter' && (
              <>
                <label htmlFor="companyId">Company ID</label>
                <input
                  id="companyId"
                  placeholder="Enter your company ID"
                  type="text"
                  name="companyId"
                  value={companyId}
                  onChange={(e) => {
                    setCompanyId(e.target.value);
                    // Error is cleared, but validation will happen via debounce effect
                    setCompanyError('');
                  }}
                  className={`w-full p-3 bg-background text-foreground rounded-md border ${
                    companyError ? 'border-destructive' : 'border-input'
                  }`}
                  required
                />
                {companyError && (
                  <p className="text-sm text-destructive mt-1">{companyError}</p>
                )}
              </>
            )}
            
            <label htmlFor="password">Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={`w-full p-3 bg-background text-foreground rounded-md border ${
                password && !isPasswordValid ? 'border-orange-400' : 'border-input'
              }`}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              placeholder="Confirm your password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={`w-full p-3 bg-background text-foreground rounded-md border ${
                confirmPassword && !passwordsMatch ? 'border-destructive' : 'border-input'
              }`}
              required
            />
            
            {/* Password requirements */}
            {(password || confirmPassword) && (
              <div className="mt-2 p-3 bg-muted/50 rounded-md">
                <h3 className="text-sm font-medium mb-2">Password Requirements:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <ValidationItem 
                    isValid={password.length >= 8} 
                    text="At least 8 characters" 
                  />
                  <ValidationItem 
                    isValid={hasCapital} 
                    text="At least one capital letter" 
                  />
                  <ValidationItem 
                    isValid={hasNumber} 
                    text="At least one number" 
                  />
                  <ValidationItem 
                    isValid={hasSymbol} 
                    text="At least one symbol" 
                  />
                  <ValidationItem 
                    isValid={passwordsMatch && confirmPassword !== ''} 
                    text="Passwords match" 
                  />
                </div>
              </div>
            )}
            
          </div>
          <Button
            variant="default"
            type="submit"
            className="mt-1 w-full"
            disabled={isSubmitting || validatingCompany || (role === 'recruiter' && !!companyError) || !isPasswordValid}
          >
            {isSubmitting ? 'Signing up...' : validatingCompany ? 'Validating company...' : `Sign up as ${role}`}
          </Button>
        </div>
      </form>
      {!candidateId && (
        <p>
          <Link
            href={`/signin/password_signin?role=${role}`}
            className="font-light text-sm text-muted-foreground"
          >
            Already have an account? Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
