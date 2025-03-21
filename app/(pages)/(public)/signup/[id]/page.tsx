'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { verifyToken } from '@/utils/email_helpers'
import { signUp } from '@/utils/auth-helpers/server'
import { extractErrorMessageFromURL } from '@/utils/helpers'


export default function CandidateSignUp({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenVerified, setTokenVerified] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const candidateId = params.id
  const token = searchParams.get('token')
  const applicationIdParam = searchParams.get('application')

  // Check for error messages in URL parameters
  useEffect(() => {
    const errorMessage = extractErrorMessageFromURL(searchParams);
    if (errorMessage) {
      setError(errorMessage);
    }
    
    // Set application ID from query params if available
    if (applicationIdParam) {
      setApplicationId(applicationIdParam);
    }
  }, [searchParams, applicationIdParam]);

  // Verify token and extract email
  useEffect(() => {
    const verifyEmailToken = async () => {
      console.log(token);
      if (!token) {
        router.push('/')
        return
      }

      try {
        const { email: verifiedEmail } = await verifyToken(token, candidateId)
        setEmail(verifiedEmail)
        setTokenVerified(true)
      } catch (err: any) {
        console.error('Token verification failed:', err)
        setError('Invalid or expired token. Please request a new signup link.')
        router.push('/')
      }
    }
    
    verifyEmailToken()
  }, [searchParams, candidateId])

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already logged in, redirect to dashboard
        router.push('/dashboard')
        router.refresh()
      }
    }
    
    checkUser()
  }, [router, supabase])

  // Check if passwords match whenever either password field changes
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatch(false)
    } else {
      setPasswordMatch(true)
    }
  }, [password, confirmPassword])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tokenVerified) {
      setError('Please use a valid signup link')
      return
    }

    // Check if passwords match before submitting
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      // Create form data to pass to the server action
      const formData = new FormData()
      formData.append('email', email) // Email is already tracked in state
      formData.append('password', password)
      formData.append('full_name', name) // Full name is already tracked in state
      formData.append('role', 'applicant')
      formData.append('candidateId', candidateId)
      
      // Add application ID if available
      if (applicationId) {
        formData.append('application_id', applicationId)
      }
      
      // Call the server action
      const redirectPath = await signUp(formData)
      
      // Check if the redirectPath contains an error parameter
      try {
        // Direct string check for common error patterns first
        if (redirectPath.includes('error=') && 
           (redirectPath.includes('already exists') || 
            redirectPath.includes('Account already exists'))) {
          setError('An account already exists with this email address. Try signing in or resetting your password.');
          setLoading(false);
          return;
        }


        
        // Fix malformed URLs with multiple question marks
        let fixedPath = redirectPath;
        if ((fixedPath.match(/\?/g) || []).length > 1) {
          fixedPath = fixedPath.replace(/\?/g, (match, index) => 
            index === fixedPath.indexOf('?') ? match : '&'
          );
        }
        
        // Parse the URL and extract error message
        const redirectURL = new URL(fixedPath, window.location.origin);
        const redirectErrorMsg = extractErrorMessageFromURL(redirectURL.searchParams);
        
        if (redirectErrorMsg) {
          setError(redirectErrorMsg);
          setLoading(false);
          return;
        }


        // Navigate to the returned path or dashboard
        router.push(redirectPath || '/dashboard')
      } catch (parseError) {
        // If URL parsing fails, try direct extraction from string
        console.error('Error parsing redirect URL:', parseError, redirectPath);
        const directErrorMsg = extractErrorMessageFromURL(redirectPath);
        if (directErrorMsg) {
          setError(directErrorMsg);
        } else {
          setError('An error occurred during sign up. Please try again.');
        }
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error('Error during sign up:', err)
      
      // Check for duplicate account error
      if (err.message?.includes('already registered') || 
          err.message?.includes('already exists') ||
          err.code === '23505') {
        setError('An account already exists with this email address. Try signing in or resetting your password.');
      } else {
        setError(err.message || 'An error occurred during sign up');
      }
    } finally {
      
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Create your candidate account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign up to continue with your assessment
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-sm text-red-600 rounded">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1 relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  readOnly={true}
                  className="bg-gray-50 text-gray-700"
                />
                {tokenVerified && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-green-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                )}
              </div>
              {tokenVerified && (
                <p className="text-xs text-gray-500 mt-1">Verified email address - cannot be changed</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={!passwordMatch && confirmPassword ? "border-red-500" : ""}
                />
                {!passwordMatch && confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading || !tokenVerified || !passwordMatch}
                className="w-full"
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6"></div>
              <Link href={`/signin/${candidateId}/protected?token=${token}`}>
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}
