import { getScouts, getUserCompanyId } from "@/utils/supabase/queries";


export async function fetchScoutsData() {
    return await getScouts();
  }