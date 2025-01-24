import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompany } from '@/hooks/useCompany';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { BotIcon } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import { useBots } from '@/hooks/useBots';

const BotCountCard = () => {
  const { bots, loading } = useBots();


  

  return (
    
<Card className="p-5 border border-input rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/40 border border-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/40 bg-opacity-20 backdrop-blur-lg hover:shadow-[0_10px_15px_-3px_rgba(90,79,207,0.4),0_4px_6px_-4px_rgba(90,79,207,0.3)] hover:scale-[1.01] transition-transform max-h-40 overflow-auto">
<CardHeader className="flex flex-row items-center space-y-0 pb-2">
    <div className="mr-4 flex items-center justify-center border-[#5650F0] rounded-full h-12 w-12">
    <BotIcon className="h-8 w-8 text-black dark:text-white" />
    </div>
          <CardTitle className="text-md font-medium">Talentora Bots Configured</CardTitle>
        </CardHeader>
        <CardContent>
        {loading ? (
          <Skeleton className="h-4 w-32 mr-4 mb-2" />
        ) : (
          <div>
            <div className="-mt-5 ml-2 text-2xl font-semibold">{bots?.length}</div>
            {/* <p className="text-sm text-muted-foreground">
              This number represents the total count of bots available for use.
            </p> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BotCountCard;
