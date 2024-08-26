import { createClient } from "@/utils/supabase/server";

export default async function Home() {

  const supabase = createClient();

  const { data: jobs, error } = await supabase.from('jobs').select('*');
  if (error) console.error(error);


  console.log("jobs",jobs);

  return (
    <div>
      <h1>Hello World</h1>
      <p>{JSON.stringify(jobs)}</p>
    </div>
  );
}
