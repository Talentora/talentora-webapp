import { getApplicants } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';

const page = async () => {
  const supabase = createClient();
  const applicants = await getApplicants(supabase, 1);


  console.log("applicants", applicants);

  return (
    <div>
      <h1>Applicants</h1>
      <p>{JSON.stringify(applicants)}</p>
    </div>
  );
}

export default page;
