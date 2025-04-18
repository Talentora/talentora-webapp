'use client';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // assume this client instance is set up
import { usePathname } from 'next/navigation';


const AuthListener = () => {
    const supabase = createClient();
    const pathname = usePathname();
    useEffect(() => {
        let triggered = false;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (!triggered && event === 'SIGNED_IN' && pathname !== '/settings/onboarding') {
            triggered = true;
            subscription.unsubscribe();
            window.location.href = '/dashboard';
        }
        });
        return () => subscription.unsubscribe();
    }, [supabase.auth.getUser()]);
    return null;
    };

export default AuthListener;
