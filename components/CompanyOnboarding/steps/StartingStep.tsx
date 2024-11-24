import Image from 'next/image';

export const StartingStep: React.FC<{
  onCompletion: (isComplete: boolean) => void;
}> = ({ onCompletion }) => {
  return (
    <div className="flex justify-between">
      <div className="p-3">
        <ul className="list-disc list-inside mt-4 space-y-1">
          <li>Company info</li>
          <li>ATS integration</li>
          <li>Invite your team</li>
          <li>Get Started!</li>
        </ul>
      </div>
      <div className="w-1/2 border border-gray-300">
        <Image src="" alt="Empty Image" />
      </div>
    </div>
  );
};
