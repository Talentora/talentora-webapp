'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import ScoutSettings from '@/components/ScoutLibrary/ScoutSettings';
import CreateScout from './CreateScout';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScoutWithJobs } from '@/types/custom';

export default function ScoutLibrary({ scouts: initialscouts }: { scouts: ScoutWithJobs[] }) {
  const [scouts, setscouts] = useState<ScoutWithJobs[]>(initialscouts || []);
  const [filteredscouts, setFilteredscouts] = useState<ScoutWithJobs[]>(scouts);

  console.log("scouts",scouts);
  console.log("filteredscouts",filteredscouts);



  const handlescoutCreated = (newscout: ScoutWithJobs) => {
    if (!newscout || !newscout.id) {
      console.error('Invalid scout data received');
      return;
    }
    const updatedscouts = [...scouts, newscout];
    setscouts(updatedscouts);
    setFilteredscouts(updatedscouts);
  };

  const handlescoutDeleted = (scoutId: number) => {
    const updatedscouts = scouts.filter(scout => scout.id !== scoutId);
    setscouts(updatedscouts);
    setFilteredscouts(updatedscouts);
  };

  const handlescoutUpdated = (updatedscout: ScoutWithJobs) => {
    const updatedscouts = scouts.map(scout => 
      scout.id === updatedscout.id ? updatedscout : scout
    );
    setscouts(updatedscouts);
    setFilteredscouts(updatedscouts);
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = scouts.filter(
      (scout: ScoutWithJobs) =>
        scout?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scout?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredscouts(filtered);
  };

  // Filter scouts based on whether they have jobs configured
  const activescouts = filteredscouts.filter(
    scout => scout.job_interview_config && scout.job_interview_config.length > 0
  );
  const inactivescouts = filteredscouts.filter(
    scout => !scout.job_interview_config || scout.job_interview_config.length === 0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 relative group">
        <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent">Ora</span> Scout Gallery
        <div className="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-10 w-64 text-sm text-gray-600 top-full left-0 mt-1">
          An Ora Scout is an AI-powered interview assistant that helps screen and evaluate candidates through natural conversations, providing consistent and unbiased initial assessments.
        </div>
      </h1>

      <div className="mb-6">
        <div className="flex flex-row justify-between gap-10 mb-4">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search scouts..."
              className="w-full pl-10"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <CreateScout onBotCreated={handlescoutCreated} />
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active Scouts ({activescouts.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive Scouts ({inactivescouts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activescouts.map((scout: ScoutWithJobs) => (
                <ScoutSettings 
                  key={scout.id} 
                  scout={scout} 
                  onscoutDeleted={handlescoutDeleted}
                  onscoutUpdated={handlescoutUpdated}
                />
              ))}
              {activescouts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-6">
                  <p className="text-lg font-semibold mb-2">No active Scouts</p>
                  <p className="text-gray-500">Configure jobs for your Scouts to make them active</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inactive">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactivescouts.map((scout: ScoutWithJobs) => (
                <ScoutSettings 
                  key={scout.id} 
                  scout={scout} 
                  onscoutDeleted={handlescoutDeleted}
                  onscoutUpdated={handlescoutUpdated}
                />
              ))}
              {inactivescouts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-6">
                  <p className="text-lg font-semibold mb-2">No inactive Scouts</p>
                  <p className="text-gray-500">All your scouts are currently active</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
