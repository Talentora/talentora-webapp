import { useEffect, useState } from 'react';
import { ScoutWithJobs } from '@/types/custom';
import { fetchScoutsData } from '@/server/scouts';

export const useScouts = () => {
  const [scouts, setScouts] = useState<ScoutWithJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // State to store error message

  useEffect(() => {
    const fetchScouts = async () => {
      try {
        const data = await fetchScoutsData();
        
        if (data) {
          setScouts(data);
        } else {
          setError('No scouts found');  // Optional: Customize your error message
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching bots');  // Handle any errors
      } finally {
        setLoading(false);  // Set loading to false whether success or error
      }

    };

    fetchScouts();
  }, []);

  return { scouts, loading, error };
};
