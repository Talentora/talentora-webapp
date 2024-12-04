'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface IntegrationStatusResponse {
  data?: {
    id: string;
    integration: string;
    integration_slug: string;
    category: string;
    end_user_origin_id: string;
    end_user_organization_name: string;
    end_user_email_address: string;
    status: string;
    webhook_listener_url: string;
    is_duplicate: boolean;
    account_type: string;
    completed_at: string;
  };
  integration_status: 'connected' | 'disconnected';
}

const IntegrationStatus = () => {
  const [status, setStatus] = useState<IntegrationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/merge/integration');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching integration status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <IntegrationStatusSkeleton />;

  return (
    <Card className="my-8 text-card-foreground">
      <CardHeader>
        <CardTitle className="text-primary">Integration Status</CardTitle>
        <CardDescription className="text-muted-foreground bg-secondary/50 p-4 rounded-lg">
          We partner with <a href="https://www.merge.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Merge.dev</a> to provide seamless integration with your existing ATS systems.
          Merge's unified API allows us to connect with 30+ ATS providers including Greenhouse, Lever, and Workday.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {status?.data?.end_user_organization_name || 'Organization'}
                </h2>
                <Badge 
                  variant={status?.integration_status === 'connected' ? 'success' : 'destructive'} 
                  className="mt-2"
                >
                  {status?.integration_status === 'connected' ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Available Integrations</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Available ATS Integrations</DialogTitle>
                    <DialogDescription>
                      Connect with any of these popular ATS providers through our Merge.dev integration
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    {[
                      'Greenhouse', 'Lever', 'Workday', 'iCIMS', 'BambooHR',
                      'Jobvite', 'JazzHR', 'Recruitee', 'Pinpoint', 'Sage HR',
                      'SmartRecruiters', 'Teamtailor', 'Ashby'
                    ].map((provider) => (
                      <div key={provider} className="flex items-center p-3 border rounded-md">
                        <span className="font-medium">{provider}</span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Integration Status
                </h3>
                <p className="text-lg font-medium">{status?.data?.status || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Category
                </h3>
                <p className="text-lg font-medium">{(status?.data?.category || 'N/A').toUpperCase()}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Account Type
                </h3>
                <p className="text-lg font-medium">{status?.data?.account_type || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Integration Provider
                </h3>
                <p className="text-lg font-medium">{status?.data?.integration || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const IntegrationStatusSkeleton = () => (
  <Card className="my-8 text-card-foreground">
    <CardHeader>
      <CardTitle className="text-primary">Integration Status</CardTitle>
      <CardDescription className="text-muted-foreground">
        View your ATS integration status and details
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-row items-center space-x-4 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            <Skeleton className="w-48 h-8" />
          </h2>
          <Skeleton className="w-24 h-6 mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">
            Status
          </h3>
          <Skeleton className="w-32 h-6 mt-1" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">
            Category
          </h3>
          <Skeleton className="w-32 h-6 mt-1" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default IntegrationStatus;
