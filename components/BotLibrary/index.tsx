'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import BotSettings from './BotSettings';
import CreateBot from './CreateBot';
import { Search } from 'lucide-react';
import { Tables } from '@/types/types_db';
import { BotLibrarySkeleton } from './BotSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BotWithJobs } from '@/types/custom';

export default function BotLibrary({ bots: initialBots }: { bots: BotWithJobs[] }) {
  const [bots, setBots] = useState<BotWithJobs[]>(initialBots || []);
  const [filteredBots, setFilteredBots] = useState<BotWithJobs[]>(bots);

  console.log("bots",bots);
  console.log("filteredBots",filteredBots);



  const handleBotCreated = (newBot: BotWithJobs) => {
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

  const handleBotUpdated = (updatedBot: BotWithJobs) => {
    const updatedBots = bots.map(bot => 
      bot.id === updatedBot.id ? updatedBot : bot
    );
    setBots(updatedBots);
    setFilteredBots(updatedBots);
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = bots.filter(
      (bot: BotWithJobs) =>
        bot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bot?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBots(filtered);
  };

  // Filter bots based on whether they have jobs configured
  const activeBots = filteredBots.filter(
    bot => bot.job_interview_config && bot.job_interview_config.length > 0
  );
  const inactiveBots = filteredBots.filter(
    bot => !bot.job_interview_config || bot.job_interview_config.length === 0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Interviewer Gallery</h1>

      <div className="mb-6">
        <div className="flex flex-row justify-between gap-10 mb-4">
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

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active Bots ({activeBots.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive Bots ({inactiveBots.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBots.map((bot: BotWithJobs) => (
                <BotSettings 
                  key={bot.id} 
                  bot={bot} 
                  onBotDeleted={handleBotDeleted}
                  onBotUpdated={handleBotUpdated}
                />
              ))}
              {activeBots.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-6">
                  <p className="text-lg font-semibold mb-2">No active bots</p>
                  <p className="text-gray-500">Configure jobs for your bots to make them active</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inactive">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveBots.map((bot: BotWithJobs) => (
                <BotSettings 
                  key={bot.id} 
                  bot={bot} 
                  onBotDeleted={handleBotDeleted}
                  onBotUpdated={handleBotUpdated}
                />
              ))}
              {inactiveBots.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-6">
                  <p className="text-lg font-semibold mb-2">No inactive bots</p>
                  <p className="text-gray-500">All your bots are currently active</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
