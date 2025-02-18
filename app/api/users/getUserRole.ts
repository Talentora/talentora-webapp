import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/supabase/queries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Invalid userId' });
    }

    const supabase = createClient();
    const role = await getUserRole(supabase, userId);

    if (role) {
        res.status(200).json({ role });
    } else {
        res.status(404).json({ error: 'User role not found' });
    }
}
