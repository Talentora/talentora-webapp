import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tables } from '@/types/types_db';
import { CardView } from './CardView';
import { TableView } from './TableView';
import { deleteJob } from '@/utils/supabase/queries';

type Job = Tables<'jobs'>;

interface JobListProps {
  jobListData: {
    filteredJobs: Job[];
    isCardView: boolean;
    toggleView: () => void;
  };
}

export default function JobList({ jobListData }: JobListProps) {
  const { filteredJobs, isCardView, toggleView } = jobListData;

  async function handleDeleteJob(id: number): Promise<void> {
    try {
      console.log('Before delete job');
      await deleteJob(id);
      console.log('After delete job');
      // await onDeleteJob(id);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <LayoutGridIcon className="h-4 w-4" />
        <Switch
          checked={!isCardView}
          onCheckedChange={toggleView}
          id="view-toggle"
        />
        <ListIcon className="h-4 w-4" />
        <label htmlFor="view-toggle" className="text-sm text-muted-foreground">
          {isCardView ? 'Card View' : 'Table View'}
        </label>
      </div>
      {isCardView ? (
        <CardView
          cardViewData={{ filteredJobs, onDeleteJob: handleDeleteJob }}
        />
      ) : (
        <TableView
          tableViewData={{ filteredJobs, onDeleteJob: handleDeleteJob }}
        />
      )}
    </>
  );
}
