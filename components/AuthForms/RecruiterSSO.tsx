'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { Building2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RecruiterSSO() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domain, setDomain] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("[SSO] Starting SSO flow for domain:", domain);

    try {

      const redirectTo = process.env.NEXT_PUBLIC_SITE_URL;

      console.log("[SSO] Using callback URL:", redirectTo);
      
      const { data, error } = await supabase.auth.signInWithSSO({
        domain: domain,
        options: { 
          redirectTo
        }
      });

      console.log("[SSO] SignInWithSSO response - data:", data);
      console.log("[SSO] SignInWithSSO response - error:", error);

      if (error) throw error;
      
      // If there's a URL to redirect to, redirect there
      if (data?.url) {
        console.log("[SSO] Redirecting to SSO URL:", data.url);
        window.location.href = data.url;
      } else {
        console.error("[SSO] No URL returned from signInWithSSO");
      }
    } catch (error) {
      console.error('[SSO] Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-between p-8 border shadow-lg rounded-xl">
      <div className="flex-1 max-w-md">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">
            Sign in with your organization's SSO to access your recruiting dashboard.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Company Email Domain</Label>
            <div className="flex gap-2">
              <Input
                id="domain"
                placeholder="company.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="w-32"
                disabled={isSubmitting || !domain}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your company email domain to sign in with SSO
            </p>
          </div>
        </form>
      </div>

      <div className="flex-1 max-w-md">
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/placeholder-recruiting-image.jpg"
            alt="Recruiting illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
} 