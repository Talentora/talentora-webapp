import { getMergeApiKey } from '@/utils/supabase/queries';

export default async function TestingPage() {
  const mergeApiKey = await getMergeApiKey();
  console.log('mergeApiKey', mergeApiKey);
  return <div>TestingPage</div>;
}
