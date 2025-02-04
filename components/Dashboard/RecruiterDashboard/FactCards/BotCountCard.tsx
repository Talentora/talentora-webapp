import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import { useScouts } from '@/hooks/useScouts';

const ScoutCountCard = () => {
  const { scouts, loading } = useScouts();


  

  return (
    
<Card className="p-5 border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 transition duration-300 ease-in-out hover:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]">
  <CardHeader className="flex flex-row justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="ml-4 pt-2 text-sm font-medium">
          Ora Scouts
        </CardTitle>
        <button className="p-2 bg-input rounded-md transition duration-300 ease-in-out group-hover:bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
        <Building2 className="h-6 w-6 text-blue-700" />
        </button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="ml-4 h-4 w-32 mb-2" />
        ) : (
          <div>
            <div className="ml-4 text-2xl font-bold">{scouts?.length}</div>
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
