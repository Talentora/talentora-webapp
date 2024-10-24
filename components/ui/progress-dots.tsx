import * as React from 'react';

interface ProgressDotsProps {
  step: number;
  totalSteps: number;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ step, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex gap-2">
      {steps.map((s) => (
        <div
          key={s}
          className={`w-2 h-2 rounded-full border border-grey-100 ${
            s <= step ? 'bg-accent' : 'bg-transparent'
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressDots;
