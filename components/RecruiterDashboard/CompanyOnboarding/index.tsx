'use client';

import { useState, useEffect } from 'react';
import { useToast } from "@/components/Toasts/use-toast"
import { ToastAction } from "@/components/Toasts/toast"
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { createCompany } from '@/utils/supabase/queries';
import { Tables } from '@/types/types_db';

type Company = Omit<Tables<'companies'>, 'id'>;

export default function OnboardingPage() {
  const { toast } = useToast()

  const [step, setStep] = useState<number>(1);
  const [companyName, setCompanyName] = useState<string>('');
  const [headquarters, setHeadquarters] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [hasCompanyId, setHasCompanyId] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [greenhouseKey, setGreenhouseKey] = useState<string>('');

  const totalSteps = 5;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    const fetchUserAndCompanyData = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('Error fetching user:', error);
        return;
      }
      setUser(user);

      // Get the recruiter's company_id from the recruiters table
      const { data: recruiterData, error: recruiterError } = await supabase
        .from('recruiters')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (recruiterError) {
        console.error('Error fetching recruiter data:', recruiterError);
        return;
      }

      const companyId = recruiterData?.company_id;
      setHasCompanyId(!!companyId);
    };

    fetchUserAndCompanyData();
  }, []);

  const handleGreenhouseIntegration = async (event: React.FormEvent) => {
    event.preventDefault();

    const supabase = createClient();
    
    try {
      // Fetch the company ID for the current user
      const { data: recruiterData, error: recruiterError } = await supabase
        .from('recruiters')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (recruiterError) throw recruiterError;

      const companyId = recruiterData?.company_id;

      if (!companyId) {
        throw new Error('Company ID not found');
      }

      // Update the company with the new Greenhouse API key
      const { error: updateError } = await supabase
        .from('companies')
        .update({ greenhouse_api_key: greenhouseKey })
        .eq('id', companyId);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Greenhouse API key saved successfully",
        duration: 5000,
      });

      nextStep(); // Move to the next step after successful update
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save Greenhouse API key. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }


  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const companyData: Company = {
      name: companyName,
      location: headquarters,
      industry,
      description: null,
      email_extension: null,
      subscription_id: null,
      website_url: null,
      greenhouse_api_key:null
    };
  
    try {
      if (!user) {
        throw new Error('No user found');
      }
      const createdCompany = await createCompany(
        companyData,
        user.id
      );
      if (!createdCompany) {
        throw new Error('Failed to save company information');
      }
      toast({
        title: "Success!",
        description: "Company information saved successfully",
        duration: 5000,
      })
      nextStep(); // Move to the next step after successful creation
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save company information. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Talentora</CardTitle>
          <CardDescription>
            Let&apos;s get your company set up in just a few steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-1/4 h-2 rounded-full ${i + 1 <= step ? 'bg-primary' : 'bg-gray-200'}`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Welcome to RoboRecruiter!</h3>
              <p>
                We&apos;re excited to have you on board. Here&apos;s a quick
                overview of what you can expect:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Step 1:</strong> Enter your company information
                  including name, location, and size.
                </li>
                <li>
                  <strong>Step 2:</strong> Invite your team members to join your
                  workspace.
                </li>
                <li>
                  <strong>Step 3:</strong> Complete the setup and start using
                  RoboRecruiter!
                </li>
              </ul>
            </div>
          )}

          {step === 2 && (
            <>
              {hasCompanyId ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Company Information</h3>
                  <p>You are already associated with a company. If you need to update your company information, please contact support.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <h3 className="text-lg font-medium">Company Information</h3>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      type="text"
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="headquarters">Headquarters Location</Label>
                    <Input
                      type="text"
                      id="headquarters"
                      value={headquarters}
                      onChange={(e) => setHeadquarters(e.target.value)}
                      placeholder="Enter your company's headquarters location"
                      required
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      type="text"
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g., Technology, Healthcare, Finance"
                      required
                    />
                  </div>
                  <Button type="submit">Save</Button>
                </form>
              )}
            </>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Greenhouse Integration</h3>
              <p>
                Enter your Greenhouse API key to integrate with your account.
              </p>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="greenhouse-key">Greenhouse API Key</Label>
                <Input
                  type="password"
                  id="greenhouse-key"
                  placeholder="Enter your Greenhouse API key"
                  value={greenhouseKey}
                  onChange={(e) => setGreenhouseKey(e.target.value)}
                  required
                />
              </div>
              <Button onClick={handleGreenhouseIntegration}>
                Connect Greenhouse
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invite Your Team</h3>
              <p>
                Add team members&apos; email addresses to invite them to your
                workspace.
              </p>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="team-emails">Team Emails</Label>
                <Textarea
                  id="team-emails"
                  placeholder="Enter email addresses, separated by commas"
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 text-center p-4">
              <h3 className="text-lg font-medium">You&apos;re All Set!</h3>
              <p>Congratulations! Your account is now ready to use.</p>
              <Link href="/dashboard" passHref>
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step < totalSteps && (
            <Button onClick={nextStep} className="ml-auto">
              {step === totalSteps - 1 ? 'Finish' : 'Next'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
