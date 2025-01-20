import { ArrowRight, Brain, Users, Zap, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function Hero() {
  return (
    <section className="container px-4 mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm">
            <span className="text-purple-600 font-medium">✨ AI-Powered Video Interviews</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tighter lg:text-6xl xl:text-7xl">
            Hire the best talent{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">3x faster</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-[600px]">
            Our AI-powered platform conducts initial interviews, assesses candidates, and provides data-driven insights - all while you sleep.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 text-lg group"
            >
              Watch Demo
              <Play className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>50,000+ interviews conducted</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>4.9/5 recruiter rating</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-8 -left-8 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-purple-100/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/90 hover:bg-white group"
              >
                <Play className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
                <span className="ml-2 text-purple-600 group-hover:text-purple-700">Watch Product Demo</span>
              </Button>
            </div>
            {/* Placeholder for actual video thumbnail */}
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-50" />
          </div>
          <Card className="relative mt-6 p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border-purple-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Try it now</h3>
                <p className="text-gray-600">Create your first AI interview</p>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <Input
                type="text"
                placeholder="Enter your work email..."
                className="w-full bg-white text-lg"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
} 