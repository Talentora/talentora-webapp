import React from 'react';

interface ProgressDotsProps {
  step: number;
  totalSteps: number;
  vertical?: boolean; // Add a prop to support vertical layout
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ step, totalSteps, vertical = true }) => {
  return (
    <div
      className={`flex ${vertical ? 'flex-col items-center gap-2' : 'flex-row justify-center gap-3'}`}
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${
            index + 1 <= step ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressDots;
