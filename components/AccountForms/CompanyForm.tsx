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
import { useState } from 'react';
type Company = Tables<'companies'>;
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useCompany } from '@/hooks/useCompany';

const CompanyForm = () => {
  const { company } = useCompany();
  const [showApiKey, setShowApiKey] = useState(false);

  if (!company) return null; // Ensure company is not null before rendering

  return (
    <Card className="my-8 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-primary">Company Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          View and manage your company details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center space-x-4 pb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={company.logo_url || undefined}
              alt={company.name}
            />
            <AvatarFallback>
              {company.name.slice(0, 2).toUpperCase()}
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
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              Website
            </h3>
            <p className="mt-1">{company.website_url || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">
              Location
            </h3>
            <p className="mt-1">{company.location || 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Description
            </h3>
            <p className="mt-1">
              {company.description || 'No description available.'}
            </p>
          </div>
        </div>
        <div className="col-span-2 mt-4">
          <h3 className="font-semibold text-sm text-muted-foreground">
            API Key
          </h3>
          <div className="mt-1 flex items-center">
            <div
              className="bg-secondary p-2 rounded relative cursor-pointer"
              onMouseEnter={() => setShowApiKey(true)}
              onMouseLeave={() => setShowApiKey(false)}
            >
              {showApiKey ? (
                <>
                  <span>
                    {company.merge_api_key || 'No API key available'}
                  </span>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
