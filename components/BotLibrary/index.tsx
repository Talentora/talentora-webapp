'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import BotSettings from './BotSettings';
import CreateBot from './CreateBot';
import { Search } from 'lucide-react';
import { Tables } from '@/types/types_db';
import { BotLibrarySkeleton } from './BotSkeleton';

type Bot = Tables<'bots'>;

export default function BotLibrary({ bots: initialBots }: { bots: Bot[] }) {
  const [bots, setBots] = useState<Bot[]>(initialBots || []);
  const [filteredBots, setFilteredBots] = useState<Bot[]>(bots);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for initial data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBotCreated = (newBot: Bot) => {
    if (!newBot || !newBot.id) {
      console.error('Invalid bot data received');
      return;
    }
    const updatedBots = [...bots, newBot];
    setBots(updatedBots);
    setFilteredBots(updatedBots);
  };

  const handleBotDeleted = (botId: number) => {
    const updatedBots = bots.filter(bot => bot.id !== botId);
    setBots(updatedBots);
    setFilteredBots(updatedBots);
  };

  const handleBotUpdated = (updatedBot: Bot) => {
    const updatedBots = bots.map(bot => 
      bot.id === updatedBot.id ? updatedBot : bot
    );
    setBots(updatedBots);
    setFilteredBots(updatedBots);
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = bots.filter(
      (bot: Bot) =>
        bot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bot?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBots(filtered);
  };

  if (isLoading) {
    return <BotLibrarySkeleton />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Interviewer Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-full mb-4 flex flex-row justify-between gap-10">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search bots..."
              className="w-full pl-10"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <CreateBot onBotCreated={handleBotCreated} />
          </div>
        </div>
        {filteredBots.filter(bot => bot && bot.id).map((bot: Bot) => (
          <BotSettings 
            key={bot.id} 
            bot={bot} 
            onBotDeleted={handleBotDeleted}
            onBotUpdated={handleBotUpdated}
          />
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
