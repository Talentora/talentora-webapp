import CustomerPortalForm from '@/components/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/AccountForms/EmailForm';
import NameForm from '@/components/AccountForms/NameForm';
import CompanyForm from '@/components/AccountForms/CompanyForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Account() {
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

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
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={userDetails?.full_name ?? ''} />
        <EmailForm userEmail={user.email} />
        <CompanyForm
          companyName={userDetails?.company_name ?? ''}
          companySize={userDetails?.company_size ?? ''}
          industry={userDetails?.industry ?? ''}
        />
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
