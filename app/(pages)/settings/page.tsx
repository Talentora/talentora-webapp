import { Tables } from '@/types/types_db';
type Recruiter = Tables<'recruiters'>
type Company = Tables<'companies'>
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CustomerPortalForm from '@/components/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/AccountForms/EmailForm';
import NameForm from '@/components/AccountForms/NameForm';
import CompanyForm from '@/components/AccountForms/CompanyForm';
import { redirect } from 'next/navigation';
import { useRecruiter } from '@/hooks/useRecruiter';
import { useCompany } from '@/hooks/useCompany';


export default async function Account() {





  return (
    <section className="mb-32 bg-background">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-primary sm:text-center sm:text-6xl">
            Settings
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-muted-foreground sm:text-center sm:text-2xl">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm />
        <NameForm />
        <EmailForm />
        
        
          <CompanyForm  />
      
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Invite Teammates</h2>
          <Link href="/settings/invite">
            <Button>Invite Your Teammates</Button>
          </Link>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Company Onboarding</h2>
          <Link href="/settings/onboarding">
            <Button>Get your company setup</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
