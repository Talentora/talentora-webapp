"use client"

import { Tables } from '@/types/types_db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerPortalForm from '@/components/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/AccountForms/EmailForm';
import NameForm from '@/components/AccountForms/NameForm';
import CompanyForm from '@/components/AccountForms/CompanyForm';
import Link from 'next/link';
import InvitePage from '@/components/Invite';

type Recruiter = Tables<'recruiters'>;
type Company = Tables<'companies'>;

export default function SettingsPage() {
  return (
    <section className="p-6">
      <div className="p-2">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="flex w-full bg-transparent rounded-lg">
            <TabsTrigger 
              value="account" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary py-1.5 text-sm"
            >
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="company" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary py-1.5 text-sm"
            >
              Company
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary py-1.5 text-sm"
            >
              Billing
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-primary py-1.5 text-sm"
            >
              Team
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <NameForm />
                  <EmailForm />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company">
            <Card>
              <CardContent className="space-y-3">
                <CompanyForm />
                <div className="mt-4">
                  <h2 className="text-lg font-bold mb-2">Company Onboarding</h2>
                  <Link href="/settings/onboarding">
                    <Button size="sm">Get your company setup</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Billing Information</CardTitle>
                <CardDescription>Manage your subscription and billing details.</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerPortalForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader className="pb-4">
                <InvitePage jobs={[]} />
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
