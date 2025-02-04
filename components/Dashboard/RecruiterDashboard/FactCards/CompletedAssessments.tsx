import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const CompletedAssessmentsCard = ({ factWindow }: { factWindow: number }) => {
  const [completedAssessmentsCount, setCompletedAssessmentsCount] = useState(0);
  const [previousAssessmentsCount, setPreviousAssessmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = createClient();
      const currentStartDate = new Date(new Date().setDate(new Date().getDate() - factWindow)).toISOString().split('T')[0];
      const previousStartDate = new Date(new Date().setDate(new Date().getDate() - 2 * factWindow)).toISOString().split('T')[0];
      const midDate = new Date(new Date().setDate(new Date().getDate() - factWindow)).toISOString().split('T')[0];

      const { data: currentData, error: currentError } = await supabase
        .from('AI_summary')
        .select('*')
        .gte("created_at", currentStartDate);

      const { data: previousData, error: previousError } = await supabase
        .from('AI_summary')
        .select('*')
        .gte("created_at", previousStartDate)
        .lt("created_at", midDate);

      if (currentError || previousError) {
        console.error(currentError || previousError);
      } else {
        setCompletedAssessmentsCount(currentData.length);
        setPreviousAssessmentsCount(previousData.length);
      }
      setLoading(false);
    };

    fetchCounts();
  }, [factWindow]);

  const percentChange = previousAssessmentsCount === 0 
    ? 100 
    : ((completedAssessmentsCount - previousAssessmentsCount) / previousAssessmentsCount) * 100;

  return (
    <Card className="group p-5 border-transparent bg-background rounded-2xl shadow-md shadow-[#5650F0]/20 transition duration-300 ease-in-out hover:bg-[linear-gradient(to_right,rgba(129,140,248,0.15),rgba(196,181,253,0.15))]">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
        <CardTitle className="ml-4 pt-2 text-sm font-medium">
          AI Assessments
        </CardTitle>
        <button className="p-2 bg-input rounded-md transition duration-300 ease-in-out group-hover:bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
          <Brain className="h-6 w-6 text-purple-500" />
        </button>
      </CardHeader>
      <CardContent className="relative">
        {loading ? (
          <Skeleton className="h-4 w-32 mb-2" />
        ) : (
          <div className="ml-4 text-2xl font-bold">{completedAssessmentsCount}</div>
        )}
        {!loading && (
          <div className="absolute bottom-2 right-4 text-sm font-medium text-gray-600">
            {percentChange >= 0 ? `+${percentChange.toFixed(1)}%` : `${percentChange.toFixed(1)}%`}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedAssessmentsCard;