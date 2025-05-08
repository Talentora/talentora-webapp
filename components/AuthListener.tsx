'use client';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePathname, useRouter } from 'next/navigation';

const AuthListener = () => {
    const supabase = createClient();
    const pathname = usePathname();
    const router = useRouter();
    
    useEffect(() => {
        let triggered = false;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (!triggered && event === 'SIGNED_IN' && pathname !== '/settings/onboarding') {
                triggered = true;
                subscription.unsubscribe();
                
                // Use router.push instead of window.location for better navigation
                router.push('/dashboard');
            }
        });
        
        return () => subscription.unsubscribe();
    }, [pathname, router]);
    
    return null;
};

export default AuthListener;
