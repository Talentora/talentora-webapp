'use client';

import { useState } from 'react';
import { BarChart, Briefcase, Users, GraduationCap, Search, Stethoscope, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BotSettings from './BotSettings';
import CreateBot from './CreateBot';

interface Bot {
  id: number;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

export default function BotLibrary() {
  const [bots, setBots] = useState<Bot[]>([
    {
      id: 1,
      name: 'Alex',
      role: 'Technical Interviewer',
      description: 'Specializes in technical interviews for software engineering positions.',
      icon: <Code className="h-12 w-12" />
    },
    {
      id: 2,
      name: 'Sarah',
      role: 'HR Specialist', 
      description: 'Focuses on human resources and cultural fit interviews.',
      icon: <Users className="h-12 w-12" />
    },
    {
      id: 3,
      name: 'Marcus',
      role: 'Sales Recruiter',
      description: 'Designed for interviewing sales and marketing candidates.',
      icon: <BarChart className="h-12 w-12" />
    },
    {
      id: 4,
      name: 'Victoria',
      role: 'Executive Headhunter',
      description: 'Tailored for C-suite and executive-level interviews.',
      icon: <Briefcase className="h-12 w-12" />
    },
    {
      id: 5,
      name: 'Daniel',
      role: 'Academic Interviewer',
      description: 'Specialized in academic and research position interviews.',
      icon: <GraduationCap className="h-12 w-12" />
    },
    {
      id: 6,
      name: 'Emma',
      role: 'Healthcare Recruiter',
      description: 'Focused on interviews for healthcare professionals.',
      icon: <Stethoscope className="h-12 w-12" />
    }
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Interviewer Bot Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-full mb-4 flex flex-row justify-between gap-10">

          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search bots..."
              className="w-full pl-10"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredBots = bots.filter(
                  (bot) =>
                    bot.name.toLowerCase().includes(searchTerm) ||
                    bot.description.toLowerCase().includes(searchTerm)
                );
                setBots(filteredBots);
              }}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <CreateBot bots={bots} setBots={setBots} />
        </div>
        {bots.map((bot) => (
          <BotSettings key={bot.id} bot={bot} />
        ))}
      </div>
    </div>
  );
}