import { createClient } from "@/utils/supabase/server";
import { getJobs } from "@/utils/supabase/queries";
import InvitePage from "@/components/Invite";

const Page = async () => {
  const supabase = createClient();
  const jobs = await getJobs(supabase); 

  return (
    <div className="w-5/6">
      <InvitePage jobs={jobs} />
    </div>
  );
};

export default Page;
