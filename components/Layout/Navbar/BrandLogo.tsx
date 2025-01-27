import Link from 'next/link';
import Logo from '@/components/ui/icons/Logo';

export function BrandLogo() {
  return (
    <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Logo">
      <Logo />
           <h1 className="text-2xl tracking-tight font-bold font-poppins text-foreground">
            Talent
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ora
            </span>
          </h1>
    </Link>
  );
} 