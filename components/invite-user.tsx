'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { inviteRecruiter } from '@/utils/supabase/queries';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from '@/components/Toasts/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createClient } from '@/utils/supabase/server';

export function InviteUserComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [currentUserDomain, setCurrentUserDomain] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user && user.email) {
        const domain = user.email.split('@')[1];
        setCurrentUserDomain(domain);
      }
    };
    fetchUserEmail();
  }, []);

  const validateEmail = (email: string) => {
    const domain = email.split('@')[1];
    if (domain !== currentUserDomain) {
      setEmailError(
        `Invited user's email must be from the ${currentUserDomain} domain.`
      );
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    // await inviteRecruiter(name, email);
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form and show success message
    setName('');
    setEmail('');
    setIsLoading(false);
    toast({
      title: 'Invitation Sent',
      description: `An invitation has been sent to ${email}.`
    });
  };

  return (
    <div className="flex justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Invite User</CardTitle>
          <CardDescription>
            Invite a new user to join your company&apos;s Talentora page.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder={`user@${currentUserDomain}`}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  required
                />
                {emailError && (
                  <Alert intent="danger">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{emailError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !!emailError}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
