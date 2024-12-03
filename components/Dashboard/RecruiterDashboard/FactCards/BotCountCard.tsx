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
    
    <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-primary-dark/50 bg-card">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium">
          Talentora Bots Configured by your Company
        </CardTitle>
        <Link href="/bot">
          <BotIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-4 w-32 mb-2" />
        ) : (
          <div>
            <div className="text-2xl font-bold">{bots?.length}</div>
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
