// import { getMergeApiKey } from '@/utils/supabase/queries';

// export type MergeHeaders = {
//   Authorization: string;
//   'X-Account-Token': string;
//   'Content-Type'?: string;
// };

// export async function getMergeHeaders(
//   userId?: string,
//   includeContentType = false
// ): Promise<MergeHeaders> {
//   const accountToken = await getMergeApiKey();
//   const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

//   if (!apiKey || !accountToken) {
//     throw new Error('API credentials not found');
//   }

//   const headers: MergeHeaders = {
//     Authorization: `Bearer ${apiKey}`,
//     'X-Account-Token': accountToken,
//   };

//   if (includeContentType) {
//     headers['Content-Type'] = 'application/json';
//   }

//   return headers;
// }

// export const MERGE_BASE_URL = 'https://api.merge.dev/api/ats/v1'; 