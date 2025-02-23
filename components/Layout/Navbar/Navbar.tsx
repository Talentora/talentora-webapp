'use client';
import Navlinks from './Navlinks';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/lib';

export default function Navbar({ visible }: { visible: boolean }) {
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
      className="sticky top-0 z-40 transition-all duration-150 h-16 md:h-20 bg-background/80 backdrop-blur-sm border-b border-border w-full max-w-full overflow-hidden"
      style={{ opacity }}
    >
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto w-full">
        <Navlinks visible={visible} />
      </div>
    </nav>
  );
}
