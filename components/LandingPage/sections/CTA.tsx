import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';

const stats = [
  { label: "Time saved", value: "60%", suffix: "avg" },
  { label: "Interviews automated", value: "50k", suffix: "+" },
  { label: "Client satisfaction", value: "4.9", suffix: "/5" }
];

export function CTA() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl" />
        <div className="relative  backdrop-blur-sm rounded-3xl p-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Join 1000+ companies already hiring smarter
            </h2>
            <p className="text-xl text-gray-600">
              Start with a free trial and see the difference AI-powered hiring can make.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    {stat.value}<span className="text-2xl">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg">
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 text-lg group"
              >
                Book Product Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 