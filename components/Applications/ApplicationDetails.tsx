'use client';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ApplicationDetails({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${id}`);
        if (!response.ok) {
          throw new Error('Failed to load application');
        }
        const enrichedData = await response.json();
        setData(enrichedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load application'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const candidateName = useMemo(() => {
    if (!data?.candidate) return '';
    const { first_name, last_name } = data.candidate;
    return `${first_name} ${last_name}`;
  }, [data?.candidate]);

  if (loading) {
    return <ApplicationSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Application not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{candidateName}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add your application details here */}
      </CardContent>
    </Card>
  );
}

const ApplicationSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-1/3" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);