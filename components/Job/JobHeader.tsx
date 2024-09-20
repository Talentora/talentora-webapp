"use client";

import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import {
  BriefcaseIcon,
  MapPinIcon,
  CircleDollarSign,
  Edit2,
  Save,
  ClipboardListIcon,
  UserIcon,
} from 'lucide-react';
import { Tables } from '@/types/types_db';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import { updateJob } from '@/utils/supabase/queries';

type Job = Tables<'jobs'>
const MarkdownEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
});

interface JobHeaderProps {
  job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
  const [jobData, setJobData] = useState({
    department: job.department,
    location: job.location,
    salary_range: job.salary_range,
    description: job.description,
    requirements: job.requirements,
    qualifications: job.qualifications,
    applicant_count: job.applicant_count,
    company_id: job.company_id,
    id: job.id,
    title: job.title,
  });

  const [isEditable, setIsEditable] = useState({
    department: false,
    location: false,
    salary: false,
    description: false,
    requirements: false,
    qualifications: false,
  });

  const [isUpdated, setIsUpdated] = useState(false);

  const toggleEditable = (field: keyof typeof isEditable) => {
    setIsEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const hasChanges = Object.entries(jobData).some(
      ([key, value]) => value !== job[key as keyof Job]
    );
    setIsUpdated(hasChanges);
  }, [jobData, job]);

  const handleChange = (field: keyof typeof jobData, value: string) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form action={async (formData: FormData) => {
      await updateJob(job.id, jobData);
      setIsUpdated(false);
    }}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
          <div className="flex flex-row justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center group relative">
                <BriefcaseIcon className="mr-1 h-4 w-4" /> {jobData.department}
                <Edit2 
                  className="ml-2 cursor-pointer absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => toggleEditable('department')} 
                />
                {isEditable.department && (
                  <Save 
                    className="ml-2 cursor-pointer absolute right-0" 
                    onClick={() => toggleEditable('department')} 
                  />
                )}
              </span>
              <span className="flex items-center group relative">
                <MapPinIcon className="mr-1 h-4 w-4" /> {jobData.location}
                <Edit2 
                  className="ml-2 cursor-pointer absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => toggleEditable('location')} 
                />
                {isEditable.location && (
                  <Save 
                    className="ml-2 cursor-pointer absolute right-0" 
                    onClick={() => toggleEditable('location')} 
                  />
                )}
              </span>
              <span className="flex items-center group relative">
                <CircleDollarSign className="mr-1 h-4 w-4" /> {jobData.salary_range}
                <Edit2 
                  className="ml-2 cursor-pointer absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => toggleEditable('salary')} 
                />
                {isEditable.salary && (
                  <Save 
                    className="ml-2 cursor-pointer absolute right-0" 
                    onClick={() => toggleEditable('salary')} 
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
                  onClick={() => toggleEditable('description')} 
                />
                {isEditable.description && (
                  <Save 
                    className="ml-2 cursor-pointer" 
                    onClick={() => toggleEditable('description')} 
                  />
                )}
              </span>
            </h3>
            {isEditable.description ? (
              <MarkdownEditor
                value={jobData.description}
                onChange={({ text }) => handleChange('description', text)}
              />
            ) : (
              <CardDescription>
                <ReactMarkdown>{jobData.description}</ReactMarkdown>
              </CardDescription>
            )}
          </section>
          <section className="group relative">
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <UserIcon className="mr-2 h-5 w-5" /> Requirements
              <span className="flex items-center ml-auto">
                <Edit2 
                  className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => toggleEditable('requirements')} 
                />
                {isEditable.requirements && (
                  <Save 
                    className="ml-2 cursor-pointer" 
                    onClick={() => toggleEditable('requirements')} 
                  />
                )}
              </span>
            </h3>
            {isEditable.requirements ? (
              <MarkdownEditor
                value={jobData.requirements}
                onChange={({ text }) => handleChange('requirements', text)}
              />
            ) : (
              <CardDescription>
                <ReactMarkdown>{jobData.requirements}</ReactMarkdown>
              </CardDescription>
            )}
          </section>
          <section className="group relative">
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <UserIcon className="mr-2 h-5 w-5" /> Qualifications
              <span className="flex items-center ml-auto">
                <Edit2 
                  className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => toggleEditable('qualifications')} 
                />
                {isEditable.qualifications && (
                  <Save 
                    className="ml-2 cursor-pointer" 
                    onClick={() => toggleEditable('qualifications')} 
                  />
                )}
              </span>
            </h3>
            {isEditable.qualifications ? (
              <MarkdownEditor
                value={jobData.qualifications}
                onChange={({ text }) => handleChange('qualifications', text)}
              />
            ) : (
              <CardDescription>
                <ReactMarkdown>{jobData.qualifications}</ReactMarkdown>
              </CardDescription>
            )}
          </section>
          {isUpdated && (
            <Button type="submit" className="mt-4">
              Update Settings
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  );
}