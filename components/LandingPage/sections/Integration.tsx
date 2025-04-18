import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
const benefits = [
  "One-click integration with major ATS platforms",
  "Automated candidate data sync", 
  "Custom workflow automation",
  "Real-time analytics dashboard"
];

export function Integration() {
  return (
    <section className="container mx-auto px-4 py-24 relative">
      <div className="absolute inset-0  to-transparent" />
      <div className="relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
          <div className="bg-purple-500/5 border border-purple-500 dark:bg-purple-500/20 inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm">
            <span className=" text-primary font-medium">✨ Enterprise Ready</span>
          </div>
            <h2 className="text-5xl tracking-tighter font-bold"> 
              Seamlessly fits into your workflow
            </h2>
            <p className="text-xl text-gray-600">
              Get up and running in minutes with our plug-and-play integrations. No complex setup required.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
           
          </div>
          <div className="relative">
            <div className="absolute -inset-4  rounded-3xl blur-2xl" />
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-accent/10 shadow-2xl">
              <Image
                src="/Images/Image7.png"
                alt="Integration visualization"
                fill
                className="object-cover"
                priority
              />
              {/* Video overlay */}
              <div className="absolute inset-0 " />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}