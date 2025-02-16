'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSkeleton from './ApplicantDashboardSkeleton';
import { useApplicant } from '@/hooks/useApplicant';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useMemo } from 'react';
import AssessmentCard from './AssessmentCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function JobPortal() {
  const { user } = useUser();
  const { enrichedApplications, isLoading, error } = useApplicant();

  // Memoize sorted applications
  const sortedApplications = useMemo(() => {
    if (!enrichedApplications) return [];
    return [...enrichedApplications].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [enrichedApplications]);

  return (
    <div className="min-h-screen">
      <header className="py-8 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">Applicant Dashboard</h1>
          <p className="text-lg opacity-90">
            Welcome, {user?.data?.user_metadata?.full_name || user?.data?.email}
          </p>
        </div>
      </header>

      {isLoading ? (
        <main>
          <LoadingSkeleton />
        </main>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen">
          <Alert className="bg-red-100 border-red-400 text-red-700 max-w-md">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Error: {error.message}</AlertDescription>
          </Alert>
        </div>
      ) : (
        <main className="container mx-auto">
          {sortedApplications?.length === 0 ? (
            <Card className="border p-5 border-border shadow-sm relative mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Welcome to Talentora!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Thanks for checking out Talentora! You currently have no
                  interview applications. In the meantime, train your interview
                  skills by practicing with our{' '}
                  <Link href="/demo" className="text-blue-500 hover:underline">
                    demo scout
                  </Link>
                  !
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <Link href="/about" className="hover:underline">
                    Click here to learn more about our platform.
                  </Link>
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border p-5 border-border shadow-sm relative mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Welcome to Talentora!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Thanks for choosing out Talentora! You currently have
                    {sortedApplications?.length} applications. To prepare, train
                    your interview skills by practicing with our{' '}
                    <Link
                      href="/demo"
                      className="text-blue-500 hover:underline"
                    >
                      demo scout
                    </Link>
                    !
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <Link href="/about" className="hover:underline">
                      Click here to learn more about our platform.
                    </Link>
                  </p>
                </CardContent>
              </Card>
              <div className="grid gap-6 md:grid-cols-2 px-10 mt-6">
                {sortedApplications?.map((application) => (
                  <AssessmentCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}
