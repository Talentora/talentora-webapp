import Pricing from '@/components/ui/Pricing/Pricing';
// import { createClient } from '@/app/utils/supabase/server';
// import {
//   getProducts,
//   getSubscription,
//   getUser
// } from '@/app/utils/supabase/queries';

export default async function PricingPage() {
  // const supabase = createClient();
  // const [user, products, subscription] = await Promise.all([
  //   // getUser(supabase),
  //   // getProducts(supabase),
  //   // getSubscription(supabase)
  // ]);
  const [userRes, productsRes, subscriptionRes] = await Promise.all([
    fetch('http://localhost:3000/api/supabase/user'),
    fetch('http://localhost:3000/api/supabase/products'),
    fetch('http://localhost:3000/api/supabase/subscription'),
  ]);

  // Parse the JSON response
  console.log(userRes.json);
  const user = await userRes.json();
  const products = await productsRes.json();
  const subscription = await subscriptionRes.json();

  return (
    <div>
      <Pricing
        user={user}
        products={products ?? []}
        subscription={subscription}
      />
    </div>
  );
}
