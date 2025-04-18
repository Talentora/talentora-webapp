import { createClient } from '@/utils/supabase/client';
import DashboardPage from '@/components/Dashboard';
import { getUserRole } from '@/utils/supabase/queries';

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let role = null;
  if (user) {
    role = await getUserRole(supabase, user.id);
  }

  return <DashboardPage serverRole={role} />;
}
