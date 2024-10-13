'use client';

import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card
} from '@/components/ui/card';
import { Button } from '../ui/button';
import {
  BriefcaseIcon,
  MapPinIcon,
  CircleDollarSign,
  Edit2,
  Save,
  ClipboardListIcon
} from 'lucide-react';
import { Job } from '@/types/greenhouse';
import { useState, useEffect } from 'react';
import { updateJob } from '@/utils/supabase/queries';

interface JobHeaderProps {
  job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
  const [jobData, setJobData] = useState(job);
  const [isEditable, setIsEditable] = useState({
    name: false,
    departments: false,
    offices: false,
    notes: false,
    custom_fields: false
  });

  const [isUpdated, setIsUpdated] = useState(false);

  const toggleEditable = (field: keyof typeof isEditable) => {
    setIsEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const hasChanges = Object.entries(jobData).some(
      ([key, value]) => JSON.stringify(value) !== JSON.stringify(job[key as keyof Job])
    );
    setIsUpdated(hasChanges);
  }, [jobData, job]);

  const handleChange = (field: keyof typeof jobData, value: any) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log('updating');
        await updateJob(job.id, jobData);
        setIsUpdated(false);
      }}
    >
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{jobData.name}</CardTitle>
          <div className="flex flex-row justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center group relative">
                <BriefcaseIcon className="mr-1 h-4 w-4" /> {jobData.departments.join(', ')}
                <Edit2
                  className="ml-2 cursor-pointer absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleEditable('departments')}
                />
                {isEditable.departments && (
                  <Save
                    className="ml-2 cursor-pointer absolute right-0"
                    onClick={() => toggleEditable('departments')}
                  />
                )}
              </span>
              <span className="flex items-center group relative">
                <MapPinIcon className="mr-1 h-4 w-4" /> {jobData.offices.join(', ')}
                <Edit2
                  className="ml-2 cursor-pointer absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleEditable('offices')}
                />
                {isEditable.offices && (
                  <Save
                    className="ml-2 cursor-pointer absolute right-0"
                    onClick={() => toggleEditable('offices')}
                  />
                )}
              </span>
              <span className="flex items-center group relative">
                <CircleDollarSign className="mr-1 h-4 w-4" />{' '}
                {jobData.custom_fields.employment_type}
                <Edit2
                  className="ml-2 cursor-pointer absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleEditable('custom_fields')}
                />
                {isEditable.custom_fields && (
                  <Save
                    className="ml-2 cursor-pointer absolute right-0"
                    onClick={() => toggleEditable('custom_fields')}
                  />
                )}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="group relative">
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <ClipboardListIcon className="mr-2 h-5 w-5" /> Job Description
              <span className="flex items-center ml-auto">
                <Edit2
                  className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleEditable('notes')}
                />
                {isEditable.notes && (
                  <Save
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditable('notes')}
                  />
                )}
              </span>
            </h3>
            {isEditable.notes ? (
              <textarea
                value={jobData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <CardDescription>{jobData.notes}</CardDescription>
            )}
          </section>
          {isUpdated && (
            <Button type="submit" className="mt-4">
              Update Job
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  );
}