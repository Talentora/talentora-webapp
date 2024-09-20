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
type Job = Tables<'jobs'>
const MarkdownEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
});

interface JobHeaderProps {
  job: Job;
  onUpdate: (Job: Job) => void;
}

export function JobHeader({ job, onUpdate }: JobHeaderProps) {
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

  const updateNewJob = async () => {
    try {
      setIsUpdated(false);
      onUpdate(jobData);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleChange = (field: keyof typeof jobData, value: string) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
        <div className="flex flex-row justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {[
              { label: jobData.department, icon: <BriefcaseIcon className="mr-1 h-4 w-4" />, field: 'department' },
              { label: jobData.location, icon: <MapPinIcon className="mr-1 h-4 w-4" />, field: 'location' },
              { label: jobData.salary_range, icon: <CircleDollarSign className="mr-1 h-4 w-4" />, field: 'salary_range' },
            ].map(({ label, icon, field }) => (
              <span className="flex items-center group relative" key={field}>
                {icon} {label}
                <Edit2 
                  className="ml-2 cursor-pointer absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => toggleEditable(field as keyof typeof isEditable)} 
                />
                {isEditable[field as keyof typeof isEditable] && (
                  <Save 
                    className="ml-2 cursor-pointer absolute right-0" 
                    onClick={() => toggleEditable(field as keyof typeof isEditable)} 
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
          { title: 'Job Description', value: jobData.description, field: 'description', icon: <ClipboardListIcon className="mr-2 h-5 w-5" /> },
          { title: 'Requirements', value: jobData.requirements, field: 'requirements', icon: <UserIcon className="mr-2 h-5 w-5" /> },
          { title: 'Qualifications', value: jobData.qualifications, field: 'qualifications', icon: <UserIcon className="mr-2 h-5 w-5" /> },
        ].map(({ title, value, field, icon }) => (
          <section key={field} className="group relative">
            <h3 className="text-lg font-semibold flex items-center mb-2">
              {icon} {title}
              <span className="flex items-center ml-auto">
                <Edit2 
                  className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => toggleEditable(field as keyof typeof isEditable)} 
                />
                {isEditable[field as keyof typeof isEditable] && (
                  <Save 
                    className="ml-2 cursor-pointer" 
                    onClick={() => toggleEditable(field as keyof typeof isEditable)} 
                  />
                )}
              </span>
            </h3>
            {isEditable[field as keyof typeof isEditable] ? (
              <MarkdownEditor
                value={value}
                onChange={({ text }) => handleChange(field as keyof typeof jobData, text)}
              />
            ) : (
              <CardDescription>
                <ReactMarkdown>{value}</ReactMarkdown>
              </CardDescription>
            )}
          </section>
        ))}
        {isUpdated && (
          <Button onClick={updateNewJob} className="mt-4">
            Update Settings
          </Button>
        )}
      </CardContent>
    </Card>
  );
}