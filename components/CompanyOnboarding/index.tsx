'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from 'next/link'
declare global {
  interface Window {
    google: typeof google;
  }
}

export default function OnboardingPage() {
  const [step, setStep] = useState<number>(1);
  const [companySize, setCompanySize] = useState<string>("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById('google-maps-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script';
        document.head.appendChild(script);

        script.onload = initializeAutocomplete;
      } else {
        initializeAutocomplete();
      }
    };

    const initializeAutocomplete = () => {
      if (inputRef.current && window.google) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['(cities)'],
        });
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.formatted_address) {
            inputRef.current!.value = place.formatted_address;
          }
        });
      }
    };

    loadGoogleMapsScript();

    return () => {
      const script = document.getElementById('google-maps-script');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const totalSteps = 4;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to RoboRecruiter</CardTitle>
          <CardDescription>Let's get your company set up in just a few steps</CardDescription>
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
              <p>We're excited to have you on board. Here's a quick overview of what you can expect:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Step 1:</strong> Enter your company information including name, location, and size.</li>
                <li><strong>Step 2:</strong> Invite your team members to join your workspace.</li>
                <li><strong>Step 3:</strong> Complete the setup and start using RoboRecruiter!</li>
              </ul>
              <p>If you have any questions, feel free to reach out to our support team at any time.</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="company">Company Name</Label>
                <Input type="text" id="company" placeholder="Acme Inc." />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="headquarters">Headquarters Location</Label>
                <Input  
                  type="text" 
                  id="headquarters" 
                  placeholder="City, Country" 
                  ref={inputRef}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="size">Number of Employees</Label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501+">501+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="industry">Industry</Label>
                <Input type="text" id="industry" placeholder="e.g., Technology, Healthcare, Finance" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invite Your Team</h3>
              <p>Add team members' email addresses to invite them to your workspace.</p>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="team-emails">Team Emails</Label>
                <Textarea 
                  id="team-emails" 
                  placeholder="Enter email addresses, separated by commas"
                  rows={4}
                />
              </div>
              <p className="text-sm text-muted-foreground">You can always invite more team members later.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center p-4">
              <h3 className="text-lg font-medium">You're All Set!</h3>
              <p>Congratulations! Your account is now ready to use.</p>
              <p>We've sent invitations to your team members. They'll be able to join your workspace soon.</p>
              <Link href='/account' passHref >
                <Button as="a" >
                  Get Started
                </Button>
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
              {step === totalSteps - 1 ? "Finish" : "Next"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}