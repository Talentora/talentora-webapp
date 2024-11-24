import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

const InvitedCandidatesCard = ({ factWindow }: { factWindow: number }) => {
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = createClient();
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('*')
        .gte("created_at", new Date(new Date().setDate(new Date().getDate() - factWindow)).toISOString().split('T')[0]);

      if (applicationsError) {
        console.error(applicationsError);
      } else {
        console.log("Applications data", applicationsData);
        setApplicationsCount(applicationsData.length);
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Card className="border bg-foreground p-5 border-gray-300 rounded-lg shadow-sm">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium">
          Candidates Invited
        </CardTitle>
        <Link href="/applicants">
          <Mail className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-4 w-32 mb-2" />
          </>
        ) : (
         
                  <div className="text-2xl font-bold">{applicationsCount}</div>

        )}
      </CardContent>
    </Card>
  );
};

export default InvitedCandidatesCard;