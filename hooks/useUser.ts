"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AuthUser } from '@/types/types_auth';


export const useUser = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const supabase = createClient(); // Ensure this is called in a server context
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(data.user);
            } catch (err) {
                setError('Failed to fetch user');
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return { user, loading, error };
};




