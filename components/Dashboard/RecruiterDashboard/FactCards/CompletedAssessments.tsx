import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { BookCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

const CompletedAssessmentsCard = ({ factWindow }: { factWindow: number }) => {
  const [completedAssessmentsCount, setCompletedAssessmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = createClient();
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('AI_summary')
        .select('*')
        .gte("created_at", new Date(new Date().setDate(new Date().getDate() - factWindow)).toISOString().split('T')[0]);

      if (assessmentsError) {
        console.error(assessmentsError);
      } else {
        console.log("Assessments data", assessmentsData);
        setCompletedAssessmentsCount(assessmentsData.length);
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Card className="p-5 bg-white rounded-2xl shadow-xl shadow-primary-dark/50 bg-card">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          AI Assessments Completed
        </CardTitle>
        <Link href="/applicants">
          <BookCheck className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-4 w-32 mb-2" />
          </>
        ) : (
            <div className="text-2xl font-bold">{completedAssessmentsCount}</div>

       
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedAssessmentsCard;