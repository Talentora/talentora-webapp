import { Button } from '@/components/ui/button';

const JobSettings = ({
  onConfigureInterview
}: {
  onConfigureInterview: () => void;
}) => {
  return (
    <div>
      <h1>Job Settings</h1>
      <Button
        onClick={onConfigureInterview}
        className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md"
      >
        Configure Interview
      </Button>
    </div>
  );
};

export default JobSettings;
