import Pricing from '@/components/Pricing/Pricing';
import {
  getProducts,
  getSubscription
} from '@/utils/supabase/queries';
import { useUser } from '@/hooks/useUser';

export default async function PricingPage() {
  const { user } = useUser();
  const [products, subscription] = await Promise.all([
    getProducts(),
    getSubscription()
  ]);

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
