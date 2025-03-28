"use client"

import { Tables } from '@/types/types_db';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NameForm from '@/components/AccountForms/NameForm';
import CompanyForm from '@/components/AccountForms/CompanyForm';
import Link from 'next/link';
import IntegrationStatus from '@/components/AccountForms/IntegrationStatus';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/useUser';


export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'account';

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

          <TabsList className="flex w-full bg-transparent rounded-lg">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 data-[state=active]:bg-background data-[state=active]:underline py-1.5 text-sm text-foreground"
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
