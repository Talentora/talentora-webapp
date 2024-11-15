'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BotSettings from './BotSettings';
import CreateBot from './CreateBot';
import { Tables } from '@/types/types_db';
type Bot = Tables<'bots'>;

export default function BotLibrary({ bots }: { bots: Bot[] }) {
  const [filteredBots, setFilteredBots] = useState(bots);

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
                    bot?.name?.toLowerCase().includes(searchTerm) ||
                    bot?.description?.toLowerCase().includes(searchTerm)
                );
                setFilteredBots(filteredBots);
              }}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <CreateBot />
        </div>
        {filteredBots.map((bot) => (
          <BotSettings key={bot.id} bot={bot} />
        ))}
        {bots.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center">
            <p className="text-lg font-semibold mb-4">No bots available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
