'use client';

import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import { getSubscription } from '@/utils/supabase/queries';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Tables } from '@/types/types_db';
import { useSubscription } from '@/hooks/useSubscription';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  price: Price & {
    product: Product | null;
  };
};

export default function CustomerPortalForm() {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { subscription } = useSubscription() as {
    subscription: SubscriptionWithPriceAndProduct | null;
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription.price.currency || 'USD',
      minimumFractionDigits: 0
    }).format((subscription.price.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <Card className="my-8 text-card-foreground">
      <CardHeader>
        <CardTitle className="text-primary">Your Plan</CardTitle>
        <CardDescription className="text-muted-foreground">
          {subscription
            ? `You are currently on the ${subscription.price.product?.name} plan.`
            : 'You are not currently subscribed to any plan.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-8 mb-4 text-xl font-semibold text-primary">
          {subscription ? (
            `${subscriptionPrice}/${subscription.price.interval}`
          ) : (
            <Link href="/" className="text-primary">
              Choose your plan
            </Link>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center w-full">
          <p className="pb-4 sm:pb-0 text-muted-foreground">
            Manage your subscription on Stripe.
          </p>
          <Button
            onClick={handleStripePortalRequest}
            loading={isSubmitting}
            className="bg-button-primary text-button-primary-foreground"
          >
            Open customer portal
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
