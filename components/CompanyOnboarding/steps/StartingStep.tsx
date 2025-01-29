import Image from 'next/image';
import Logo from '@/components/ui/icons/Logo';



export const StartingStep: React.FC<{
  onCompletion: (isComplete: boolean) => void;
}> = ({ onCompletion }) => {
  return (
    <div className="flex justify-between">
             
            <div>Welcome to Talentora</div>
            <div>
              Let&apos;s get your company set up in just a few steps
            </div>
          
      <div className="p-3">
        <ul className="list-disc list-inside mt-4 space-y-1">
          
          <li>Company info</li>
          <li>ATS integration</li>
          <li>Invite your team</li>
          <li>Get Started!</li>
        </ul>
      </div>
      <div className="w-1/2 rounded-lg">
      <div style={{"height":"80%", "display": "flex", "alignItems":"center"}} className="flex justify-center pb-6">
            <Logo width="30px" height="30px" />
          </div>
               </div>
    </div>
  );
};
