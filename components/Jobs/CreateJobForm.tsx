import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Job } from '@/types/greenhouse';

interface CreateJobFormProps {
  formData: {
    onSubmit: (jobData: Omit<Job, 'id'>) => Promise<void>;
    onCancel: () => void;
  };
}

export function CreateJobForm({ formData }: CreateJobFormProps) {
  const { onSubmit, onCancel } = formData;
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [office, setOffice] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      departments: [department],
      offices: [office],
      notes,
      requisition_id: null,
      confidential: false,
      status: 'open',
      created_at: new Date().toISOString(),
      opened_at: new Date().toISOString(),
      closed_at: null,
      updated_at: new Date().toISOString(),
      is_template: false,
      copied_from_id: null,
      hiring_team: {
        hiring_managers: [],
        recruiters: [],
        coordinators: [],
        sourcers: []
      },
      openings: [],
      custom_fields: {
        employment_type: null,
        reason_for_hire: null
      },
      keyed_custom_fields: {
        employment_type: null,
        reason_for_hire: null
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-1/2">
      <Input
        placeholder="Job Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      />
      <Input
        placeholder="Office"
        value={office}
        onChange={(e) => setOffice(e.target.value)}
        required
      />
      <Textarea
        placeholder="Job Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
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