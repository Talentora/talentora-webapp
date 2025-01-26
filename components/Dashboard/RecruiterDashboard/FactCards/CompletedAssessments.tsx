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

    <Link href="/applicants">
    <Card className="p-5 border border-input rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/40 border border-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/40 bg-opacity-20 backdrop-blur-lg hover:shadow-[0_10px_15px_-3px_rgba(90,79,207,0.4),0_4px_6px_-4px_rgba(90,79,207,0.3)] hover:scale-[1.01] transition-transform max-h-40 overflow-auto">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="mr-4 flex items-center justify-center border-[#5650F0] rounded-full h-12 w-12">
            <BookCheck className="h-7 w-7 text-black dark:text-white" />
            </div>
              <CardTitle className="text-md font-medium">AI Assessments Completed</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton className="h-4 w-32 mb-2" />
                </>
              ) : (
                <div className="-mt-4 ml-2 text-2xl font-medium pb-9 ">{completedAssessmentsCount}</div>
              )}
            </CardContent>
            
    
          </Card>
        </Link>
  );
};

export default CompletedAssessmentsCard;