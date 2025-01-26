import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { BotIcon } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import { useScouts } from '@/hooks/useScouts';

const ScoutCountCard = () => {
  const { scouts, loading } = useScouts();


  

  return (
    
    <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-primary-dark/50 bg-card">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium">
          Ora Scouts Configured by your Company
        </CardTitle>
        <Link href="/scouts">
          <BotIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-4 w-32 mb-2" />
        ) : (
          <div>
            <div className="text-2xl font-bold">{scouts?.length}</div>
            {/* <p className="text-sm text-muted-foreground">
              This number represents the total count of bots available for use.
            </p> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoutCountCard;
