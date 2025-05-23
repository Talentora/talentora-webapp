"use client"

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NameForm from '@/components/AccountForms/NameForm';
import CompanyForm from '@/components/AccountForms/CompanyForm';
import Link from 'next/link';
import IntegrationStatus from '@/components/AccountForms/IntegrationStatus';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Users, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import InviteRecruiter from '@/components/Recruiters/InviteRecruiter';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'account';
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { user } = useUser();
  const isRecruiter = user?.data?.user_metadata?.role === "applicant" ? false : true;


  const tabs = [
    {
      label: 'Account',
      value: 'account',
      component: (
        <div className="flex flex-row gap-4 w-1/2"> 
          <NameForm />
          {/* <EmailForm /> */}
        </div>
      )
    },
    ...(isRecruiter
      ? [
          {
            label: 'Company', 
            value: 'company',
            component: (
              <div>
                <CompanyForm />
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-foreground mb-2">Company Onboarding</h2>
                  <Link href="/settings/onboarding">
                    <Button size="sm">Continue Onboarding</Button>
                  </Link>
                </div>
              </div>
            )
          },
          {
            label: 'Teams',
            value: 'teams',
            component: (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">Team Management</h2>
                  <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Invite Team Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <InviteRecruiter onInviteSent={() => setIsInviteOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage users who have access to your organization's dashboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-3 px-4 text-left font-medium">Name</th>
                            <th className="py-3 px-4 text-left font-medium">Email</th>
                            <th className="py-3 px-4 text-left font-medium">Role</th>
                            <th className="py-3 px-4 text-left font-medium">Status</th>
                            <th className="py-3 px-4 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4">{user?.data?.user_metadata?.full_name || 'Current User'}</td>
                            <td className="py-3 px-4">{user?.data?.email}</td>
                            <td className="py-3 px-4">Admin</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Settings</span>
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          },
          {
            label: 'Integration Status',
            value: 'integrations',
            component: <IntegrationStatus />
          }
        ]
      : []),
  ];
  

  return (
    <section className="p-6">
      <div className="p-2">
        <Tabs defaultValue={tab} className="w-full">

          <TabsList className="flex w-full bg-muted/50 p-1 rounded-lg border shadow-sm">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="border-none">
                {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
