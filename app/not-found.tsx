import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/icons/Logo';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-primary">
      <Logo className="h-16 w-16 text-white mb-8" />
      <h1 className="text-5xl font-bold mb-4 font-poppins">
        404 - Page Not Found
      </h1>
      <p className="text-xl mb-8 text-primary">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <Button 
        asChild
        className="bg-accent/10 hover:bg-accent/20 text-primary border border-accent/20"
      >
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
