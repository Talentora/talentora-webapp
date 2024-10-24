import Navlinks from './Navlinks';

export default function Navbar() {

  return (
<nav className="sticky top-0 z-40 transition-all duration-150 h-16 md:h-20 bg-foreground to-accent w-full relative">     
     <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto w-full">
        <Navlinks />
      </div>
    </nav>
  );
}

