import { Hero, Integration, CTA, LogoSection } from './sections';
import Features from './sections/Features';
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Features />
        <Integration />
        <LogoSection />
        <CTA />
      </main>
    </div>
  );
}