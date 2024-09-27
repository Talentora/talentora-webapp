import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

interface CreateJobFormProps {
  formData: {
    onSubmit: (jobData: Omit<Job, 'id'>) => Promise<void>;
    onCancel: () => void;
  };
}

export function CreateJobForm({ formData }: CreateJobFormProps) {
  const { onSubmit, onCancel } = formData;
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      department,
      location,
      description,
      qualifications,
      requirements,
      salary_range: salaryRange,
      applicant_count: 0,
      company_id: 1
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-1/2">
      <Input
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      />
      <Input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <Textarea
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Textarea
        placeholder="Qualifications"
        value={qualifications}
        onChange={(e) => setQualifications(e.target.value)}
        required
      />
      <Textarea
        placeholder="Requirements"
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        required
      />
      <Input
        placeholder="Salary Range"
        value={salaryRange}
        onChange={(e) => setSalaryRange(e.target.value)}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Job</Button>
      </div>
    </form>
  );
}
