import Image from 'next/image';
import Logo from '@/components/ui/icons/Logo';



export const StartingStep: React.FC<{
  onCompletion: (isComplete: boolean) => void;
}> = ({ onCompletion }) => {
  return (
    <div className="flex justify-between">
      <div className="p-3 overflow-auto max-h-[300px]">
        <ul className="list-disc list-inside space-y-2 text-pretty">
          <li className="leading-relaxed">Company info - Tell us about your organization and hiring needs</li>
          <li className="leading-relaxed">ATS integration - Connect your existing recruiting tools</li>
          <li className="leading-relaxed">Invite your team - Add hiring managers and recruiters</li>
          <li className="leading-relaxed">Get Started! - Begin finding great candidates</li>
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
