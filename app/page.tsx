// import Pricing from '@/components/ui/Pricing/Pricing';
import LandingPage from '@/components/ui/LandingPage/LandingPage';
// import { createClient } from '@/utils/supabase/server';
// import {
//   getProducts,
//   getSubscription,
//   getUser
// } from '@/utils/supabase/queries';

export default async function PricingPage() {
  // const supabase = createClient();
  // const [user, products, subscription] = await Promise.all([
  //   getUser(supabase),
  //   getProducts(supabase),
  //   getSubscription(supabase)
  // ]);

  return (
    // <Pricing
    //   user={user}
    //   products={products ?? []}
    //   subscription={subscription}
    // />
    <LandingPage />
  );
}
