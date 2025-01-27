'use client';

import { ArrowRight, Brain, Users, Zap, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
export function Hero() {

  const handleVideoClick = () => {
    const video = document.querySelector('video');
    if (video) {
      video.play();
    }
  };

  return (
    <section className="container px-4 py-16 mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm">
            <span className="text-primary font-medium">✨ AI-Powered Video Interviews</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tighter lg:text-6xl xl:text-7xl">
            Hire the best talent{" "}
            <span className="bg-gradient-to-r from-accent to-pink-600 bg-clip-text text-transparent">3x faster</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-[600px]">
            Our AI-powered platform conducts initial interviews, assesses candidates, and provides data-driven insights - all while you sleep.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-accent/90 text-lg">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-accent/5 text-lg group"
              onClick={handleVideoClick}
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
          <div className="absolute -top-8 -left-8 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-accent/10">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-pink-600/5 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <video width="320" height="240" controls preload="auto" className="w-full h-full object-cover">
                <source src="/Videos/InterviewDemo.mp4" />
                <track
                  src="/videos/captions-en.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            {/* Placeholder for actual video thumbnail */}
            <div className="w-full h-full bg-gradient-to-br from-accent/10 to-pink-50" />
          </div>
         
        </div>
      </div>
    </section>
  );
} 