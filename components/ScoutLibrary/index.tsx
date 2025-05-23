'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import ScoutSettings from '@/components/ScoutLibrary/ScoutSettings';
import CreateScout from './CreateScout';
import { Search } from 'lucide-react';
import { ScoutWithJobs } from '@/types/custom';

export default function ScoutLibrary({ scouts: initialscouts }: { scouts: ScoutWithJobs[] }) {
  const [scouts, setscouts] = useState<ScoutWithJobs[]>(initialscouts || []);
  const [filteredscouts, setFilteredscouts] = useState<ScoutWithJobs[]>(scouts);
  const [editingScout, setEditingScout] = useState<ScoutWithJobs | null>(null);

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

  const handlescoutUpdated = (updatedscout: ScoutWithJobs | null) => {
    if (!updatedscout) {
      return;
    }
    const updatedscouts = scouts.map(scout => 
      scout.id === updatedscout.id ? updatedscout : scout
    );
    setscouts(updatedscouts);
    setFilteredscouts(updatedscouts);
    setEditingScout(null);
  };

  const handleEditScout = (scout: ScoutWithJobs) => {
    setEditingScout(scout);
  };

  const handleCloseEdit = () => {
    setEditingScout(null);
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = scouts.filter(
      (scout: ScoutWithJobs) =>
        scout?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scout?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredscouts(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 relative group">
        Ora Scout Gallery
        <div className="absolute hidden group-hover:block bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-10 w-64 text-sm text-gray-600 top-full left-0 mt-1">
          An Ora Scout is an AI-powered interview assistant that helps screen and evaluate candidates through natural conversations, providing consistent and unbiased initial assessments.
        </div>
      </h1>

      <div className="mb-6">
        <div className="flex flex-row justify-between gap-10 mb-4">
          {/* <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search scouts..."
              className="w-full pl-10"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div> */}
          <div className="flex flex-row justify-end">
            <CreateScout 
              onBotCreated={handlescoutCreated} 
              isEdit={!!editingScout}
              existingBot={editingScout || undefined}
              onClose={handleCloseEdit}
              onBotUpdated={handlescoutUpdated}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredscouts.map((scout: ScoutWithJobs) => (
            <ScoutSettings 
              key={scout.id} 
              scout={scout} 
              onscoutDeleted={handlescoutDeleted}
              onscoutUpdated={handlescoutUpdated}
              onEditScout={handleEditScout}
            />
          ))}
          {filteredscouts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-6">
              <p className="text-lg font-semibold mb-2">No Scouts Found</p>
              <p className="text-gray-500">Create a new Scout to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
