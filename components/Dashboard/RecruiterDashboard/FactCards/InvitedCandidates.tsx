import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

const InvitedCandidatesCard = ({ factWindow }: { factWindow: number }) => {
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [previousApplicationsCount, setPreviousApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = createClient();

      // Current period
      const { data: currentApplicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .gte("created_at", new Date(new Date().setDate(new Date().getDate() - factWindow)).toISOString().split('T')[0]);

      if (applicationsError) {
        console.error(applicationsError);
      } else {
        setApplicationsCount(currentApplicationsData.length);

        // Previous period (for comparison)
        const { data: previousApplicationsData } = await supabase
          .from('applications')
          .select('*')
          .gte("created_at", new Date(new Date().setDate(new Date().getDate() - 2 * factWindow)).toISOString().split('T')[0])
          .lt("created_at", new Date(new Date().setDate(new Date().getDate() - factWindow)).toISOString().split('T')[0]);

        // Check if previousApplicationsData is null or undefined and set it to an empty array if it is
        setPreviousApplicationsCount(previousApplicationsData?.length ?? 0);
        setLoading(false);
      }
    };

    fetchCounts();
  }, [factWindow]);

  // Calculate percentage change
  const percentageChange = previousApplicationsCount 
    ? ((applicationsCount - previousApplicationsCount) / previousApplicationsCount) * 100
    : 0;

  return (
    <Card className="max-h-[100px] group p-2 border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 transition duration-300 ease-in-out hover:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))] dark:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]">
      <CardHeader className="flex flex-row justify-between space-y-0 gap-2">
        <CardTitle className="ml-4 pt-4 text-sm font-medium">
          Candidates Invited
        </CardTitle>
        <button className="group p-2 bg-input rounded-md transition duration-300 ease-in-out group-hover:bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Mail className="h-6 w-6 text-green-700 group-hover:text-green-700" />
        </button>
      </CardHeader>
      <CardContent className="relative">
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <>
            <div className="ml-4 -mt-6 text-2xl font-bold">{applicationsCount}</div>
            <div className="absolute right-2 -mt-4 text-sm text-green-600">
            {percentageChange >= 0 ? '+' : ''}
              {percentageChange.toFixed(2)}%
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitedCandidatesCard;
