'use client';

import { Tables } from '@/types/types_db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';
import { Skeleton } from '@/components/ui/skeleton';

type Company = Tables<'companies'>;

const CompanyForm = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { company, loading }: { company: Company | null; loading: boolean } = useCompany();

  if (loading) return <CompanyFormSkeleton />;

  if (!company) return null;

  return (
    <Card className="my-8 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-primary">Company Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          View all details of your company.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center space-x-4 pb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={company.logo_url || undefined} alt={company.name} />
            <AvatarFallback>
              {company.name?.slice(0, 2).toUpperCase() || 'CO'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-primary">{company.name}</h2>
            <Badge variant="outline" className="mt-1 bg-primary text-white">
              {company.industry}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(company).map(([key, value]) => (
            <div key={key} className={key === 'description' ? 'col-span-2' : ''}>
              <h3 className="font-semibold text-sm text-muted-foreground capitalize">
                {key.replace(/_/g, ' ')}
              </h3>
              {key === 'merge_account_token' ? (
                <div className="mt-1 flex items-center">
                  <div
                    className="bg-secondary p-2 rounded relative cursor-pointer"
                    onMouseEnter={() => setShowApiKey(true)}
                    onMouseLeave={() => setShowApiKey(false)}
                  >
                    {showApiKey ? (
                      <>
                        <span>{value || 'No API key available'}</span>
                        <EyeOffIcon className="w-4 h-4 inline-block ml-2" />
                      </>
                    ) : (
                      <>
                        <span>••••••••••••••••</span>
                        <EyeIcon className="w-4 h-4 inline-block ml-2" />
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-1">{value || 'N/A'}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const CompanyFormSkeleton = () => (
  <Card className="my-8 bg-card text-card-foreground">
    <CardHeader>
      <CardTitle className="text-primary">Company Information</CardTitle>
      <CardDescription className="text-muted-foreground">
        View all details of your company.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-row items-center space-x-4 pb-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div>
          <Skeleton className="w-48 h-8 mb-2" />
          <Skeleton className="w-24 h-6" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array(10).fill(null).map((_, index) => (
          <div key={index} className={index === 0 ? 'col-span-2' : ''}>
            <Skeleton className="w-full h-6 mb-2" />
            <Skeleton className="w-full h-8" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default CompanyForm;

