'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  const [step, setStep] = useState<number>(1);
  const [companyName, setCompanyName] = useState<string>('');
  const [headquarters, setHeadquarters] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');

  const totalSteps = 4;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
    };

    try {
      const createdCompany = await createCompany(companyData);
      if (!createdCompany) {
        throw new Error('Failed to save company information');
      }
      console.log('Company information saved successfully');
    } catch (error) {
      console.error('Error:', error);
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

          {step === 3 && (
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

          {step === 4 && (
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
