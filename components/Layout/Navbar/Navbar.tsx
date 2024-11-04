'use client';
import Navlinks from './Navlinks';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxOpacity = 1;
      const minOpacity = 0;
      const scrollHeight = 50; // Height at which the navbar starts to fade out
      const opacity = Math.max(
        minOpacity,
        Math.min(maxOpacity, 1 - scrollPosition / scrollHeight)
      );
      setOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-150 h-16 md:h-20 bg-transparent to-accent w-full relative`}
      style={{ opacity: opacity }}
    >
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto w-full">
        <Navlinks />
      </div>
    </nav>
  );
}
