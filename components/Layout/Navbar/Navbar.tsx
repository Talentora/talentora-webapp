'use client';
import Navlinks from './Navlinks';
import { useEffect, useState } from 'react';

import { User } from '@supabase/supabase-js';
import { type Database } from '@/types/types_db';

type Company = Database['public']['Tables']['companies']['Row'];

interface NavbarProps {
  visible: boolean;
  user?: User | null;
  role?: string | null;
  company?: Company | null;
}

export default function Navbar({ visible, user, role, company }: NavbarProps) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxOpacity = 1;
      const minOpacity = 0;
      const scrollHeight = 50;
      const opacity = Math.max(
        minOpacity,
        Math.min(maxOpacity, 1 - scrollPosition / scrollHeight)
      );
      setOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-40 transition-all duration-150 h-16 md:h-20 bg-background/80 backdrop-blur-sm border-b border-border w-full max-w-full overflow-visible"
      style={{ opacity }}
    >
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] px-4 mx-auto w-full relative">
        <Navlinks
          visible={visible}
          user={user}
          role={role}
          company={company}
        />
      </div>
    </nav>
  );
}
