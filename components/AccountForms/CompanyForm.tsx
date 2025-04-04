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
  CardFooter
} from '@/components/ui/card';
type Company = Tables<'companies'>;
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

const CompanyForm = () => {
  const [showApiKey, setShowApiKey] = useState(false);

  const { data, loading }: { data: Company | null; loading: boolean } = useUser().company;



  if (loading) return <CompanyFormSkeleton />; // Display skeleton while loading

  if (!data) return null;
  else {
    return (
    <Card className="my-8 text-card-foreground border-none">
      <CardHeader>
        <CardTitle >Company Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          View and manage your company details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center space-x-4 pb-4">
          <Avatar className="w-16 h-16">
            {/* <AvatarImage
              src={company.logo_url || undefined}
              alt={company.name}
            /> */}
            <AvatarFallback>
              {data?.name?.slice(0, 2).toUpperCase() || 'CO'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold ">{data.name}</h2>
            <Badge variant="outline" className="mt-1 bg-primary text-white">
              {data.industry}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
         
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              Location
            </h3>
            <p className="mt-1">{data.location || 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Description
            </h3>
            <p className="mt-1">
              {data.description || 'No description available.'}
            </p>
          </div>
        </div>
        <div className="col-span-2 mt-4">
          <h3 className="font-semibold text-sm text-muted-foreground">
            API Key
          </h3>
          <div className="mt-1 flex items-center">
            <div
              className="bg-input p-2 rounded relative cursor-pointer"
              onMouseEnter={() => setShowApiKey(true)}
              onMouseLeave={() => setShowApiKey(false)}
            >
              {showApiKey ? (
                <>
                  <span>
                    {data.merge_account_token || 'No API key available'}
                  </span>
                  {/* <EyeOffIcon className="w-4 h-4 inline-block ml-2" /> */}
                </>
              ) : (
                <>
                  <span>••••••••••••••••</span>
                  <EyeIcon className="w-4 h-4 inline-block ml-2" />
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      </Card>
    );
  }
};

// CompanyFormSkeleton component to display while loading
const CompanyFormSkeleton = () => (
  <Card className="my-8  text-card-foreground">
    <CardHeader>
      <CardTitle >Company Information</CardTitle>
      <CardDescription className="text-muted-foreground">
        View and manage your company details.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-row items-center space-x-4 pb-4">
        <Avatar className="w-16 h-16">
          <Skeleton className="w-16 h-16 rounded-full" />
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold ">
            <Skeleton className="w-1/2 h-8" />
          </h2>
          <Badge variant="outline" className="mt-1 bg-primary text-white">
            <Skeleton className="w-1/2 h-8" />
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">
            Website
          </h3>
          <p className="mt-1">
            <Skeleton className="w-1/2 h-8" />
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">
            Location
          </h3>
          <p className="mt-1">
            <Skeleton className="w-1/2 h-8" />
          </p>
        </div>
        <div className="col-span-2">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Description
          </h3>
          <p className="mt-1">
            <Skeleton className="w-full h-8" />
          </p>
        </div>
      </div>
      <div className="col-span-2 mt-4">
        <h3 className="font-semibold text-sm text-muted-foreground">
          API Key
        </h3>
        <div className="mt-1 flex items-center">
          <div className="bg-secondary p-2 rounded relative cursor-pointer">
            <Skeleton className="w-1/2 h-8" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default CompanyForm;
