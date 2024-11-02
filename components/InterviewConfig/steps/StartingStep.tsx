import Image from 'next/image';


export const StartingStep: React.FC<{
  onCompletion: (isComplete: boolean) => void;
}> = ({ onCompletion }) => {
  return (
    <div className="flex justify-between">
      <div className="p-3">
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>Select this role's AI interviewer</li>
          <li>Add a description of the role</li>
          <li>Configure the interview</li>
          <li>Enter interview questions</li>
          <li>Review and publish</li>
          <li>Invite candidates!</li>
        </ul>
      </div>
      <div className="w-1/2 border border-gray-300">
        <Image src="" alt="Empty Image" />
      </div>
    </div>
  );
};
