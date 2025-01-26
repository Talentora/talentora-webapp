'use client';
import Navlinks from './Navlinks';
import { useEffect, useState } from 'react';

export default function Navbar({ visible }: { visible: boolean }) {


  return (
    <nav
    className={`backdrop-blur-lg sticky top-0 z-40 transition-all duration-150 h-16 md:h-20 bg-white/70 dark:bg-black/70 dark:backdrop-blur-md border-b border-inputto-accent w-full relative`}
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
