// 'use client';

// import Pricing from '@/components/Pricing/Pricing';
// import { getProducts, getSubscription } from '@/utils/supabase/queries';
// import { useUser } from '@/hooks/useUser';
// import { useEffect, useState } from 'react';
// import { Tables } from '@/types/types_db';
// import { User } from "@supabase/supabase-js"
// type Product = Tables<'products'>;
// type Subscription = Tables<'subscriptions'>;
// type Price = Tables<'prices'>;
// interface ProductWithPrices extends Product {
//   prices: Price[];
// }
// interface PriceWithProduct extends Price {
//   products: Product | null;
// }
// interface SubscriptionWithProduct extends Subscription {
//   prices: PriceWithProduct | null;
// }

// interface Props {
//   user: User | null | undefined;
//   products: ProductWithPrices[];
//   subscription: SubscriptionWithProduct | null;
// }

// export default function PricingPage() {
//   const { user } = useUser();

//   const [products, setProducts] = useState<ProductWithPrices[]>([]);
//   const [subscription, setSubscription] = useState<SubscriptionWithProduct | null>(null);

//   useEffect(() => {
//     const fetchProductsAndSubscription = async () => {
//       const [products, subscription] = await Promise.all([
//         getProducts(),
//         getSubscription()
//       ]);

//       setProducts(products || []);
//       setSubscription(subscription as SubscriptionWithProduct | null);
//     };
//     fetchProductsAndSubscription();
//   }, []);

//   return (
//     <div>
//       <Pricing
//         user={user}
//         products={products ?? []}
//         subscription={subscription as SubscriptionWithProduct | null}
//       />
//     </div>
//   );
// }
import LandingPage from '@/components/LandingPage/LandingPage';

export default function PricingPage() {
  return <LandingPage />;
}

