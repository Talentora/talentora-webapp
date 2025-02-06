import { createClient } from '@/utils/supabase/server';
import DashboardPage from '@/components/Dashboard';
import { getUserRole } from '@/utils/supabase/queries';

export default async function Page() {
  const supabase = createClient();
  
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let role = null;
  if (user) {
    role = await getUserRole(supabase, user.id);
  }

  return <DashboardPage serverRole={role} />;
}
